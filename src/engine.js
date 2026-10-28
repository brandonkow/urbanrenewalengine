// Pure financial calculations. All assumptions enter through x; no browser state.
function dcRate(x){return x?.dc??0}
const SF_PER_ACRE = 43560;
function calcRLV(x){
  const land=x.area*SF_PER_ACRE, epr=x.pr*(1+x.prUp), gfa=land*epr, sal=gfa*x.eff, gdv=sal*x.asp;
  const hard=gfa*x.hc, pfee=hard*x.pf, cont=hard*x.cont;
  const stat=gdv*x.stat, sm=gdv*x.sm, fin=gdv*x.fin, demo=gdv*x.demo, prof=gdv*x.profit;
  const gdvPct=x.stat+x.sm+x.fin+x.demo+x.profit;
  const k=x.eff*(1-gdvPct);           // residual per RM of ASP per GFA sf
  const c=x.hc*(1+x.pf+x.cont);       // cost per GFA sf
  const per=x.asp*k-c;                // residual per GFA sf
  const dcr=dcRate(x), incGFA=Math.max(0,gfa-land*x.pr);
  const dc=dcr*Math.max(0,incGFA*per); // development charge on the value the incentive GFA adds
  const rlv=gdv-hard-pfee-cont-stat-sm-fin-demo-prof-dc;
  const E=epr-dcr*Math.max(0,epr-x.pr); // PR that still earns residual after the charge
  const be=c/k;                        // breakeven ASP (the charge only applies when per > 0)
  const beHC=(x.asp*k)/(1+x.pf+x.cont);// breakeven hard cost at current ASP
  return {land,epr,E,gfa,incGFA,sal,gdv,hard,pfee,cont,stat,sm,fin,demo,prof,dc,dcr,rlv,rlvAc:rlv/x.area,psf:rlv/land,k,c,per,be,beHC,
    stack:[['GDV',gdv],['Hard cost',-hard],['Professional fees',-pfee],['Contingency',-cont],['Statutory / infrastructure',-stat],['Sales & marketing',-sm],['Finance',-fin],['Demolition / relocation',-demo],['Developer profit',-prof]].concat(dc>0?[['Development charge on incentive GFA',-dc]]:[])};
}
function weightedOwnerValue(o){return o.res*(1-o.cs)+o.com*o.cs}
function ownerPackage(o){return weightedOwnerValue(o)*(1+o.up)}
function ownerBudgetPer(o){return ownerPackage(o)*(1+(o.hold||0))}
function requiredASP(x,m,n,o){const need=n*ownerBudgetPer(o)/m.land;return (need/m.E+m.c)/m.k}
function requiredPR(x,m,n,o){
  const need=n*ownerBudgetPer(o)/m.land, per=x.asp*m.k-m.c; if(per<=0) return Infinity;
  let r=need/per; const d=m.dcr||0;
  if(r>x.pr&&d>0){ if(d>=1) return Infinity; r=(r-d*x.pr)/(1-d) }
  return r;
}
function requiredHC(x,m,need){return (x.asp*m.k-need/m.E)/(1+x.pf+x.cont)}
function calcOwner(x,m){
  const o=x.owner; if(!o) return null;
  const w=weightedOwnerValue(o), pkg=ownerPackage(o), per=ownerBudgetPer(o);
  const n=o.n, reqTotal=n*per;
  return {w,pkg,per,n,reqTotal,
    maxN:m.rlv>0?m.rlv/per:0,
    coverage:m.rlv/reqTotal,
    premium:m.rlv/(n*(1+(o.hold||0)))/w-1,
    reqASP:requiredASP(x,m,n,o),
    reqPR:requiredPR(x,m,n,o),
    reqArea:m.rlvAc>0?reqTotal/m.rlvAc:Infinity,
    density:n/x.area,
    payLpsf:o.mode==='landed'?m.rlv/(x.area*SF_PER_ACRE*o.net)/((1+o.up)*(1+(o.hold||0))):null,
    maxPerAcre:m.rlvAc>0?m.rlvAc/per:0};
}
function model(x){const m=calcRLV(x);m.own=calcOwner(x,m);return m}

function dealCalc(x,m,d,nOv){
  const o={...x.owner}; if(nOv!==undefined) o.n=nOv;
  const n=o.n, Nc=n*o.cs, Nr=n-Nc, h=1+(o.hold||0);
  const w=weightedOwnerValue(o), tot=n*w;
  const pkR=o.res*(1+o.up)*h, pkC=o.com*(1+o.up)*h, paid=Nr*pkR+Nc*pkC;
  const rentG=d.T*12*(Nr*d.resRent+Nc*d.comRent), credit=Math.min(rentG,d.reloc*m.demo), rent=rentG-credit;
  const disc=Math.pow(1+d.r,d.T), asp=x.asp;
  const fee=(consid)=>d.feeBasis==='gdv'?d.feeRate*m.gdv:d.feeRate*consid;
  const fin=(S)=>{S.fee=fee(S.consid);S.after=S.surplus-S.fee;S.fundable=S.after>=0;S.prom=Math.max(0,S.after)*d.promote;S.payoff=S.fundable?S.fee+S.prom:0;S.margin=(x.profit*m.gdv+S.surplus)/m.gdv;return S};
  // A: cash buyout today
  const A=fin({key:'A',consid:paid,surplus:m.rlv-paid,upfront:paid,perR:pkR,perC:pkC,upR:pkR/o.res-1,upC:o.com?pkC/o.com-1:null,maxUp:m.rlv/(tot*h)-1,rent:0});
  A.pvR=A.upR; A.pvC=A.upC;
  // B: replacement units at completion
  const mult=d.matchPV?disc:1;
  const aR=d.sizing==='value'?pkR*mult/asp:d.oldRes*d.ratio;
  const aC=d.sizing==='value'?(o.com?pkC*mult/asp:0):d.oldCom*d.ratio;
  const R=Nr*aR+Nc*aC, VR=R*asp;
  const B=fin({key:'B',aR,aC,R,VR,fits:R<=m.sal,consid:VR,surplus:m.rlv-VR+x.sm*VR+(d.waive?x.profit*VR:0)-rent,upfront:0,rent,
    perR:aR*asp,perC:aC*asp,maxUp:(m.rlv-rent)/(tot*h*(1-x.sm-(d.waive?x.profit:0)))-1});
  B.upR=B.perR/o.res-1; B.upC=o.com?B.perC/o.com-1:null; B.pvR=B.perR/disc/o.res-1; B.pvC=o.com?B.perC/disc/o.com-1:null;
  B.ratioR=aR/d.oldRes; B.ratioC=aC/d.oldCom;
  // C: JV landowner entitlement (% of GDV) at completion
  const eReq=paid/m.gdv, e=(d.e===null||d.e===undefined)?eReq:d.e, pay=e*m.gdv;
  const C=fin({key:'C',eReq,e,eMax:(m.rlv-rent)/m.gdv,consid:pay,surplus:m.rlv-pay-rent,upfront:0,rent,
    perR:pay*o.res/tot,perC:pay*o.com/tot,maxUp:(m.rlv-rent)/tot-1});
  C.upR=pay/tot-1; C.upC=o.com?C.upR:null; C.pvR=(1+C.upR)/disc-1; C.pvC=o.com?C.pvR:null;
  return {A,B,C,rent,rentG,credit,disc,n,Nr,Nc,pkR,pkC,paid};
}
function maxInterests(x,m,d,key){
  let best=0;
  for(let n=1;n<=300;n++){const r=dealCalc(x,m,{...d,e:null},n)[key];if(r.after>=0)best=n;else if(n>best+25)break}
  return best;
}

function applyOwnerDerived(x){
  if(!x||!x.owner) return;
  const o=x.owner;
  if(o.mode==='landed'){o.n=Math.max(1,Math.round(x.area*SF_PER_ACRE*o.net/o.lot));o.res=o.lot*o.lpsf;o.cs=0;o.com=0;return}
  applyForm(x);
}
function applyForm(x){
  const f=x.owner&&x.owner.form; if(!f||!f.on) return;
  x.owner.n=Math.round(f.bays*f.levels);
  x.owner.cs=f.levels>0?1/f.levels:0;
}


export {SF_PER_ACRE,calcRLV,weightedOwnerValue,ownerPackage,ownerBudgetPer,requiredASP,requiredPR,requiredHC,calcOwner,model,dealCalc,maxInterests,applyOwnerDerived,applyForm};
