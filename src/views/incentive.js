/* ---------- DBKL 2026 guideline: calculator view ---------- */
let ISEL=store.get('isel','taiping');
const INC_SL={i_open:['open',v=>'+'+fmtPct(v,0)],i_tpz:['tpz',v=>'+'+fmtPct(v,0)],i_ppu:['ppu',v=>fmt1(v)],i_usf:['unitSf',v=>fmt0(v)+' sf']};
function incRange(id,l,v,min,max,step,hint,src){const f=INC_SL[id][1];return `<div class="ctrl"><div class="ctrl-top"><label for="${id}">${l}</label><output id="${id}_o" for="${id}">${f(v)}</output></div>
  <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}">
  <div class="hint"><span>${hint}</span>${badge(src||'UNDERWRITING_ASSUMPTION')}</div></div>`}
function viewIncentive(id){
  const list=MODELLED.filter(i=>INC_DEFAULT[i]);
  const sid=list.includes(id)?id:(list.includes(ISEL)?ISEL:'taiping'); ISEL=sid; store.set('isel',sid);
  const s=SITE[sid], x=st(sid), d=incP(sid), b=incB(sid), g=g26Row(sid,true), A=g.A, Ab=A?A.best:null;
  const mz=modelB(sid,0), mb=g.mb, mc=g.mc, mx=g.mx, own=!!mb.own, per=own?mb.own.per:null, n=own?mb.own.n:null;
  const ns=nearestStation(s), tz=tpzRead(ns.km), resOK=incResOK(s), landed=/landed/i.test(INC_DEFAULT[sid].why);
  const tier=G26.redev.find(t=>Math.abs(t.v-d.redev)<1e-9)||G26.redev[0], tag=incTag(sid);
  const dcNow=dcRate(x), alt=dcNow>0||!own?null:modelB(sid,b.share,.3);
  const word=x.owner&&x.owner.mode==='landed'?'lots':'interests';
  const paid=rlv=>own?`${fmt1(Math.max(0,Math.min(rlv/per,n)))} of ${n}`:'–';
  const covTd=v=>v===null||v===undefined?'<td class="num muted">–</td>':`<td class="num"><span class="chip ${covCls(v)}">${fmtPct(Math.max(0,v),0)}</span></td>`;
  const aBetter=Ab&&Ab.rlv>mb.rlv;
  const rrow=(l,pr,rlv,ac,cov,best)=>`<tr${best?' class="best"':''}><td>${l}</td><td class="num">${fmt2(pr)}×</td><td class="num ${sgnCls(rlv)}">${fmtM(rlv,1)}</td><td class="num ${sgnCls(rlv)}">${fmtM(ac,1)}</td>${covTd(cov)}<td class="num">${paid(rlv)}</td></tr>`;
  const calc=[
    ['Redevelopment',fmtPct(d.redev,0),tier.t],
    ['Residing',fmtPct(b.res,0),resOK?(b.res?'At least 50% residential in a commercial zone':'Not claimed'):`Needs a commercial zone; this site is zoned ${s.zone}`],
    ['Public open space',fmtPct(b.open,0),b.open?'Surrendered above the standard':'Not claimed'],
    ['Components',fmtPct(b.sub,0),''],
    ['× Eligibility',fmtPct(d.elig,0),d.elig===1?'Structures on more than half the site':'Structures on half the site or less'],
    ['+ Transit zone',fmtPct(b.tpz,0),b.tpz?'Inside a TPZ or TIZ':'Not claimed'],
    ['Incentive','+'+fmtPct(b.share,0),b.capped?`Capped: the components add up to +${fmtPct(b.raw,0)}`:`Cap +70%; the most this classification reaches is +${fmtPct(mx.share,0)}`],
    ['Effective PR',fmt2(b.pr)+'×',`${fmt2(s.pr)} × (1 + ${fmtPct(b.share,0)})`]];
  const R=[];
  if(mz.per<=0){
    R.push(`The residual is negative at base density, and each added floor loses money at ${fmtRM(x.asp)} psf, so neither route helps until the end value clears about ${fmtRM(mz.be)} psf.`);
  } else {
    R.push(own?`Category B ${tag} lifts the plot ratio from ${fmt2(s.pr)} to ${fmt2(b.pr)} and the residual from ${fmtM(mz.rlv,1)} to ${fmtM(mb.rlv,1)}: <b>${fmtPct(Math.max(0,mb.own.coverage),0)}</b> of the owner budget, ${mb.own.coverage>=1?`enough to pay all ${n} ${word} in full`:`enough for ${fmt1(Math.max(0,mb.own.maxN))} of ${n} ${word}`}.`
      :`Category B ${tag} lifts the plot ratio from ${fmt2(s.pr)} to ${fmt2(b.pr)} and the residual from ${fmtM(mz.rlvAc,1)} to ${fmtM(mb.rlvAc,1)} per acre. This site has no owner model yet, so coverage is untested.`);
    if(b.share<mx.share-1e-9) R.push(`The most this classification can reach is +${fmtPct(mx.share,0)} (PR ${fmt2(mx.pr)})${mx.share<G26.cap-1e-9?', short of the 70% cap':', the 70% cap'}. There, ${own?`coverage would be <b>${fmtPct(Math.max(0,mc.own.coverage),0)}</b>`:`the residual would be ${fmtM(mc.rlvAc,1)} per acre`}. The other +${fmtPct(mx.share-b.share,0)} would have to come from ${resOK&&!b.res?'the residing component, ':''}surrendered open space (up to +10%) or a transit zone (up to +20%), each needing site-specific proof.${mx.share<G26.cap-1e-9?` Reaching +70% would take ${resOK?'':'a commercial zone for the residing component, or '}a higher redevelopment tier${d.elig<1?' or more of the site under existing structures':''}.`:''}`);
    else R.push(`This setting is the most this classification can reach${b.capped?`: the components add up to +${fmtPct(b.raw,0)}, but only +70% counts`:` (+${fmtPct(b.share,0)})`}.`);
    if(alt) R.push(`If market-sold incentive floor area pays a 30% development charge, Category B coverage falls to ${fmtPct(Math.max(0,alt.own.coverage),0)}. The guideline relieves only replacement, MADANI and RMM floor area (6.0(6)).`);
    else if(dcNow>0) R.push(`These figures include your ${fmtPct(dcNow,0)} development charge on incentive floor area (set under <a href="#/board">Distance to deal</a>).`);
    if(Ab){
      const cs=(x.hc*(1+x.pf+x.cont))/x.eff, mp=AFF.madani.p/AFF.madani.sf, rp=AFF.rmm.p/AFF.rmm.sf;
      R.push(`Category A’s best tier is ${Ab.k} (${fmt0(Ab.ose)} persons per acre, ${fmtPct(Ab.ctl,0)} controlled): ${fmt0(Ab.U)} units at PR ${fmt2(Ab.epr)} equivalent, ${Ab.cov!==null?`<b>${fmtPct(Math.max(0,Ab.cov),0)}</b> covered`:`${fmtM(Ab.rlvAc,1)} per acre`}. That ${aBetter?'beats':'trails'} Category B ${tag}.${rp<cs?` MADANI sells at about ${fmtRM(mp)} psf and RMM at about ${fmtRM(rp)} psf, against roughly ${fmtRM(cs)} psf to build a saleable square foot here, so each controlled unit beyond the replacement units costs the scheme money.`:''}`);
      if(Ab.G>0&&Ab.need>0) R.push(`Replacement units count toward the controlled share: here ${fmt0(Ab.G)} replacement units fill ${fmtPct(Math.min(1,Ab.G/Ab.need),0)} of tier ${Ab.k}’s ${fmt0(Ab.need)}-unit obligation.`);
      if(Ab.unhoused>0) R.push(`Tier ${Ab.k} allows ${fmt0(Ab.U)} units in all, fewer than the ${fmt0(n)} ${word}, so ${fmt0(Ab.unhoused)} owners could not get a replacement unit.`);
    }
  }
  if(landed&&d.elig===1) R.push(`For a village, whether “plot area with existing structures” means building footprints or built-on lots decides between 100% and 50% eligibility. At 50%, the redevelopment component here falls to +${fmtPct(d.redev*.5,0)}.`);
  R.push(`Transit: the nearest mapped station is ${esc(ns.n)} (${esc(ns.line)}), about ${fmt0(ns.km*1000)} m from the approximate pin, which reads as <b>${tz[2]}</b> on the draft PTKL2040 definition (TPZ within 400 m of the station, TIZ 400–600 m). Confirm the gazetted zone and its category before counting it.`);
  const aRows=A?A.all.map(q=>`<tr${q===Ab?' class="best"':''}><td><b>${q.k}</b><span class="small muted" style="display:block;white-space:nowrap">${fmtPct(q.ctl,0)} controlled, ${fmt0(q.ose)}/acre</span></td><td class="num">${fmt0(q.U)}</td><td class="num">${fmt0(q.G)}</td><td class="num">${fmt0(q.M)} / ${fmt0(q.R)}</td><td class="num">${fmt0(q.F)}</td><td class="num">${fmt2(q.epr)}×</td><td class="num ${sgnCls(q.rlv)}">${fmtM(q.rlv,1)}</td>${covTd(q.cov)}</tr>`).join(''):'';
  return `<div class="page">
   ${head('DBKL incentives','What DBKL’s 2026 redevelopment incentive guideline could add to each site. Category B raises the plot ratio; Category A sets a density in exchange for controlled housing. Grants are discretionary, so this is a scenario, never the base case.',siteSelect(sid,list.map(i=>SITE[i]),'incSel'))}
   <div class="metrics">
    <div class="metric"><span class="v">${fmt2(s.pr)}×</span><span class="k">Base PR</span>${badge(s.prType)}</div>
    <div class="metric"><span class="v">+${fmtPct(b.share,0)}</span><span class="k">Category B, ${tag}</span>${badge(tag==='as read'?'INFERRED':'EDITED',tag==='as read'?'Our reading of the guideline, not a DBKL decision':'Changed from the reading')}</div>
    <div class="metric"><span class="v">${fmt2(b.pr)}×</span><span class="k">Effective PR</span>${badge('MODEL_OUTPUT')}</div>
    <div class="metric"><span class="v ${own?(mb.own.coverage>=1?'pos':'neg'):sgnCls(mb.rlv)}">${own?fmtPct(Math.max(0,mb.own.coverage),0):fmtM(mb.rlvAc,1)}</span><span class="k">${own?'Owner coverage at that PR':'Residual per acre at that PR'}</span>${badge('MODEL_OUTPUT')}</div>
    <div class="metric"><span class="v">${Ab?'Tier '+Ab.k:'–'}</span><span class="k">Best Category A tier${Ab&&Ab.cov!==null?`, ${fmtPct(Math.max(0,Ab.cov),0)} covered`:''}</span>${badge('MODEL_OUTPUT')}</div>
    <div class="metric"><span class="v">${fmt2(mx.pr)}×</span><span class="k">Most Category B could reach (+${fmtPct(mx.share,0)})</span>${badge('MODEL_OUTPUT','Every optional component at its ceiling, for this classification and zone')}</div>
   </div>
   <div class="lab-grid" style="margin-top:22px">
    <aside class="ctrls" aria-label="Incentive settings">
     <p class="ctrl-group" style="margin-top:0">Category B: plot ratio</p>
     <p class="small muted" style="margin:6px 0 6px" id="irLab">Redevelopment component</p>
     <div class="seg" role="group" aria-labelledby="irLab">${G26.redev.map(t=>`<button type="button" data-ir="${t.v}" aria-pressed="${Math.abs(d.redev-t.v)<1e-9}">${t.v?fmtPct(t.v,0):'None'}</button>`).join('')}</div>
     <p class="small" style="margin:8px 0 0"><b>${esc(tier.t)}.</b> ${esc(tier.d)}</p>
     <p class="small muted" style="margin:6px 0 0">Our reading for this site: ${esc(INC_DEFAULT[sid].why)} ${badge('INFERRED','Our reading of the guideline, not a DBKL decision')}</p>
     <label class="tog" style="margin-top:8px"><input type="checkbox" id="i_res" ${b.res?'checked':''} ${resOK?'':'disabled'}>Residing component (+30%)</label>
     <p class="small muted" style="margin:0">${resOK?(s.zone?'':'Zone not recorded. ')+'Needs at least 50% residential floor area in a commercial zone.':`Not available: it needs a commercial zone, and this site is zoned ${esc(s.zone)}.`}</p>
     ${incRange('i_open','Public open space',b.open,0,G26.openMax,.01,'Surrendered above the standard; up to +10%')}
     ${incRange('i_tpz','Transit zone (TPZ or TIZ)',b.tpz,0,G26.tpzMax,.01,'Rate set by the PTKL2040 zone category; up to +20%')}
     <p class="small" style="margin:6px 0 0"><span class="chip ${tz[1]}">${tz[0]}</span> <span class="muted">${esc(ns.n)} station is about ${fmt0(ns.km*1000)} m from the pin.</span></p>
     <p class="small muted" style="margin:2px 0 0">Pins and lines are approximate; KTM and monorail stations are not mapped.</p>
     <p class="small muted" style="margin:12px 0 6px" id="ieLab">Existing structures cover</p>
     <div class="seg" role="group" aria-labelledby="ieLab"><button type="button" data-ie="1" aria-pressed="${d.elig===1}">More than half the site</button><button type="button" data-ie="0.5" aria-pressed="${d.elig!==1}">Half or less</button></div>
     <p class="small muted" style="margin:6px 0 0">At half or less, the redevelopment, residing and open-space components are halved; the transit zone is not.</p>
     <p class="ctrl-group">Category A: density</p>
     ${incRange('i_ppu','Persons per unit',d.ppu,3,5,.1,'Not stated in the guideline; 4 is our assumption','INFERRED')}
     ${incRange('i_usf','Free-market unit size',d.unitSf,600,1600,50,'Density caps units, not floor area')}
     <label class="tog"><input type="checkbox" id="i_big" ${x.area>=G26.bigAcres||d.big?'checked':''} ${x.area>=G26.bigAcres?'disabled':''}>Scheme of 10 acres or more</label>
     <p class="small muted" style="margin:0">Sets the MADANI:RMM split after replacement units to 50:50 instead of 30:70. ${x.area<G26.bigAcres?`The model uses ${fmt2(x.area)} acres${s.area?'':', a per-acre normalisation'}.`:''}</p>
     <p class="small muted" style="margin-top:14px">Settings ${SYNC.mode==='synced'?'save privately to your account':'are saved in this browser'}.</p>
    </aside>
    <div>
     <div class="sec" style="margin-top:0"><div class="sec-head"><h2>Category B calculation</h2><span class="muted">Guideline section 5.2 and 6.0(2)</span></div>
      <table class="cost"><tbody>${calc.map(([l,v,t],i)=>`<tr${i===calc.length-1?' class="tot"':''}><td>${l}</td><td class="num"><b>${v}</b></td><td class="small muted">${esc(t)}</td></tr>`).join('')}</tbody></table>
      <p style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn" id="iApply">Use +${fmtPct(b.share,0)} in the scenario lab</button><button type="button" class="btn ghost" id="iReset" ${incEdited(sid)?'':'disabled'}>Reset to our reading</button></p>
      <p class="small muted" style="margin:0">The lab’s DBKL 2026 preset applies this share to the base case; this button applies it to the site’s current scenario.</p>
     </div>
     <div class="sec"><div class="sec-head"><h2>Routes compared</h2><span class="muted">Same ASP, costs and owners; only density changes</span></div>
      <div class="tw"><table class="cost"><thead><tr><th>Route</th><th class="num">Effective PR</th><th class="num">Residual</th><th class="num">Per acre</th><th class="num">Owner coverage</th><th class="num">${word==='lots'?'Lots':'Interests'} paid in full</th></tr></thead><tbody>
       ${rrow('No incentive (base PR)',s.pr,mz.rlv,mz.rlvAc,own?mz.own.coverage:null,false)}
       ${rrow(`Category B, ${tag} (+${fmtPct(b.share,0)})`,b.pr,mb.rlv,mb.rlvAc,own?mb.own.coverage:null,!aBetter&&mb.rlv>0)}
       ${rrow(`Category B at its maximum (+${fmtPct(mx.share,0)})`,mx.pr,mc.rlv,mc.rlvAc,own?mc.own.coverage:null,false)}
       ${Ab?rrow(`Category A, tier ${Ab.k} (best tier)`,Ab.epr,Ab.rlv,Ab.rlvAc,Ab.cov,aBetter&&Ab.rlv>0):''}
      </tbody></table></div>
      <p class="small muted" style="margin-top:8px">${mb.rlv>0||(Ab&&Ab.rlv>0)?`Shaded: the better of Category B as ${tag==='as read'?'read':'set'} and the best Category A tier.`:'Neither route gives a positive residual.'} Every row uses this site’s current scenario (${fmtRM(x.asp)} psf, hard cost ${fmtRM(x.hc)} psf)${own?` and its owner budget of ${fmtM(mb.own.reqTotal,1)}`:''}. ${badge('MODEL_OUTPUT')}</p>
     </div>
     <div class="sec"><div class="sec-head"><h2>Reading</h2></div>
      <ul class="small" style="margin:0;padding-left:18px;display:grid;gap:6px">${R.map(t=>`<li>${t}</li>`).join('')}</ul>
      <p class="note info small">None of this enters the base case. DBKL decides each grant after objections, technical studies, JKPS where needed, and the Mayor.</p>
     </div>
     <div class="sec"><div class="sec-head"><h2>Category A: density tiers</h2><span class="muted">Fully residential; ${Ab&&Ab.big?'50:50':'30:70'} MADANI:RMM after replacement units</span></div>
      ${A?`<div class="tw"><table class="cost"><thead><tr><th>Tier</th><th class="num">Units</th><th class="num">Replacement</th><th class="num">MADANI / RMM</th><th class="num">Market</th><th class="num">PR</th><th class="num">Residual</th><th class="num">Coverage</th></tr></thead><tbody>${aRows}</tbody></table></div>
      <p class="small muted" style="margin-top:8px">Units = persons per acre × ${fmt2(x.area)} acres ÷ ${fmt1(d.ppu)} persons per unit. PR is the plot ratio the floor area works out to. Controlled units are rounded up to meet the share. Replacement and free-market units are ${fmt0(d.unitSf)} sf at ${fmtRM(x.asp)} psf; MADANI units are ${AFF.madani.sf} sf at ${fmtRM(AFF.madani.p)} and RMM units ${AFF.rmm.sf} sf at ${fmtRM(AFF.rmm.p)}. Replacement units are valued at market, so the owner test stays cash-equivalent. ${badge('MODEL_OUTPUT')}</p>`:'<p class="muted">No density reading for this site.</p>'}
     </div>
     <div class="sec"><div class="sec-head"><h2>Conditions that apply</h2><span class="muted">Guideline section 6.0</span></div>
      <ul class="small" style="margin:0;padding-left:18px;display:grid;gap:6px">${G26_COND.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
     </div>
    </div>
   </div>
   ${g26Glance()}
  </div>`;
}
function bindIncentive(root){
  const sid=ISEL, d=incP(sid);
  const commit=(focusSel)=>{store.set('inc',INC);render();if(focusSel){const f=document.querySelector(focusSel);if(f)f.focus({preventScroll:true})}};
  const sel=root.querySelector('#incSel'); if(sel) sel.onchange=()=>go('#/incentive/'+sel.value);
  root.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>{d.redev=parseFloat(b.dataset.ir);commit(`[data-ir="${b.dataset.ir}"]`)});
  root.querySelectorAll('[data-ie]').forEach(b=>b.onclick=()=>{d.elig=parseFloat(b.dataset.ie);commit(`[data-ie="${b.dataset.ie}"]`)});
  const r=root.querySelector('#i_res'); if(r) r.onchange=()=>{d.residing=r.checked?G26.residing:0;commit('#i_res')};
  const bg=root.querySelector('#i_big'); if(bg) bg.onchange=()=>{d.big=bg.checked;commit('#i_big')};
  for(const id in INC_SL){const el=root.querySelector('#'+id); if(!el) continue; const [k,f]=INC_SL[id];
    el.oninput=()=>{root.querySelector('#'+id+'_o').textContent=f(parseFloat(el.value))};
    el.onchange=()=>{d[k]=parseFloat(el.value);commit('#'+id)}}
  root.querySelector('#iApply').onclick=()=>{const b=incB(sid),x=st(sid);x.prUp=b.share;x.sc='g26';saveState();toast(`PR uplift set to +${fmtPct(b.share,0)} in the lab`);go('#/lab/'+sid)};
  armConfirm(root.querySelector('#iReset'),()=>{delete INC[sid];store.set('inc',INC);render();toast('Reset to our reading of the guideline')});
}

