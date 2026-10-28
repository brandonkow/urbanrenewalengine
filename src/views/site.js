/* ---------- site dossier ---------- */
function siteSelect(cur,list,id){
  const opts=list.map(s=>`<option value="${s.id}" ${s.id===cur?'selected':''}>${esc(s.name)}</option>`).join('');
  return `<label class="small muted" for="${id}" style="display:block">Site</label><select class="sel" id="${id}">${opts}</select>`;
}
function scenarioTable(s){
  const rows=['down','base','up'].map(k=>{const x={...presetState(s,k),area:1,owner:null};return [PRESET[k].l,x,calcRLV(x)]});
  const r=(l,f)=>`<tr><td>${l}</td>${rows.map(([,x,m])=>`<td class="num">${f(x,m)}</td>`).join('')}</tr>`;
  return `<div class="tw"><table class="cost"><thead><tr><th>Per acre (normalised)</th>${rows.map(r=>`<th class="num">${r[0]}</th>`).join('')}</tr></thead><tbody>
   ${r('Effective PR',(x,m)=>fmt2(m.epr)+'×')}
   ${r('GFA',(x,m)=>fmt0(m.gfa)+' sf')}
   ${r('Saleable efficiency',x=>fmtPct(x.eff,0))}
   ${r('ASP',x=>fmtRM(x.asp))}
   ${r('Hard cost / GFA sf',x=>fmtRM(x.hc))}
   ${r('Developer profit',x=>fmtPct(x.profit,0))}
   ${r('GDV',(x,m)=>fmtM(m.gdv))}
   ${r('RLV / acre',(x,m)=>`<b class="${sgnCls(m.rlv)}">${fmtM(m.rlv)}</b>`)}
   ${r('RLV / land sf',(x,m)=>`<span class="${sgnCls(m.rlv)}">${fmtRM(m.psf)}</span>`)}
   ${r('Breakeven ASP',(x,m)=>fmtRM(m.be))}
  </tbody></table></div>`;
}
function heatTables(x,m){
  const o=x.owner;
  if(o.mode==='landed') return landedHeat(x,m);
  const shares=[.1,.25,.4,.6], ups=[.2,.25,.3,.35,.4];
  let t1=`<table class="heat"><thead><tr><th>Commercial share ↓ / uplift →</th>${ups.map(u=>`<th class="num">${fmtPct(u,0)}</th>`).join('')}</tr></thead><tbody>`;
  shares.forEach(cs=>{t1+=`<tr><td>${fmtPct(cs,0)}</td>`;ups.forEach(u=>{const per=ownerBudgetPer({...o,cs,up:u});const v=m.rlvAc/per;const d=o.n/x.area;const c=v>=d*1.25?'h-ok':v>=d?'h-warn':'h-bad';const cur=Math.abs(cs-o.cs)<.001&&Math.abs(u-o.up)<.001;t1+=`<td class="num ${c}${cur?' cur':''}">${fmt1(v)}</td>`});t1+='</tr>'});
  t1+='</tbody></table>';
  const areas=[.75,1,1.25,1.5,2,2.5], ns=[20,30,40,50,60,80];
  let t2=`<table class="heat"><thead><tr><th>Site acres ↓ / interests →</th>${ns.map(n=>`<th class="num">${n}</th>`).join('')}</tr></thead><tbody>`;
  areas.forEach(a=>{t2+=`<tr><td>${fmt2(a)}</td>`;ns.forEach(n=>{const rlv=m.rlvAc*a;const prem=rlv/(n*(1+(o.hold||0)))/weightedOwnerValue(o)-1;const c=prem>=o.up?'h-ok':prem>=0?'h-warn':'h-bad';t2+=`<td class="num ${c}">${fmtSPct(prem,0)}</td>`});t2+='</tr>'});
  t2+='</tbody></table>';
  return `<div class="pair">
   <div><h3>Max interests supported per acre</h3><p class="small muted">Green clears the current density (${fmt1(o.n/x.area)}/acre) by 25%; outlined cell is the current mix.</p><div class="tw">${t1}</div></div>
   <div><h3>Owner premium or discount to current value</h3><p class="small muted">Green meets the ${fmtPct(o.up,0)} uplift target; amber is positive but below it.</p><div class="tw">${t2}</div></div>
  </div>`;
}
function landedHeat(x,m){
  const o=x.owner, lps=[100,150,200,250,300,400], ups=[.2,.25,.3,.35,.4];
  let t=`<table class="heat"><thead><tr><th>Lot value psf ↓ / uplift →</th>${ups.map(u=>`<th class="num">${fmtPct(u,0)}</th>`).join('')}</tr></thead><tbody>`;
  lps.forEach(lp=>{t+=`<tr><td>${fmtRM(lp)}</td>`;ups.forEach(u=>{const need=o.n*o.lot*lp*(1+u)*(1+(o.hold||0));const cov=m.rlv/need;const c=cov>=1.25?'h-ok':cov>=1?'h-warn':'h-bad';const cur=Math.abs(lp-o.lpsf)<.5&&Math.abs(u-o.up)<.001;t+=`<td class="num ${c}${cur?' cur':''}">${fmtPct(Math.max(0,cov),0)}</td>`});t+='</tr>'});
  t+='</tbody></table>';
  return `<div class="pair"><div><h3>Owner-budget coverage by lot value</h3><p class="small muted">Share of the owner budget the residual pays for ${o.n} lots of ${fmt0(o.lot)} sf. Green clears with 25% to spare; outlined cell is the current case.</p><div class="tw">${t}</div></div><div></div></div>`;
}
function countTable(x,m){
  const o=x.owner, ns=[20,30,40,50,60,80];
  return `<div class="tw"><table class="cost"><thead><tr><th>Interests at ${fmt2(x.area)} ac</th>${ns.map(n=>`<th class="num">${n}</th>`).join('')}</tr></thead><tbody>
   <tr><td>Owner budget</td>${ns.map(n=>`<td class="num">${fmtM(n*ownerBudgetPer(o),1)}</td>`).join('')}</tr>
   <tr><td>Required ASP at PR ${fmt2(m.epr)}</td>${ns.map(n=>`<td class="num">${fmtRM(requiredASP(x,m,n,o))}</td>`).join('')}</tr>
   <tr><td>Premium at ${fmtRM(x.asp)} ASP</td>${ns.map(n=>{const p=Math.max(-1,m.rlv/(n*(1+(o.hold||0)))/weightedOwnerValue(o)-1);return `<td class="num ${sgnCls(p)}">${fmtSPct(p)}</td>`}).join('')}</tr>
   <tr><td>Required PR at ${fmtRM(x.asp)} ASP</td>${ns.map(n=>{const v=requiredPR(x,m,n,o);return `<td class="num">${isFinite(v)?fmt2(v)+'×':'none'}</td>`}).join('')}</tr>
  </tbody></table></div>`;
}
function evidenceTable(list){
  if(!list.length) return '<p class="muted">No site-specific evidence recorded yet beyond the planning listing.</p>';
  return `<div class="tw"><table><thead><tr><th>Data point</th><th>Value</th><th>Source type</th><th>Confidence</th><th>Checked</th><th>Notes</th></tr></thead><tbody>
  ${list.map(e=>`<tr><td>${e.site!=='*'&&SITE[e.site]&&list.some(z=>z.site!==e.site)?`<span class="muted small">${esc(SITE[e.site].name)}</span><br>`:''}${esc(e.f)}</td><td>${e.url?`<a href="${e.url}" target="_blank" rel="noopener">${esc(e.v)}</a>`:esc(e.v)}</td><td>${badge(e.type)}</td><td class="small">${esc(e.conf)}</td><td class="small">${esc(e.chk)}</td><td class="small">${esc(e.n)}</td></tr>`).join('')}
  </tbody></table></div>`;
}
function viewSite(id){
  const s=SITE[id]||SITE.taiping, x=s.rlv?st(s.id):null, m=x?model(x):null, sug=suggestVerdict(s,x,m), os=ownerStatus(m,x);
  const gi=s.rlv&&INC_DEFAULT[s.id]?g26Row(s.id,false):null;
  const f=v2Factors(s), v2=v2Score(s);
  const trig=TRIGGERS.filter(t=>t.site===s.id);
  const ident = s.group==='specific'
    ? `<dt>Framework</dt><dd>${esc(s.ref)} ${badge('OFFICIAL_PLANNING')}</dd><dt>Location / access</dt><dd>${esc(s.access)}</dd><dt>Mukim / lots</dt><dd class="muted">Not in the JWP exact-lot list; obtain from DBKL eMap ${badge('MISSING')}</dd>`
    : `<dt>Framework</dt><dd>${esc(s.ref)} (${esc(s.cat)}) ${badge('OFFICIAL_PLANNING','JWP 49-site list')}</dd><dt>Mukim / Seksyen</dt><dd>${esc(s.mukim)}</dd><dt>Parliament</dt><dd>${esc(s.parl)}</dd><dt>Official lots</dt><dd>${esc(s.lots)}</dd>`;
  const areaRow = s.area ? `<dt>Site area</dt><dd>${fmt2(s.area.ac)} ac (${fmt0(s.area.ac*SF_PER_ACRE)} sf) ${badge(x.areaConfirmed?'OFFICIAL_CADASTRAL':s.area.type)}<br><span class="small muted">${esc(s.area.note)}</span></dd>`
    : `<dt>Site area</dt><dd>${s.rlv?'Normalised to 1 acre ':'Unknown '}${badge(s.rlv?'UNDERWRITING_ASSUMPTION':'MISSING')}</dd>`;
  const planning = `<dt>Zone</dt><dd>${s.zone?esc(s.zone)+' '+badge('OFFICIAL_PLANNING'):'Not confirmed '+badge('MISSING')}</dd>
    <dt>Base plot ratio</dt><dd>${s.pr?'1:'+fmt1(s.pr)+' ':'Not confirmed '}${badge(s.prType)}</dd>
    ${s.cond?`<dt>Assembly rule</dt><dd>${esc(s.cond)}</dd>`:''}
    <dt>Incentive PR</dt><dd>${m&&m.own&&s.pr&&isFinite(m.own.reqPR)?`Owners need an effective PR of <b>${fmt2(m.own.reqPR)}×</b> (${fmtSPct(m.own.reqPR/s.pr-1,0)} over base). `:m&&m.own&&!isFinite(m.own.reqPR)?'Extra density cannot help at this ASP: each added floor loses money. ':''}${gi?`DBKL’s 2026 guideline, ${incTag(s.id)}: <b>+${fmtPct(gi.b.share,0)}</b>, so PR <b>${fmt2(gi.b.pr)}×</b>${gi.mb.own?`, covering <b>${fmtPct(Math.max(0,gi.mb.own.coverage),0)}</b> of the owner budget`:''}. Cap: +70% (PR ${fmt2(s.pr*1.7)}×). ${badge('OFFICIAL_PLANNING','Guideline rates; the tier classification is our reading')} <a href="#/incentive/${s.id}">Incentive calculator</a>. <span class="muted">Discretionary, and never in the base case.</span>`:'<span class="muted">No guideline reading for this site yet.</span>'}</dd>`;
  const market = s.rlv ? `<dt>ASP range used</dt><dd>${s.rlv.asp.map(fmtRM).join(' / ')} psf ${badge('UNDERWRITING_ASSUMPTION')}</dd><dt>Evidence</dt><dd><a href="${s.rlv.url}" target="_blank" rel="noopener">${esc(s.rlv.note)}</a></dd><dt>Base hard cost</dt><dd>${fmtRM(s.rlv.hc)} psf GFA ${badge('UNDERWRITING_ASSUMPTION')}</dd>${s.tenure?`<dt>Tenure</dt><dd>${esc(s.tenure)} ${badge('ASKING_LISTING')}</dd>`:''}`
    : `<dt>Market evidence</dt><dd class="muted">None gathered yet</dd>`;
  const landedBlock = m&&m.own&&x.owner.mode==='landed' ? `<dl class="kv" style="margin-bottom:12px">
     <dt>Lot size</dt><dd>${fmt0(x.owner.lot)} sf ${badge((s.ownerSrc||{}).lot||'UNDERWRITING_ASSUMPTION')}</dd>
     <dt>Lot value</dt><dd>${fmtRM(x.owner.lpsf)} psf of land, ${fmtK(x.owner.res)} per lot ${badge(x.owner.nConfirmed?'TRANSACTION':(s.ownerSrc||{}).lpsf||'UNDERWRITING_ASSUMPTION')}</dd>
     <dt>Share of site in lots</dt><dd>${fmtPct(x.owner.net,0)} ${badge('UNDERWRITING_ASSUMPTION')}</dd>
     <dt>Evidence</dt><dd>${s.ownerUrl?`<a href="${s.ownerUrl}" target="_blank" rel="noopener">${esc(s.ownerNote)}</a>`:esc(s.ownerNote||'')}</dd>
     <dt>Residual can pay</dt><dd><b class="${m.own.payLpsf<x.owner.lpsf?'neg':'pos'}">${m.own.payLpsf>0?fmtRM(m.own.payLpsf):'Nothing'} psf of lot land</b> at a ${fmtPct(x.owner.up,0)} uplift ${badge('MODEL_OUTPUT')}</dd></dl>` : '';
  const ownerSec = m&&m.own ? `${landedBlock}
    <div class="metrics">
     <div class="metric"><span class="v">${fmtK(m.own.w)}</span><span class="k">Weighted current value</span>${badge('MODEL_OUTPUT')}</div>
     <div class="metric"><span class="v">${fmtK(m.own.per)}</span><span class="k">Required package${x.owner.hold?' incl. holdout':''}</span>${badge('MODEL_OUTPUT')}</div>
     <div class="metric"><span class="v">${fmt1(m.own.maxN)}</span><span class="k">Max supportable interests</span>${badge('MODEL_OUTPUT')}</div>
     <div class="metric"><span class="v">${m.own.n}</span><span class="k">Interests tested</span>${badge(x.owner.nConfirmed?'OFFICIAL_STRATA':(x.owner.mode==='landed'?'MODEL_OUTPUT':'INFERRED'))}</div>
     <div class="metric"><span class="v ${sgnCls(m.own.premium)}">${m.rlv>0?fmtSPct(m.own.premium):'−100%'}</span><span class="k">Owner premium at current ASP</span>${badge('MODEL_OUTPUT')}</div>
     <div class="metric"><span class="v">${fmtRM(m.own.reqASP)}</span><span class="k">Owner-required ASP</span>${badge('MODEL_OUTPUT')}</div>
     <div class="metric"><span class="v">${isFinite(m.own.reqPR)?fmt2(m.own.reqPR)+'×':'None'}</span><span class="k">Owner-required PR at ${fmtRM(x.asp)}</span>${badge('MODEL_OUTPUT')}</div>
     <div class="metric"><span class="v">${isFinite(m.own.reqArea)?fmt2(m.own.reqArea)+' ac':'None'}</span><span class="k">Land needed for ${m.own.n} interests</span>${badge('MODEL_OUTPUT')}</div>
    </div>
    ${interestGrid(x,m)}
    <p class="small"><span class="chip ${densityBand(m.own.density)[1]}">${fmt1(m.own.density)} interests per acre: ${densityBand(m.own.density)[0]}</span> <span class="muted">Handoff bands: under 20 strong, 20–25 workable, 25–35 difficult, over 35 weak.</span></p>`
    : `<p class="note info">${s.rlv?'No owner model yet. The project residual exists, but nobody has tested whether it can pay the existing interests.':'Not underwritten. Build the RLV case first, then the owner model.'} ${s.rlv?`<a href="#/lab/${s.id}">Start one in the scenario lab</a>.`:''}</p>`;
  const scoreTbl = f ? `<table class="cost"><thead><tr><th>V2 factor</th><th class="num">Weight</th><th class="num">Score</th><th>Basis</th></tr></thead><tbody>
    ${Object.keys(V2W).map(k=>`<tr><td>${V2_LABEL[k]}</td><td class="num">${fmtPct(V2W[k],0)}</td><td class="num"><b>${fmt1(f[k].v)}</b></td><td class="small">${badge(f[k].src)} ${esc(f[k].why)}</td></tr>`).join('')}
    <tr class="tot"><td>V2 score</td><td></td><td class="num">${fmt2(v2)}</td><td class="small">${s.v1?'V1 was '+fmt2(s.v1.score):'No V1 score: not in the original Top 20'}</td></tr></tbody></table>`
    : '<p class="muted">Not scored.</p>';
  return `<div class="page">
   ${head(esc(s.name),`${esc(s.place)}. ${esc(s.ref)}.${s.thesis?' '+esc(s.thesis)+'.':''}`,
    `<div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">${siteSelect(s.id,SITES,'siteSel')}${s.rlv?`<a class="btn" style="text-decoration:none" href="#/lab/${s.id}">Open in scenario lab</a>`:''}${x&&x.owner?`<a class="btn ghost" style="text-decoration:none" href="#/deal/${s.id}">Deal structures</a>`:''}</div>`)}
   <p>${stageTag(s.stage)} &nbsp; ${verdictTag(s.verdict)} &nbsp; <span class="small muted">Data confidence: ${CONF_L[s.conf]}</span></p>
   <div class="cols" style="margin-top:18px">
    <div>
     <div class="block"><h3>Identity</h3><dl class="kv">${ident}${areaRow}<dt>Map pin</dt><dd>${s.lat.toFixed(3)}°N, ${s.lon.toFixed(3)}°E ${badge('INFERRED','Approximate orientation pin only')}</dd></dl></div>
     <div class="block"><h3>Planning: what can be built?</h3><dl class="kv">${planning}</dl></div>
     <div class="block"><h3>Market: what can it sell for?</h3><dl class="kv">${market}</dl></div>${txSummary(s.id)}
     <div class="block"><h3>Deal: can it be assembled?</h3><dl class="kv"><dt>Main risk</dt><dd>${esc(s.risk||'Not assessed')}</dd><dt>Gating variable</dt><dd><b>${esc(s.gating)}</b></dd><dt>Next action</dt><dd>${esc(s.next)}</dd></dl></div>
     <div class="block"><h3>Score</h3>${scoreTbl}</div>
    </div>
    <div>
     <div class="block"><h3>Development: what is the residual?</h3>${s.rlv?scenarioTable(s):'<p class="muted">No RLV case yet.</p>'}
      ${m?`<p class="small muted" style="margin-top:8px">Recorded presets from the workbook. The live scenario (${PRESET[x.sc]?.l||'Custom'}${JSON.stringify(x)!==JSON.stringify(presetState(s,x.sc))?', edited':''}) gives ${fmtM(m.rlv)} total at ${fmt2(x.area)} ac, ${fmtRM(m.psf)} per land sf.</p>`:''}</div>
     <div class="block"><h3>Owners: can existing interests be satisfied?</h3>${ownerSec}</div>
     <div class="block"><h3>Verdict</h3>
      <dl class="kv"><dt>Recorded verdict</dt><dd>${verdictTag(s.verdict)}</dd>
      ${sug?`<dt>Model suggests</dt><dd>${verdictTag(sug[0])} <span class="small">${esc(sug[1])}</span></dd>`:''}
      ${m?`<dt>Owner test</dt><dd><span class="chip ${os.c}">${os.l}</span></dd>`:''}
      ${m?`<dt>Nearest lever</dt><dd>${esc(leverText(levers(s)))} <a href="#/compare">Compare sites</a></dd>`:''}
      ${gi&&gi.mb.own?`<dt>With DBKL incentive</dt><dd><span class="chip ${covCls(gi.mb.own.coverage)}">${fmtPct(Math.max(0,gi.mb.own.coverage),0)} covered</span> at PR ${fmt2(gi.b.pr)} (+${fmtPct(gi.b.share,0)}, ${incTag(s.id)})</dd>`:''}</dl>
     </div>
    </div>
   </div>
   ${m&&m.own?`<div class="sec"><div class="sec-head"><h2>Owner sensitivity</h2><span class="muted">Current scenario at ${fmt2(x.area)} ac</span></div>
     <h3>By ownership count</h3>${countTable(x,m)}
     <div style="margin-top:22px">${heatTables(x,m)}</div></div>`:''}
   ${buyerFitHTML(s)}
   ${trig.length?`<div class="sec"><div class="sec-head"><h2>Triggers</h2><span class="muted">What must change</span></div>${triggerTable(trig,true)}</div>`:''}
   ${m?`<div class="sec"><div class="sec-head"><h2>Sensitivity charts</h2><span class="muted">Current scenario</span></div>${chartsHTML(x,m)}</div>`:''}
   <div class="sec"><div class="sec-head"><h2>Evidence and confidence</h2><span class="muted">Filled badge is official; dashed is proxy or assumption</span></div>${evidenceTable([...EVIDENCE.filter(e=>e.site===s.id),...txEvidence(s.id)])}</div>
  </div>`;
}
function bindSite(root){const sel=root.querySelector('#siteSel');if(sel)sel.onchange=()=>go('#/site/'+sel.value)}

