import {SF_PER_ACRE,ownerBudgetPer} from './engine.js';
function dcRate(x){return x?.dc??0}
const G26={
  name:'Garis Panduan Insentif Pelaksanaan Pembangunan Semula Kuala Lumpur (2026), Pindaan Pertama',
  inForce:'In force 15 June 2026; First Amendment in force 1 October 2026',
  cap:.70, residing:.30, openMax:.10, tpzMax:.20,
  redev:[
    {v:.50,t:'Whole scheme with permanent structures',d:'Jadual 5.2.1: multi-storey strata schemes (DBKL or private housing not fit for occupation, or an old scheme identified for redevelopment), or single-owner buildings of 11 storeys and above. Expects replacement units, transit housing and full demolition.'},
    {v:.30,t:'Replanning old, dilapidated, abandoned or squatter areas',d:'Jadual 5.2.2: landed schemes; abandoned projects over 3 years old; former landfill, sewage, depot or institutional sites; squatter areas with relocation costs.'},
    {v:.15,t:'Replanning old or dilapidated areas (minor)',d:'Jadual 5.2.3: temporary structures over 10 years old; single lots or buildings of up to 3 storeys (2 acres outside the city centre, 20,000 sf inside it); squatters settled by one-off payment.'},
    {v:0,t:'Not eligible',d:'For example, gazetted community-facility, open-space or institutional sites.'}],
  catA:[{k:'I',ctl:1,ose:1400},{k:'II',ctl:.5,ose:1200},{k:'III',ctl:.3,ose:1000},{k:'IV',ctl:.2,ose:800}],
  bigAcres:10, mBig:.5, mSmall:.3,
  tpzDraft:{tpz:[.30,.20,.10,.05],tiz:[.20,.15,.10,.05]}
};
const AFF={madani:{p:200000,sf:750},rmm:{p:300000,sf:900}};
function incResOK(s){return !(s&&s.zone&&/^R/.test(s.zone))}
function g26Share(c){const sub=c.redev+c.res+c.open, comp=sub*c.elig, raw=comp+c.tpz;return {sub,comp,raw,share:Math.min(raw,G26.cap),capped:raw>G26.cap+1e-12}}
function categoryB(s,p){
  if(!s||!s.pr||!p)return null;
  const res=incResOK(s)?Math.min(p.residing||0,G26.residing):0, open=Math.max(0,Math.min(p.open||0,G26.openMax)), tpz=Math.max(0,Math.min(p.tpz||0,G26.tpzMax));
  const r=g26Share({redev:p.redev,res,open,tpz,elig:p.elig});
  return {p,res,open,tpz,sub:r.sub,comp:r.comp,raw:r.raw,share:r.share,capped:r.capped,base:s.pr,incPR:r.share*s.pr,pr:s.pr*(1+r.share)};
}

function categoryA(x,p,k){
  const c=G26.catA.find(z=>z.k===k);if(!x||!p||!c)return null;
  const land=x.area*SF_PER_ACRE, o=x.owner;
  const U=Math.max(0,Math.floor(c.ose*x.area/p.ppu+1e-9)), G=o?Math.min(o.n,U):0;
  const need=Math.max(0,Math.ceil(c.ctl*U-1e-9)), aff=Math.max(0,need-G), big=x.area>=G26.bigAcres||!!p.big, ms=big?G26.mBig:G26.mSmall;
  const M=Math.round(aff*ms), R=aff-M, F=Math.max(0,U-G-aff);
  const sF=p.unitSf, mkt=(F+G)*sF, affNfa=M*AFF.madani.sf+R*AFF.rmm.sf, nfa=mkt+affNfa, gfa=nfa/x.eff, epr=gfa/land;
  const gdvAff=M*AFF.madani.p+R*AFF.rmm.p, gdv=mkt*x.asp+gdvAff;
  const gp=x.stat+x.sm+x.fin+x.demo+x.profit, cc=x.hc*(1+x.pf+x.cont), per=x.asp*x.eff*(1-gp)-cc;
  const dcr=dcRate(x), dc=dcr*Math.max(0,gfa-land*x.pr)*(nfa>0?F*sF/nfa:0)*Math.max(0,per);
  const rlv=gdv-gfa*cc-gdv*gp-dc, budget=o?o.n*ownerBudgetPer(o):null;
  return {k,ctl:c.ctl,ose:c.ose,p,U,G,need,aff,big,ms,M,R,F,mkt,affNfa,nfa,gfa,epr,gdv,gdvAff,affLoss:affNfa*x.asp-gdvAff,dc,rlv,rlvAc:rlv/x.area,
    budget,cov:budget?rlv/budget:null,per:o?ownerBudgetPer(o):null,ctlActual:U>0?(G+aff)/U:0,unhoused:o?Math.max(0,o.n-U):0};
}

export {G26,AFF,incResOK,g26Share,categoryB,categoryA};
