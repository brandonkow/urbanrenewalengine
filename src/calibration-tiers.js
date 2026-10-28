/* ---------- calibration: market tiers ---------- */
function tierSection(pshares){
  const sub=GDVCOMPS.filter(g=>g.tier==='sub').map(gShare), sLo=Math.min(...sub), sHi=Math.max(...sub);
  const lo=Math.min(...pshares), hi=Math.max(...pshares);
  const rows=SITES.filter(s=>s.rlv).map(s=>{const x=st(s.id),m=model(x);return {s,x,m,share:m.rlv/m.gdv}});
  const tp=rows.find(r=>r.s.id==='taiping');
  const body=rows.map(r=>{
    const tier=SITE_TIER[r.s.id]==='prime', a=tier?lo:sLo, z=tier?hi:sHi, bLo=r.m.gdv*a, bHi=r.m.gdv*z, gap=a-r.share;
    return `<tr><td>${siteLink(r.s)}</td><td>${tier?'Prime fringe':'Suburban'}</td><td class="num ${sgnCls(r.share)}">${fmtPct(r.share)}</td>
     <td class="num">${fmtPct(a)}–${fmtPct(z)}</td><td class="num ${gap>0?'neg':''}">${gap>0?fmtPct(gap)+' below':'Within or above'}</td>
     <td class="num">${fmtM(bLo,1)} to ${fmtM(bHi,1)}</td>
     <td class="num">${r.m.own?`${fmt1(bLo/r.m.own.per)} to ${fmt1(bHi/r.m.own.per)}`:'<span class="muted">–</span>'}</td></tr>`;
  }).join('');
  return `<div class="sec"><div class="sec-head"><h2>Land share of GDV by market tier</h2><span class="muted">Model residual against what developers actually pay</span></div>
   <div class="tw"><table class="cost"><thead><tr><th>Site</th><th>Tier</th><th class="num">Model RLV ÷ GDV</th><th class="num">Market band</th><th class="num">Model versus band</th><th class="num">Land budget at band</th><th class="num">Interests that budget pays</th></tr></thead><tbody>${body}</tbody></table></div>
   <p class="small muted" style="margin-top:8px">At base PR, every suburban site models below the 10–12% of GDV that developers pay. That is the density gap again: market land prices assume more floor area than the base plot ratio allows. Deals: ${GDVCOMPS.map(g=>`<a href="${g.url}" target="_blank" rel="noopener">${esc(g.name)}</a> ${fmtPct(gShare(g))}`).join('; ')}.</p>
   ${tp&&tp.m.own?`<p class="note small">Taiping’s model land share is ${fmtPct(tp.share)}. Underwritten like the prime KL buyers, its land budget would be ${fmtM(tp.m.gdv*lo,1)}–${fmtM(tp.m.gdv*hi,1)}, enough for ${fmt1(tp.m.gdv*lo/tp.m.own.per)}–${fmt1(tp.m.gdv*hi/tp.m.own.per)} interests at the current package. Those deals are city-centre plots at PR 8–10, so treat this as an upper bound, not a base case.</p>`:''}
  </div>`;
}


