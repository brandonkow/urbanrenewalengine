/* ---------- data: export and import ---------- */
function siteResults(){
  return SITES.map(s=>{
    const x=s.rlv?st(s.id):null, m=x?model(x):null, L=levers(s), sug=x?suggestVerdict(s,x,m):null;
    return {id:s.id,name:s.name,place:s.place,ref:s.ref,group:s.group,zone:s.zone||null,basePR:s.pr,basePRSource:s.prType,
      stage:s.stage,recordedVerdict:s.verdict,modelVerdict:sug?sug[0]:null,confidence:s.conf,v1:s.v1?s.v1.score:null,v2:v2Score(s),
      scenario:x?{preset:x.sc,asp:x.asp,hardCost:x.hc,areaAcres:x.area,basePR:x.pr,prUplift:x.prUp,effectivePR:m.epr,efficiency:x.eff,profit:x.profit,devCharge:dcRate(x)}:null,
      gdv:m?m.gdv:null,rlv:m?m.rlv:null,rlvPerAcre:m?m.rlvAc:null,rlvPerLandSf:m?m.psf:null,breakevenASP:m?m.be:null,
      owners:m&&m.own?{mode:x.owner.mode||'strata',interests:m.own.n,countConfirmed:!!x.owner.nConfirmed,packagePerInterest:m.own.per,budget:m.own.reqTotal,coverage:m.own.coverage,maxInterests:m.own.maxN,requiredASP:m.own.reqASP,requiredPR:isFinite(m.own.reqPR)?m.own.reqPR:null,premium:m.own.premium,payableLotPsf:m.own.payLpsf}:null,
      nearestLever:L&&L.nearest?{lever:L.nearest.l,move:L.nearest.v,clears:L.clears,text:leverText(L)}:null,
      dbkl2026:(()=>{const g=s.rlv&&INC_DEFAULT[s.id]?g26Row(s.id,true):null;if(!g)return null;return {tier:g.b.p.redev,asSet:incEdited(s.id),components:{redevelopment:g.b.p.redev,residing:g.b.res,openSpace:g.b.open,transitZone:g.b.tpz,eligibility:g.b.p.elig},share:g.b.share,effectivePR:g.b.pr,coverage:g.mb.own?g.mb.own.coverage:null,rlv:g.mb.rlv,rlvPerAcre:g.mb.rlvAc,maxShare:g.mx.share,maxPR:g.mx.pr,maxCoverage:g.mc.own?g.mc.own.coverage:null,maxRlvPerAcre:g.mc.rlvAc,catA:g.A?{tier:g.A.best.k,personsPerAcre:g.A.best.ose,prEquivalent:g.A.best.epr,rlv:g.A.best.rlv,coverage:g.A.best.cov}:null}})()};
  });
}
function exportObj(){
  return {engine:'KL Urban Renewal Engine',build:5,exportedAt:new Date().toISOString(),
    note:'Screening model only; not a valuation or investment advice.',
    workspace:JSON.parse(JSON.stringify(workspaceBody())),results:siteResults(),
    sites:SITES.map(s=>{const o=JSON.parse(JSON.stringify(s));delete o.v1;return o}),evidence:EVIDENCE,issues:ISSUES};
}
function resultsCSV(){
  const cols=['id','name','place','ref','zone','basePR','stage','recordedVerdict','modelVerdict','confidence','v1','v2','asp','hardCost','areaAcres','effectivePR','gdv','rlv','rlvPerAcre','rlvPerLandSf','breakevenASP','ownerMode','interests','coverage','maxInterests','requiredASP','requiredPR','premium','payableLotPsf','nearestLever','g26Share','g26PR','g26Coverage','g26MaxShare','g26MaxCoverage','catATier','catACoverage'];
  const q=v=>v===null||v===undefined?'':typeof v==='number'?(isFinite(v)?String(+v.toFixed(4)):''):`"${String(v).replace(/"/g,'""')}"`;
  const lines=siteResults().map(r=>{const sc=r.scenario||{},ow=r.owners||{};
    const f={...r,asp:sc.asp,hardCost:sc.hardCost,areaAcres:sc.areaAcres,effectivePR:sc.effectivePR,ownerMode:ow.mode,interests:ow.interests,coverage:ow.coverage,maxInterests:ow.maxInterests,requiredASP:ow.requiredASP,requiredPR:ow.requiredPR,premium:ow.premium,payableLotPsf:ow.payableLotPsf,nearestLever:r.nearestLever?r.nearestLever.text:null,
      g26Share:r.dbkl2026?r.dbkl2026.share:null,g26PR:r.dbkl2026?r.dbkl2026.effectivePR:null,g26Coverage:r.dbkl2026?r.dbkl2026.coverage:null,g26MaxShare:r.dbkl2026?r.dbkl2026.maxShare:null,g26MaxCoverage:r.dbkl2026?r.dbkl2026.maxCoverage:null,catATier:r.dbkl2026&&r.dbkl2026.catA?r.dbkl2026.catA.tier:null,catACoverage:r.dbkl2026&&r.dbkl2026.catA?r.dbkl2026.catA.coverage:null};
    return cols.map(c=>q(f[c])).join(',')});
  return [cols.join(','),...lines].join('\n');
}
async function saveText(name,text,mime){
  let D=null;
  try{if(window.claude&&typeof window.claude.use==='function') D=await window.claude.use('downloads')}catch(e){D=null}
  if(D){
    try{await D.save({filename:name,data:text});toast('Saved '+name);return}
    catch(e){if(e&&e.code==='declined'){toast('Download cancelled');return} if(e&&e.code==='rate_limited'){toast('A save prompt is already open');return}}
  }
  try{const url=URL.createObjectURL(new Blob([text],{type:mime}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast('Downloaded '+name)}
  catch(e){toast('Download unavailable here; use Show JSON instead')}
}
function importWorkspace(text){
  let j; try{j=JSON.parse(text)}catch(e){toast('That is not valid JSON');return false}
  const b=j&&typeof j==='object'?(j.workspace||j):null;
  const keys=['state','saved','checks','v2w','deal','asm','cal','glob','inc','mc','massing','transactions','cashflow','diligence'];
  if(!b||typeof b!=='object'||!keys.some(k=>b[k]&&typeof b[k]==='object')){toast('No workspace data found in that file');return false}
  if(b.state&&typeof b.state==='object'){
    const clean={};
    for(const id in b.state){
      const s=SITE[id], v=b.state[id];
      if(!s||!s.rlv||!v||typeof v!=='object') continue;
      const base=presetState(s,'base');
      const merged={...base,...v};
      merged.owner=v.owner&&typeof v.owner==='object'?{...(base.owner||{}),...v.owner}:base.owner;
      for(const kk of ['area','asp','pr','prUp','eff','hc','pf','cont','stat','sm','fin','demo','profit']) if(!isFinite(merged[kk])) merged[kk]=base[kk];
      applyOwnerDerived(merged); clean[id]=merged;
    }
    b.state=clean;
  }
  b.updatedAt=new Date().toISOString();
  applyRemote(b); schedulePush(); toast('Workspace imported'); return true;
}
function dataSection(){
  return `<div class="sec"><div class="sec-head"><h2>Data: export and import</h2><span class="muted">Move the workspace to another device, tool or person</span></div>
   <div class="cols">
    <div>
     <p class="small">The workspace file holds every edited scenario, deal assumption, assembly record, checklist tick, score weight, calibration, global setting, cash-flow assumptions and due-diligence history, plus the site data, evidence register and each site’s current results.</p>
     <p style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn" id="expJson">Download workspace (.json)</button><button type="button" class="btn ghost" id="expCsv">Download site results (.csv)</button><button type="button" class="btn ghost" id="expShow">Show JSON to copy</button></p>
     <label class="small muted" for="expText" id="expLab" hidden>Exported JSON</label>
     <textarea id="expText" readonly hidden rows="10" style="width:100%;border:1px solid var(--rule);background:var(--panel);border-radius:4px;padding:8px;font:12px/1.4 var(--f)"></textarea>
    </div>
    <div>
     <label class="small muted" for="impFile" style="display:block">Import a workspace file</label>
     <input type="file" id="impFile" accept=".json,application/json" style="margin:4px 0 12px">
     <label class="small muted" for="impText" style="display:block">Or paste exported JSON</label>
     <textarea id="impText" rows="5" style="width:100%;border:1px solid var(--rule);background:var(--panel);border-radius:4px;padding:8px;font:12px/1.4 var(--f)"></textarea>
     <p style="margin-top:8px"><button type="button" class="btn ghost" id="impBtn">Import and replace workspace</button></p>
     <p class="small muted">Importing replaces your current workspace${SYNC.mode==='synced'?' in your account too':''}. Download a copy first if you might want it back.</p>
    </div>
   </div>
  </div>`;
}
function bindData(root){
  const stamp=new Date().toISOString().slice(0,10);
  root.querySelector('#expJson').onclick=()=>saveText(`kl-urban-renewal-workspace-${stamp}.json`,JSON.stringify(exportObj(),null,2),'application/json');
  root.querySelector('#expCsv').onclick=()=>saveText(`kl-urban-renewal-sites-${stamp}.csv`,resultsCSV(),'text/csv');
  root.querySelector('#expShow').onclick=()=>{const t=root.querySelector('#expText');t.value=JSON.stringify(exportObj(),null,2);t.hidden=false;root.querySelector('#expLab').hidden=false;t.focus();t.select()};
  const f=root.querySelector('#impFile'), ta=root.querySelector('#impText');
  f.onchange=()=>{const file=f.files&&f.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{ta.value=String(rd.result||'');toast('File loaded; press Import to apply')};rd.readAsText(file)};
  armConfirm(root.querySelector('#impBtn'),()=>{if(!ta.value.trim()){toast('Choose a file or paste JSON first');return}importWorkspace(ta.value)});
}
function viewMethod(){const html=viewMethodCore();const i=html.lastIndexOf('</div>');return html.slice(0,i)+dataSection()+html.slice(i)}
function bindMethod(root){bindMethodCore(root);bindData(root)}

