/* ---------- scoring ---------- */
const V1W = {su:.35,pc:.25,dl:.25,ie:.15};
const V2W_DEFAULT = {rg:.25,pc:.15,of:.20,evc:.15,dl:.10,ie:.10,acc:.05};
let V2W = store.get('v2w',{...V2W_DEFAULT});
const V2_LABEL = {rg:'Residual-value gap',pc:'Planning certainty',of:'Owner-density feasibility',evc:'End-value confidence',dl:'Dealability / assembly',ie:'Information edge',acc:'Capital accessibility'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function v2Factors(s){
  if(!s.v2||(!s.v1&&s.v2.pc===undefined)) return null;
  const v1=s.v1||{su:null,pc:s.v2.pc,dl:s.v2.dl,ie:s.v2.ie};
  const x=s.rlv?st(s.id):null, m=x?model(x):null;
  const f={};
  f.rg=m?{v:clamp(5+m.psf/100,0,10),src:'MODEL_OUTPUT',why:`5 + RLV per land sf / 100 (RM${fmt0(m.psf)} psf)`}:{v:(v1.su||6)*.7,src:'INFERRED',why:'No RLV yet: V1 structural upside × 0.7 haircut'};
  f.pc={v:s.prType==='OFFICIAL_PLANNING'?v1.pc:Math.min(v1.pc,6.5),src:'INFERRED',why:s.prType==='OFFICIAL_PLANNING'?'V1 planning clarity; PR is official':'V1 planning clarity capped at 6.5 because PR is not official'};
  f.of=(m&&m.own)?{v:clamp(7*m.own.coverage,0,10),src:'MODEL_OUTPUT',why:`7 × coverage (${fmt2(m.own.coverage)})`}:{v:s.v2.own,src:'INFERRED',why:'Analyst proxy from lot count and ownership type'};
  f.evc={v:s.v2.evc,src:'INFERRED',why:'Analyst judgement on depth and freshness of end-value evidence'};
  f.dl={v:v1.dl,src:'INFERRED',why:s.v1?'V1 dealability score':'Provisional: 30,000 sf sub-areas allow small assemblies'};
  f.ie={v:v1.ie,src:'INFERRED',why:s.v1?'V1 information-edge score':'Provisional: absent from the original Top 20'};
  f.acc={v:s.v2.acc,src:'INFERRED',why:'Analyst judgement: smaller ticket and cleaner title = more accessible'};
  return f;
}
function v2Score(s){const f=v2Factors(s);if(!f)return null;let t=0,w=0;for(const k in V2W){t+=V2W[k]*f[k].v;w+=V2W[k]}return w?t/w:null}

