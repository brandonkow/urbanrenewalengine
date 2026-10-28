/* ---------- chart helper ---------- */
let CID=0;
function niceTicks(min,max,n=5){
  if(!isFinite(min)||!isFinite(max)) return [0,1];
  if(min===max){min-=1;max+=1}
  const raw=(max-min)/n, mag=Math.pow(10,Math.floor(Math.log10(raw))), e=raw/mag;
  const step=(e>=7.5?10:e>=3.5?5:e>=1.5?2:1)*mag;
  const a=Math.floor(min/step)*step, b=Math.ceil(max/step)*step, t=[];
  for(let v=a;v<=b+step*1e-6;v+=step) t.push(+v.toPrecision(12));
  return t;
}
function lineChart(o){
  const W=560,H=268,P={l:60,r:18,t:18,b:42}, id='cl'+(++CID);
  const xs=o.series.flatMap(s=>s.pts.map(p=>p[0]));
  let ys=o.series.flatMap(s=>s.pts.map(p=>p[1])).filter(v=>isFinite(v));
  (o.hl||[]).forEach(h=>{if(isFinite(h.y))ys.push(h.y)});
  let xmin=o.xmin??Math.min(...xs), xmax=o.xmax??Math.max(...xs);
  let ymin=o.ymin??Math.min(...ys), ymax=Math.max(...ys);
  if(o.ymaxClip!==undefined) ymax=Math.min(ymax,o.ymaxClip);
  const yt=niceTicks(ymin,ymax); ymin=yt[0]; ymax=yt[yt.length-1];
  const xt=niceTicks(xmin,xmax,6).filter(v=>v>=xmin-1e-9&&v<=xmax+1e-9);
  const X=v=>P.l+(v-xmin)/(xmax-xmin)*(W-P.l-P.r), Y=v=>P.t+(ymax-v)/(ymax-ymin)*(H-P.t-P.b);
  let g=`<defs><clipPath id="${id}"><rect x="${P.l}" y="${P.t-2}" width="${W-P.l-P.r}" height="${H-P.t-P.b+4}"/></clipPath></defs>`;
  yt.forEach(v=>{g+=`<line class="${Math.abs(v)<1e-12?'ax0':'ax'}" x1="${P.l}" x2="${W-P.r}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}"/><text class="tick" x="${P.l-7}" y="${(Y(v)+3.5).toFixed(1)}" text-anchor="end">${o.yf(v)}</text>`});
  xt.forEach(v=>{g+=`<text class="tick" x="${X(v).toFixed(1)}" y="${H-P.b+15}" text-anchor="middle">${o.xf(v)}</text>`});
  g+=`<text class="axl" x="${(P.l+W-P.r)/2}" y="${H-6}" text-anchor="middle">${esc(o.xl)}</text>`;
  g+=`<text class="axl" transform="translate(13 ${(P.t+H-P.b)/2}) rotate(-90)" text-anchor="middle">${esc(o.yl)}</text>`;
  g+=`<g clip-path="url(#${id})">`;
  (o.hl||[]).forEach(h=>{if(!isFinite(h.y)||h.y<ymin||h.y>ymax)return;const y=Y(h.y).toFixed(1);g+=`<line class="${h.c||'ref'}" x1="${P.l}" x2="${W-P.r}" y1="${y}" y2="${y}"/><text class="${h.c==='ref2'?'reflab2':'reflab'}" x="${h.left?P.l+4:W-P.r-4}" y="${(+y+(h.below?13:-5)).toFixed(1)}" text-anchor="${h.left?'start':'end'}">${esc(h.l||'')}</text>`});
  (o.vl||[]).forEach((v,i)=>{if(!isFinite(v.x)||v.x<xmin||v.x>xmax)return;const x=X(v.x).toFixed(1);g+=`<line class="${v.c||'ref'}" x1="${x}" x2="${x}" y1="${P.t}" y2="${H-P.b}"/><text class="${v.c==='ref2'?'reflab2':'reflab'}" x="${(+x+4).toFixed(1)}" y="${P.t+10+i*12}">${esc(v.l||'')}</text>`});
  o.series.forEach((s,i)=>{
    let d='',pen=false;
    s.pts.forEach(p=>{if(!isFinite(p[1])){pen=false;return}const yy=Math.max(Math.min(p[1],ymax+(ymax-ymin)),ymin-(ymax-ymin));d+=(pen?'L':'M')+X(p[0]).toFixed(1)+' '+Y(yy).toFixed(1);pen=true});
    g+=`<path class="ln c${s.c??i}" d="${d}"/>`;
  });
  (o.dots||[]).forEach(p=>{if(isFinite(p[1])&&p[1]>=ymin&&p[1]<=ymax&&p[0]>=xmin&&p[0]<=xmax)g+=`<circle class="dot" r="4.5" cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}"/>`});
  g+='</g>';
  const leg=o.series.length>1?`<div class="leg">${o.series.map((s,i)=>`<span style="--c:var(--${['ink','zone','official','muted'][s.c??i]})">${esc(s.name)}</span>`).join('')}</div>`:'';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria||o.xl+' vs '+o.yl)}">${g}</svg>${leg}`;
}
function range(a,b,n){const r=[];for(let i=0;i<=n;i++)r.push(a+(b-a)*i/n);return r}

function chartsHTML(x,m){
  const aspR=range(Math.max(100,x.asp*.55),x.asp*1.6,48);
  const c1=lineChart({aria:'Residual land value against ASP',
    series:[{name:'RLV',pts:aspR.map(a=>[a,calcRLV({...x,asp:a}).rlv/1e6])}],
    hl:[...(m.own?[{y:m.own.reqTotal/1e6,l:`Owner budget ${fmtM(m.own.reqTotal,1)}`}]:[])],
    vl:[{x:m.be,l:`Breakeven ${fmtRM(m.be)}`,c:'ref2'},...(m.own?[{x:m.own.reqASP,l:`Owner-required ${fmtRM(m.own.reqASP)}`}]:[])],
    dots:[[x.asp,m.rlv/1e6]],
    xl:'End-product ASP (RM psf)',yl:'Total RLV (RM m)',xf:v=>fmt0(v),yf:v=>fmt0(v)});
  let c2,c3,c4;
  if(m.own){
    const o=x.owner, areas=range(.25,Math.max(3,x.area*1.6),40);
    c2=lineChart({aria:'Maximum supportable owners against site area',
      series:[.2,.3,.4].map((u,i)=>({name:`${u*100}% uplift`,c:[3,0,2][i],pts:areas.map(a=>{const mm=calcRLV({...x,area:a});return[a,Math.max(0,mm.rlv/ownerBudgetPer({...o,up:u}))]})})),
      hl:[{y:o.n,l:`${o.n} interests`}],vl:[{x:x.area,l:`Site ${fmt2(x.area)} ac`,c:'ref2'}],ymin:0,
      xl:'Site area (acres)',yl:'Max supportable interests',xf:v=>fmt2(v).replace(/\.?0+$/,''),yf:v=>fmt0(v)});
    const ns=range(10,Math.max(100,o.n*1.3),45);
    c3=lineChart({aria:'Required ASP against ownership count',
      series:[{name:'Required ASP',pts:ns.map(n=>[n,requiredASP(x,m,n,o)])}],
      hl:[{y:x.asp,l:`Current ASP ${fmtRM(x.asp)}`,c:'ref2'}],vl:[{x:o.n,l:`${o.n} interests`}],dots:[[o.n,m.own.reqASP]],
      xl:'Ownership interests',yl:'Required ASP (RM psf)',xf:v=>fmt0(v),yf:v=>fmt0(v)});
    c4=lineChart({aria:'Required plot ratio against ownership count',
      series:[{name:'Required PR',pts:ns.map(n=>[n,requiredPR(x,m,n,o)])}],
      hl:[{y:m.epr,l:`Effective PR ${fmt2(m.epr)}×`,c:'ref2'}],vl:[{x:o.n,l:`${o.n} interests`}],dots:[[o.n,m.own.reqPR]],ymin:0,ymaxClip:Math.max(12,m.epr*2.5),
      xl:'Ownership interests',yl:'Required effective PR (×)',xf:v=>fmt0(v),yf:v=>fmt1(v)});
  }
  const none='<p class="note info">Owner model not built for this site. Start one in the scenario lab to see this chart.</p>';
  return `<div class="charts">
   <div class="chart"><h3>RLV against ASP</h3><p>Dot is the current scenario. Red line is the total owner budget.</p>${c1}</div>
   <div class="chart"><h3>Supportable owners against site area</h3><p>How much land each uplift target needs.</p>${c2||none}</div>
   <div class="chart"><h3>Required ASP by ownership count</h3><p>ASP needed to pay every interest its package.</p>${c3||none}</div>
   <div class="chart"><h3>Required plot ratio by ownership count</h3><p>Density needed instead, holding ASP.</p>${c4||none}</div>
  </div>`;
}
function interestGrid(x,m){
  const o=m.own, n=Math.min(o.n,160), cov=o.coverage, paid=Math.max(0,Math.min(cov,1))*n;
  let h='';
  for(let i=0;i<n;i++){
    if(i+1<=paid+1e-9) h+='<i></i>';
    else if(i<paid) h+=`<i class="part"><b style="width:${((paid-i)*100).toFixed(0)}%"></b></i>`;
    else h+='<i class="un"></i>';
  }
  if(cov>1){const extra=Math.min(Math.floor((cov-1)*n),80);for(let i=0;i<extra;i++)h+='<i class="extra"></i>'}
  const cap = cov>=1
    ? `The residual pays all <b>${o.n}</b> interests their <b>${fmtK(o.per)}</b> package, with room for <b>${fmt1(o.maxN-o.n)}</b> more (dashed).`
    : `The residual pays <b>${fmt1(Math.max(0,o.maxN))} of ${o.n}</b> interests their <b>${fmtK(o.per)}</b> package. The hatched squares are unfunded: a <b>${fmtM(o.reqTotal-m.rlv,1)}</b> shortfall.`;
  return `<div class="igrid" role="img" aria-label="${o.n} ownership interests, ${fmt1(Math.min(o.maxN,o.n))} funded">${h}</div><p class="igrid-cap">${cap}${o.n>160?' Grid capped at 160 squares.':''}</p>`;
}

