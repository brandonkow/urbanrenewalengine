/* ---------- persistence (per-viewer convenience) ---------- */
const store={
  get(k,d){try{const v=localStorage.getItem('klure:'+k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem('klure:'+k,JSON.stringify(v))}catch(e){}if(['state','saved','checks','v2w','deal','asm','cal','glob','inc','mc','massing','transactions','cashflow','diligence'].includes(k))schedulePush()}
};

