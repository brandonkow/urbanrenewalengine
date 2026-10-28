/* ---------- account sync (db, private per viewer) ---------- */
const SYNC_KEYS=['state','saved','checks','v2w','deal','asm','cal','glob','inc','mc','massing','transactions','cashflow','diligence','versions'];
const SYNC={mode:'local',doc:null,pushing:false,dirty:false,t:0,lastPushed:null};
function syncLabel(){
  const el=document.getElementById('syncState'); if(!el) return;
  el.textContent={local:'Saved in this browser only',connecting:'Connecting to your account…',synced:'Saved privately to your account',saving:'Saving to your account…',readonly:'View only: changes stay in this browser'}[SYNC.mode];
  el.dataset.mode=SYNC.mode;
}
function setSync(m){SYNC.mode=m;syncLabel()}
function workspaceBody(){
  return {v:2,updatedAt:store.get('updatedAt',new Date().toISOString()),
    state:STATE,saved:store.get('saved',[]),checks:CHECKS,v2w:V2W,deal:DEAL,asm:ASM,cal:CAL,glob:GLOB,inc:INC,mc:MC,massing:MASS,transactions:TX,cashflow:CF,diligence:DD,versions:SV};
}
function schedulePush(){
  try{localStorage.setItem('klure:updatedAt',JSON.stringify(new Date().toISOString()))}catch(e){}
  if(!SYNC.doc) return;
  clearTimeout(SYNC.t); SYNC.t=setTimeout(pushNow,900);
}
async function pushNow(){
  if(!SYNC.doc||SYNC.mode==='readonly') return;
  if(SYNC.pushing){SYNC.dirty=true;return}
  SYNC.pushing=true; setSync('saving');
  const body=JSON.parse(JSON.stringify(workspaceBody())); SYNC.lastPushed=body.updatedAt;
  try{await SYNC.doc.set(body); setSync('synced')}
  catch(e){
    if(e&&e.code==='unavailable'){await new Promise(r=>setTimeout(r,800+Math.random()*800));try{await SYNC.doc.set(body);setSync('synced')}catch(e2){setSync('local')}}
    else if(e&&(e.code==='invalid_argument'||e.code==='not_granted')) setSync('readonly');
    else if(e&&e.code==='quota_exceeded'){setSync('local');toast('Account storage is full; changes stay in this browser')}
    else setSync('local');
  }
  finally{SYNC.pushing=false; if(SYNC.dirty){SYNC.dirty=false;pushNow()}}
}
function applyRemote(b){
  if(!b||typeof b!=='object') return;
  if(Object.hasOwn(b,'versions')){try{const next=svClean(b.versions);localStorage.setItem('klure:versions',JSON.stringify(next));SV=next;SVNOTICE=''}catch(e){toast('Workspace unchanged: '+e.message);return false}}
  const raw=(k,v)=>{try{localStorage.setItem('klure:'+k,JSON.stringify(v))}catch(e){}};
  if(b.state){STATE=JSON.parse(JSON.stringify(b.state));raw('state',STATE)}
  if(b.saved){raw('saved',b.saved)}
  if(b.checks){CHECKS=JSON.parse(JSON.stringify(b.checks));raw('checks',CHECKS)}
  if(b.v2w){V2W=JSON.parse(JSON.stringify(b.v2w));raw('v2w',V2W)}
  if(b.deal){DEAL=JSON.parse(JSON.stringify(b.deal));raw('deal',DEAL)}
  if(b.asm){ASM=JSON.parse(JSON.stringify(b.asm));raw('asm',ASM)}
  if(b.cal){CAL=JSON.parse(JSON.stringify(b.cal));raw('cal',CAL)}
  if(b.glob){GLOB=JSON.parse(JSON.stringify(b.glob));raw('glob',GLOB)}
  if(b.inc){INC=JSON.parse(JSON.stringify(b.inc));raw('inc',INC)}
  if(b.mc&&typeof b.mc==='object'){MC=JSON.parse(JSON.stringify(b.mc));raw('mc',MC)}
  if(b.massing&&typeof b.massing==='object'&&!Array.isArray(b.massing)){MASS=JSON.parse(JSON.stringify(b.massing));raw('massing',MASS)}
  if(Object.hasOwn(b,'transactions')){TX=txClean(b.transactions,reviewToday());raw('transactions',TX)}
  if(Object.hasOwn(b,'cashflow')){CF=cfClean(b.cashflow);raw('cashflow',CF)}
  if(Object.hasOwn(b,'diligence')){const d=ddClean(b.diligence,reviewToday());DD=d.data;DDNOTICE=d.rejected;raw('diligence',DD)}
  if(b.updatedAt) raw('updatedAt',b.updatedAt);
  const a=document.activeElement; if(a&&a.type==='range') return; // don't yank a slider mid-drag
  render();return true;
}
async function initSync(){
  if(!(window.claude&&typeof window.claude.use==='function')){setSync('local');return}
  setSync('connecting');
  try{
    const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
    if(!db||!user){setSync('local');return}
    const uid=await user.id(); if(!uid){setSync('local');return}
    const doc=db.doc('data/users/'+uid+'/workspace');
    const snap=await doc.get();
    SYNC.doc=doc;
    const localAt=store.get('updatedAt',null);
    if(snap.exists){
      const b=snap.data();
      if(localAt&&b.updatedAt&&localAt>b.updatedAt) await pushNow(); else applyRemote(b);
    } else await pushNow();
    if(SYNC.mode!=='readonly') setSync('synced');
    doc.onSnapshot(sn=>{
      if(!sn.exists||sn.metadata.hasPendingWrites) return;
      const b=sn.data(); if(!b||b.updatedAt===SYNC.lastPushed) return;
      const la=store.get('updatedAt',null); if(la&&b.updatedAt&&b.updatedAt<=la) return;
      applyRemote(b);
    },()=>setSync('local'));
  }catch(e){setSync('local')}
}


