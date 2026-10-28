/* ---------- scenario lab ---------- */
function ctrlDefs(s,x){
  const d=[
   {g:'Market and planning'},
   {k:'asp',l:'End-product ASP (psf)',min:300,max:2200,step:5,f:fmtRM,src:'UNDERWRITING_ASSUMPTION'},
   {k:'pr',l:'Base plot ratio',min:1,max:8,step:.05,f:v=>fmt2(v)+'×',src:s.prType},
   {k:'prUp',l:'PR uplift, not an entitlement',min:0,max:1.5,step:.01,f:v=>fmtPct(v,0),src:'UNDERWRITING_ASSUMPTION',note:'DBKL 2026 cap: +70%'},
   {k:'area',l:'Site area (acres)',min:.25,max:5,step:.01,f:v=>fmt2(v)+' ac',src:x.areaConfirmed?'OFFICIAL_CADASTRAL':(s.area?s.area.type:'UNDERWRITING_ASSUMPTION')},
   {g:'Development'},
   {k:'hc',l:'Hard cost (psf GFA)',min:120,max:800,step:1,f:fmtRM,src:'UNDERWRITING_ASSUMPTION'},
   {k:'eff',l:'Saleable efficiency',min:.6,max:.9,step:.005,f:v=>fmtPct(v),src:'UNDERWRITING_ASSUMPTION'},
   {k:'profit',l:'Developer profit (of GDV)',min:.08,max:.3,step:.005,f:v=>fmtPct(v),src:'UNDERWRITING_ASSUMPTION'},
   {k:'fin',l:'Finance (of GDV)',min:0,max:.12,step:.005,f:v=>fmtPct(v),src:'UNDERWRITING_ASSUMPTION'},
   {k:'demo',l:'Demolition and relocation (of GDV)',min:0,max:.1,step:.005,f:v=>fmtPct(v),src:'UNDERWRITING_ASSUMPTION'}
  ];
  if(x.owner){
    const ph=x.owner.placeholder;
    const landed=x.owner.mode==='landed';
    if(!landed&&!x.owner.form) x.owner.form={on:false,bays:20,levels:2};
    if(landed){
      const os=s.ownerSrc||{};
      d.push({g:'Owners: landed lots'},
       {k:'owner.lot',l:'Average lot size (sf)',min:1000,max:8000,step:50,f:v=>fmt0(v)+' sf',src:os.lot||'UNDERWRITING_ASSUMPTION'},
       {k:'owner.lpsf',l:'Lot value (psf of land)',min:50,max:800,step:5,f:fmtRM,src:x.owner.nConfirmed?'TRANSACTION':(os.lpsf||'UNDERWRITING_ASSUMPTION')},
       {k:'owner.net',l:'Share of site in private lots',min:.4,max:.95,step:.01,f:v=>fmtPct(v,0),src:'UNDERWRITING_ASSUMPTION'},
       {k:'owner.n',l:'Ownership interests (lots)',min:1,max:160,step:1,f:fmt0,src:'MODEL_OUTPUT',locked:true},
       {k:'owner.up',l:'Required owner uplift',min:0,max:1,step:.01,f:v=>fmtPct(v,0),src:'UNDERWRITING_ASSUMPTION'},
       {k:'owner.hold',l:'Holdout reserve (unanimous consent)',min:0,max:.5,step:.01,f:v=>fmtPct(v,0),src:'UNDERWRITING_ASSUMPTION'});
      return d;
    }
    d.push({g:'Owners'},{custom:'form'},
     {k:'owner.n',l:'Ownership interests',min:5,max:160,step:1,f:fmt0,src:x.owner.nConfirmed?'OFFICIAL_STRATA':'INFERRED'},
     {k:'owner.cs',l:'Commercial share of interests',min:0,max:1,step:.01,f:v=>fmtPct(v,0),src:'UNDERWRITING_ASSUMPTION'},
     {k:'owner.res',l:'Residential interest value',min:100000,max:2000000,step:5000,f:fmtK,src:ph?'UNDERWRITING_ASSUMPTION':'TRANSACTION'},
     {k:'owner.com',l:'Commercial interest value',min:0,max:4000000,step:10000,f:fmtK,src:ph?'UNDERWRITING_ASSUMPTION':'MODEL_OUTPUT'},
     {k:'owner.up',l:'Required owner uplift',min:0,max:1,step:.01,f:v=>fmtPct(v,0),src:'UNDERWRITING_ASSUMPTION'},
     {k:'owner.hold',l:'Holdout reserve (unanimous consent)',min:0,max:.5,step:.01,f:v=>fmtPct(v,0),src:'UNDERWRITING_ASSUMPTION'});
  }
  return d;
}
const getK=(x,k)=>k.startsWith('owner.')?x.owner[k.slice(6)]:x[k];
function setK(x,k,v){if(k.startsWith('owner.'))x.owner[k.slice(6)]=v;else x[k]=v}
function ctrlHTML(c,s,x){
  if(c.g) return `<p class="ctrl-group">${c.g}</p>`;
  if(c.custom==='form'){const f=x.owner.form;return `<label class="tog" style="margin-top:4px"><input type="checkbox" id="formOn" ${f.on?'checked':''}>Set count and mix from building form</label>
   ${f.on?`<div class="ctrl"><div class="ctrl-top"><label for="f_bays">Frontage bays</label><output id="f_bays_o">${f.bays}</output></div><input type="range" id="f_bays" data-fk="bays" min="4" max="60" step="1" value="${f.bays}"><div class="hint"><span>Ground floor is commercial</span>${badge('INFERRED')}</div></div>
   <div class="ctrl"><div class="ctrl-top"><label for="f_levels">Levels per bay</label><output id="f_levels_o">${f.levels}</output></div><input type="range" id="f_levels" data-fk="levels" min="1" max="8" step="1" value="${f.levels}"><div class="hint"><span>Commercial share = 1 ÷ levels</span>${badge('INFERRED')}</div></div>`:'<p class="small muted" style="margin:0 0 4px">Keeps the interest count and commercial share consistent: bays × levels interests, one commercial per bay.</p>'}`}
  const v=getK(x,c.k), base=presetState(s,x.sc)||{}, bv=getK({...base,owner:base.owner||x.owner},c.k);
  const edited=Math.abs(v-bv)>1e-9;
  const id='c_'+c.k.replace('.','_');
  const locked=c.locked||(x.owner&&x.owner.form&&x.owner.form.on&&(c.k==='owner.n'||c.k==='owner.cs'));
  return `<div class="ctrl"><div class="ctrl-top"><label for="${id}">${c.l}${locked?` <span class="small muted">(${c.locked?'derived':'from form'})</span>`:''}</label><output id="${id}_o" for="${id}">${c.f(v)}</output></div>
   <input type="range" id="${id}" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${v}" ${locked?'disabled':''}>
   <div class="hint"><span>${c.note?c.note:`${c.f(c.min)} to ${c.f(c.max)}`}</span><span id="${id}_b">${edited?badge('EDITED','Changed from '+c.f(bv)):badge(c.src)}</span></div></div>`;
}
let LAB = store.get('lab',{site:'taiping'});
function labOutputs(s,x){
  const m=model(x), sug=suggestVerdict(s,x,m), os=ownerStatus(m,x);
  const stack=m.stack.map(([l,v])=>`<tr><td>${l}</td><td class="num ${sgnCls(v)}">${fmtM(v)}</td><td class="num muted">${fmtPct(Math.abs(v)/m.gdv)}</td></tr>`).join('');
  const met=TRIGGERS.filter(t=>t.site===s.id);
  return `${cfLabSummary(s.id,x)}<div class="metrics">
    <div class="metric"><span class="v">${fmtM(m.gdv,1)}</span><span class="k">GDV</span></div>
    <div class="metric"><span class="v ${sgnCls(m.rlv)}">${fmtM(m.rlv,1)}</span><span class="k">RLV at ${fmt2(x.area)} ac</span></div>
    <div class="metric"><span class="v ${sgnCls(m.rlv)}">${fmtM(m.rlvAc)}</span><span class="k">RLV per acre</span></div>
    <div class="metric"><span class="v ${sgnCls(m.rlv)}">${fmtRM(m.psf)}</span><span class="k">RLV per land sf</span></div>
    <div class="metric"><span class="v">${fmtRM(m.be)}</span><span class="k">Breakeven ASP</span></div>
    ${m.own?`
    <div class="metric"><span class="v">${fmt1(m.own.maxN)}</span><span class="k">Max supported interests</span></div>
    <div class="metric"><span class="v">${fmtRM(m.own.reqASP)}</span><span class="k">Required ASP for ${m.own.n}</span></div>
    <div class="metric"><span class="v">${isFinite(m.own.reqPR)?fmt2(m.own.reqPR)+'×':'<span class="neg">None</span>'}</span><span class="k">Required PR for ${m.own.n}${isFinite(m.own.reqPR)?'':' (each extra unit of PR loses money)'}</span></div>
    <div class="metric"><span class="v ${sgnCls(m.own.premium)}">${m.rlv>0?fmtSPct(m.own.premium):'−100%'}</span><span class="k">Owner premium</span></div>
    <div class="metric"><span class="v">${isFinite(m.own.reqArea)?fmt2(m.own.reqArea)+' ac':'<span class="neg">None</span>'}</span><span class="k">Land needed</span></div>
    ${m.own.payLpsf!==null?`<div class="metric"><span class="v ${m.own.payLpsf<x.owner.lpsf?'neg':'pos'}">${m.own.payLpsf>0?fmtRM(m.own.payLpsf):'RM0'}</span><span class="k">Payable lot value psf (vs ${fmtRM(x.owner.lpsf)})</span></div>`:''}`:''}
   </div>
   <p class="small muted" style="margin:6px 0 0">Every figure above is a model output ${badge('MODEL_OUTPUT')} and inherits the confidence of its weakest input.</p>
   <div class="sec" style="margin-top:22px">
    <div class="sec-head"><h2>Decision</h2>${sug?verdictTag(sug[0]):''}</div>
    ${sug?`<p>${esc(sug[1])}</p>`:''}
    ${m.own?interestGrid(x,m):`<p class="note info">No owner model for this site. <button type="button" class="btn ghost" id="startOwner">Start owner model with placeholder values</button></p>`}
    ${m.own&&x.owner.placeholder?'<p class="note">These owner inputs are placeholders, not evidence. Replace them before reading anything into the result.</p>':''}
    ${met.length?triggerTable(met,true):''}
   </div>
   <div class="sec"><div class="sec-head"><h2>Sensitivity</h2><span class="muted">Updates as you move the controls</span></div>${chartsHTML(x,m)}</div>
   <div class="sec"><div class="sec-head"><h2>Cost stack</h2><span class="muted">RLV = GDV less every line below</span></div>
    <div class="tw"><table class="cost"><thead><tr><th>Line</th><th class="num">RM</th><th class="num">% of GDV</th></tr></thead><tbody>${stack}<tr class="tot"><td>Residual land value</td><td class="num ${sgnCls(m.rlv)}">${fmtM(m.rlv)}</td><td class="num">${fmtPct(m.rlv/m.gdv)}</td></tr></tbody></table></div>
   </div>`;
}
function savedList(){
  const sv=store.get('saved',[]);
  if(!sv.length) return '<p class="small muted">No saved scenarios yet. Saved scenarios stay in this browser only.</p>';
  return `<ul class="check">${sv.map((v,i)=>`<li><span></span><span><b>${esc(v.name)}</b><br><span class="small muted">${esc(SITE[v.site].name)}, ${esc(v.date)}: RLV ${fmtM(v.rlv,1)}${v.maxN!==null?`, pays ${fmt1(v.maxN)} of ${v.n}`:''}</span></span><span><button type="button" class="btn ghost" data-load="${i}">Load</button> <button type="button" class="btn ghost" data-del="${i}" aria-label="Delete ${esc(v.name)}">Delete</button></span></li>`).join('')}</ul>`;
}
function viewLab(id){
  const sid=MODELLED.includes(id)?id:(MODELLED.includes(LAB.site)?LAB.site:'taiping');
  LAB.site=sid;store.set('lab',LAB);
  const s=SITE[sid], x=st(sid);
  const ctrls=ctrlDefs(s,x).map(c=>ctrlHTML(c,s,x)).join('');
  const modelledSites=MODELLED.map(i=>SITE[i]);
  return `<div class="page">
   ${head('Scenario lab',`Stress the residual and the owner test together. Edits persist in this browser and flow through to the watchlist, map and triggers.`,siteSelect(sid,modelledSites,'labSel'))}
   <div class="lab-grid">
    <aside class="ctrls" aria-label="Scenario controls">
     <div class="seg" role="group" aria-label="Preset">${['down','base','up'].concat(INC_DEFAULT[sid]?['g26']:[]).map(k=>`<button type="button" data-preset="${k}" aria-pressed="${x.sc===k}">${PRESET[k].l}</button>`).join('')}</div>
     <p class="small muted" style="margin:6px 0 0">A preset resets every control to the workbook values${s.owner?' and restores the recorded owner model':''}.${INC_DEFAULT[sid]?' DBKL 2026 is the base case plus the incentive set for this site under DBKL incentives.':''}</p>
     ${ctrls}
     <p class="ctrl-group">Evidence status</p>
     ${x.owner?`<label class="tog"><input type="checkbox" id="nConf" ${x.owner.nConfirmed?'checked':''}>Interest count confirmed from the strata roll</label>`:''}
     <label class="tog"><input type="checkbox" id="aConf" ${x.areaConfirmed?'checked':''}>Site area confirmed from DBKL data</label>
     <p class="small muted">Tick these only when the official document is in hand. They change verdict logic and trigger status, not the numbers.</p>
     <p class="ctrl-group">Fixed allowances</p>
     <p class="small muted">Professional fees ${fmtPct(x.pf,0)} and contingency ${fmtPct(x.cont,0)} of hard cost; statutory ${fmtPct(x.stat,0)} and sales ${fmtPct(x.sm,0)} of GDV. Development charge on incentive floor area: ${fmtPct(dcRate(x),0)} of the value it adds (set under <a href="#/board">Distance to deal</a>).</p>
     ${x.owner?`<p style="margin-top:14px"><a class="btn ghost" style="text-decoration:none;display:inline-block" href="#/deal/${sid}">Compare deal structures</a></p>`:''}
     <p class="ctrl-group">Saved scenarios</p>
     <div style="display:flex;gap:8px;margin:6px 0 10px"><button type="button" class="btn" id="saveSc">Save this scenario</button></div>
     <div id="savedBox">${savedList()}</div>
    </aside>
    <div id="labOut" aria-live="polite">${labOutputs(s,x)}</div>
   </div>
  </div>`;
}
function bindLab(root){
  const sid=LAB.site, s=SITE[sid];
  const sel=root.querySelector('#labSel'); if(sel) sel.onchange=()=>go('#/lab/'+sel.value);
  const out=root.querySelector('#labOut');
  const refresh=()=>{const x=st(sid);out.innerHTML=labOutputs(s,x);bindLabOut()};
  const bindLabOut=()=>{const b=out.querySelector('#startOwner');if(b)b.onclick=()=>{st(sid).owner={...GENERIC_OWNER};saveState();render()}};
  bindLabOut();
  let raf=0;
  root.querySelectorAll('input[type="range"]').forEach(inp=>{
    inp.oninput=()=>{
      const x=st(sid), k=inp.dataset.k, v=parseFloat(inp.value);
      setK(x,k,v); applyOwnerDerived(x);
      const nIn=root.querySelector('#c_owner_n'); if(nIn&&k!=='owner.n'){nIn.value=x.owner.n;const no=root.querySelector('#c_owner_n_o');if(no)no.textContent=fmt0(x.owner.n)}
      const c=ctrlDefs(s,x).find(c=>c.k===k), base=presetState(s,x.sc)||{}, bv=getK({...base,owner:base.owner||x.owner},k);
      const id='c_'+k.replace('.','_');
      root.querySelector('#'+id+'_o').textContent=c.f(v);
      root.querySelector('#'+id+'_b').innerHTML=Math.abs(v-bv)>1e-9?badge('EDITED','Changed from '+c.f(bv)):badge(c.src);
      cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{refresh();saveState()});
    };
  });
  const fo=root.querySelector('#formOn'); if(fo) fo.onchange=()=>{const x=st(sid);x.owner.form.on=fo.checked;applyForm(x);saveState();render()};
  root.querySelectorAll('[data-fk]').forEach(inp=>inp.oninput=()=>{
    const x=st(sid);x.owner.form[inp.dataset.fk]=parseInt(inp.value,10);applyForm(x);
    root.querySelector('#f_'+inp.dataset.fk+'_o').textContent=inp.value;
    const nIn=root.querySelector('#c_owner_n'),cIn=root.querySelector('#c_owner_cs');
    if(nIn){nIn.value=x.owner.n;root.querySelector('#c_owner_n_o').textContent=fmt0(x.owner.n)}
    if(cIn){cIn.value=x.owner.cs;root.querySelector('#c_owner_cs_o').textContent=fmtPct(x.owner.cs,0)}
    cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{refresh();saveState()});
  });
  root.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{STATE[sid]=presetState(s,b.dataset.preset);saveState();render();toast(PRESET[b.dataset.preset].l+' preset applied')});
  const nc=root.querySelector('#nConf'); if(nc) nc.onchange=()=>{st(sid).owner.nConfirmed=nc.checked;saveState();render()};
  const ac=root.querySelector('#aConf'); if(ac) ac.onchange=()=>{st(sid).areaConfirmed=ac.checked;saveState();render()};
  const bindSaved=()=>{
    root.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{const v=store.get('saved',[])[+b.dataset.load];STATE[v.site]=JSON.parse(JSON.stringify(v.state));saveState();go('#/lab/'+v.site);render();toast('Scenario loaded')});
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const sv=store.get('saved',[]);sv.splice(+b.dataset.del,1);store.set('saved',sv);root.querySelector('#savedBox').innerHTML=savedList();bindSaved()});
  };
  bindSaved();
  root.querySelector('#saveSc').onclick=()=>{
    const x=st(sid), m=model(x), sv=store.get('saved',[]);
    const name=`${s.name.replace(/^(Flat|Apartmen|Perumahan) /,'')}: ${fmtRM(x.asp)}, PR ${fmt2(x.pr*(1+x.prUp))}${x.owner?`, ${x.owner.n} interests`:''}`;
    sv.unshift({name,site:sid,date:new Date().toLocaleString('en-MY',{dateStyle:'medium',timeStyle:'short'}),state:JSON.parse(JSON.stringify(x)),rlv:m.rlv,maxN:m.own?m.own.maxN:null,n:x.owner?x.owner.n:null});
    store.set('saved',sv.slice(0,30));root.querySelector('#savedBox').innerHTML=savedList();bindSaved();toast('Scenario saved');
  };
}

