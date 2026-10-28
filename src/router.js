/* ---------- router ---------- */
function route(){const h=(location.hash||'#/watchlist').slice(2).split('/');return {p:h[0]||'watchlist',a:h[1],b:h[2],c:h[3]}}
let LAST='';
function render(){
  const r=route(), v=document.getElementById('view');
  const views={watchlist:[viewWatchlist,bindWatchlist],map:[viewMap,bindMap],site:[()=>viewSite(r.a||'taiping'),bindSite],lab:[()=>viewLab(r.a),bindLab],deal:[()=>viewDeal(r.a),bindDeal],land:[()=>viewLand(r.a),bindLand],review:[viewReview,bindReview],compare:[viewCompare,bindCompare],cashflow:[()=>viewCashflow(r.a),bindCashflow],transactions:[()=>viewTransactions(r.a),bindTransactions],calibration:[viewCalibration,bindCalibration],board:[viewBoard,bindBoard],incentive:[()=>viewIncentive(r.a),bindIncentive],assembly:[()=>viewAssembly(r.a),bindAssembly],pack:[()=>viewPack(r.a,r.b,r.c),bindPack],odds:[()=>viewOdds(r.a),bindOdds],massing:[()=>viewMassing(r.a),bindMassing],triggers:[viewTriggers,()=>{}],diligence:[()=>viewDiligence(r.a),bindDiligence],sources:[viewSources,bindSources],universe:[viewUniverse,bindUniverse],method:[viewMethod,bindMethod]};
  const [fn,bind]=views[r.p]||views.watchlist;
  const y=window.scrollY, same=LAST===location.hash;
  const fid=document.activeElement&&document.activeElement.id;
  v.innerHTML=fn(); bind(v);
  if(same&&fid){const el=document.getElementById(fid);if(el&&el.type==='range')el.focus({preventScroll:true})}
  document.querySelectorAll('#nav button').forEach(b=>b.setAttribute('aria-current',b.dataset.p===r.p?'page':'false'));
  if(same) window.scrollTo(0,y); else {window.scrollTo(0,0);v.focus({preventScroll:true})}
  LAST=location.hash;
}
document.getElementById('nav').innerHTML=NAV.map(([p,l,sm])=>`<li><button type="button" data-p="${p}">${l}<small>${sm}</small></button></li>`).join('');
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{const p=b.dataset.p;go('#/'+(p==='site'?'site/'+(MAP.sel||'taiping'):p==='lab'?'lab/'+LAB.site:p==='deal'?'deal/'+DSEL:p==='assembly'?'assembly/'+ASEL:p==='incentive'?'incentive/'+ISEL:p==='pack'?`pack/${PSEL}/${PLANG}/${PSC}`:p==='odds'?'odds/'+MCSEL:p==='massing'?'massing/'+MSEL:p))});
window.addEventListener('hashchange',render);
(function theme(){
  const t=store.get('theme',null); if(t) document.documentElement.setAttribute('data-theme',t);
  document.getElementById('themeBtn').onclick=()=>{
    const cur=document.documentElement.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    const n=cur==='dark'?'light':'dark'; document.documentElement.setAttribute('data-theme',n); store.set('theme',n);
  };
})();
render();
syncLabel();
initSync();

