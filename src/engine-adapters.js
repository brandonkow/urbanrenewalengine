/* ---------- engine: pure functions ---------- */
// Browser adapters make the legacy global development-charge fallback explicit.
const SF_PER_ACRE=URECore.SF_PER_ACRE;
function calcRLV(x){return URECore.calcRLV({...x,dc:dcRate(x)})}
function model(x){const m=calcRLV(x);m.own=calcOwner(x,m);return m}
function weightedOwnerValue(...args){return URECore.weightedOwnerValue(...args)}
function ownerPackage(...args){return URECore.ownerPackage(...args)}
function ownerBudgetPer(...args){return URECore.ownerBudgetPer(...args)}
function requiredASP(...args){return URECore.requiredASP(...args)}
function requiredPR(...args){return URECore.requiredPR(...args)}
function requiredHC(...args){return URECore.requiredHC(...args)}
function calcOwner(...args){return URECore.calcOwner(...args)}
function densityBand(d){if(d<20)return['Strong','ok'];if(d<=25)return['Workable, sensitive','warn'];if(d<=35)return['Difficult','warn'];return['Weak base case','bad']}
function ownerStatus(m,x){
  if(!m||!m.own) return {l:'Not assessed',c:'na',short:'Not assessed'};
  const r=m.own.coverage, conf=x.owner.nConfirmed, tag=conf?'':(x.owner.mode==='landed'?' (lot values unverified)':' (stress case)');
  const pays=`${fmt1(Math.max(0,Math.min(m.own.maxN,m.own.n)))} of ${m.own.n}`;
  if(r>=1.25) return {l:'Clears'+tag,c:'ok',short:pays};
  if(r>=1) return {l:'Tight'+tag,c:'warn',short:pays};
  if(r>=.8) return {l:'Short'+tag,c:'warn',short:pays};
  return {l:'Fails'+tag,c:'bad',short:pays};
}
function econState(s){
  if(!s.rlv) return 'na';
  const x=st(s.id), m=model(x);
  if(m.rlv<=0) return (m.be-x.asp)/x.asp<=.10?'warn':'bad';
  if(m.own && m.own.coverage<1) return 'warn';
  return 'ok';
}
function suggestVerdict(s,x,m){
  if(!m) return null;
  if(s.prType!=='OFFICIAL_PLANNING') return ['PLANNING_UNCERTAIN','Plot ratio is not yet an official figure.'];
  if(m.rlv<=0){
    const gap=(m.be-x.asp)/x.asp;
    return gap<=.10?['TRIGGER_WATCH',`ASP is ${fmtPct(gap)} below breakeven: within the 10% trigger band.`]:['END_VALUE_TOO_LOW',`ASP is ${fmtPct(gap)} below breakeven.`];
  }
  if(!m.own) return ['CONDITIONAL_HIGH_POTENTIAL','Project residual is positive but owner economics are untested.'];
  const r=m.own.coverage, conf=x.owner.nConfirmed;
  const what=x.owner.mode==='landed'?'lot values are':'the count is';
  if(r>=1.25) return conf?['STRONG_BASE_CASE','Residual covers confirmed interests with a 25%+ margin.']:['CONDITIONAL_HIGH_POTENTIAL',`Residual covers the owners with margin, but ${what} not confirmed.`];
  if(r>=1) return ['CONDITIONAL_HIGH_POTENTIAL','Residual covers owners with under 25% margin.'];
  if(r<.6) return ['OWNER_DENSITY_BLOCKED',`The residual covers only ${fmtPct(Math.max(0,r),0)} of the owner budget: too far short for count uncertainty to rescue it.`];
  return conf?['OWNER_DENSITY_BLOCKED','Confirmed interests exceed what the residual can pay.']:['CONDITIONAL_HIGH_POTENTIAL',`Residual pays ${fmt1(m.own.maxN)} of ${m.own.n} interests, but ${what} unconfirmed.`];
}

