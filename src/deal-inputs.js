/* ---------- deal inputs ---------- */
const DEAL_DEFAULT={T:4,r:.06,resRent:2000,comRent:8000,reloc:.5,sizing:'value',matchPV:false,ratio:1,oldRes:800,oldCom:1200,waive:false,e:null,feeBasis:'owner',feeRate:.02,promote:.20};
const DEAL_SITE={taiping:{oldRes:1579,oldCom:1540},pantai:{oldRes:1500,resRent:1800},salak:{oldRes:1800,resRent:1500},jinjang_aman:{oldRes:1800,resRent:1400},jinjang_selatan:{oldRes:1800,resRent:1400}};
let DSRC_OV={};
let DEAL=store.get('deal',{});
function dl(id){if(!DEAL[id])DEAL[id]={...DEAL_DEFAULT,...(DEAL_SITE[id]||{})};return DEAL[id]}
const DEAL_SRC={T:'UNDERWRITING_ASSUMPTION',r:'UNDERWRITING_ASSUMPTION',resRent:'UNDERWRITING_ASSUMPTION',comRent:'ASKING_LISTING',reloc:'UNDERWRITING_ASSUMPTION',oldRes:'ASKING_LISTING',oldCom:'ASKING_LISTING',ratio:'UNDERWRITING_ASSUMPTION',feeRate:'UNDERWRITING_ASSUMPTION',promote:'UNDERWRITING_ASSUMPTION',e:'UNDERWRITING_ASSUMPTION'};

