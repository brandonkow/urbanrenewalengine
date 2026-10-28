/* ---------- DBKL 2026 guideline: board section and summary ---------- */
function g26CovCell(m,sub){return `<td class="num">${m.own?`<span class="chip ${covCls(m.own.coverage)}">${fmtPct(Math.max(0,m.own.coverage),0)} covered</span>`:`<span class="${sgnCls(m.rlv)}">${fmtM(m.rlvAc)}/acre</span>`}<span class="small muted" style="display:block">${sub}</span></td>`}
function g26Section(){
  const rows=SITES.filter(s=>s.rlv&&INC_DEFAULT[s.id]).map(s=>g26Row(s.id,true)).filter(Boolean);
  rows.sort((a,b)=>(b.mb.own?1:0)-(a.mb.own?1:0)||(a.mb.own?b.mb.own.coverage-a.mb.own.coverage:b.mb.rlvAc-a.mb.rlvAc));
  const body=rows.map(g=>{
    const s=g.s, t=G26.redev.find(z=>Math.abs(z.v-g.b.p.redev)<1e-9), A=g.A?g.A.best:null;
    const aBetter=A&&A.rlv>g.mb.rlv, best=aBetter?A.rlv:g.mb.rlv, route=aBetter?'Category A':'Category B';
    let lab;
    if(best<=0) lab='<span class="chip bad">Neither: residual negative</span>';
    else if(g.mb.own){const c=aBetter?A.cov:g.mb.own.coverage;lab=`<span class="chip ${c>=1?'ok':'warn'}">${route} ${c>=1?'clears':'still short'}</span>`}
    else lab=`<span class="chip na">${route}; owners untested</span>`;
    return `<tr><td class="site"><a href="#/incentive/${s.id}">${esc(s.name)}</a><span class="muted">${esc(s.ref||s.place)}</span></td>
      <td class="small">${t?esc(t.t):'–'}<span class="muted" style="display:block">Redevelopment +${fmtPct(g.b.p.redev,0)}, ${incTag(s.id)}</span></td>
      <td class="num">${fmt2(s.pr)}×</td>
      ${g26CovCell(g.mb,`PR ${fmt2(g.b.pr)} (+${fmtPct(g.b.share,0)})`)}
      ${g26CovCell(g.mc,`PR ${fmt2(g.mx.pr)} (+${fmtPct(g.mx.share,0)})`)}
      <td class="num">${A?(A.cov!==null?`<span class="chip ${covCls(A.cov)}">${fmtPct(Math.max(0,A.cov),0)} covered</span>`:`<span class="${sgnCls(A.rlv)}">${fmtM(A.rlvAc)}/acre</span>`)+`<span class="small muted" style="display:block">Tier ${A.k}, PR ${fmt2(A.epr)} equivalent</span>`:'<span class="muted">–</span>'}</td>
      <td>${lab}</td></tr>`;
  }).join('');
  return `<div class="sec"><div class="sec-head"><h2>DBKL 2026 incentive guideline</h2><span class="muted">What each route could add on each site’s current scenario</span></div>
   <div class="tw"><table class="cost"><thead><tr><th>Site</th><th>Category B classification</th><th class="num">Base PR</th><th class="num">Category B</th><th class="num">Most it could reach</th><th class="num">Category A, best tier</th><th>Better route</th></tr></thead><tbody>${body}</tbody></table></div>
   <p class="small muted" style="margin-top:8px">Coverage is the residual at that plot ratio divided by the owner budget; sites without an owner model show residual per acre. “Most it could reach” claims every optional component at its ceiling (open space +10%, transit zone +20%, residing +30% only in commercial zones), so residential sites on the 30% tier top out at +60%, not +70%. Classifications are our reading of Jadual 5.2.1–5.2.3, not DBKL decisions, and every grant is discretionary, so none of this enters the base case. <a href="#/incentive/${ISEL}">Open the incentive calculator</a> to set components site by site. ${badge('MODEL_OUTPUT')}</p>
  </div>`;
}
function g26Glance(){
  const ex1=6*(1+g26Share({redev:.5,res:.3,open:.1,tpz:.15,elig:.5}).share), ex2=6*(1+g26Share({redev:.5,res:.3,open:.1,tpz:.15,elig:1}).share);
  return `<div class="sec"><div class="sec-head"><h2>The guideline at a glance</h2><span class="muted">${esc(G26.inForce)}</span></div>
   <div class="cols">
    <div>
     <h3>Category A: density, fully residential schemes</h3>
     <div class="tw"><table class="cost"><thead><tr><th>Tier</th><th class="num">Controlled housing</th><th class="num">Free market</th><th class="num">Density</th></tr></thead><tbody>
      ${G26.catA.map(c=>`<tr><td>${c.k}</td><td class="num">${fmtPct(c.ctl,0)}</td><td class="num">${c.ctl<1?fmtPct(1-c.ctl,0):'–'}</td><td class="num">${fmt0(c.ose)} persons/acre</td></tr>`).join('')}
     </tbody></table></div>
     <p class="small muted" style="margin-top:8px">Controlled housing is replacement units plus Residensi MADANI (up to ${fmtRM(AFF.madani.p)}, at least ${AFF.madani.sf} sf) and RMM (up to ${fmtRM(AFF.rmm.p)}, at least ${AFF.rmm.sf} sf). After replacement units, MADANI and RMM split 50:50 on schemes of 10 acres or more and 30:70 below. ${badge('OFFICIAL_PLANNING')}</p>
    </div>
    <div>
     <h3>Category B: plot ratio, up to +70% of base</h3>
     <div class="tw"><table class="cost"><thead><tr><th>Component</th><th class="num">Rate</th><th>Main criterion</th></tr></thead><tbody>
      ${G26.redev.filter(t=>t.v>0).map(t=>`<tr><td>Redevelopment</td><td class="num">${fmtPct(t.v,0)}</td><td class="small">${esc(t.t)}</td></tr>`).join('')}
      <tr><td>Residing</td><td class="num">${fmtPct(G26.residing,0)}</td><td class="small">At least 50% residential floor area in a commercial zone</td></tr>
      <tr><td>Public open space</td><td class="num">≤${fmtPct(G26.openMax,0)}</td><td class="small">Open space surrendered above the standard, pro rata</td></tr>
      <tr><td>Transit zone</td><td class="num">≤${fmtPct(G26.tpzMax,0)}</td><td class="small">Inside a TPZ or TIZ, at the rate the PTKL2040 criteria set</td></tr>
     </tbody></table></div>
     <p class="small muted" style="margin-top:8px">Existing structures on more than half the site earn 100% of the redevelopment, residing and open-space components; half or less earns 50%. The transit component is not scaled. Engine check against the guideline’s worked examples (base PR 6.0, components 90%, transit 15%): PR <b>${fmt1(ex1)}</b> at 50% eligibility and <b>${fmt1(ex2)}</b> at 100%, after the cap. The guideline gives 9.6 and 10.2. <a href="${U.dbklGuides}" target="_blank" rel="noopener">${badge('OFFICIAL_PLANNING')}</a></p>
    </div>
   </div>
  </div>`;
}

