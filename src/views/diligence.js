/* ---------- due diligence: evidence-linked workflow, never gate certification ---------- */
const DD_STATUS={open:'Open',working:'In progress',waiting:'Waiting for evidence',reviewed:'Review recorded'};
const DD_FINDING={pending:'Not assessed',supported:'Supports the stated question',contradicted:'Contradicts the stated question',inconclusive:'Inconclusive'};
const DD_ROLE={unassigned:'Unassigned',analyst:'Analyst',planner:'Planner',legal:'Legal adviser',valuer:'Valuer',qs:'Quantity surveyor'};
const DD_TASKS=[
 ['boundary','Confirm parcel boundary and area','Obtain title, cadastral area and parcel geometry; distinguish public-map proxies.'],
 ['ownership','Verify legal interests and tenure','Confirm parcel counts, share units, tenure and restrictions from records. Do not store owner personal data.'],
 ['planning','Obtain written planning position','Confirm permitted use, intensity, incentive eligibility, development charges and required technical studies.'],
 ['market','Review comparable completed sales','Check dates, property type, area basis and proposed-product comparability. Asking prices remain separate.'],
 ['cost','Reconcile design and cost allowances','Reconcile massing, parking, demolition, relocation and contingencies with QS evidence.'],
 ['consent','Review assembly evidence','Reconcile the Assembly tracker with legal records. Recording this task does not establish consent.'],
 ['funding','Verify funding and programme','Obtain lender terms, collection timing, equity commitments and a deliverable programme.']
];
function ddTemplates(id){return DD_TASKS.map(([id,title,need])=>({id,title,need})).concat(id==='taiping'?CHECK.map(c=>({id:'legacy-'+c.id,title:c.t,need:c.n})):[])}
function ddEmpty(){return {status:'open',role:'unassigned',due:'',review:'',finding:'pending',note:'',url:'',reference:'',source:null}}
function ddSnapshot(e){return Object.fromEntries(['site','f','v','type','conf','url','chk','n'].map(k=>[k,String(e[k]??'')]))}
function ddKey(e){return JSON.stringify([e.site,e.f,e.url,e.n])}
function ddEvidence(id){return EVIDENCE.filter(e=>e.site===id||e.site==='all').concat(txEvidence(id)).map(ddSnapshot)}
function ddValidate(e,asOf){
 const errs=[];
 if(!e||typeof e!=='object'||Array.isArray(e))return ['Invalid review record.'];
 for(const [k,dict] of [['status',DD_STATUS],['role',DD_ROLE],['finding',DD_FINDING]])if(!Object.hasOwn(dict,e[k]))errs.push('Choose a valid '+k+'.');
 for(const [k,max] of [['due',10],['review',10],['note',2000],['url',2000],['reference',300]])if(typeof e[k]!=='string'||e[k].length>max)errs.push('Invalid '+k+' length.');
 for(const k of ['due','review'])if(e[k]&&reviewDay(e[k])===null)errs.push('Enter a valid '+k+' date.');
 if(e.review&&e.review>asOf)errs.push('Review date cannot be in the future.');
 if(e.url&&!txURL(e.url))errs.push('Use an http or https source URL without login credentials.');
 if(e.source!==null){
  if(!e.source||typeof e.source!=='object'||Array.isArray(e.source)||['site','f','v','type','conf','url','chk','n'].some(k=>typeof e.source[k]!=='string'||e.source[k].length>6000))errs.push('Invalid evidence snapshot.');
  else if(e.source.url&&!txURL(e.source.url))errs.push('Invalid evidence URL.');
 }
 if(e.status==='reviewed'){
  if(!e.review||e.finding==='pending'||(typeof e.note!=='string'||!e.note.trim())||(typeof e.reference!=='string'||!e.reference.trim())||!e.url)errs.push('A recorded review needs a date, finding, note, source URL and document/page reference.');
  if(e.source?.type==='MISSING')errs.push('Missing evidence cannot support a recorded review. Cite an actual document.');
 }
 return errs;
}
function ddClean(raw,asOf){
 const data={};let rejected=0;
 if(raw==null)return {data,rejected};
 if(typeof raw!=='object'||Array.isArray(raw))return {data,rejected:1};
 for(const [id,tasks] of Object.entries(raw)){
  if(!Object.hasOwn(SITE,id)||!tasks||typeof tasks!=='object'||Array.isArray(tasks)){rejected++;continue}
  const allowed=new Set(ddTemplates(id).map(t=>t.id)),clean={};
  for(const [key,record] of Object.entries(tasks)){
   const hist=record?.history;let prev='';
   if(!allowed.has(key)||!Array.isArray(hist)||!hist.length||hist.length>500){rejected++;continue}
   const history=[];let bad=false;
   for(const rawEvent of hist){
    if(!rawEvent||typeof rawEvent!=='object'||Array.isArray(rawEvent)){bad=true;break}
    const e=Object.fromEntries(Object.keys(ddEmpty()).map(k=>[k,rawEvent[k]]));
    const at=rawEvent.at,ms=Date.parse(at);
    if(ddValidate(e,asOf).length||typeof at!=='string'||!Number.isFinite(ms)||new Date(ms).toISOString()!==at||at<prev||at.slice(0,10)>asOf||(e.review&&e.review>at.slice(0,10))){bad=true;break}
    if(e.source)e.source=ddSnapshot(e.source);
    history.push({...e,at});prev=at;
   }
   if(bad){rejected++;continue}
   clean[key]={history};
  }
  if(Object.keys(clean).length)data[id]=clean;
 }
 return {data,rejected};
}
const DD_LOAD=ddClean(store.get('diligence',{}),reviewToday());
let DD=DD_LOAD.data,DDNOTICE=DD_LOAD.rejected,DDUI={site:'taiping',filter:'all',task:'boundary'};
function ddCurrent(record){return record?.history?.at(-1)||ddEmpty()}
function ddChanged(event,evidence){
 if(!event.source)return false;
 const now=evidence.find(e=>ddKey(e)===ddKey(event.source));
 return !now||JSON.stringify(ddSnapshot(now))!==JSON.stringify(ddSnapshot(event.source));
}
function ddRows(id,asOf=reviewToday()){
 const evidence=ddEvidence(id);
 return ddTemplates(id).map(t=>{
  const record=DD[id]?.[t.id],event=ddCurrent(record),changed=ddChanged(event,evidence);
  return {...t,event,history:record?.history||[],changed,unreviewed:event.status!=='reviewed'||changed,overdue:!!event.due&&event.due<asOf&&(event.status!=='reviewed'||changed)};
 });
}
function ddAppend(record,event,at,asOf){
 const errors=ddValidate(event,asOf);if(errors.length)throw Error(errors.join(' '));
 const history=record?.history||[];
 if(history.length>=500)throw Error('History is full (500 entries). Export it before arranging an archive; no entries have been removed.');
 const clean=ddClean({taiping:{boundary:{history:history.concat({...event,at})}}},asOf);
 if(clean.rejected)throw Error('Invalid or out-of-order review timestamp.');
 return clean.data.taiping.boundary;
}
function ddSave(id,key,event){
 if(!Object.hasOwn(SITE,id)||!ddTemplates(id).some(t=>t.id===key))throw Error('Unknown site or task.');
 const record=ddAppend(DD[id]?.[key],event,new Date().toISOString(),reviewToday());
 const next={...DD,[id]:{...DD[id],[key]:record}};
 try{localStorage.setItem('klure:diligence',JSON.stringify(next))}catch(e){throw Error('Review was not saved: browser storage is unavailable or full. Export the workspace before freeing storage.')}
 DD=next;schedulePush();
}
function ddGates(id){
 return TRIGGERS.filter(t=>t.site===id).map(t=>({label:t.l,state:evalTrigger(t).state,basis:t.basis||'Current scenario and recorded evidence',need:t.need||'Confirm the underlying evidence; workflow reviews do not change this condition.'}));
}
function ddLink(url,label){const u=txURL(url);return u?'<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(label||url)+'</a>':'No source URL recorded'}
function ddHistory(e){
 return '<details class="dd-history"><summary>'+esc(e.at)+' · '+esc(DD_STATUS[e.status])+'</summary><p>'+esc(DD_FINDING[e.finding])+' · '+esc(DD_ROLE[e.role])+'<br>Due: '+esc(e.due||'Not set')+' · Reviewed: '+esc(e.review||'Not recorded')+'</p><p class="dd-note">'+esc(e.note||'No note')+'</p><p>'+ddLink(e.url,e.reference||'Source document')+'</p>'+(e.source?'<details><summary>Evidence snapshot at this review</summary><p>'+esc(e.source.f)+' · '+esc(e.source.type)+' · '+esc(e.source.conf)+'<br>Checked: '+esc(e.source.chk||'Not dated')+'</p><p class="dd-note">'+esc(e.source.v)+'<br>'+esc(e.source.n)+'</p></details>':'<p class="small muted">Separate document reference; external page changes are not monitored.</p>')+'</details>';
}
function ddEditor(row,evidence){
 const e=row.event,sel=e.source?evidence.findIndex(v=>ddKey(v)===ddKey(e.source)):-1;
 const opts=(obj,v)=>Object.entries(obj).map(([k,l])=>'<option value="'+k+'" '+(v===k?'selected':'')+'>'+esc(l)+'</option>').join('');
 return '<section class="dd-editor" aria-label="Selected investigation task"><h2>'+esc(row.title)+'</h2><p>'+esc(row.need)+'</p>'+(row.changed?'<p class="note warn">Linked evidence changed or was removed from the workspace. Recheck the source; the previous snapshot is preserved below.</p>':'')+
 '<form id="dd-form"><div class="dd-fields"><label>Status<select id="dd-status">'+opts(DD_STATUS,e.status)+'</select></label><label>Responsible role<select id="dd-role">'+opts(DD_ROLE,e.role)+'</select></label><label>Due date<input id="dd-due" type="date" value="'+esc(e.due)+'"></label><label>Review date<input id="dd-review" type="date" max="'+reviewToday()+'" value="'+esc(e.review)+'"></label></div><label>Finding<select id="dd-finding">'+opts(DD_FINDING,e.finding)+'</select></label>'+
 '<label>Link workspace evidence<select id="dd-source"><option value="-1">Separate source / no registry link</option>'+evidence.map((v,i)=>'<option value="'+i+'" '+(i===sel?'selected':'')+'>'+esc(v.f+' · '+v.type+' · '+(v.chk||'Undated'))+'</option>').join('')+'</select></label>'+
 '<label>Source URL<input id="dd-url" type="url" maxlength="2000" value="'+esc(e.url)+'" placeholder="https://…"></label><label>Document and page / reference<input id="dd-reference" maxlength="300" value="'+esc(e.reference)+'"></label><label>Review note<textarea id="dd-note" rows="4" maxlength="2000">'+esc(e.note)+'</textarea></label>'+
 '<p class="small muted">Record the question, evidence and limitations. Do not enter owners’ names, contacts, IC numbers, access tokens or private document contents. Documents are linked, not uploaded or fetched.</p><p id="dd-error" class="dd-error" role="alert"></p><button class="btn" type="submit">Save review entry</button></form>'+
 '<h3>Review history ('+row.history.length+')</h3><p class="small muted">New saves append entries. Workspace imports or sync can replace this history; it is not an authenticated or tamper-proof audit trail.</p>'+(row.history.length?row.history.slice().reverse().map(ddHistory).join(''):'<p>No review entries yet. Legacy checklist ticks do not count as reviews.</p>')+'</section>';
}
function viewDiligence(id){
 DDUI.site=Object.hasOwn(SITE,id)?id:DDUI.site;const sid=DDUI.site,rows=ddRows(sid),ev=ddEvidence(sid);
 const visible=rows.filter(r=>DDUI.filter==='all'||DDUI.filter==='open'&&r.unreviewed||DDUI.filter==='overdue'&&r.overdue||DDUI.filter==='waiting'&&r.event.status==='waiting'||DDUI.filter==='recheck'&&r.changed);
 if(!visible.some(r=>r.id===DDUI.task))DDUI.task=visible[0]?.id||'';
 const selected=visible.find(r=>r.id===DDUI.task),gates=ddGates(sid);
 return '<div class="page dd-page">'+head('Due-diligence workspace','Track investigation work and its sources. A recorded review is an analyst assertion, never a planning approval or consent certificate.',siteSelect(sid,SITES,'dd-site'))+
 '<p><a href="#/site/'+sid+'">Site dossier</a> · <a href="#/sources">Evidence register</a> · <a href="#/triggers">Underlying triggers</a></p>'+
 (DDNOTICE?'<p class="note warn" role="status">'+DDNOTICE+' invalid task record(s) were excluded from loaded history. Check the original workspace export before recording further reviews.</p>':'')+
 '<p class="note">This workspace cannot change scenario inputs, evidence, trigger results or Assembly records. The existing checklist remains separate.</p>'+
 '<div class="metrics">'+[['Tasks',rows.length],['Awaiting review / recheck',rows.filter(r=>r.unreviewed).length],['Overdue',rows.filter(r=>r.overdue).length],['Linked evidence changed',rows.filter(r=>r.changed).length]].map(([l,v])=>'<div class="metric"><span class="v">'+v+'</span><span class="k">'+l+'</span></div>').join('')+'</div>'+
 '<details class="dd-gates" open><summary>Underlying conditions remain visible</summary><p class="small">Trigger results below use current scenario inputs and recorded evidence. A “Met” model threshold is not an approval. Parcel-specific planning, legal and funding documents still require professional review.</p>'+(gates.length?'<ul>'+gates.map(g=>'<li><b>'+esc(g.label)+'</b> · '+({await:'Awaiting data',no:'Not met',met:'Met'}[g.state])+'<br><span class="small">'+esc(g.basis)+' · '+esc(g.need)+'</span></li>').join('')+'</ul>':'<p>No configured triggers for this site. Absence of a trigger is not clearance.</p>')+(!SITE[sid].rlv?'<p>Development and owner models remain missing.</p>':'')+'</details>'+
 '<div class="dd-layout"><aside aria-label="Investigation queue"><label>Show tasks<select id="dd-filter">'+[['all','All tasks'],['open','Awaiting review / recheck'],['overdue','Overdue'],['waiting','Waiting for evidence'],['recheck','Evidence changed']].map(([k,l])=>'<option value="'+k+'" '+(DDUI.filter===k?'selected':'')+'>'+l+'</option>').join('')+'</select></label><p class="small muted">'+visible.length+' of '+rows.length+' tasks · Dates use UTC ('+reviewToday()+').</p><ul class="dd-queue">'+visible.map(r=>'<li><button class="btn ghost" type="button" data-dd-task="'+r.id+'" aria-pressed="'+(r.id===DDUI.task)+'">'+esc(r.title)+'</button><p class="small">'+esc(DD_STATUS[r.event.status])+' · '+esc(DD_ROLE[r.event.role])+'<br>Due: '+esc(r.event.due||'Not set')+(r.overdue?' · <b>Overdue</b>':'')+(r.changed?' · <b>Recheck source</b>':'')+'</p></li>').join('')+'</ul><button class="btn ghost" type="button" id="dd-export">Export this site’s reviews</button></aside>'+
 (selected?ddEditor(selected,ev):'<p>No tasks match this filter.</p>')+'</div></div>';
}
function bindDiligence(root){
 root.querySelector('#dd-site').onchange=e=>{DDUI.task='boundary';DDUI.filter='all';go('#/diligence/'+e.target.value)};
 root.querySelector('#dd-filter').onchange=e=>{DDUI.filter=e.target.value;render()};
 root.querySelectorAll('[data-dd-task]').forEach(b=>b.onclick=()=>{DDUI.task=b.dataset.ddTask;render();document.getElementById('dd-status')?.focus()});
 root.querySelector('#dd-export').onclick=()=>saveText('diligence-'+DDUI.site+'.json',JSON.stringify({v:1,asOf:reviewToday(),site:DDUI.site,basis:'Analyst workflow only; not approval or consent',workspace:{diligence:{[DDUI.site]:DD[DDUI.site]||{}}},tasks:ddRows(DDUI.site),conditions:ddGates(DDUI.site)},null,2),'application/json');
 const form=root.querySelector('#dd-form');if(!form)return;const evidence=ddEvidence(DDUI.site);
 root.querySelector('#dd-source').onchange=e=>{const src=evidence[Number(e.target.value)];if(src){root.querySelector('#dd-url').value=src.url;root.querySelector('#dd-reference').value=src.f.slice(0,300)}};
 form.onsubmit=e=>{
  e.preventDefault();const event=ddEmpty();
  for(const k of Object.keys(event))if(k!=='source')event[k]=root.querySelector('#dd-'+k).value.trim();
  const src=evidence[Number(root.querySelector('#dd-source').value)];
  event.source=src&&txURL(src.url)===txURL(event.url)?ddSnapshot(src):null;
  try{ddSave(DDUI.site,DDUI.task,event);render();toast('Review entry saved')}catch(err){root.querySelector('#dd-error').textContent=err.message}
 };
}

