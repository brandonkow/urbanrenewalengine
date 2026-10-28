/* ---------- DBKL 2026 guideline: models ---------- */
function covCls(v){return v===null||v===undefined||!isFinite(v)?'na':v>=1?'ok':v>=.8?'warn':'bad'}
function modelB(id,share,dc){const x=JSON.parse(JSON.stringify(st(id)));x.prUp=share;if(dc!==undefined)x.dc=dc;applyOwnerDerived(x);return model(x)}
function catA(id,k,ov){const x=st(id),d=incP(id);return x&&d?URECore.categoryA({...x,dc:dcRate(x)},{...d,...ov},k):null}
function catAAll(id){const all=G26.catA.map(c=>catA(id,c.k)).filter(Boolean);if(!all.length)return null;return {all,best:all.reduce((a,q)=>q.rlv>a.rlv?q:a)}}
function g26Row(id,withA){
  const s=SITE[id]; if(!s||!s.rlv) return null; const b=incB(id); if(!b) return null;
  const x=st(id), mx=incMax(id); return {s,x,b,mx,m0:model(x),mb:modelB(id,b.share),mc:modelB(id,mx.share),A:withA?catAAll(id):null};
}
function hav(a,b,c,d){const r=Math.PI/180,dl=(c-a)*r,dn=(d-b)*r,q=Math.sin(dl/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(dn/2)**2;return 2*6371*Math.asin(Math.sqrt(q))}
function nearestStation(s){let best=null;RAIL.forEach(r=>r.st.forEach(p=>{const km=hav(s.lat,s.lon,p[1],p[2]);if(!best||km<best.km)best={n:p[0],line:r.n,km}}));return best}
function tpzRead(km){return km<=.4?['Possible TPZ','ok','inside a possible TPZ']:km<=.6?['Possible TIZ','warn','inside a possible TIZ']:km<=.7?['Near the TIZ edge','warn','just outside the TIZ']:['Outside transit zones','na','outside both zones']}
const G26_COND=[
 'Discretionary: each grant goes through the objection process (Kaedah 3), technical studies (TIA, EIA, SIA) where relevant, JKPS where a site cannot meet them, and the Mayor (6.0(7), 6.0(13)).',
 'No double privilege, for example a phase of a scheme that already received a redevelopment incentive (6.0(8)).',
 'Category A cannot add transit-zone, lot-amalgamation or affordable-housing-policy incentives. Category B cannot add lot amalgamation (6.0(1)–(2)).',
 'Eligibility is judged on the buildings standing at application, with a five-year lookback on records DBKL can verify (6.0(3)).',
 'Gazetted or reserved community-facility and open-space sites, and institutional sites already given a plot ratio in PTKL2040, are excluded (6.0(4)).',
 'Development-charge and ISF relief covers only replacement, MADANI and RMM components, under the charge policy in force (6.0(6)).',
 'Partial redevelopment is tied to the share demolished or altered, at most 50%, and not above the base plot ratio (6.0(9)); the clause is ambiguous.',
 'Not for individually developed shophouse rows: at least two rows and the back lane (6.0(10)).',
 'Subject to the gazetted land-use zone and intensity. The applicant reports on site eligibility, infrastructure and utility capacity, and community facilities (6.0(11)–(12)).'
];

