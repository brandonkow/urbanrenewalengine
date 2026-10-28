/* ---------- distance to deal ---------- */
function levers(s){return s.rlv?leversFor(s,st(s.id)):null}
function leversFor(s,x){
  if(!s.rlv||!x) return null;
  const m=model(x), L={s,x,m,items:[]};
  if(m.own){
    const need=m.own.reqTotal/m.land, hcStar=requiredHC(x,m,need);
    L.mode='owner'; L.cov=m.own.coverage; L.clears=m.own.coverage>=1;
    L.items.push({k:'asp',l:'ASP',v:m.own.reqASP/x.asp-1,target:m.own.reqASP,f:fmtRM,u:' psf'});
    L.items.push({k:'hc',l:'Hard cost',v:hcStar>0?hcStar/x.hc-1:-1,target:hcStar,f:fmtRM,u:' psf GFA',floor:hcStar<=0});
    L.items.push({k:'pkg',l:'Owner package',v:Math.max(-1,m.own.coverage-1),target:m.own.per*Math.max(0,m.own.coverage),f:fmtK,u:' each',floor:m.rlv<=0});
    L.prNeed=m.own.reqPR; L.prUp=isFinite(L.prNeed)?L.prNeed/x.pr-1:Infinity;
  } else {
    L.mode='rlv'; L.clears=m.rlv>0; L.cov=null;
    L.items.push({k:'asp',l:'ASP',v:m.be/x.asp-1,target:m.be,f:fmtRM,u:' psf'});
    L.items.push({k:'hc',l:'Hard cost',v:m.beHC/x.hc-1,target:m.beHC,f:fmtRM,u:' psf GFA'});
    L.prNeed=null; L.prUp=null;
  }
  const valid=L.items.filter(i=>!i.floor&&isFinite(i.v));
  L.nearest=valid.slice().sort((a,b)=>Math.abs(a.v)-Math.abs(b.v))[0]||null;
  return L;
}
function leverText(L){
  if(!L||!L.nearest) return '–';
  const n=L.nearest, nl=n.l==='ASP'?'ASP':n.l.toLowerCase();
  if(L.mode==='rlv') return L.clears?`Residual positive (${nl} headroom ${fmtPct(Math.abs(n.v),1)}); owner model missing`:`${n.l} ${fmtSPct(n.v)} to break even`;
  if(L.clears) return `Clears; thinnest headroom ${fmtPct(Math.abs(n.v),1)} on ${nl}`;
  return `${n.l} ${fmtSPct(n.v)}`;
}
function prBand(up,s){
  if(up===null) return null;
  if(!isFinite(up)) return ['Density can’t help','bad','Each added floor loses money at this ASP'];
  if(up<=0) return ['Base PR enough','ok','No incentive needed'];
  const b=s?incB(s.id):null, asRead=b?b.share:0, mx=s?incMax(s.id):null;
  if(b&&up<=asRead+1e-9) return ['Within the guideline','ok',`DBKL 2026, ${incTag(s.id)}: +${fmtPct(asRead,0)} for this site`];
  if(mx&&up<=mx.share+1e-9) return ['Needs more components','warn',`Above the +${fmtPct(asRead,0)} ${incTag(s.id)}; reachable up to +${fmtPct(mx.share,0)} with open space and a transit zone`];
  if(mx&&up<=G26.cap+1e-9) return ['Beyond this classification','bad',`More than the +${fmtPct(mx.share,0)} this classification can reach; the 70% cap needs a higher redevelopment tier`];
  if(!mx&&up<=G26.cap+1e-9) return ['Needs an incentive','warn','Within DBKL’s 70% cap'];
  return ['Beyond the 70% cap','bad','More than DBKL’s 2026 guideline allows on plot ratio'];
}
const INT_FACTS=[
 ['In force','PTKL2040 was gazetted on 28 May 2025 and took effect on 11 June 2025.','PRESS_REPORT',U.ptklNews],
 ['Incentive channels','Redevelopment, lot amalgamation, transit-oriented and affordable-housing projects can be granted floor area above the base plot ratio.','PRESS_REPORT',U.ptklNews],
 ['Caps','City-centre commercial is capped at 1:10; main commercial, commerce and mixed use at 1:8.','PRESS_REPORT',U.ptklNews],
 ['How the draft sized them','A transit-zone bonus in % by zone category; three special-redevelopment categories; lot-amalgamation incentives in 17 areas, rising from 1:2.0 standalone toward 1:4.0 with assembled size.','OFFICIAL_PLANNING',U.ptklFaq],
 ['Current rules','DBKL’s 2026 redevelopment incentive guideline (First Amendment in force 1 October 2026). Category B adds up to 70% of the base plot ratio; Category A sets 800–1,400 persons per acre in exchange for 20–100% controlled housing. See DBKL incentives.','OFFICIAL_PLANNING',U.dbklGuides],
 ['Development charge','Approvals that raise intensity pay a development charge on the land-value increase (Section 40, Act 267). The 2026 guideline limits relief to replacement, MADANI and RMM components, so market-sold incentive floor area likely pays. The rate is unverified.','OFFICIAL_PLANNING',U.dbklFaq],
 ['Plan amendments','A separate route: DBKL took letters of intent for PTKL2040 amendments until 10 July 2026.','PRESS_REPORT',U.ptklAmend]
];
function viewBoard(){
  const rows=SITES.map(levers).filter(Boolean);
  const grp=L=>L.mode==='owner'?(L.clears?0:1):(L.clears?2:3);
  rows.sort((a,b)=>grp(a)-grp(b)||Math.abs(a.nearest?a.nearest.v:9)-Math.abs(b.nearest?b.nearest.v:9));
  const cell=(L,k)=>{
    const i=L.items.find(z=>z.k===k); if(!i) return '<td class="num muted">–</td>';
    if(i.floor) return `<td class="num h-bad">Not reachable<span class="small" style="display:block">${k==='pkg'?'residual is negative':'even at zero cost'}</span></td>`;
    const near=L.nearest&&L.nearest.k===k;
    const cls=L.clears?'h-ok':Math.abs(i.v)<=.10?'h-warn':'h-bad';
    return `<td class="num ${cls}${near?' cur':''}"><b>${fmtSPct(i.v)}</b><span class="small" style="display:block">${i.f(i.target)}${i.u}</span></td>`;
  };
  const body=rows.map(L=>{
    const s=L.s, b=prBand(L.prUp,s);
    return `<tr><td class="site">${siteLink(s)}<span class="muted">${esc(s.place)}</span></td>
      <td>${L.mode==='owner'?`<span class="chip ${L.clears?'ok':L.cov>=.8?'warn':'bad'}">${fmtPct(Math.max(0,L.cov),0)} covered</span>`:`<span class="chip ${L.clears?'warn':'bad'}">${L.clears?'Residual only':'Residual negative'}</span>`}</td>
      ${cell(L,'asp')}${cell(L,'hc')}${cell(L,'pkg')}
      <td class="num">${L.prNeed===null?'<span class="muted">–</span>':isFinite(L.prNeed)?`<b>${fmt2(L.prNeed)}×</b><span class="small" style="display:block">${fmtSPct(L.prUp,0)} over base ${fmt1(L.x.pr)}</span>`:'<span class="neg">None</span>'}</td>
      <td class="small">${b?`<span class="chip ${b[1]}">${b[0]}</span><span class="muted" style="display:block">${esc(b[2])}</span>`:'<span class="muted">–</span>'}</td>
      <td class="small" style="min-width:170px">${esc(leverText(L))}</td></tr>`;
  }).join('');
  const owned=rows.filter(L=>L.mode==='owner');
  const dcs=[0,.3,.6];
  const dcRows=owned.map(L=>`<tr><td>${siteLink(L.s)}</td><td class="num">${fmt1(L.x.pr)}</td>${dcs.map(d=>{const x2={...L.x,dc:d},m2=model(x2),r=m2.own?m2.own.reqPR:null;return `<td class="num">${r===null?'–':isFinite(r)?fmt2(r)+'×':'None'}</td>`}).join('')}</tr>`).join('');
  return `<div class="page">
   ${head('Distance to deal','How far each site is from paying its owners in full, one lever at a time. The smallest move is the thing to diligence first.')}
   <div class="sec" style="margin-top:0"><div class="sec-head"><h2>Single-lever moves to full owner coverage</h2><span class="muted">Each column holds everything else fixed; outlined cell is the nearest lever</span></div>
    <div class="tw"><table class="heat"><thead><tr><th>Site</th><th>Owner test</th><th class="num">ASP</th><th class="num">Hard cost</th><th class="num">Owner package</th><th class="num">Effective PR needed</th><th>Planning read</th><th>Nearest lever</th></tr></thead><tbody>${body}</tbody></table></div>
    <p class="small muted" style="margin-top:8px">Green: already clears (the figure is headroom). Amber: within 10%. Red: further. Sites without an owner model show the move to break even instead. Once DBKL’s incentive for a site is known, set it as PR uplift in the <a href="#/lab/taiping">scenario lab</a> and this table updates. All figures are model outputs from each site’s current scenario ${badge('MODEL_OUTPUT')}</p>
   </div>
   ${g26Section()}
   <div class="sec"><div class="sec-head"><h2>Planning intensity</h2><span class="muted">The variable land prices are pricing</span></div>
    <div class="cols">
     <div><dl class="kv">${INT_FACTS.map(f=>`<dt>${esc(f[0])}</dt><dd>${esc(f[1])} <a href="${f[3]}" target="_blank" rel="noopener">${badge(f[2])}</a></dd>`).join('')}</dl></div>
     <div>
      <div class="ctrl" style="padding-top:0"><div class="ctrl-top"><label for="g_dc">Development charge on incentive floor area</label><output id="g_dc_o">${fmtPct(GLOB.dc,0)}</output></div>
       <input type="range" id="g_dc" min="0" max="1" step=".05" value="${GLOB.dc}">
       <div class="hint"><span>Share of the value the extra floor area adds; applies to every site</span>${badge('UNDERWRITING_ASSUMPTION')}</div></div>
      <h3 style="margin-top:14px">Effective PR owners need, by charge rate</h3>
      <div class="tw"><table class="cost"><thead><tr><th>Site</th><th class="num">Base</th>${dcs.map(d=>`<th class="num">${fmtPct(d,0)} charge</th>`).join('')}</tr></thead><tbody>${dcRows}</tbody></table></div>
      <p class="small muted" style="margin-top:8px">The charge never changes the base case, because base scenarios assume no incentive. It raises the density a site must win before owners are paid in full.</p>
     </div>
    </div>
   </div>
  </div>`;
}
function bindBoard(root){
  const i=root.querySelector('#g_dc'), o=root.querySelector('#g_dc_o');
  i.oninput=()=>{o.textContent=fmtPct(parseFloat(i.value),0)};
  i.onchange=()=>{GLOB.dc=parseFloat(i.value);store.set('glob',GLOB);render();toast('Development charge set to '+fmtPct(GLOB.dc,0))};
}

