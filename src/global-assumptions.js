/* ---------- global assumptions ---------- */
let GLOB = store.get('glob',{dc:0});
function dcRate(x){return (x&&x.dc!==undefined&&x.dc!==null)?x.dc:(GLOB&&isFinite(GLOB.dc)?GLOB.dc:0)}

