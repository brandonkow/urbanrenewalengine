/* ---------- cash flow: quarterly funding model, separate from static RLV ---------- */
const CF_FIELDS=[
 ['quarters','Construction profile length (quarters)',1,40,1],
 ['land','Owner entitlement / land consideration (RM)',0,1e11,1000],
 ['upfront','Cash at signing (%)',0,100,1],
 ['debt','Debt share of a cash deficit (%)',0,95,1],
 ['facility','Maximum outstanding facility (RM)',0,1e11,1000],
 ['rate','Annual debt interest (%)',0,50,.1],
 ['target','Target annual equity IRR (%)',0,100,.1],
 ['deposit','Buyer deposit on sale (%)',0,100,1],
 ['retention','Collections retained until after completion (%)',0,100,1],
 ['lag','Retention release delay (quarters)',0,8,1],
 ['rent','Additional relocation / rent, net of existing allowance (RM)',0,1e10,1000],
 ['extra','Additional fees / costs, excluding finance (RM)',0,1e10,1000]
];
function cfCurve(n){
 const f=t=>t*t*(3-2*t);
 return Array.from({length:n},(_,i)=>(f((i+1)/n)-f(i/n))*100);
}
function cfDefaults(x){
 const m=model(x),n=16;
 return {quarters:n,land:Math.max(0,m.own?.reqTotal??m.rlv),structure:'cash',upfront:100,
 debt:65,facility:m.gdv*.65,rate:6,target:15,deposit:10,retention:5,lag:2,rent:0,extra:0,
 construction:cfCurve(n),sales:Array.from({length:n},(_,i)=>i<4?0:100/(n-4))};
}
function cfValidate(p){
 const errors=[];
 if(!p||typeof p!=='object'||Array.isArray(p))return ['Cash-flow settings must be an object.'];
 for(const [k,l,min,max,step] of CF_FIELDS)if(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<min||p[k]>max||(step===1&&!Number.isInteger(p[k])))errors.push(l+' is outside its supported range.');
 if(!['cash','deferred','replacement','jv'].includes(p.structure))errors.push('Choose a supported owner structure.');
 if(p.deposit+p.retention>100)errors.push('Deposit plus retention cannot exceed 100%.');
 for(const k of ['construction','sales']){
  const a=p[k];if(!Array.isArray(a)||a.length!==p.quarters||a.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>100)||Math.abs(a.reduce((s,v)=>s+v,0)-100)>.001)errors.push(k+' needs one non-negative percentage per quarter, totalling 100%.');
 }
 return errors;
}
function cfClean(raw){
 const out={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 for(const id of MODELLED){const p=raw[id];if(!p||cfValidate(p).length)continue;
 out[id]=Object.fromEntries([...CF_FIELDS.map(f=>f[0]),'structure','construction','sales'].map(k=>[k,Array.isArray(p[k])?[...p[k]]:p[k]]))}
 return out;
}
let CF=cfClean(store.get('cashflow',{})),CFSEL='taiping';
function cfConfig(id,x){return JSON.parse(JSON.stringify(CF[id]||cfDefaults(x)))}
function cfNPV(flows,annual){const q=Math.pow(1+annual,.25);return flows.reduce((s,v,i)=>s+v/Math.pow(q,i),0)}
function cfIRR(flows){
 const signs=flows.filter(v=>Math.abs(v)>1e-7).map(Math.sign);
 let changes=0;for(let i=1;i<signs.length;i++)if(signs[i]!==signs[i-1])changes++;
 if(changes!==1||signs[0]!==-1)return {value:null,reason:changes>1?'Multiple sign changes; IRR withheld':'Needs an equity outflow followed by a return'};
 // Solve in log(1 + quarterly rate), which remains stable near -100%.
 const at=y=>flows.reduce((s,v,i)=>s+v*Math.exp(-y*i-Math.max(0,-y*(flows.length-1))),0);
 let lo=-20,hi=20;
 if(!(at(lo)>0&&at(hi)<0))return {value:null,reason:'IRR outside supported numerical range'};
 for(let i=0;i<160;i++){const mid=(lo+hi)/2;if(at(mid)>0)lo=mid;else hi=mid}
 const value=Math.expm1(4*(lo+hi)/2);
 return Number.isFinite(value)?{value,reason:''}:{value:null,reason:'IRR outside supported numerical range'};
}
function cfReceipts(p){
 const norm=a=>a.map(v=>v/a.reduce((s,z)=>s+z,0));
 const cw=norm(p.construction),sw=norm(p.sales);
 const completion=cw.reduce((last,v,i)=>v>0?i+1:last,0),release=completion+p.lag;
 const n=Math.max(p.quarters,release),receipts=Array(n+1).fill(0);
 let sold=0,progress=0;
 const dep=p.deposit/100,ret=p.retention/100,prog=1-dep-ret;
 for(let q=1;q<=n;q++){
  const c=cw[q-1]||0,s=sw[q-1]||0;progress+=c;
  const due=dep+prog*progress+(q>=release?ret:0);
  receipts[q]=s*due+sold*(prog*c+(q===release?ret:0));sold+=s;
 }
 return {receipts,cw,n,completion,release};
}
function cfModel(x,p,landOverride){
 const errors=cfValidate(p);if(errors.length)throw Error(errors.join(' '));
 const land=landOverride===undefined?p.land:landOverride;
 if(!Number.isFinite(land)||land<0)throw Error('Land consideration must be finite and non-negative.');
 const m=model(x);
 if(!['gdv','hard','pfee','cont','stat','sm','demo','dc','rlv','fin','prof'].every(k=>Number.isFinite(m[k]))||m.gdv<=0)throw Error('Financial inputs do not produce a supported cash flow.');
 if(p.structure==='replacement'&&land>m.gdv)throw Error('Replacement entitlement exceeds the saleable product.');
 const sched=cfReceipts(p),replacement=p.structure==='replacement',salesGDV=m.gdv-(replacement?land:0);
 const upfront=p.structure==='cash'?land*p.upfront/100:0;
 const deferred=['cash','deferred','jv'].includes(p.structure)?land-upfront:0;
 const rows=[],project=[-upfront],equity=[];
 let debt=0,reserve=0,peakDebt=0,interestTotal=0,cumEquity=0,peakEquity=0,terminalEquity=0;
 function fund(q,receipt,build,other,owner){
  const opening=debt,interest=q?opening*p.rate/400:0;interestTotal+=interest;
  let cash=reserve+receipt-build-other-owner-interest,draw=0,repay=0,eq=0,terminal=0,distribution=0;
  if(cash<0){draw=Math.min(-cash*p.debt/100,Math.max(0,p.facility-debt));eq=cash+draw;debt+=draw;cash=0}
  else {repay=Math.min(debt,cash);debt-=repay;cash-=repay}
  peakDebt=Math.max(peakDebt,debt,opening);
  if(q===sched.n){terminal=debt;eq-=terminal;repay+=terminal;debt=0;distribution=cash;eq+=cash;cash=0;terminalEquity=terminal}
  reserve=cash;cumEquity+=eq;peakEquity=Math.max(peakEquity,-cumEquity);equity.push(eq);
  rows.push({q,receipt,build,other,owner,opening,interest,draw,repay,equity:eq,distribution,terminal,reserve,debt});
 }
 fund(0,0,0,0,upfront);
 for(let q=1;q<=sched.n;q++){
  const cw=sched.cw[q-1]||0,rec=sched.receipts[q]*salesGDV;
  const build=(m.hard+m.pfee+m.cont)*cw;
  // Sales costs follow collections; statutory/DC/extra at Q1; demo at first work.
  const firstWork=p.construction.findIndex(v=>v>0)+1;
  const other=rec*x.sm+(q===1?m.stat+m.dc+p.extra:0)+(q===firstWork?m.demo:0)+(q<=sched.completion?p.rent/sched.completion:0);
  const owner=q===sched.completion?deferred:0;
  project.push(rec-build-other-owner);fund(q,rec,build,other,owner);
 }
 const sum=a=>a.reduce((s,v)=>s+v,0),profit=sum(equity),smSaving=replacement?land*x.sm:0;
 const bridge=m.rlv+m.fin+m.prof-land+smSaving-p.rent-p.extra-interestTotal;
 return {m,p:JSON.parse(JSON.stringify({...p,land})),land,salesGDV,replacementSF:replacement?land/x.asp:0,
  ...sched,rows,project,equity,peakDebt,peakEquity,interestTotal,terminalEquity,
  profit,equityIRR:cfIRR(equity),projectIRR:cfIRR(project),npv:cfNPV(equity,p.target/100),
  contributions:-sum(rows.map(r=>Math.min(0,r.equity))),distributions:sum(rows.map(r=>r.distribution)),
  bridge,bridgeError:profit-bridge,staticEquivalent:profit+land+interestTotal-m.fin-m.prof-smSaving+p.rent+p.extra};
}
function cfTarget(x,p){
 const m=model(x),value=land=>cfModel(x,p,land),npv=r=>cfNPV(r.equity,p.target/100);
 let lo=0,hi=m.gdv*(p.structure==='replacement'?1:2),r0=value(0),n0=npv(r0);
 if(n0<-.01)return {land:null,reason:'Target not reached even with zero land consideration'};
 if(n0<=.01)return {land:0,reason:'Only zero consideration reaches the target NPV'};
 let rhi=value(hi);
 if(npv(rhi)>0)return {land:null,reason:'No target boundary within twice GDV'};
 // Check monotonicity before solving: no optimizer should quietly assume it.
 let prev=n0;
 for(let i=1;i<=24;i++){const v=npv(value(hi*i/24));if(v>prev+.01)return {land:null,reason:'Non-monotonic funding response; target solver withheld'};prev=v}
 for(let i=0;i<70;i++){const mid=(lo+hi)/2;if(npv(value(mid))>=0)lo=mid;else hi=mid}
 const land=(lo+hi)/2,r=value(land);
 return {land,npv:npv(r),irr:r.equityIRR.value,reason:r.equityIRR.value===null?'Target NPV ceiling; no conventional equity IRR':'Target equity IRR achieved in this model'};
}


function cfPct(v){return v===null?'Not defined':fmtPct(v,1)}
function cfLabSummary(id,x){
 try{const r=cfModel(x,cfConfig(id,x));
 return '<section class="cf-summary"><h3>Time-phased funding</h3><p>Developer equity IRR <b>'+cfPct(r.equityIRR.value)+'</b> · Peak debt <b>'+fmtM(r.peakDebt)+'</b> · Peak equity <b>'+fmtM(r.peakEquity)+'</b>. <a href="#/cashflow/'+id+'">Inspect cash flow and assumptions</a></p><p class="small muted">Illustrative quarterly timing; pre-tax and before promote. '+(!SITE[id].area?'Normalised test parcel, not an assembled-site budget. ':'')+'Static RLV remains unchanged.</p></section>';
 }catch(e){return '<p class="note warn">Cash-flow settings need review: '+esc(e.message)+' <a href="#/cashflow/'+id+'">Open cash flow</a></p>'}
}
function cfOutput(id,x,p){
 let r;try{r=cfModel(x,p)}catch(e){return '<p class="note warn" role="alert">'+esc(e.message)+'</p>'}
 const t=cfTarget(x,p);
 const chart=lineChart({aria:'Quarterly outstanding debt and retained cash',series:[
 {name:'Debt',c:0,pts:r.rows.map(a=>[a.q,a.debt/1e6])},
 {name:'Retained cash',c:1,pts:r.rows.map(a=>[a.q,a.reserve/1e6])}],
 xl:'Quarter (0 = signing)',yl:'RM m',xf:fmt0,yf:fmt1});
 const metrics=[
 ['Developer equity IRR',cfPct(r.equityIRR.value)],['Project IRR before financing',cfPct(r.projectIRR.value)],
 ['Peak debt',fmtM(r.peakDebt)],['Peak equity deployed',fmtM(r.peakEquity)],
 ['Modelled debt interest',fmtM(r.interestTotal)],['Pre-tax equity profit / loss',fmtM(r.profit)],
 ['Land consideration at target return',t.land===null?'No supported price':fmtM(t.land)]
 ];
 return '<div id="cf-results"><div class="metrics">'+metrics.map(([k,v])=>'<div class="metric"><span class="v">'+v+'</span><span class="k">'+k+'</span></div>').join('')+'</div>'+
 '<p class="small">'+esc(t.reason)+'. Target '+fmtPct(p.target/100,1)+' annual equity return; same timing, facility and structure. '+(t.land!==null?'This is a nominal consideration ceiling, not a valuation or an accepted owner offer.':'')+'</p>'+
 (r.equityIRR.value===null?'<p class="note warn">'+esc(r.equityIRR.reason)+'. Use profit, funding and NPV instead.</p>':'')+
 '<p>Equity NPV at target: <b>'+fmtM(r.npv)+'</b>. Total equity contributed '+fmtM(r.contributions)+'; distributed '+fmtM(r.distributions)+'. '+(r.terminalEquity>.01?'<b>Final equity call to clear debt: '+fmtM(r.terminalEquity)+'.</b>':'Debt fully repaid from project receipts.')+'</p>'+
 '<p class="small">Owner structure: '+esc(p.structure)+'. Completion Q'+r.completion+'; retention released Q'+r.release+'. '+(p.structure==='replacement'?'Replacement entitlement reserves '+fmt0(r.replacementSF)+' saleable sf; collections fall to '+fmtM(r.salesGDV)+'. Construction cost remains for all units, and selling costs exclude the replacement entitlement.':p.structure==='jv'?'Owner entitlement equals '+fmtPct(p.land/r.m.gdv,1)+' of this scenario GDV, paid at completion.':'Owner cash is paid at signing and/or completion as selected.')+'</p>'+
 '<div class="sec"><h2>Debt and retained cash</h2>'+chart+'</div>'+
 '<div class="sec"><h2>Quarterly ledger</h2><p class="small">All amounts RM million. Scroll horizontally for the full funding ledger. Equity is negative for contributions and positive for final distributions.</p>'+
 '<div class="tw" role="region" tabindex="0" aria-label="Quarterly cash-flow ledger"><table class="cf-ledger"><thead><tr>'+['Quarter','Receipts','Construction + fees','Other costs','Owner cash','Opening debt','Interest','Debt drawn','Debt repaid','Equity flow','Cash retained','Closing debt'].map(s=>'<th>'+s+'</th>').join('')+'</tr></thead><tbody>'+
 r.rows.map(a=>'<tr><th scope="row">'+a.q+'</th>'+['receipt','build','other','owner','opening','interest','draw','repay','equity','reserve','debt'].map(k=>'<td class="num">'+fmt2(a[k]/1e6)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div></div>'+
 '<div class="sec"><h2>Reconcile to the static residual</h2><table class="cost"><tbody>'+
 [['Static RLV',r.m.rlv],['Add back flat finance allowance',r.m.fin],['Add back developer profit reserve (return, not cash cost)',r.m.prof],
 ['Less owner consideration / replacement sales foregone',-r.land],['Replacement selling-cost saving',p.structure==='replacement'?r.land*x.sm:0],
 ['Less additional relocation and costs',-p.rent-p.extra],['Less modelled interest',-r.interestTotal],['Equals pre-tax equity profit / loss',r.profit],
 ['Reconciliation difference (tolerance RM0.01)',r.bridgeError]].map(([l,v])=>'<tr><td>'+l+'</td><td class="num">'+fmtRM(v)+'</td></tr>').join('')+
 '</tbody></table><p class="small">The model replaces the flat finance allowance with the quarterly interest ledger. Developer profit is measured as a return, not charged again as a cash expense. Development charge retains the static engine amount and its existing assumptions. Reversing the bridge recovers static RLV to RM0.01, including flat-timing cases.</p></div>'+
 '<button type="button" class="btn ghost" id="cf-export">Export cash-flow JSON</button></div>';
}
function viewCashflow(id){
 const sid=MODELLED.includes(id)?id:CFSEL;CFSEL=MODELLED.includes(sid)?sid:'taiping';
 const x=st(CFSEL),p=cfConfig(CFSEL,x),saved=!!CF[CFSEL];
 return '<div class="page cf-page">'+head('Cash flow and IRR','Test when money is spent, received and funded. This is a separate timing model of the current live scenario.',siteSelect(CFSEL,MODELLED.map(i=>SITE[i]),'cf-site'))+
 '<p><a href="#/lab/'+CFSEL+'">Edit development inputs in the scenario lab</a> · '+badge('UNDERWRITING_ASSUMPTION')+'</p>'+
 '<p class="note warn">All timing, billing and facility terms are illustrative. They are not a statutory Schedule H schedule, bank offer or planning approval. '+(!SITE[CFSEL].area?'This is a normalised test parcel; its total amounts are not an assembled-site budget. ':'')+'Owner consent and evidence gaps remain unresolved.</p>'+
 '<form id="cf-form"><h2>Timing and funding assumptions</h2><p class="small">'+(saved?'Saved cash-flow settings are used; land consideration and facility remain your explicit amounts when the lab changes.':'Illustrative defaults: land equals the current owner budget, or the non-negative static residual where no owner model exists. Facility equals 65% of GDV; debt share 65%, interest 6%, target return 15%. None is a verified financing term.')+'</p>'+
 '<label class="mass-field">Owner structure<select id="cf-structure">'+[['cash','Cash with signing / completion split'],['deferred','Cash deferred to completion'],['replacement','Replacement units at completion'],['jv','JV entitlement at completion']].map(([v,l])=>'<option value="'+v+'" '+(p.structure===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label>'+
 '<div class="mass-fields">'+CF_FIELDS.map(([k,l,min,max,step])=>'<label class="mass-field">'+l+'<input data-cf="'+k+'" id="cf-'+k+'" type="number" required min="'+min+'" max="'+max+'" step="'+(step===1?1:'any')+'" value="'+p[k]+'"></label>').join('')+'</div>'+
 '<p class="small">Signing percentage applies only to the cash structure. Deferred cash and JV pay at construction completion. Replacement units forgo sales receipts; no cash land payment is added. Additional relocation is net of the demolition/relocation allowance already in the lab.</p>'+
 '<div class="cols">'+['construction','sales'].map(k=>'<label class="mass-field">'+(k==='construction'?'Construction spending / progress':'Sales take-up')+' percentages, Q1 onward<textarea id="cf-'+k+'" rows="4" required>'+p[k].map(v=>Number(v.toFixed(8))).join(', ')+'</textarea></label>').join('')+'</div>'+
 '<p class="small">Each list needs one percentage per quarter, totalling 100% (rounding within 0.001 percentage points is normalized). Use zero quarters to model delays. Buyer deposits arrive on sale; remaining progress collections follow cumulative construction progress, with catch-up for late sales. Retention is released after completion. All sales are assumed achieved by the end of the take-up profile.</p>'+
 '<p><button type="button" class="btn ghost" id="cf-profiles">Generate S-curve and delayed take-up</button> <button class="btn" type="submit">Apply cash-flow assumptions</button> <button type="button" class="btn ghost" id="cf-reset">Reset cash-flow assumptions</button></p><p id="cf-error" role="alert"></p></form>'+
 '<p class="note info">Quarter-end netting: receipts and retained cash fund costs first, then debt and equity cover deficits. Interest is charged on opening debt at the annual rate / 4. Surplus cash repays debt; remaining cash earns no interest and is held until the final distribution. Any debt left at the end requires an explicit equity call. Intraperiod funding peaks, taxes, lender fees not entered above, statutory account restrictions and promote are not modelled.</p>'+
 cfOutput(CFSEL,x,p)+'</div>';
}
function bindCashflow(root){
 const sid=CFSEL;root.querySelector('#cf-site').onchange=e=>go('#/cashflow/'+e.target.value);
 root.querySelector('#cf-profiles').onclick=()=>{
  const n=Number(root.querySelector('#cf-quarters').value);if(!Number.isInteger(n)||n<1||n>40){root.querySelector('#cf-error').textContent='Choose 1–40 quarters before generating profiles.';return}
  root.querySelector('#cf-construction').value=cfCurve(n).map(v=>+v.toFixed(8)).join(', ');
  const delay=Math.min(4,n-1);root.querySelector('#cf-sales').value=Array.from({length:n},(_,i)=>i<delay?0:+(100/(n-delay)).toFixed(8)).join(', ');
 };
 root.querySelector('#cf-form').onsubmit=e=>{
  e.preventDefault();const p=Object.fromEntries(CF_FIELDS.map(([k])=>[k,Number(root.querySelector('#cf-'+k).value)]));
  p.structure=root.querySelector('#cf-structure').value;
  for(const k of ['construction','sales'])p[k]=root.querySelector('#cf-'+k).value.split(',').map(v=>v.trim()===''?NaN:Number(v.trim()));
  const err=cfValidate(p);
  if(!err.length)try{cfModel(st(sid),p)}catch(e){err.push(e.message)}
  if(err.length){root.querySelector('#cf-error').textContent=err.join(' ');return}
  CF[sid]=p;store.set('cashflow',CF);render();toast('Cash-flow assumptions applied');
 };
 root.querySelector('#cf-reset').onclick=()=>{delete CF[sid];store.set('cashflow',CF);render()};
 const exp=root.querySelector('#cf-export');if(exp)exp.onclick=()=>{
  const x=JSON.parse(JSON.stringify(st(sid))),p=cfConfig(sid,x);
  saveText('klure-cashflow-'+sid+'.json',JSON.stringify({site:sid,asOf:new Date().toISOString(),basis:'Live scenario; illustrative quarterly assumptions; pre-tax, before promote',input:x,result:cfModel(x,p),target:cfTarget(x,p)},null,2),'application/json');
 };
}


