/* ---------- watchlist ---------- */
let WL = store.get('wl',{model:'v2',sort:'score',dir:-1});
function heroRule(){
  const x=st('taiping'), m=model(x), o=m.own;
  const mx=Math.max(m.rlv,o.reqTotal,1), aw=Math.max(0,m.rlv)/mx*100, rw=o.reqTotal/mx*100;
  const gap=o.reqTotal-m.rlv;
  return `<section class="rule" aria-labelledby="ruleh">
   <div class="rule-top">
     <p class="rule-eq" id="ruleh">Residual value<span class="gt">${m.rlv>=o.reqTotal?'&gt;':'&lt;'}</span>required owner consideration</p>
     <span class="small muted">Apartmen Taman Taiping, current scenario</span>
   </div>
   <div class="bars">
     <div class="lab"><b>${fmtM(m.rlv,1)}</b>Residual available at ${fmt2(x.area)} ac</div>
     <div class="bar"><i class="avail" style="width:${aw}%"></i>${gap>0?`<i class="gap" style="left:${aw}%;width:${rw-aw}%"></i>`:''}</div>
     <div class="lab"><b>${fmtM(o.reqTotal,1)}</b>${o.n} interests × ${fmtK(o.per)}</div>
     <div class="bar"><i class="req" style="width:${rw}%"></i></div>
   </div>
   <div class="rule-foot">
     <span class="chip ${gap>0?'bad':'ok'}">${gap>0?`Short by ${fmtM(gap,1)}: pays ${fmt1(o.maxN)} of ${o.n} interests`:`Surplus of ${fmtM(-gap,1)}`}</span>
     <span>Interest count ${badge(x.owner.nConfirmed?'OFFICIAL_STRATA':'INFERRED')} Site area ${badge(x.areaConfirmed?'OFFICIAL_CADASTRAL':'PUBLIC_MAP')}</span>
     ${(()=>{const g=g26Row('taiping');return g&&g.mb.own?`<span>With DBKL’s 2026 incentive, ${incTag('taiping')} (PR ${fmt2(g.b.pr)}): <b>${fmtPct(Math.max(0,g.mb.own.coverage),0)}</b> covered</span>`:''})()}
     <a href="#/lab/taiping">Change the assumptions</a>
   </div>
  </section>`;
}
function wlRows(){
  return SITES.filter(s=>s.v1||s.id==='salak').map(s=>{
    const x=s.rlv?st(s.id):null, m=x?model(x):null;
    return {s,x,m,v1:s.v1?s.v1.score:null,v2:v2Score(s),f:v2Factors(s),os:ownerStatus(m,x),lev:levers(s),g:s.rlv&&INC_DEFAULT[s.id]?g26Row(s.id,false):null};
  });
}
function viewWatchlist(){
  const rows=wlRows();
  const key=WL.sort, dir=WL.dir;
  const val=r=>({score:WL.model==='v1'?r.v1:r.v2,v1:r.v1,v2:r.v2,rlvAc:r.m?r.m.rlvAc:null,psf:r.m?r.m.psf:null,be:r.m?r.m.be:null,name:r.s.name,stage:STAGES.indexOf(r.s.stage)})[key];
  rows.sort((a,b)=>{const va=val(a),vb=val(b);if(va===null&&vb===null)return 0;if(va===null)return 1;if(vb===null)return -1;return (va>vb?1:va<vb?-1:0)*dir});
  const scoreKey=WL.model==='v1'?'v1':'v2';
  const ranked=[...rows].filter(r=>r[scoreKey]!==null).sort((a,b)=>b[scoreKey]-a[scoreKey]);
  const rankOf=r=>{const i=ranked.findIndex(z=>z.s.id===r.s.id);if(i<0)return '–';const v=r[scoreKey];return ranked.findIndex(z=>Math.abs(z[scoreKey]-v)<1e-9)+1};
  const th=(k,l,cls='')=>`<th class="sort ${cls}" data-k="${k}" ${WL.sort===k?`aria-sort="${WL.dir<0?'descending':'ascending'}"`:''} scope="col">${l}</th>`;
  const fcols = WL.model==='v1'
    ? [['su','Structural upside'],['pc','Planning clarity'],['dl','Dealability'],['ie','Info edge']]
    : Object.entries(V2_LABEL).map(([k,l])=>[k,l.split(' ')[0].replace('-',' ')]);
  const fShort={rg:'Residual gap',pc:'Planning',of:'Owner feasibility',evc:'End value',dl:'Dealability',ie:'Info edge',acc:'Capital'};
  const sb=v=>v===null?'<span class="muted">–</span>':`<span class="score">${fmt2(v)}</span><span class="scorebar"><i style="width:${v*10}%"></i></span>`;
  const body=rows.map(r=>{
    const s=r.s;
    const fc = WL.model==='v1'
      ? fcols.map(([k])=>`<td class="num">${s.v1?fmt1(s.v1[k]):'–'}</td>`).join('')
      : fcols.map(([k])=>r.f?`<td class="num ${r.f[k].src==='MODEL_OUTPUT'?'score':'muted'}" title="${esc(r.f[k].why)}">${fmt1(r.f[k].v)}</td>`:'<td class="num muted">–</td>').join('');
    return `<tr class="link" data-id="${s.id}">
      <td class="rank">${rankOf(r)}</td>
      <td class="site"><b>${esc(s.name)}</b><span class="muted">${esc(s.place)}, ${esc(s.ref)}</span></td>
      ${fc}
      <td>${sb(WL.model==='v1'?r.v1:r.v2)}</td>
      <td class="num muted">${(WL.model==='v1'?r.v2:r.v1)===null?'–':fmt2(WL.model==='v1'?r.v2:r.v1)}</td>
      <td class="num ${r.m?sgnCls(r.m.rlv):''}">${r.m?fmtM(r.m.rlvAc):'<span class="muted">–</span>'}</td>
      <td class="num ${r.m?sgnCls(r.m.rlv):''}">${r.m?fmtRM(r.m.psf):'<span class="muted">–</span>'}</td>
      <td class="num">${r.m?fmtRM(r.m.be):'<span class="muted">–</span>'}</td>
      <td><span class="chip ${r.os.c}">${r.os.l}</span>${r.m&&r.m.own?`<span class="muted small" style="display:block">pays ${r.os.short}</span>`:''}</td>
      <td class="small" style="min-width:150px">${r.lev?esc(leverText(r.lev)):'<span class="muted">Not underwritten</span>'}</td>
      <td class="small" style="min-width:130px">${r.g?(r.g.mb.own?`<span class="chip ${covCls(r.g.mb.own.coverage)}">${fmtPct(Math.max(0,r.g.mb.own.coverage),0)} covered</span>`:`<span class="${sgnCls(r.g.mb.rlv)}">${fmtM(r.g.mb.rlvAc)}/acre</span>`)+`<span class="muted" style="display:block">PR ${fmt2(r.g.b.pr)} (+${fmtPct(r.g.b.share,0)})</span>`:'<span class="muted">–</span>'}</td>
      <td class="small">${CONF_L[s.conf]}</td>
      <td>${stageTag(s.stage)}</td>
      <td>${verdictTag(s.verdict)}</td>
      <td class="small" style="min-width:180px">${esc(s.trig)}</td>
      <td class="small" style="min-width:260px">${esc(s.next)}</td>
    </tr>`}).join('');
  return `<div class="page">
   ${head('Watchlist','Twenty-one KL redevelopment sites ranked for actionability, not headline land value. Owner economics decide whether a strong planning story is a deal.',
     `<div class="seg" role="group" aria-label="Score model"><button type="button" data-model="v2" aria-pressed="${WL.model==='v2'}">Score V2, owner-aware</button><button type="button" data-model="v1" aria-pressed="${WL.model==='v1'}">Score V1, original</button></div>`)}
   ${heroRule()}
   <div class="sec">
    <div class="sec-head"><h2>Ranked sites</h2><span class="muted">${WL.model==='v2'?'Bold factors come from the live RLV and owner model; grey factors are analyst proxies (hover for the basis). Weights are editable under Method.':'V1 weights: upside 35%, planning 25%, dealability 25%, information edge 15%.'}</span></div>
    <div class="tw"><table id="wl">
     <thead><tr><th scope="col">#</th>${th('name','Site')}${fcols.map(([k,l])=>`<th class="num" scope="col">${WL.model==='v1'?l:fShort[k]}</th>`).join('')}${th('score',WL.model==='v1'?'V1 score':'V2 score')}<th class="num" scope="col">${WL.model==='v1'?'V2':'V1'}</th>${th('rlvAc','RLV / acre','num')}${th('psf','RLV / land sf','num')}${th('be','Breakeven ASP','num')}<th scope="col">Owner density</th><th scope="col">Nearest lever</th><th scope="col">With DBKL incentive</th><th scope="col">Confidence</th>${th('stage','Stage')}<th scope="col">Verdict</th><th scope="col">Trigger</th><th scope="col">Next action</th></tr></thead>
     <tbody>${body}</tbody>
    </table></div>
    <p class="small muted" style="margin-top:10px">RLV columns use each site’s current scenario (base case unless edited in the lab), normalised to 1 acre except Taman Taiping, which uses the 1.289-acre public-map proxy. Per-acre and per-sf figures are unaffected by area.</p>
   </div>
  </div>`;
}
function bindWatchlist(root){
  root.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>{WL.model=b.dataset.model;WL.sort='score';WL.dir=-1;store.set('wl',WL);render()});
  root.querySelectorAll('th.sort').forEach(t=>t.onclick=()=>{const k=t.dataset.k;if(WL.sort===k)WL.dir*=-1;else{WL.sort=k;WL.dir=(k==='name'||k==='stage'||k==='be')?1:-1}store.set('wl',WL);render()});
  root.querySelectorAll('tr.link').forEach(r=>r.onclick=e=>{if(e.target.closest('a'))return;go('#/site/'+r.dataset.id)});
}

