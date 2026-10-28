/* ---------- triggers ---------- */
const TRIGGERS = [
 {site:'taiping',l:'Legal interest count within the supportable maximum',cur:(x)=>x.owner.nConfirmed?x.owner.n:null,op:'<=',thr:(x,m)=>m.own.maxN,f:fmt1,u:'interests',need:'Strata roll (parcel and accessory counts)'},
 {site:'taiping',l:'Official site area covers the owner budget',cur:(x)=>x.areaConfirmed?x.area:null,op:'>=',thr:(x,m)=>m.own.reqArea,f:fmt2,u:'acres',need:'DBKL Site 6 polygon (eMap)'},
 {site:'taiping',l:'Underwritten ASP clears the owner-required ASP',cur:(x)=>x.asp,op:'>=',thr:(x,m)=>m.own.reqASP,f:fmtRM,u:'psf',basis:'scenario'},
 {site:'taiping',l:'Effective PR clears the owner-required PR',cur:(x,m)=>m.epr,op:'>=',thr:(x,m)=>m.own.reqPR,f:fmt2,u:'×',basis:'scenario',need:'PTKL incentive assessment'},
 {site:'taiping',l:'Every interest signed (unanimous consent)',cur:(x)=>{const a=ASM.taiping;if(!a)return null;const it=a.items.slice(0,x.owner.n);return it.filter(q=>q.s===3).length/x.owner.n},op:'>=',thr:()=>1,f:v=>fmtPct(v,0),u:'',basis:'evidence',need:'Start tracking in Assembly'},
 {site:'taiping',l:'DBKL confirms the 50% Category B redevelopment incentive for Site 6',cur:()=>null,op:'==',thr:()=>1,f:()=>'Yes',u:'',need:'Pre-consultation with DBKL’s Unit Pembaharuan Bandar'},
 {site:'taiping',l:'Owner coverage with the DBKL 2026 incentive',cur:()=>{const g=g26Row('taiping');return g&&g.mb.own?g.mb.own.coverage:null},op:'>=',thr:()=>1,f:v=>fmtPct(v,0),u:'',basis:'scenario'},
 {site:'salak',l:'Owner coverage with the DBKL 2026 incentive',cur:()=>{const g=g26Row('salak');return g&&g.mb.own?g.mb.own.coverage:null},op:'>=',thr:()=>1,f:v=>fmtPct(v,0),u:'',basis:'scenario'},
 {site:'salak',l:'DBKL confirms the 30% landed-scheme incentive',cur:()=>null,op:'==',thr:()=>1,f:()=>'Yes',u:'',need:'Pre-consultation with DBKL’s Unit Pembaharuan Bandar'},
 {site:'pantai',l:'Owner coverage with the DBKL 2026 incentive',cur:()=>{const g=g26Row('pantai');return g&&g.mb.own?g.mb.own.coverage:null},op:'>=',thr:()=>1,f:v=>fmtPct(v,0),u:'',basis:'scenario'},
 {site:'salak',l:'Effective PR clears the owner-required PR',cur:(x,m)=>m.epr,op:'>=',thr:(x,m)=>m.own.reqPR,f:fmt2,u:'×',basis:'scenario',need:'PTKL incentive assessment'},
 {site:'rejang',l:'Setapak ASP at or above RM650 psf',cur:(x)=>x.asp,op:'>=',thr:()=>650,f:fmtRM,u:'psf',basis:'scenario'},
 {site:'rejang',l:'ASP clears breakeven',cur:(x)=>x.asp,op:'>=',thr:(x,m)=>m.be,f:fmtRM,u:'psf',basis:'scenario'},
 {site:'rejang',l:'Hard cost at or below breakeven cost',cur:(x)=>x.hc,op:'<=',thr:(x,m)=>m.beHC,f:fmtRM,u:'psf GFA',basis:'scenario'},
 {site:'rejang',l:'Effective PR at or above 4.0',cur:(x,m)=>m.epr,op:'>=',thr:()=>4,f:fmt2,u:'×',basis:'scenario'},
 {site:'rejang',l:'Owner count at or below 32',cur:(x)=>x.owner&&x.owner.nConfirmed?x.owner.n:null,op:'<=',thr:()=>32,f:fmt0,u:'interests',need:'Title and strata search'},
 {site:'salak',l:'Underwritten ASP clears the owner-required ASP',cur:(x)=>x.asp,op:'>=',thr:(x,m)=>m.own.reqASP,f:fmtRM,u:'psf',basis:'scenario'},
 {site:'salak',l:'Lowest observed lot ask at or below the payable land value',cur:()=>122,op:'<=',thr:(x,m)=>m.own.payLpsf,f:fmtRM,u:'psf land',basis:'evidence',note:'Lowest current lot ask; most sit at RM135–203 psf.'},
 {site:'salak',l:'Tuan Straits sells through at RM675+ psf',cur:()=>null,op:'==',thr:()=>1,f:()=>'Yes',u:'',need:'Developer take-up data'},
 {site:'pantai',l:'Effective PR clears the owner-required PR',cur:(x,m)=>m.epr,op:'>=',thr:(x,m)=>m.own.reqPR,f:fmt2,u:'×',basis:'scenario',need:'PTKL incentive assessment'},
 {site:'pantai',l:'Verified lot value at or below the payable land value',cur:(x)=>x.owner.nConfirmed?x.owner.lpsf:null,op:'<=',thr:(x,m)=>m.own.payLpsf,f:fmtRM,u:'psf land',need:'Kampung Pantai lot transactions (NAPIC)'},
 {site:'jinjang_aman',l:'ASP clears breakeven',cur:(x)=>x.asp,op:'>=',thr:(x,m)=>m.be,f:fmtRM,u:'psf',basis:'scenario'},
 {site:'jinjang_selatan',l:'ASP clears breakeven',cur:(x)=>x.asp,op:'>=',thr:(x,m)=>m.be,f:fmtRM,u:'psf',basis:'scenario'},
 {site:'jujur',l:'ASP clears breakeven',cur:(x)=>x.asp,op:'>=',thr:(x,m)=>m.be,f:fmtRM,u:'psf',basis:'scenario'},
 {site:'jujur',l:'Hard cost at or below breakeven cost',cur:(x)=>x.hc,op:'<=',thr:(x,m)=>m.beHC,f:fmtRM,u:'psf GFA',basis:'scenario'},
 {site:'keramat',l:'Observed land ask at or below modelled RLV per land sf',cur:()=>144,op:'<=',thr:(x,m)=>m.psf,f:fmtRM,u:'psf land',basis:'evidence',note:'Lowest observed ask; most asks are RM333–600+ psf.'},
 {site:'angkasa',l:'PR 1:3.5 confirmed in the DCP2 intensity map',cur:()=>null,op:'==',thr:()=>1,f:()=>'Yes',u:'',need:'PTKL DCP2 intensity map'},
 {site:'angkasa',l:'ASP clears breakeven',cur:(x)=>x.asp,op:'>=',thr:(x,m)=>m.be,f:fmtRM,u:'psf',basis:'scenario'}
];
function evalTrigger(t){
  const s=SITE[t.site], x=st(t.site), m=model(x);
  const cur=t.cur(x,m), thr=t.thr(x,m);
  let state;
  if(cur===null||cur===undefined) state='await';
  else if(!isFinite(thr)) state='no';
  else state=(t.op==='>='?cur>=thr:t.op==='<='?cur<=thr:cur===thr)?'met':'no';
  return {cur,thr,state};
}

