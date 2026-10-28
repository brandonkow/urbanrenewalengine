/* ---------- scenario presets ---------- */
const PRESET = {
  down:{i:0,eff:.75,prUp:0,hcMult:1.10,profit:.22,l:'Downside'},
  base:{i:1,eff:.78,prUp:0,hcMult:1.00,profit:.20,l:'Base'},
  up:{i:2,eff:.80,prUp:.25,hcMult:.95,profit:.18,l:'Upside'},
  g26:{i:1,eff:.78,prUp:0,hcMult:1.00,profit:.20,l:'DBKL 2026'}
};
const FIXED = {pf:.08,cont:.05,stat:.03,sm:.03,fin:.05,demo:.02};
const GENERIC_OWNER = {res:400000,com:0,cs:0,up:.30,n:40,hold:0,nConfirmed:false,placeholder:true};

function presetState(s,key='base'){
  if(!s.rlv) return null;
  const p=PRESET[key];
  const g=key==='g26'?incB(s.id):null;
  const x={sc:key, area:s.area?s.area.ac:1, areaConfirmed:false, asp:s.rlv.asp[p.i], pr:s.pr, prUp:g?g.share:p.prUp, eff:p.eff,
    hc:+(s.rlv.hc*p.hcMult).toFixed(2), ...FIXED, profit:p.profit,
    owner:s.owner?JSON.parse(JSON.stringify(s.owner)):null};
  applyOwnerDerived(x);
  return x;
}
let STATE = store.get('state',{});
function st(id){
  const s=SITE[id]; if(!s.rlv) return null;
  if(!STATE[id]) STATE[id]=presetState(s,'base');
  return STATE[id];
}
function saveState(){store.set('state',STATE)}

