/* ---------- owner-test odds (Monte Carlo) ----------
   Seeded draws over end price, hard cost, owner count or lot value, the development-charge rate and DBKL's
   decision. Each draw runs the engine's own model(), so the base case and every golden number stay as they
   are; this is a second view. The same seed always gives the same answer. */
const MC_OUT=[
 ['read','Category B as set','DBKL grants the Category B share set in DBKL incentives (our reading unless you changed it).'],
 ['half','Half eligibility','Existing structures are judged to cover half the site or less, so the redevelopment, residing and open-space components halve (6.0(2)).'],
 ['none','No incentive','DBKL refuses the incentive, or the scheme falls outside the guideline.'],
 ['dbl','Double privilege','The base plot ratio already counts as an incentive, so Category B cannot stack on it (6.0(8)).']];
const MC_DEFAULT={seed:1,n:2000,out:{read:.45,half:.15,none:.30,dbl:.10},dc:[0,.10,.30],hc:[.92,1,1.15],
  site:{taiping:{n:[30,40,80]},salak:{lpsf:[122,160,203]},pantai:{lpsf:[240,300,458]},jinjang_aman:{lpsf:[176,200,229]},jinjang_selatan:{lpsf:[176,200,229]}}};
const MC_SRC={taiping:{own:'UNDERWRITING_ASSUMPTION',why:'Strata roll not obtained. 40 is the engine’s stress case; the handoff’s building-form cases run to 60 and 80.'},
  salak:{own:'ASKING_LISTING',why:'Village lot asks of about RM122–203 psf of land.'},
  pantai:{own:'INFERRED',why:'No Kampung Pantai lot evidence. The top is a Pantai Murni terrace at about RM458 psf of land.'},
  jinjang_aman:{own:'ASKING_LISTING',why:'Jinjang Utara lot asks of about RM176–229 psf of land.'},
  jinjang_selatan:{own:'ASKING_LISTING',why:'Uses the Jinjang Utara lot asks; no site-specific evidence.'}};
function mcRng(seed){let a=(seed>>>0)||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function mcTri(u,r){const [a,c,b]=r;if(!(b>a))return c;const F=(c-a)/(b-a);return u<F?a+Math.sqrt(u*(b-a)*(c-a)):b-Math.sqrt((1-u)*(b-a)*(b-c))}
function mcSort3(r,d){const v=(Array.isArray(r)?r:d).slice(0,3).map((q,i)=>isFinite(+q)?+q:d[i]);v.sort((p,q)=>p-q);return v}
function mcCfg(c){
  c=c||MC; const D=MC_DEFAULT, out={};
  for(const [k] of MC_OUT) out[k]=Math.max(0,isFinite(+(c.out||{})[k])?+(c.out||{})[k]:D.out[k]);
  const site={};
  for(const id of packSites()){
    const s=SITE[id], o=s.owner, cs=(c.site||{})[id]||{}, ds=D.site[id]||{}, landed=o.mode==='landed';
    site[id]={asp:mcSort3(cs.asp,s.rlv.asp), own:landed?mcSort3(cs.lpsf,ds.lpsf||[o.lpsf*.8,o.lpsf,o.lpsf*1.3]):mcSort3(cs.n,ds.n||[o.n,o.n,o.n]), ownKey:landed?'lpsf':'n'};
  }
  return {seed:Math.max(1,Math.round(isFinite(+c.seed)?+c.seed:D.seed)), n:Math.min(20000,Math.max(100,Math.round(isFinite(+c.n)?+c.n:D.n))),
    out, dc:mcSort3(c.dc,D.dc).map(v=>Math.max(0,Math.min(1,v))), hc:mcSort3(c.hc,D.hc).map(v=>Math.max(.1,v)), site};
}
function mcShares(id){return {read:incB(id).share,half:incB(id,{elig:.5}).share,none:0,dbl:0}}
function mcPoint(base,v){
  const x={...base,owner:{...base.owner},asp:v.asp,hc:base.hc*v.hcm,dc:v.dc,prUp:v.share};
  if(x.owner.mode==='landed') x.owner.lpsf=v.own; else {x.owner.n=Math.max(1,Math.round(v.own)); if(x.owner.form) x.owner.form={...x.owner.form,on:false}}
  applyOwnerDerived(x); return model(x);
}
function mcRun(id,cfg){
  cfg=cfg||mcCfg(); const R=cfg.site[id]; if(!R) return null;
  const base=presetState(SITE[id],'base'), sh=mcShares(id), keys=MC_OUT.map(o=>o[0]);
  const w=keys.map(k=>cfg.out[k]), tw=w.reduce((a,b)=>a+b,0)||1, rnd=mcRng(cfg.seed), N=cfg.n;
  const cov=new Float64Array(N), by=keys.map(()=>({n:0,hit:0}));
  let hit=0;
  for(let i=0;i<N;i++){
    const u0=rnd(),u1=rnd(),u2=rnd(),u3=rnd(),u4=rnd();
    let j=0,acc=w[0]/tw; while(u4>=acc&&j<keys.length-1){j++;acc+=w[j]/tw}
    const c=mcPoint(base,{asp:mcTri(u0,R.asp),hcm:mcTri(u1,cfg.hc),dc:mcTri(u2,cfg.dc),own:mcTri(u3,R.own),share:sh[keys[j]]}).own.coverage;
    cov[i]=c; by[j].n++; if(c>=1){hit++;by[j].hit++}
  }
  const sorted=Float64Array.from(cov).sort(), q=p=>sorted[Math.min(N-1,Math.max(0,Math.floor(p*(N-1)+.5)))];
  const byOut={}; keys.forEach((k,i)=>byOut[k]={n:by[i].n,p:by[i].n?by[i].hit/by[i].n:null,share:sh[k]});
  return {id,N,p:hit/N,q10:q(.1),q50:q(.5),q90:q(.9),q01:q(.01),q99:q(.99),mean:cov.reduce((a,b)=>a+b,0)/N,byOut,cov,tornado:mcTornado(id,cfg,base,sh)};
}
function mcTornado(id,cfg,base,sh){
  base=base||presetState(SITE[id],'base'); sh=sh||mcShares(id); const R=cfg.site[id], landed=R.ownKey==='lpsf';
  const mid={asp:R.asp[1],hcm:cfg.hc[1],dc:cfg.dc[1],own:R.own[1],share:sh.read};
  const at=ov=>mcPoint(base,{...mid,...ov}).own.coverage, centre=at({});
  const rows=[
    {k:'asp',l:'End price (ASP)',n:'the end price',lo:{v:R.asp[0],t:fmtRM(R.asp[0])+' psf',c:at({asp:R.asp[0]})},hi:{v:R.asp[2],t:fmtRM(R.asp[2])+' psf',c:at({asp:R.asp[2]})}},
    {k:'hc',l:'Hard cost',n:'hard cost',lo:{v:cfg.hc[0],t:fmtRM(base.hc*cfg.hc[0])+' psf',c:at({hcm:cfg.hc[0]})},hi:{v:cfg.hc[2],t:fmtRM(base.hc*cfg.hc[2])+' psf',c:at({hcm:cfg.hc[2]})}},
    landed?{k:'own',l:'Lot value',n:'lot value',lo:{v:R.own[0],t:fmtRM(R.own[0])+' psf',c:at({own:R.own[0]})},hi:{v:R.own[2],t:fmtRM(R.own[2])+' psf',c:at({own:R.own[2]})}}
          :{k:'own',l:'Ownership interests',n:'the ownership count',lo:{v:R.own[0],t:fmt0(R.own[0]),c:at({own:R.own[0]})},hi:{v:R.own[2],t:fmt0(R.own[2]),c:at({own:R.own[2]})}},
    {k:'dc',l:'Development charge',n:'the development charge',lo:{v:cfg.dc[0],t:fmtPct(cfg.dc[0],0),c:at({dc:cfg.dc[0]})},hi:{v:cfg.dc[2],t:fmtPct(cfg.dc[2],0),c:at({dc:cfg.dc[2]})}},
    {k:'g26',l:'DBKL decision',n:'DBKL’s decision',lo:{v:0,t:'No incentive',c:at({share:0})},hi:{v:sh.read,t:`+${fmtPct(sh.read,0)} as set`,c:at({share:sh.read})}}];
  rows.forEach(r=>r.swing=Math.abs(r.hi.c-r.lo.c));
  rows.sort((a,b)=>b.swing-a.swing);
  return {centre,rows};
}

/* charts: coverage histogram (status colour: short vs clears) and a tornado (low input vs high input) */
function mcHist(r){
  const W=560,H=230,P={l:46,r:14,t:16,b:40}, bw=.05;
  let lo=Math.floor(Math.min(r.q01,.6)/bw)*bw, hi=Math.ceil(Math.max(r.q99,1.3)/bw)*bw; if(hi-lo>4){lo=Math.max(lo,-1);hi=Math.min(hi,3)}
  const nb=Math.max(1,Math.round((hi-lo)/bw)), cnt=new Array(nb).fill(0);
  r.cov.forEach(c=>{const i=Math.min(nb-1,Math.max(0,Math.floor((c-lo)/bw+1e-9)));cnt[i]++});
  const ymax=Math.max(...cnt)/r.N, yt=niceTicks(0,ymax,4), Y1=yt[yt.length-1];
  const X=v=>P.l+(v-lo)/(hi-lo)*(W-P.l-P.r), Y=v=>P.t+(Y1-v)/Y1*(H-P.t-P.b);
  let g='';
  yt.forEach(v=>{g+=`<line class="${v===0?'ax0':'ax'}" x1="${P.l}" x2="${W-P.r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}"/><text class="tick" x="${P.l-6}" y="${(Y(v)+3.5).toFixed(1)}" text-anchor="end">${fmtPct(v,0)}</text>`});
  niceTicks(lo,hi,6).filter(v=>v>=lo-1e-9&&v<=hi+1e-9).forEach(v=>{g+=`<text class="tick" x="${X(v).toFixed(1)}" y="${H-P.b+14}" text-anchor="middle">${fmtPct(v,0)}</text>`});
  cnt.forEach((n,i)=>{if(!n)return;const a=lo+i*bw, x0=X(a)+1, x1=X(a+bw)-1, y=Y(n/r.N);
    g+=`<rect class="${a>=1-1e-9?'mc-ok':'mc-bad'}" x="${x0.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1,x1-x0).toFixed(1)}" height="${(Y(0)-y).toFixed(1)}"><title>Coverage ${fmtPct(a,0)}–${fmtPct(a+bw,0)}: ${fmtPct(n/r.N,1)} of draws</title></rect>`});
  if(1>=lo&&1<=hi){const x=X(1).toFixed(1);g+=`<line class="mc-ref" x1="${x}" x2="${x}" y1="${P.t-6}" y2="${H-P.b}"/><text class="axl" x="${(+x+5).toFixed(1)}" y="${P.t+4}">100%: owners paid in full</text>`}
  g+=`<text class="axl" x="${(P.l+W-P.r)/2}" y="${H-5}" text-anchor="middle">Owner coverage (residual ÷ owner budget)</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Distribution of owner coverage across ${r.N} draws; ${fmtPct(r.p,0)} at or above 100%">${g}</svg>
   <div class="leg"><span style="--c:var(--bad)">Short of the owner budget</span><span style="--c:var(--ok)">Clears (100% or more)</span></div>`;
}
function mcTornadoSVG(t){
  const rows=t.rows, W=560, rh=34, P={l:126,r:8,t:22,b:30}, H=P.t+rows.length*rh+P.b;
  const vals=rows.flatMap(r=>[r.lo.c,r.hi.c]).concat([t.centre,1]);
  const xt=niceTicks(Math.min(...vals),Math.max(...vals),6), lo=xt[0], hi=xt[xt.length-1], pad=(hi-lo||1)*.24;
  const X=v=>P.l+(v-lo+pad)/(hi-lo+2*pad||1)*(W-P.l-P.r);
  let g='';
  xt.forEach(v=>{const x=X(v).toFixed(1);g+=`<line class="ax" x1="${x}" x2="${x}" y1="${P.t-4}" y2="${H-P.b}"/><text class="tick" x="${x}" y="${H-P.b+14}" text-anchor="middle">${fmtPct(v,0)}</text>`});
  rows.forEach((r,i)=>{
    const yc=P.t+i*rh+rh/2, bh=12;
    g+=`<text class="axl" x="${P.l-8}" y="${(yc+4).toFixed(1)}" text-anchor="end">${esc(r.l)}</text>`;
    for(const [side,cls] of [['lo','mc-lo'],['hi','mc-hi']]){
      const e=r[side], a=Math.min(X(t.centre),X(e.c)), b=Math.max(X(t.centre),X(e.c)), y=yc+(side==='lo'?-bh-1:1);
      g+=`<rect class="${cls}" x="${a.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1.5,b-a).toFixed(1)}" height="${bh}"><title>${esc(r.l)} at ${esc(e.t)}: coverage ${fmtPct(e.c,0)}</title></rect>`;
      const right=X(e.c)>=X(t.centre);
      g+=`<text class="tick" x="${(right?b+4:a-4).toFixed(1)}" y="${(y+bh-2).toFixed(1)}" text-anchor="${right?'start':'end'}">${esc(e.t)}</text>`;
    }
  });
  const xc=X(t.centre).toFixed(1); g+=`<line class="ax0" x1="${xc}" x2="${xc}" y1="${P.t-8}" y2="${H-P.b}"/><text class="tick" x="${xc}" y="${P.t-11}" text-anchor="middle">${fmtPct(t.centre,0)} at the middle values</text>`;
  if(1>=lo&&1<=hi){const x1=X(1).toFixed(1);g+=`<line class="mc-ref" x1="${x1}" x2="${x1}" y1="${P.t-4}" y2="${H-P.b}"/>`}
  g+=`<text class="axl" x="${(P.l+W-P.r)/2}" y="${H-4}" text-anchor="middle">Owner coverage with one input moved, the rest at their middle values</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tornado chart: which input moves owner coverage most">${g}</svg>
   <div class="leg"><span style="--c:var(--viz1)">Input at the low end of its range</span><span style="--c:var(--viz2)">Input at the high end</span><span style="--c:var(--ink)">100% line</span></div>`;
}

let MCSEL=store.get('mcsel','taiping');
function mcNum(path,v,step,w){return `<input class="mc-in" type="number" inputmode="decimal" step="${step}" data-mc="${path}" value="${+(+v).toFixed(4)}" style="width:${w||76}px" aria-label="${esc(path)}">`}
function viewOdds(id){
  const list=packSites(), sid=list.includes(id)?id:(list.includes(MCSEL)?MCSEL:list[0]); MCSEL=sid; store.set('mcsel',sid);
  const cfg=mcCfg(), res=list.map(i=>mcRun(i,cfg)), r=res.find(q=>q.id===sid), tw=MC_OUT.reduce((a,[k])=>a+cfg.out[k],0)||1;
  const pcell=p=>p===null?'<td class="num muted">–</td>':`<td class="num"><span class="chip ${p>=.75?'ok':p>=.4?'warn':'bad'}">${fmtPct(p,0)}</span></td>`;
  const rows=res.map(q=>{const s=SITE[q.id], top=q.tornado.rows[0];
    return `<tr class="${q.id===sid?'mc-cur':''}"><td class="site"><a href="#/odds/${q.id}">${esc(s.name)}</a><span class="muted">${esc(s.ref||s.place)}</span></td>
     <td class="num"><b class="mc-p">${fmtPct(q.p,0)}</b><span class="scorebar" style="width:90px;margin-left:auto"><i style="width:${(q.p*100).toFixed(1)}%"></i></span></td>
     <td class="num">${fmtPct(q.q50,0)}</td><td class="num">${fmtPct(q.q10,0)} to ${fmtPct(q.q90,0)}</td>
     ${MC_OUT.slice(0,3).map(([k])=>pcell(q.byOut[k].p)).join('')}
     <td class="small">${esc(top.l)}<span class="muted" style="display:block">${fmtPct(top.lo.c,0)} to ${fmtPct(top.hi.c,0)}</span></td></tr>`}).join('');
  const s=SITE[sid], R=cfg.site[sid], landed=R.ownKey==='lpsf', t=r.tornado;
  const tRows=t.rows.map(q=>`<tr><td>${esc(q.l)}</td><td class="num">${esc(q.lo.t)}</td><td class="num">${fmtPct(q.lo.c,0)}</td><td class="num">${esc(q.hi.t)}</td><td class="num">${fmtPct(q.hi.c,0)}</td><td class="num"><b>${fmtPct(q.swing,0)}</b></td></tr>`).join('');
  const read=[];
  read.push(`Across ${fmt0(r.N)} draws, ${esc(s.name)} clears the owner test (coverage of 100% or more) in <b>${fmtPct(r.p,0)}</b> of them. The middle draw covers ${fmtPct(r.q50,0)} of the owner budget, and eight in ten draws fall between ${fmtPct(r.q10,0)} and ${fmtPct(r.q90,0)}.`);
  const bo=r.byOut, pp=k=>bo[k].p===null?'no draws':fmtPct(bo[k].p,0);
  read.push(`By DBKL decision, the chance of clearing is ${pp('read')} if DBKL grants Category B as set, ${pp('half')} at half eligibility, ${pp('none')} with no incentive and ${pp('dbl')} under double privilege.`);
  read.push(`The input that moves coverage most is ${t.rows[0].n} (${fmtPct(t.rows[0].lo.c,0)} to ${fmtPct(t.rows[0].hi.c,0)} across its range), then ${t.rows[1].n}. ${t.rows[0].k==='own'?(landed?'Verified lot values are the cheapest information to buy.':'The strata roll settles this one.'):t.rows[0].k==='g26'?'A DBKL pre-consultation answer is worth more than any other diligence here.':''}`);
  if(r.p===0) read.push('No draw clears: within these ranges, no combination of price, cost and DBKL decision pays every owner.');
  const ownLabel=landed?'Lot value (RM psf of land)':'Ownership interests';
  const siteRows=list.map(i=>{const q=cfg.site[i], L=q.ownKey==='lpsf';return `<tr><td class="site"><b>${esc(SITE[i].name)}</b></td>
    <td class="num">${[0,1,2].map(j=>mcNum(`site.${i}.asp.${j}`,q.asp[j],10,70)).join(' ')}</td>
    <td class="num"><span class="small muted" style="display:block">${L?'Lot RM psf':'Interests'}</span>${[0,1,2].map(j=>mcNum(`site.${i}.${q.ownKey}.${j}`,q.own[j],L?5:1,62)).join(' ')}</td>
    <td>${badge(MC_SRC[i]?MC_SRC[i].own:'UNDERWRITING_ASSUMPTION',MC_SRC[i]?MC_SRC[i].why:'')}</td></tr>`}).join('');
  return `<div class="page">
   ${head('Owner-test odds','How likely each site is to clear the owner test once its inputs are uncertain. Each draw picks an end price, hard cost, owner count or lot value, development-charge rate and DBKL decision from the ranges below and runs the engine’s own model. The base case does not change; this is a separate view.',siteSelect(sid,list.map(i=>SITE[i]),'mcSel'))}
   <div class="tw"><table class="cost"><thead><tr><th>Site</th><th class="num">Chance of clearing</th><th class="num">Median coverage</th><th class="num">8 in 10 draws</th><th class="num">If DBKL grants as set</th><th class="num">Half eligibility</th><th class="num">No incentive</th><th>Biggest driver</th></tr></thead><tbody>${rows}</tbody></table></div>
   <p class="small muted" style="margin-top:8px">${fmt0(cfg.n)} draws per site, seed ${cfg.seed}. Same seed, same answer. Coverage is the residual divided by the owner budget, as in the base case. The DBKL columns are the chance of clearing given that decision. ${badge('MODEL_OUTPUT')} Ranges are judgements, not evidence ${badge('UNDERWRITING_ASSUMPTION')}.</p>
   <div class="sec"><div class="sec-head"><h2>${esc(s.name)}</h2><span class="muted">${fmtPct(r.p,0)} chance of clearing</span></div>
    <div class="charts">
     <div class="chart"><h3>Where the draws land</h3><p>Share of draws by owner coverage, in 5-point bins; the top and bottom 1% fold into the end bins</p>${mcHist(r)}</div>
     <div class="chart"><h3>What moves coverage most</h3><p>One input at a time across its range; DBKL decision from no incentive to the share as set</p>${mcTornadoSVG(t)}</div>
    </div>
    <ul class="read" style="margin-top:14px">${read.map(x=>`<li>${x}</li>`).join('')}</ul>
    <div class="tw" style="margin-top:10px"><table class="cost"><thead><tr><th>Input</th><th class="num">Low end</th><th class="num">Coverage</th><th class="num">High end</th><th class="num">Coverage</th><th class="num">Swing</th></tr></thead><tbody>${tRows}</tbody></table></div>
   </div>
   <div class="sec"><div class="sec-head"><h2>Ranges</h2><span class="muted">Low, most likely and high; triangular distributions</span></div>
    <div class="cols">
     <div>
      <h3>DBKL decision</h3>
      <table class="cost"><tbody>${MC_OUT.map(([k,l,d])=>`<tr><td>${esc(l)}<span class="small muted" style="display:block">${esc(d)}</span></td><td class="num">${mcNum('out.'+k,cfg.out[k]*100,1,64)}<span class="small muted"> weight</span><span class="small" style="display:block">${fmtPct(cfg.out[k]/tw,0)} chance</span></td></tr>`).join('')}</tbody></table>
      <p class="small muted" style="margin-top:6px">Weights are normalised to 100%. None of this is a forecast of DBKL; it shows how much the answer leans on DBKL. ${badge('UNDERWRITING_ASSUMPTION')}</p>
     </div>
     <div>
      <h3>Every site</h3>
      <table class="cost"><tbody>
       <tr><td>Development charge on incentive floor area</td><td class="num">${[0,1,2].map(j=>mcNum('dc.'+j,cfg.dc[j],.01,62)).join(' ')}</td></tr>
       <tr><td>Hard cost, × the site’s base</td><td class="num">${[0,1,2].map(j=>mcNum('hc.'+j,cfg.hc[j],.01,62)).join(' ')}</td></tr>
       <tr><td>Draws per site</td><td class="num">${mcNum('n',cfg.n,500,84)}</td></tr>
       <tr><td>Random seed</td><td class="num">${mcNum('seed',cfg.seed,1,84)}</td></tr>
      </tbody></table>
      <p style="margin-top:10px"><button type="button" class="btn ghost" id="mcReset">Reset ranges</button></p>
     </div>
    </div>
    <div style="margin-top:18px">
      <h3>By site</h3>
      <div class="tw"><table class="cost"><thead><tr><th>Site</th><th class="num">End price, RM psf</th><th class="num">Owners</th><th>Source</th></tr></thead><tbody>${siteRows}</tbody></table></div>
      <p class="small muted" style="margin-top:6px">End-price ranges default to each site’s downside, base and upside presets. ${esc(MC_SRC[sid]?MC_SRC[sid].why:'')} Draws use the site’s base preset for everything else (efficiency, profit, fees, area). ${ownLabel==='Ownership interests'?'Interests keep the base commercial share.':''}</p>
    </div>
   </div>
  </div>`;
}
function bindOdds(root){
  const sel=root.querySelector('#mcSel'); if(sel) sel.onchange=()=>go('#/odds/'+sel.value);
  root.querySelectorAll('[data-mc]').forEach(inp=>inp.onchange=()=>{
    const v=parseFloat(inp.value); if(!isFinite(v)) return;
    const p=inp.dataset.mc.split('.'), cfg=mcCfg(), next=JSON.parse(JSON.stringify(MC||{}));
    if(p[0]==='out'){next.out={...cfg.out,[p[1]]:Math.max(0,v/100)}}
    else if(p[0]==='dc'||p[0]==='hc'){const a=cfg[p[0]].slice();a[+p[1]]=v;next[p[0]]=a}
    else if(p[0]==='site'){next.site=next.site||{};const cur=cfg.site[p[1]], k=p[2], a=(k==='asp'?cur.asp:cur.own).slice();a[+p[3]]=v;next.site[p[1]]={...(next.site[p[1]]||{}),[k]:a}}
    else next[p[0]]=v;
    MC=next; store.set('mc',MC); requestAnimationFrame(render);
  });
  root.querySelector('#mcReset').onclick=()=>{MC={};store.set('mc',MC);render();toast('Ranges reset')};
}


