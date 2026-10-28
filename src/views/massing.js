/* ---------- massing: separate feasibility overlay, build 5.3 ---------- */
const MASS_FIELDS=[
 ['area','Assumed parcel (acres)',.01,500,.01],
 ['aspect','Parcel depth / width',.2,5,.1],
 ['front','Front setback (m)',0,50,.5],['rear','Rear setback (m)',0,50,.5],['side','Each side setback (m)',0,50,.5],
 ['coverage','Tower footprint / site',.05,.9,.05],
 ['parkingCoverage','Parking footprint / site',.05,1,.05],
 ['floorHeight','Tower floor-to-floor (m)',2.5,6,.1],['parkingHeight','Parking floor-to-floor (m)',2.5,5,.1],
 ['heightLimit','Assumed height limit (m; 0 = unknown)',0,500,1],
 ['unitSf','Average new unit (saleable sf)',300,3000,50],
 ['bays','Resident car bays / unit',0,5,.1],['visitor','Visitor bays / unit',0,1,.05],
 ['bayArea','Gross parking area / bay (sf)',150,700,10],
 ['basementCost','Basement hard cost (RM / parking sf)',0,1500,10],
 ['podiumCost','Podium hard cost (RM / parking sf)',0,1500,10],
 ['customPR','Custom plot ratio (×)',.1,20,.1]
];
let MASS=store.get('massing',{}), MSEL=store.get('msel','taiping');
function massingDefaults(id){
 const s=SITE[id], x=presetState(s,'base');
 return {area:s.area?s.area.ac:5,aspect:1.5,front:6,rear:6,side:6,coverage:.35,parkingCoverage:.65,
  floorHeight:3.2,parkingHeight:3,heightLimit:0,unitSf:INC_DEFAULT[id]?.unitSf||900,
  bays:1,visitor:.1,bayArea:320,basementCost:180,podiumCost:120,
  mode:'podium',included:true,customPR:x.pr};
}
function massingConfig(id){
 const d=massingDefaults(id), raw=MASS&&typeof MASS==='object'?MASS[id]:null, p={...d};
 if(raw&&typeof raw==='object'){
  for(const [k,,lo,hi] of MASS_FIELDS) if(typeof raw[k]==='number'&&Number.isFinite(raw[k])) p[k]=clamp(raw[k],lo,hi);
  if(raw.mode==='podium'||raw.mode==='basement') p.mode=raw.mode;
  if(typeof raw.included==='boolean') p.included=raw.included;
 }
 return p;
}
// x must carry an explicit development-charge rate; no DOM, state writes or lab reads.
function massingCalc(x,p){
 const numeric=['area','aspect','front','rear','side','coverage','parkingCoverage','floorHeight','parkingHeight','heightLimit','unitSf','bays','visitor','bayArea','basementCost','podiumCost'];
 if(!x||!p||numeric.some(k=>!Number.isFinite(p[k]))||p.area<=0||p.aspect<=0||p.coverage<=0||p.coverage>1||p.parkingCoverage<=0||p.parkingCoverage>1||p.unitSf<=0||p.floorHeight<=0||p.parkingHeight<=0||p.bayArea<=0||['front','rear','side','heightLimit','bays','visitor','basementCost','podiumCost'].some(k=>p[k]<0)||!['podium','basement'].includes(p.mode)||typeof p.included!=='boolean'||!Number.isFinite(x.dc)){
  return {valid:false,reason:'Enter valid dimensions, parking assumptions and a development-charge rate.'};
 }
 const y={...x,area:p.area,owner:x.owner?JSON.parse(JSON.stringify(x.owner)):null};
 applyOwnerDerived(y);
 const m=model(y), landM2=m.land*.09290304, width=Math.sqrt(landM2/p.aspect), depth=width*p.aspect;
 if(![m.gfa,m.sal,m.rlv].every(Number.isFinite)||m.gfa<=0) return {valid:false,reason:'The chosen scenario needs positive, finite floor area.'};
 const innerW=Math.max(0,width-2*p.side), innerD=Math.max(0,depth-p.front-p.rear);
 const envelope=innerW*innerD/.09290304, footprint=Math.min(envelope,m.land*p.coverage);
 const parkPlate=Math.min(envelope,m.land*p.parkingCoverage), units=Math.ceil(m.sal/p.unitSf);
 const bays=Math.ceil(units*(p.bays+p.visitor)), parkingArea=bays*p.bayArea;
 const geometryOK=footprint>0&&(bays===0||parkPlate>0);
 const storeys=geometryOK?Math.ceil(m.gfa/footprint):null;
 const parkingLevels=geometryOK?(bays?Math.ceil(parkingArea/parkPlate):0):null;
 const builtParkingArea=geometryOK?parkingLevels*parkPlate:null;
 const parkingHard=geometryOK?builtParkingArea*(p.mode==='basement'?p.basementCost:p.podiumCost):null;
 const extraCost=geometryOK?(p.included?0:parkingHard*(1+y.pf+y.cont)):null;
 const adjustedRLV=geometryOK?m.rlv-extraCost:null;
 const height=geometryOK?storeys*p.floorHeight+(p.mode==='podium'?parkingLevels*p.parkingHeight:0):null;
 const heightOK=height!==null&&p.heightLimit>0?height<=p.heightLimit:null;
 return {valid:true,x:y,m,p,width,depth,innerW,innerD,envelope,footprint,parkPlate,units,bays,parkingArea,
  geometryOK,storeys,parkingLevels,builtParkingArea,parkingHard,extraCost,adjustedRLV,height,heightOK,
  adjustedCoverage:adjustedRLV!==null&&m.own?adjustedRLV/m.own.reqTotal:null};
}
function massingScenarios(id,p){
 const x={...presetState(SITE[id],'base'),dc:dcRate()}, read=packAsRead(id), max=packMaxRead(id);
 return [['base','Base: no incentive',x.pr],
  ['read','DBKL incentive as read',x.pr*(1+(read?.share||0))],
  ['max','Classification ceiling',x.pr*(1+(max?.share||0))],
  ['custom','Custom sensitivity',p.customPR]].map(([key,label,pr])=>({key,label,pr,...massingCalc({...x,prUp:pr/x.pr-1},p)}));
}
function massingSVG(r){
 if(!r.geometryOK) return '<p class="chip bad">No buildable footprint after setbacks.</p>';
 // A single equivalent block, not an architectural layout. Vertical scale compressed.
 const p=r.p, size=Math.max(r.width,r.depth), scale=145/size;
 const zMax=Math.max(r.height,1), zs=Math.min(2,170/zMax);
 const pt=(x,y,z=0)=>[245+(x-y)*scale,245+(x+y)*scale*.42-z*zs];
 const points=a=>a.map(v=>pt(...v).map(n=>n.toFixed(1)).join(',')).join(' ');
 const poly=(a,fill,dash='')=>'<polygon points="'+points(a)+'" fill="'+fill+'" stroke="var(--ink2)" stroke-width="1" '+dash+'/>';
 const rectangle=(w,d,z)=>[[0,0,z],[w,0,z],[w,d,z],[0,d,z]];
 let svg=poly(rectangle(r.width,r.depth,0),'var(--sunk)');
 svg+=poly([[p.side,p.front,0],[r.width-p.side,p.front,0],[r.width-p.side,r.depth-p.rear,0],[p.side,r.depth-p.rear,0]],'none','stroke-dasharray="5 4"');
 const block=(area,z,h,fill)=>{
  const factor=Math.sqrt(area/r.envelope), w=r.innerW*factor,d=r.innerD*factor;
  const ox=(r.width-w)/2,oy=(r.depth-d)/2;
  const tr=a=>a.map(([x,y,k])=>[x+ox,y+oy,k]);
  return poly(tr([[0,d,z],[w,d,z],[w,d,z+h],[0,d,z+h]]),fill)+poly(tr([[w,0,z],[w,d,z],[w,d,z+h],[w,0,z+h]]),'var(--panel)')+poly(tr(rectangle(w,d,z+h)),fill);
 };
 const podium=p.mode==='podium'?r.parkingLevels*p.parkingHeight:0;
 if(podium) svg+=block(r.parkPlate,0,podium,'var(--zone-soft)');
 svg+=block(r.footprint,podium,r.storeys*p.floorHeight,'var(--official-soft)');
 return '<svg class="mass-svg" viewBox="0 0 540 430" role="img" aria-labelledby="mass-title mass-desc"><title id="mass-title">Indicative massing block</title><desc id="mass-desc">'+r.storeys+' tower storeys; '+r.parkingLevels+' '+p.mode+' parking levels; '+fmt1(r.height)+' metres above ground. Dashed boundary shows setbacks. Diagram is schematic.</desc>'+svg+'<text x="16" y="24" fill="var(--ink)" font-size="16">'+r.storeys+' tower storeys · '+fmt1(r.height)+' m</text><text x="16" y="46" fill="var(--ink2)" font-size="13">'+r.parkingLevels+' '+p.mode+' parking levels</text><text x="16" y="405" fill="var(--ink2)" font-size="12">Site outline · dashed setback envelope · equivalent tower</text></svg>';
}
function viewMassing(id){
 const sid=MODELLED.includes(id)?id:(MODELLED.includes(MSEL)?MSEL:'taiping');MSEL=sid;store.set('msel',sid);
 const s=SITE[sid],p=massingConfig(sid),rows=massingScenarios(sid,p),r=rows[3];
 const n=(v,unit='')=>v===null?'Not assessed':fmt1(v)+unit;
 const money=v=>v===null?'Not assessed':fmtM(v,2);
 const cov=v=>v===null?'No owner model':fmtPct(v,0);
 const input=k=>{const f=MASS_FIELDS.find(f=>f[0]===k);return '<label class="mass-field" for="mass_'+k+'"><span>'+f[1]+'</span><input id="mass_'+k+'" type="number" data-mass="'+k+'" min="'+f[2]+'" max="'+f[3]+'" step="'+f[4]+'" value="'+p[k]+'"></label>'};
 return '<div class="page mass-page">'+head('Massing check','Test the space and parking needed for a plot ratio. This is an assumed rectangular envelope, not a confirmed buildable design.',siteSelect(sid,MODELLED.map(i=>SITE[i]),'massSel'))+
 '<p class="mass-notice">'+badge('UNDERWRITING_ASSUMPTION')+' Setbacks, footprint limits, height, parking and costs below need a planner and quantity surveyor to confirm them. Passing this screen is not planning approval.</p>'+
 '<div class="tw"><table class="cost" id="mass-results"><caption>Same base underwriting across four plot ratios; outputs are '+badge('MODEL_OUTPUT')+'</caption><thead><tr><th>Scenario</th><th class="num">PR ×</th><th class="num">Tower storeys</th><th class="num">Height m</th><th class="num">Car bays</th><th class="num">Parking levels</th><th class="num">Engine RLV</th><th class="num">Adjusted RLV</th><th class="num">Engine coverage</th><th class="num">Adjusted coverage</th><th>Envelope check</th></tr></thead><tbody>'+
 rows.map(q=>'<tr data-mass-row="'+q.key+'"><td>'+q.label+'</td><td class="num">'+fmt2(q.pr)+'</td><td class="num">'+(q.storeys??'No fit')+'</td><td class="num">'+n(q.height)+'</td><td class="num">'+fmt0(q.bays)+'</td><td class="num">'+(q.parkingLevels??'No fit')+'</td><td class="num">'+money(q.m.rlv)+'</td><td class="num">'+money(q.adjustedRLV)+'</td><td class="num">'+cov(q.m.own?.coverage??null)+'</td><td class="num">'+(q.geometryOK?cov(q.adjustedCoverage):'Not assessed')+'</td><td><span class="chip '+(!q.geometryOK||q.heightOK===false?'bad':'warn')+'">'+(!q.geometryOK?'No footprint':q.heightOK===false?'Above assumed height':q.heightOK===true?'Within assumed height':'Height limit unknown')+'</span></td></tr>').join('')+
 '</tbody></table></div><p class="small muted">DBKL scenarios remain discretionary. Classification ceiling uses the guideline reading, including zone restrictions; it is not an entitlement. Custom PR is a sensitivity only. Development charge: '+fmtPct(r.x.dc,0)+'. Lab edits and incentive-page edits are not used.</p>'+
 '<div class="sec"><div class="sec-head"><h2>Custom scenario geometry</h2>'+badge('MODEL_OUTPUT')+'</div><div class="mass-layout"><div>'+massingSVG(r)+'<p class="small muted">One equivalent tower. Shape and vertical scale are schematic. Basement parking sits below ground. Access, fire routes, tower spacing, slope, structure, services and construction staging are not tested.</p></div><div><table class="cost"><tbody>'+
 [['Parcel dimensions',n(r.width,' m')+' × '+n(r.depth,' m')],['Gross floor area',fmt0(r.m.gfa)+' sf'],['Net saleable area',fmt0(r.m.sal)+' sf'],['Indicative units (rounded up)',fmt0(r.units)],['Setback envelope',fmt0(r.envelope)+' sf'],['Tower floor plate',fmt0(r.footprint)+' sf'],['Parking floor plate',fmt0(r.parkPlate)+' sf'],['Required parking area',fmt0(r.parkingArea)+' sf'],['Built parking (full levels)',r.builtParkingArea===null?'Not assessed':fmt0(r.builtParkingArea)+' sf'],['Parking hard cost estimate',money(r.parkingHard)],['Additional cost incl. fees / contingency',money(r.extraCost)]].map(([a,b])=>'<tr><td>'+a+'</td><td class="num">'+b+'</td></tr>').join('')+
 '</tbody></table><p class="small">Parking is assumed outside chargeable GFA. Full parking floors are costed, including spare capacity on the last level. Unit count rounds up to avoid understating parking; the last unit may be smaller.</p></div></div></div>'+
 '<div class="sec"><div class="sec-head"><h2>Assumptions for this site</h2><button type="button" class="btn ghost" id="massReset">Reset massing</button></div>'+
 '<p class="small">Taiping starts at its public-map area proxy. Sites without an area start at an assumed 5 acres. Landed owner counts scale with parcel area; strata interest counts remain fixed. New unit sizes use the existing guideline assumptions.</p>'+
 '<div class="mass-fields">'+MASS_FIELDS.map(f=>input(f[0])).join('')+'</div>'+
 '<div class="mass-options"><label for="massMode">Parking form <select id="massMode" class="sel"><option value="podium" '+(p.mode==='podium'?'selected':'')+'>Podium</option><option value="basement" '+(p.mode==='basement'?'selected':'')+'>Basement</option></select></label>'+
 '<label for="massIncluded"><input type="checkbox" id="massIncluded" '+(p.included?'checked':'')+'> Assume parking is already included in engine hard cost</label></div>'+
 '<p class="mass-notice">Cost basis is unresolved. The engine applies hard cost to GFA, while its source benchmark uses construction floor area. The checked default avoids charging parking twice; it does not confirm that parking is included. Uncheck to deduct parking hard cost plus the engine’s professional-fee and contingency rates. GDV-based allowances and development charge stay unchanged in this cost sensitivity.</p>'+
 '<p class="small">Height includes tower floors plus podium parking floors. A zero height limit means unknown, never unlimited permission. Even if height fails, financial figures show the requested density and do not imply it can be built.</p></div>'+
 '<div class="sec"><h2>Evidence and next checks</h2><ul class="read"><li>PTKL2040 Volume 1 Part 1, Figure 3.3.2, printed page B1-32 directs readers to the site-level DCP2 intensity map. It does not establish a tower height for these parcels. <a href="'+U.ptkl+'" target="_blank" rel="noopener">Development-control document</a>.</li>'+
 '<li>DBKL lists the vehicle-parking guideline (2024 edition). Applicable residential rates and exemptions remain unverified here. <a href="https://www.dbkl.gov.my/en/garis-panduan" target="_blank" rel="noopener">DBKL guidelines</a>.</li>'+
 '<li>Confirm the cadastral polygon, setbacks, plinth, road surrender, height overlays, parking / motorcycle / accessible-bay standards and parking GFA treatment before relying on this screen.</li>'+
 '<li>Ask a quantity surveyor to reconcile GFA and construction floor area, parking inclusion and the basement / podium rates. No verified rate is inferred from a guideline listing.</li></ul><p><a href="#/sources">Open sources and diligence</a></p></div></div>';
}
function bindMassing(root){
 root.querySelector('#massSel').onchange=e=>go('#/massing/'+e.target.value);
 const save=p=>{if(!MASS||typeof MASS!=='object'||Array.isArray(MASS))MASS={};MASS[MSEL]=p;store.set('massing',MASS);render()};
 root.querySelectorAll('[data-mass]').forEach(el=>el.onchange=()=>{
  if(!el.checkValidity()||el.value.trim()===''){el.reportValidity();return}
  const p=massingConfig(MSEL), k=el.dataset.mass, v=Number(el.value);
  if(!Number.isFinite(v)||p[k]===v)return; // blur can repeat change while render removes the old input
  p[k]=v;save(p);
  const fresh=root.querySelector('#mass_'+k);if(fresh)fresh.focus({preventScroll:true});
 });
 root.querySelector('#massMode').onchange=e=>save({...massingConfig(MSEL),mode:e.target.value});
 root.querySelector('#massIncluded').onchange=e=>save({...massingConfig(MSEL),included:e.target.checked});
 root.querySelector('#massReset').onclick=()=>{if(MASS&&typeof MASS==='object')delete MASS[MSEL];store.set('massing',MASS);render();toast('Massing assumptions reset')};
}


