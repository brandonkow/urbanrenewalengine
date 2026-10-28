/* ---------- market calibration ---------- */
const COMPS=[
 {id:'tuan',name:'Tuan Straits Residency',place:'Salak Selatan',ac:4.67,units:1310,avg:840,avgSrc:'PRESS_REPORT',gdv:765e6,src:'PRESS_REPORT',url:U.tuan,note:'Two towers of 44 and 43 storeys; launched 2Q2026 from RM675 psf; completion 1H2030.'},
 {id:'nestree',name:'Nestree Residence',place:'Kampung Pantai',ac:2.10,units:630,avg:900,avgSrc:'INFERRED',asp:624,src:'ASKING_LISTING',url:U.nestree,note:'Two 40-storey towers. Average unit size inferred from listings (700–1,275 sf); ASP is the portal’s average ask, not launch pricing.'}
];
const LANDCOMPS=[
 {id:'p59',name:'Development land (asking)',place:'Pantai Dalam',ac:5.9,psf:523.51,src:'ASKING_LISTING',url:U.pantaiLand,asp:680,hc:270},
 {id:'s121',name:'Mixed-development land (asking)',place:'Salak South / Sungai Besi',ac:12.1,price:120e6,src:'ASKING_LISTING',url:U.salakLand,asp:650,hc:270},
 {id:'j139',name:'Large parcel (asking)',place:'Jinjang Utara',ac:13.90,price:151.371e6,src:'ASKING_LISTING',url:U.jinjangLand,asp:480,hc:260},
 {id:'ayer',name:'AYER Holdings purchase',place:'Jalan Kuchai Lama',ac:9.11,price:138e6,src:'PRESS_REPORT',url:U.ayer,asp:750,hc:270}
];
const GDVCOMPS=[
 {name:'Malton, Johor Bahru (serviced apartments)',tier:'sub',ac:3.72,price:97.23e6,gdv:950e6,url:U.malton},
 {name:'Selangor Dredging, Petaling Jaya (serviced apartments)',tier:'sub',ac:1.214*2.4710538,price:63e6,gdv:507e6,url:U.sdred},
 {name:'Sime Darby Property, UniRazak site, KL city centre',tier:'prime',share:.178,url:U.primeDeals},
 {name:'Paramount, Jalan U-Thant, KL',tier:'prime',share:.234,url:U.primeDeals}
];
const gShare=g=>g.share??g.price/g.gdv;
const SITE_TIER={taiping:'prime'};
let CAL=store.get('cal',{hc:270,eff:.78,share:.11,asp:{}});
function calK(){return CAL.eff*(1-(FIXED.stat+FIXED.sm+FIXED.fin+FIXED.demo+.20))}
function calcComp(c){
  const land=c.ac*SF_PER_ACRE, sal=c.units*c.avg, asp=c.asp??c.gdv/sal, gdv=c.gdv??sal*asp, pr=sal/CAL.eff/land, k=calK(), cc=1+FIXED.pf+FIXED.cont;
  const per=asp*k-CAL.hc*cc, rlv=pr*per;
  return {land,sal,asp,gdv,pr,gdvLand:gdv/land,rlv,share:rlv*land/gdv,hcFor:asp*(k-CAL.share*CAL.eff)/cc,base35:3.5*per};
}
function calcLand(c){
  const land=c.ac*SF_PER_ACRE, psf=c.psf??c.price/land, asp=CAL.asp[c.id]??c.asp, hc=CAL.hc*(c.hc/270), k=calK(), per=asp*k-hc*(1+FIXED.pf+FIXED.cont);
  return {psf,asp,hc,per,impliedPR:per>0?psf/per:null};
}
function viewCalibration(){
  const pc=COMPS.map(c=>({c,r:calcComp(c)})), lc=LANDCOMPS.map(c=>({c,r:calcLand(c)}));
  const shares=GDVCOMPS.filter(g=>g.tier==='sub').map(gShare), pshares=GDVCOMPS.filter(g=>g.tier==='prime').map(gShare);
  const prs=range(1.5,10,34);
  const curve=(asp,hc)=>prs.map(p=>[p,p*(asp*calK()-hc*(1+FIXED.pf+FIXED.cont))]);
  const chart=lineChart({aria:'Residual land value per land sf against effective plot ratio',
    series:[{name:'Jinjang (RM480)',c:3,pts:curve(CAL.asp.j139??480,CAL.hc*260/270)},{name:'Salak Selatan (RM650)',c:0,pts:curve(CAL.asp.s121??650,CAL.hc)},{name:'Kampung Pantai (RM680)',c:2,pts:curve(CAL.asp.p59??680,CAL.hc)}],
    hl:lc.filter(z=>z.c.id!=='ayer').map(z=>({y:z.r.psf,l:`${z.c.place.split(' /')[0]} land ${fmtRM(z.r.psf)}`,below:z.c.id==='s121'})),
    vl:[{x:2.5,l:'PTKL R2 base',c:'ref2'},{x:3.5,l:'R3 base',c:'ref2'}],
    xl:'Effective plot ratio',yl:'RLV per land sf (RM)',xf:v=>fmt1(v),yf:v=>fmt0(v),ymin:-400});
  const tuan=pc[0].r;
  return `<div class="page">
   ${head('Calibration','Does the cost stack explain what land actually trades for? Back-solve from real projects and land prices instead of trusting assumptions.')}
   <div class="lab-grid">
    <aside class="ctrls" aria-label="Calibration controls">
     <p class="ctrl-group" style="margin-top:0">Cost stack under test</p>
     <div class="ctrl"><div class="ctrl-top"><label for="cal_hc">Mass-market hard cost (psf GFA)</label><output id="cal_hc_o">${fmtRM(CAL.hc)}</output></div><input type="range" id="cal_hc" data-ck2="hc" min="180" max="400" step="5" value="${CAL.hc}"><div class="hint"><span>Jinjang scaled to ${fmt0(260/270*100)}% of this</span>${badge('UNDERWRITING_ASSUMPTION')}</div></div>
     <div class="ctrl"><div class="ctrl-top"><label for="cal_eff">Saleable efficiency</label><output id="cal_eff_o">${fmtPct(CAL.eff)}</output></div><input type="range" id="cal_eff" data-ck2="eff" min=".65" max=".9" step=".005" value="${CAL.eff}"><div class="hint"><span>Also sets the implied PR</span>${badge('UNDERWRITING_ASSUMPTION')}</div></div>
     <div class="ctrl"><div class="ctrl-top"><label for="cal_share">Target land share of GDV</label><output id="cal_share_o">${fmtPct(CAL.share)}</output></div><input type="range" id="cal_share" data-ck2="share" min=".05" max=".25" step=".005" value="${CAL.share}"><div class="hint"><span>Suburban deals ${shares.map(v=>fmtPct(v)).join(', ')}; prime ${pshares.map(v=>fmtPct(v)).join(', ')}</span>${badge('PRESS_REPORT')}</div></div>
     <p class="small muted">Other lines use the base stack: fees ${fmtPct(FIXED.pf,0)} and contingency ${fmtPct(FIXED.cont,0)} of hard cost; statutory, sales, finance and demolition ${fmtPct(FIXED.stat+FIXED.sm+FIXED.fin+FIXED.demo,0)} of GDV; profit 20%.</p>
     <p class="ctrl-group">Local new-product ASP for each land comparable</p>
     ${LANDCOMPS.map(c=>`<div class="ctrl"><div class="ctrl-top"><label for="cal_asp_${c.id}">${esc(c.place)}</label><output id="cal_asp_${c.id}_o">${fmtRM(CAL.asp[c.id]??c.asp)}</output></div><input type="range" id="cal_asp_${c.id}" data-casp="${c.id}" min="350" max="1100" step="5" value="${CAL.asp[c.id]??c.asp}"><div class="hint"><span>psf</span>${badge(c.id==='ayer'?'INFERRED':'ASKING_LISTING')}</div></div>`).join('')}
     <p style="margin-top:12px"><button type="button" class="btn ghost" id="calReset">Reset calibration</button></p>
    </aside>
    <div>
     <div class="sec" style="margin-top:0"><div class="sec-head"><h2>Real projects, back-solved</h2><span class="muted">What density and cost do these launches imply?</span></div>
      <div class="tw"><table class="cost struct"><thead><tr><th></th>${pc.map(z=>`<th class="num">${esc(z.c.name)}<br><span class="muted small">${esc(z.c.place)}</span></th>`).join('')}</tr></thead><tbody>
       <tr><td>Land</td>${pc.map(z=>`<td class="num">${fmt2(z.c.ac)} ac</td>`).join('')}</tr>
       <tr><td>Units × size</td>${pc.map(z=>`<td class="num">${fmt0(z.c.units)} × ${fmt0(z.c.avg)} sf ${badge(z.c.avgSrc)}</td>`).join('')}</tr>
       <tr><td>Average ASP</td>${pc.map(z=>`<td class="num">${fmtRM(z.r.asp)} ${badge(z.c.src)}</td>`).join('')}</tr>
       <tr><td>GDV per land sf</td>${pc.map(z=>`<td class="num">${fmtRM(z.r.gdvLand)}</td>`).join('')}</tr>
       <tr><td><b>Implied effective PR</b></td>${pc.map(z=>`<td class="num"><b>${fmt2(z.r.pr)}×</b></td>`).join('')}</tr>
       <tr><td>Density at 4 persons per unit</td>${pc.map(z=>`<td class="num">${fmt0(z.c.units/z.c.ac*4)} persons/acre</td>`).join('')}</tr>
       <tr><td>RLV per land sf at ${fmtRM(CAL.hc)} hard cost</td>${pc.map(z=>`<td class="num ${sgnCls(z.r.rlv)}">${fmtRM(z.r.rlv)}</td>`).join('')}</tr>
       <tr><td>RLV as share of GDV</td>${pc.map(z=>`<td class="num">${fmtPct(z.r.share)}</td>`).join('')}</tr>
       <tr><td>Hard cost that gives a ${fmtPct(CAL.share,0)} land share</td>${pc.map(z=>`<td class="num">${fmtRM(z.r.hcFor)}</td>`).join('')}</tr>
       <tr class="tot"><td>Same economics at the PTKL R3 base (PR 3.5)</td>${pc.map(z=>`<td class="num ${sgnCls(z.r.base35)}">${fmtRM(z.r.base35)} psf</td>`).join('')}</tr>
      </tbody></table></div>
      <p class="small muted">${pc.map(z=>`<a href="${z.c.url}" target="_blank" rel="noopener">${esc(z.c.name)}</a>: ${esc(z.c.note)}`).join(' ')}</p>
     </div>
     <div class="sec"><div class="sec-head"><h2>Land prices, back-solved</h2><span class="muted">What plot ratio would justify each land price?</span></div>
      <div class="tw"><table class="cost"><thead><tr><th>Comparable</th><th class="num">Land psf</th><th class="num">Local ASP used</th><th class="num">Residual per GFA sf</th><th class="num">Implied PR</th><th>Source</th></tr></thead><tbody>
      ${lc.map(z=>`<tr><td>${esc(z.c.name)}<br><span class="small muted">${esc(z.c.place)}, ${fmt2(z.c.ac)} ac</span></td><td class="num">${fmtRM(z.r.psf)}</td><td class="num">${fmtRM(z.r.asp)}</td><td class="num ${sgnCls(z.r.per)}">${fmtRM(z.r.per)}</td><td class="num"><b>${z.r.impliedPR===null?'<span class="neg">none works</span>':fmt2(z.r.impliedPR)+'×'}</b></td><td><a href="${z.c.url}" target="_blank" rel="noopener">${badge(z.c.src)}</a></td></tr>`).join('')}
      </tbody></table></div>
      <p class="small muted">Implied PR = land price ÷ (ASP × efficiency × (1 − GDV-based costs) − hard cost × (1 + fees + contingency)). The Kuchai Lama ASP is a placeholder; set it once local launch pricing is known.</p>
     </div>
     ${tierSection(pshares)}
     <div class="sec"><div class="sec-head"><h2>Residual by density</h2><span class="muted">Curves use each area’s ASP; red lines are observed land prices; green lines are PTKL base intensities</span></div><div class="chart">${chart}</div></div>
     <div class="sec"><div class="sec-head"><h2>Reading</h2>${badge('MODEL_OUTPUT')}</div><ul class="read">
      <li>At ${fmtRM(CAL.hc)} hard cost, Tuan Straits implies an effective PR of ${fmt2(tuan.pr)}× and a land value of ${fmtRM(tuan.rlv)} psf, ${fmtPct(tuan.share)} of GDV. Disclosed suburban deals sit at ${shares.map(v=>fmtPct(v)).join(' and ')}.</li>
      <li>The same project at the PTKL R3 base of 3.5× would leave ${fmtRM(tuan.base35)} psf. Closing that gap through cost alone would need hard cost near ${fmtRM((tuan.asp*calK()-tuan.rlv/3.5)/(1+FIXED.pf+FIXED.cont))} psf GFA, ${fmtPct(1-((tuan.asp*calK()-tuan.rlv/3.5)/(1+FIXED.pf+FIXED.cont))/CAL.hc,0)} below the tested cost. Density is the bigger lever.</li>
      <li>So for the specific incentive sites, the decisive diligence item is the intensity DBKL will grant under its 2026 incentive guideline. Every land price in this table is pricing in densities well above the base.</li>
      <li>At 4 persons per unit, Tuan Straits works out to ${fmt0(COMPS[0].units/COMPS[0].ac*4)} and Nestree to ${fmt0(COMPS[1].units/COMPS[1].ac*4)} persons per acre: inside the 1,000–1,200 band that the guideline’s Category A allows with 30–50% controlled housing.</li>
     </ul></div>
    </div>
   </div>
  </div>`;
}
function bindCalibration(root){
  let raf=0; const redraw=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{store.set('cal',CAL);render()})};
  root.querySelectorAll('[data-ck2]').forEach(i=>{const k=i.dataset.ck2,o=root.querySelector('#cal_'+k+'_o');
    i.oninput=()=>{const v=parseFloat(i.value);o.textContent=k==='hc'?fmtRM(v):fmtPct(v)};
    i.onchange=()=>{CAL[k]=parseFloat(i.value);redraw()}});
  root.querySelectorAll('[data-casp]').forEach(i=>{const o=root.querySelector('#cal_asp_'+i.dataset.casp+'_o');
    i.oninput=()=>{o.textContent=fmtRM(parseFloat(i.value))};
    i.onchange=()=>{CAL.asp[i.dataset.casp]=parseFloat(i.value);redraw()}});
  root.querySelector('#calReset').onclick=()=>{CAL={hc:270,eff:.78,share:.11,asp:{}};store.set('cal',CAL);render();toast('Calibration reset')};
}


