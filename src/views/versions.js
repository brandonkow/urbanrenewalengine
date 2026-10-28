/* Dated scenario history. Analyst snapshots; no consent or approval is implied. */
const SV_SCHEMA='klure.scenario-version.v1',SV_ENGINE='static-v1/cashflow-v1',SV_LIMIT=60;
const SV_FIELDS=[['area','Test area (acres)',0.0001,100000],['pr','Base plot ratio',0,100],['prUp','Plot-ratio uplift',0,10],['asp','ASP (RM / saleable sf)',0,1e7],['eff','Saleable efficiency',0.001,1],['hc','Hard cost (RM / GFA sf)',0,1e7],['pf','Professional fee rate',0,1],['cont','Contingency rate',0,1],['stat','Statutory cost rate',0,1],['sm','Selling cost rate',0,1],['fin','Flat finance rate',0,1],['demo','Demolition rate',0,1],['profit','Profit reserve rate',0,1],['dc','Development-charge setting',0,1]];
function svCopy(v){return JSON.parse(JSON.stringify(v))}
function svText(v,n,label){if(typeof v!=='string'||v.length>n)throw Error(label+' must be text up to '+n+' characters.');return v}
function svNumber(v,min,max,label){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('Unsupported '+label+'.');return v}
function svInput(raw){
 if(raw===null)return null;
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Scenario inputs must be an object.');
 const x={};for(const [k,label,min,max] of SV_FIELDS)x[k]=svNumber(raw[k],min,max,label);
 x.sc=Object.hasOwn(PRESET,raw.sc)?raw.sc:'base';x.areaConfirmed=raw.areaConfirmed===true;
 if(raw.owner===null)x.owner=null;
 else{
  const o=raw.owner;if(!o||typeof o!=='object'||Array.isArray(o))throw Error('Owner inputs must be an object.');
  x.owner={};
  for(const k of ['res','com','n'])x.owner[k]=svNumber(o[k],0,1e11,'owner '+k);
  for(const k of ['cs','up','hold'])x.owner[k]=svNumber(o[k]??0,0,k==='cs'?1:10,'owner '+k);
  for(const k of ['nConfirmed','placeholder'])x.owner[k]=o[k]===true;
  x.owner.mode=o.mode==='landed'?'landed':'strata';
  for(const [k,min,max] of [['net',0,1],['lot',0.01,1e8],['lpsf',0,1e8]])if(o[k]!==undefined)x.owner[k]=svNumber(o[k],min,max,'owner '+k);
  if(o.form){x.owner.form={on:o.form.on===true,bays:svNumber(o.form.bays,0,1e6,'bays'),levels:svNumber(o.form.levels,1,1e4,'levels')}}
  if(x.owner.mode==='landed'&&!['net','lot','lpsf'].every(k=>typeof x.owner[k]==='number'))throw Error('Landed owner inputs are incomplete.');
 }
 return x;
}
function svFunding(raw){
 if(raw===null)return null;
 const errors=cfValidate(raw);if(errors.length)throw Error(errors.join(' '));
 return Object.fromEntries([...CF_FIELDS.map(f=>f[0]),'structure','construction','sales'].map(k=>[k,svCopy(raw[k])]));
}
function svOutcome(x,p){
 if(!x)return {rlv:null,coverage:null,ownerBudget:null,irr:null,irrReason:'No development model',peakDebt:null,peakEquity:null,profit:null,npv:null,fundingError:''};
 const m=model(x),out={rlv:m.rlv,coverage:m.own?.coverage??null,ownerBudget:m.own?.reqTotal??null,irr:null,irrReason:'Funding settings missing',peakDebt:null,peakEquity:null,profit:null,npv:null,fundingError:''};
 if(p)try{const c=cfModel(x,p);Object.assign(out,{irr:c.equityIRR.value,irrReason:c.equityIRR.reason,peakDebt:c.peakDebt,peakEquity:c.peakEquity,profit:c.profit,npv:c.npv})}catch(e){out.fundingError=e.message;out.irrReason=e.message}
 return svCopy(out);
}
function svEvidence(raw){
 if(!Array.isArray(raw)||raw.length>500)throw Error('Evidence snapshot exceeds 500 entries.');
 return raw.map(e=>{if(!e||typeof e!=='object')throw Error('Invalid evidence entry.');return Object.fromEntries(['site','f','v','type','conf','url','chk','n'].map(k=>[k,svText(e[k],6000,'Evidence '+k)]))});
}
function svTasks(raw){
 if(!Array.isArray(raw)||raw.length>30)throw Error('Invalid task snapshot.');
 return raw.map(t=>{const o={};for(const k of ['id','title','status','finding','role','due','review','reference','url'])o[k]=svText(t[k],2000,'Task '+k);for(const k of ['changed','unreviewed','overdue'])o[k]=t[k]===true;return o});
}
function svValidate(v){
 if(!v||v.schema!==SV_SCHEMA||v.engine!==SV_ENGINE)throw Error('Unsupported scenario-history schema or engine version.');
 if(!Object.hasOwn(SITE,v.site)||!Object.hasOwn(MEMO_BASES,v.basis)||!Object.hasOwn(MEMO_DECISIONS,v.decision))throw Error('Invalid site, basis or proposed position.');
 if(typeof v.id!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(v.id))throw Error('Invalid version identifier.');
 if(typeof v.createdAt!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v.createdAt)||!Number.isFinite(Date.parse(v.createdAt))||new Date(v.createdAt).toISOString()!==v.createdAt||Date.parse(v.createdAt)>Date.now()+86400000)throw Error('Invalid snapshot timestamp.');
 const input=svInput(v.input),funding=svFunding(v.funding);
 if((input===null)!==(!SITE[v.site].rlv)||(!input&&funding))throw Error('Scenario model does not match the selected site.');
 const out={schema:SV_SCHEMA,engine:SV_ENGINE,build:'6.3',id:v.id,site:v.site,createdAt:v.createdAt,basis:v.basis,label:svText(v.label,120,'Label').trim(),decision:v.decision,rationale:svText(v.rationale,3000,'Rationale').trim(),input,funding,fundingSaved:v.fundingSaved===true,areaBasis:svText(v.areaBasis,2000,'Area basis'),evidence:svEvidence(v.evidence),tasks:svTasks(v.tasks)};
 if(!out.label)throw Error('Give this version a label.');
 if(out.decision!=='unreviewed'&&!out.rationale)throw Error('Explain the proposed position.');
 if(!Array.isArray(v.gaps)||v.gaps.length>50)throw Error('Invalid evidence gaps.');
 out.gaps=v.gaps.map(g=>svText(g,2000,'Gap'));
 out.outcome=svOutcome(input,funding);
 // Historical results are checked, never silently replaced with a different model's answer.
 if(!v.outcome||Object.keys(out.outcome).some(k=>typeof out.outcome[k]==='number'?typeof v.outcome[k]!=='number'||!Number.isFinite(v.outcome[k])||Math.abs(v.outcome[k]-out.outcome[k])>Math.max(1e-8,Math.abs(out.outcome[k])*1e-10):v.outcome[k]!==out.outcome[k]))throw Error('Stored results do not match their captured assumptions.');
 return out;
}
function svClean(raw){
 if(!Array.isArray(raw)||raw.length>SV_LIMIT||JSON.stringify(raw).length>4000000)throw Error('History supports up to 60 versions and 4 MB. Export and remove older versions first.');
 const out=raw.map(svValidate);if(new Set(out.map(v=>v.id)).size!==out.length)throw Error('Duplicate scenario-version identifier.');
 return out;
}
let SV=[],SVNOTICE='';
try{const raw=localStorage.getItem('klure:versions');SV=svClean(raw===null?[]:JSON.parse(raw))}catch(e){SVNOTICE='Stored history could not be loaded: '+e.message+' The original browser record has been retained.'}
let SVUI={site:'taiping',left:'',right:'current',basis:'live',label:'',decision:'unreviewed',rationale:'',current:null};
function svPersist(raw){
 const next=svClean(raw);
 try{localStorage.setItem('klure:versions',JSON.stringify(next))}catch(e){throw Error('History could not be saved in this browser. Export a workspace copy or free storage, then retry.')}
 SV=next;SVNOTICE='';schedulePush();return next;
}
function svCapture(id,basis,label,decision='unreviewed',rationale=''){
 const state=STATE,inc=INC;
 try{
 STATE=svCopy(state);INC=svCopy(inc);
 const raw=comparisonInput(id,basis),input=svInput(raw),funding=input?svFunding(cfConfig(id,input)):null;
 const evidence=memoEvidence(id,basis,input),r=comparisonResult(SITE[id],input,evidence,txRows(id),LAND_DEALS);
 return svValidate({schema:SV_SCHEMA,engine:SV_ENGINE,build:'6.3',id:'sv_'+crypto.randomUUID(),site:id,createdAt:new Date().toISOString(),basis,label,decision,rationale,input,funding,fundingSaved:!!CF[id],areaBasis:r.areaBasis,evidence,gaps:r.gaps,tasks:ddRows(id).map(t=>({id:t.id,title:t.title,status:t.event.status,finding:t.event.finding,role:t.event.role,due:t.event.due,review:t.event.review,reference:t.event.reference,url:t.event.url,changed:t.changed,unreviewed:t.unreviewed,overdue:t.overdue})),outcome:svOutcome(input,funding)});
 }finally{STATE=state;INC=inc}
}
function svFlat(v){
 const out={'Scenario basis':MEMO_BASES[v.basis],'Area basis':v.areaBasis,'Funding settings origin':v.fundingSaved?'Saved absolute settings':'Illustrative defaults'};
 if(v.input){
  for(const [k,l] of SV_FIELDS)out[l]=['prUp','eff','pf','cont','stat','sm','fin','demo','profit','dc'].includes(k)?fmtPct(v.input[k],4):v.input[k];
  out['Area confirmed by user']=v.input.areaConfirmed;
  const labels={res:'Residential owner value (RM / interest)',com:'Commercial owner value (RM / interest)',n:'Ownership interests tested',cs:'Commercial share of interests',up:'Owner uplift',hold:'Holdout allowance',nConfirmed:'Owner count confirmed by user',placeholder:'Placeholder owner assumptions',mode:'Owner model',net:'Net residential land share',lot:'Typical lot area (sf)',lpsf:'Owner land value (RM / land sf)'};
  for(const [k,value] of Object.entries(v.input.owner||{})){if(k==='form'){out['Block-derived count enabled']=value.on;out['Bays per block']=value.bays;out['Levels per block']=value.levels}else out[labels[k]||k]=['cs','up','hold','net'].includes(k)?fmtPct(value,4):value}
  if(v.funding){for(const [k,l] of CF_FIELDS)out[l]=v.funding[k];out['Funding structure']=v.funding.structure;out['Construction profile (% by quarter)']=v.funding.construction;out['Sales profile (% by quarter)']=v.funding.sales}
 }
 return out;
}
function svChanges(a,b){
 const x=svFlat(a),y=svFlat(b);
 return [...new Set([...Object.keys(x),...Object.keys(y)])].filter(k=>JSON.stringify(x[k])!==JSON.stringify(y[k])).map(k=>({field:k,before:x[k]??'Not recorded',after:y[k]??'Not recorded'}));
}
function svEvidenceDiff(a,b){
 const key=e=>JSON.stringify([e.site,e.f,e.url]),groups=rows=>{const m=new Map();for(const e of rows){const k=key(e);m.set(k,[...(m.get(k)||[]),e])}return m};
 const x=groups(a.evidence),y=groups(b.evidence),out=[];
 for(const k of new Set([...x.keys(),...y.keys()])){const left=x.get(k)||[],right=y.get(k)||[];if(JSON.stringify(left)!==JSON.stringify(right))out.push({kind:!left.length?'Added':!right.length?'Removed':'Changed',field:(right[0]||left[0]).f,before:left,after:right})}
 return out;
}
function svBridge(a,b){
 if(a.site!==b.site)throw Error('Choose two versions of the same site.');
 if(!a.input||!b.input)return [];
 let x=svCopy(a.input),p=svCopy(a.funding),previous=svOutcome(x,p);
 const groups=[['Area and owner package',['area','areaConfirmed','owner']],['Plot ratio and uplift',['pr','prUp']],['Sales and efficiency',['asp','eff']],['Construction, fees and contingency',['hc','pf','cont']],['Other costs, profit and development charge',['stat','sm','fin','demo','profit','dc']],['Funding and timing',[]]];
 return groups.map(([label,keys])=>{for(const k of keys)x[k]=svCopy(b.input[k]);if(!keys.length)p=svCopy(b.funding);const next=svOutcome(x,p),row={label,rlv:next.rlv===null||previous.rlv===null?null:next.rlv-previous.rlv,coverage:next.coverage===null||previous.coverage===null?null:next.coverage-previous.coverage,irr:next.irr===null||previous.irr===null?null:next.irr-previous.irr,reason:next.irrReason||previous.irrReason};previous=next;return row});
}
function svDisplay(v){return Array.isArray(v)?v.map(n=>typeof n==='number'?fmt2(n):String(n)).join(', '):typeof v==='number'?String(+v.toFixed(6)):typeof v==='boolean'?(v?'Yes':'No'):String(v)}
function svMetric(k,v){if(v===null||v===undefined)return 'Not assessed';return ['irr','coverage'].includes(k)?fmtPct(v,1):fmtM(v)}
function svCompare(a,b){
 if(a.site!==b.site)return '<p class="note warn">Choose two versions of the same site.</p>';
 const delta=(k)=>a.outcome[k]===null||b.outcome[k]===null?'Not assessed':['irr','coverage'].includes(k)?fmt2((b.outcome[k]-a.outcome[k])*100)+' pp':fmtM(b.outcome[k]-a.outcome[k]);
 const changes=svChanges(a,b),ev=svEvidenceDiff(a,b),bridge=svBridge(a,b);
 return '<section id="sv-comparison"><h2>What changed</h2><p>From <b>'+esc(a.label)+'</b> ('+esc(a.createdAt)+') to <b>'+esc(b.label)+'</b> ('+esc(b.createdAt)+'). Times are UTC.</p>'+
 '<p class="small">On narrow screens, scroll each table horizontally to see both selections and the change.</p><div class="tw" role="region" tabindex="0" aria-label="Scrollable scenario comparison"><table class="sv-table"><thead><tr><th>Result</th><th>Earlier selection</th><th>Later selection</th><th>Change</th></tr></thead><tbody>'+
 [['rlv','Static RLV'],['ownerBudget','Owner consideration'],['coverage','Owner coverage'],['irr','Equity IRR'],['peakDebt','Peak debt'],['peakEquity','Peak equity'],['profit','Pre-tax equity profit'],['npv','Equity NPV at captured target']].map(([k,l])=>'<tr><th>'+l+'</th><td>'+svMetric(k,a.outcome[k])+'</td><td>'+svMetric(k,b.outcome[k])+'</td><td>'+delta(k)+'</td></tr>').join('')+'</tbody></table></div>'+
 '<p class="small">IRR: earlier '+esc(a.outcome.irrReason||'Defined')+'; later '+esc(b.outcome.irrReason||'Defined')+'. Changes in coverage and IRR are percentage points (pp). NPV uses each version’s target; inspect target changes below.</p>'+
 '<h3>Proposed position and evidence gaps</h3><div class="cols">'+[a,b].map(v=>'<div class="block"><h4>'+esc(v.label)+'</h4><p><b>'+esc(MEMO_DECISIONS[v.decision])+'</b></p><p class="memo-pre">'+esc(v.rationale||'No rationale recorded')+'</p><p>'+esc(v.areaBasis)+'</p><ul>'+v.gaps.map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul><p>'+v.tasks.filter(t=>t.unreviewed).length+' of '+v.tasks.length+' investigation tasks await review or recheck.</p></div>').join('')+'</div><p class="note warn">The position is an analyst proposal. A stronger financial result does not verify evidence, create committee approval or establish owner consent.</p>'+
 '<h3>Changed assumptions ('+changes.length+')</h3>'+(changes.length?'<div class="tw" role="region" tabindex="0" aria-label="Scrollable scenario comparison"><table class="sv-table"><thead><tr><th>Assumption</th><th>Earlier selection</th><th>Later selection</th></tr></thead><tbody>'+changes.map(c=>'<tr><th>'+esc(c.field)+'</th><td>'+esc(svDisplay(c.before))+'</td><td>'+esc(svDisplay(c.after))+'</td></tr>').join('')+'</tbody></table></div>':'<p>No captured input changes.</p>')+
 (bridge.length?'<details class="sv-detail"><summary>Explain the numerical change</summary><p>Ordered substitutions: area/owner, planning, sales, construction, other costs, then funding. Each row changes only that group; earlier funding amounts stay fixed until the final row. Contributions depend on this order and are model arithmetic, not evidence of market causation. Intermediate unsupported IRRs are withheld.</p><div class="tw" role="region" tabindex="0" aria-label="Scrollable scenario comparison"><table class="sv-table"><thead><tr><th>Input group</th><th>RLV change</th><th>Coverage change</th><th>Equity IRR change</th></tr></thead><tbody>'+bridge.map(r=>'<tr><th>'+esc(r.label)+'</th><td>'+svMetric('rlv',r.rlv)+'</td><td>'+(r.coverage===null?'Not assessed':fmt2(r.coverage*100)+' pp')+'</td><td>'+(r.irr===null?'Withheld: '+esc(r.reason):fmt2(r.irr*100)+' pp')+'</td></tr>').join('')+'</tbody></table></div></details>':'')+
 '<h3>Evidence changes ('+ev.length+')</h3><p class="small">Captured text, URLs and check dates only. A changed source is not automatically a verified fact.</p>'+
 (ev.length?ev.map(e=>'<details class="sv-detail"><summary>'+esc(e.kind+' — '+e.field)+'</summary>'+[e.before,e.after].map((rows,i)=>'<h4>'+(i?'Later':'Earlier')+'</h4>'+(rows.length?rows.map(r=>'<p>'+esc(r.v)+'<br>'+esc(r.type+' · '+r.conf+' · '+r.chk)+'</p><p>'+esc(r.n)+'</p><p>'+ddLink(r.url,r.url)+'</p>').join(''):'<p>Not recorded.</p>')).join('')+'</details>').join(''):'<p>No captured source changes.</p>')+
 '<details class="sv-detail"><summary>Investigation review snapshots</summary>'+[a,b].map(v=>'<h4>'+esc(v.label)+'</h4><ul>'+v.tasks.map(t=>'<li>'+esc(t.title+': '+t.status+' / '+t.finding+'; review '+(t.review||'not recorded')+(t.changed?' — source changed':''))+'</li>').join('')+'</ul>').join('')+'</details></section>';
}
function viewVersions(id){
 if(Object.hasOwn(SITE,id)&&SVUI.site!==id){SVUI.site=id;SVUI.left='';SVUI.right='current';SVUI.current=null}
 const rows=SV.filter(v=>v.site===SVUI.site),selected=rows.find(v=>v.id===SVUI.left)||rows[0];if(selected)SVUI.left=selected.id;
 const right=SVUI.right==='current'?SVUI.current:rows.find(v=>v.id===SVUI.right);
 const options=chosen=>rows.map(v=>'<option value="'+esc(v.id)+'" '+(chosen===v.id?'selected':'')+'>'+esc(v.label+' · '+v.createdAt)+'</option>').join('');
 return '<div class="page sv-page">'+head('Saved scenario comparison','Keep dated inputs, funding terms, evidence and proposed positions. Compare two versions without changing the live scenario.',siteSelect(SVUI.site,SITES,'sv-site'))+
 '<p class="note">Saved in this workspace; use workspace export to keep a backup. History can be replaced by import or account sync and is not an authenticated audit trail. Older Scenario lab saves remain available there; historical evidence is not backfilled.</p>'+
 (SVNOTICE?'<p class="note warn" role="alert">'+esc(SVNOTICE)+'</p>':'')+
 '<form id="sv-form"><div class="mass-fields"><label class="mass-field">Version label<input id="sv-label" maxlength="120" required value="'+esc(SVUI.label)+'"></label><label class="mass-field">Scenario basis<select id="sv-basis">'+Object.entries(MEMO_BASES).map(([k,l])=>'<option value="'+k+'" '+(SVUI.basis===k?'selected':'')+'>'+esc(l)+'</option>').join('')+'</select></label><label class="mass-field">Proposed position<select id="sv-decision">'+Object.entries(MEMO_DECISIONS).map(([k,l])=>'<option value="'+k+'" '+(SVUI.decision===k?'selected':'')+'>'+esc(l)+'</option>').join('')+'</select></label></div><label class="mass-field">Rationale<textarea id="sv-rationale" rows="3" maxlength="3000">'+esc(SVUI.rationale)+'</textarea></label><p class="small">Do not enter owner personal data or confidential document contents. Saving captures the inputs and evidence now; versions cannot be edited in this view.</p><button class="btn" type="submit">Save dated version</button><p id="sv-error" role="alert"></p></form>'+
 '<section class="sec"><h2>Compare saved versions</h2><div class="mass-fields"><label class="mass-field">Earlier selection<select id="sv-left"><option value="">Choose a saved version</option>'+options(SVUI.left)+'</select></label><label class="mass-field">Later selection<select id="sv-right"><option value="current">Current live snapshot</option>'+options(SVUI.right)+'</select></label></div><p><button class="btn ghost" id="sv-refresh">Refresh current live snapshot</button></p><p class="small">Current snapshot is captured only when refreshed, using the proposed position and rationale above. Edits to the form or live workspace do not silently change the displayed comparison.</p>'+
 (selected&&right?svCompare(selected,right):'<p>Save a version, then choose another version or refresh the current live snapshot.</p>')+'</section>'+
 '<section class="sec"><h2>Saved history ('+SV.length+' / '+SV_LIMIT+' across all sites)</h2><p><button class="btn ghost" id="sv-export">Export history JSON</button> · <a href="#/method">Workspace backup and import</a> · <a href="#/lab/'+SVUI.site+'">Scenario lab</a></p><p class="small">No automatic deletion at the limit. Export before removing a version. Imports replace the history if included.</p><ul class="sv-history">'+rows.map(v=>'<li><div><b>'+esc(v.label)+'</b><br>'+esc(v.createdAt)+' · '+esc(MEMO_BASES[v.basis])+'<br>'+esc(MEMO_DECISIONS[v.decision])+'</div><button class="btn ghost" data-sv-delete="'+v.id+'">Delete version</button></li>').join('')+'</ul></section></div>';
}
function bindVersions(root){
 const read=()=>{SVUI.basis=root.querySelector('#sv-basis').value;SVUI.label=root.querySelector('#sv-label').value;SVUI.decision=root.querySelector('#sv-decision').value;SVUI.rationale=root.querySelector('#sv-rationale').value};
 const error=e=>{root.querySelector('#sv-error').textContent=e.message};
 root.querySelector('#sv-site').onchange=e=>go('#/versions/'+e.target.value);
 root.querySelector('#sv-form').onsubmit=e=>{e.preventDefault();try{read();if(SVNOTICE)throw Error('Resolve the stored-history error before replacing its original record. Export the original browser record first.');const v=svCapture(SVUI.site,SVUI.basis,SVUI.label,SVUI.decision,SVUI.rationale);svPersist([...SV,v]);SVUI.left=v.id;render();toast('Dated version saved')}catch(e){error(e)}};
 root.querySelector('#sv-refresh').onclick=()=>{try{read();SVUI.current=svCapture(SVUI.site,'live','Current live snapshot',SVUI.decision,SVUI.rationale);SVUI.right='current';render()}catch(e){error(e)}};
 for(const k of ['left','right'])root.querySelector('#sv-'+k).onchange=e=>{read();SVUI[k]=e.target.value;render()};
 root.querySelector('#sv-export').onclick=()=>{if(SVNOTICE)saveText('scenario-history-recovery.txt',localStorage.getItem('klure:versions')||'No stored history could be read.','text/plain');else saveText('scenario-history.json',JSON.stringify({versions:SV},null,2),'application/json')};
 root.querySelectorAll('[data-sv-delete]').forEach(b=>armConfirm(b,()=>{try{svPersist(SV.filter(v=>v.id!==b.dataset.svDelete));render()}catch(e){error(e)}}));
}
