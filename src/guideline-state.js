/* ---------- DBKL redevelopment incentive guideline (2026), First Amendment Oct 2026 ---------- */
const {G26,AFF}=URECore;
const INC_DEFAULT={
 taiping:{redev:.5,unitSf:1000,why:'Strata flats on a PTKL specific redevelopment site: Jadual 5.2.1.'},
 angkasa:{redev:.5,unitSf:900,why:'Strata flats on the JWP redevelopment list: Jadual 5.2.1. Its base PR 3.5 is itself provisional.'},
 salak:{redev:.3,unitSf:850,why:'Landed village scheme: Jadual 5.2.2. The 50% tier is arguable if DBKL treats it as housing not fit for occupation.'},
 pantai:{redev:.3,unitSf:850,why:'Landed village scheme: Jadual 5.2.2.'},
 keramat:{redev:.3,unitSf:900,why:'Landed kampung: Jadual 5.2.2.'},
 jinjang_aman:{redev:.3,unitSf:850,why:'Landed new village: Jadual 5.2.2.'},
 jinjang_selatan:{redev:.3,unitSf:850,why:'Landed new village: Jadual 5.2.2.'},
 rejang:{redev:.3,unitSf:850,why:'Cluster housing treated as a landed scheme: Jadual 5.2.2 (classification unverified).'},
 jujur:{redev:.3,unitSf:850,why:'Housing treated as a landed scheme: Jadual 5.2.2 (classification unverified).'}
};
let INC=store.get('inc',{});
let MC=store.get('mc',{}); // owner-test odds ranges (see viewOdds)
function incDefault(id){const d=INC_DEFAULT[id];return d?{redev:d.redev,residing:0,open:0,tpz:0,elig:1,ppu:4,unitSf:d.unitSf,big:false}:null}
function incP(id){if(!INC_DEFAULT[id])return null;if(!INC[id]||typeof INC[id]!=='object')INC[id]=incDefault(id);const p=INC[id],d=incDefault(id);for(const k in d)if(p[k]===undefined||p[k]===null||(typeof d[k]==='number'&&!isFinite(p[k])))p[k]=d[k];return p}
function incEdited(id){const a=INC[id],b=incDefault(id);if(!a||!b)return false;return Object.keys(b).some(k=>Math.abs((+a[k])-(+b[k]))>1e-9)}
function incTag(id){return incEdited(id)?'as set':'as read'}
function incResOK(s){return URECore.incResOK(s)}
function g26Share(c){return URECore.g26Share(c)}
function incB(id,ov){const d=incP(id);return d?URECore.categoryB(SITE[id],{...d,...ov}):null}

function incMax(id){return incB(id,{residing:G26.residing,open:G26.openMax,tpz:G26.tpzMax})}

