// Conservative parcel registry. Review assertions are not a survey or approval.
export const PARCEL_SCHEMA='klure.parcels.v1';
function obj(v,keys,label){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!keys.includes(k)))throw Error(label+': unexpected fields');}
function str(v,max,label,empty=false){if(typeof v!=='string'||v.length>max||(!empty&&!v.trim()))throw Error(label+': invalid text');return v;}
function day(v,empty=false){if(empty&&v==='')return v;if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v)throw Error('Invalid date');return v;}
function url(v){str(v,2000,'Source URL');let u;try{u=new URL(v)}catch{throw Error('Invalid source URL')}if(u.protocol!=='https:'||u.username||u.password)throw Error('Sources require HTTPS without credentials');return v;}
function one(v,values,label){if(!values.includes(v))throw Error('Invalid '+label);return v;}
function cross(a,b,c){return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);}
function touches(a,b,c,d){
 const eps=1e-12, abC=cross(a,b,c),abD=cross(a,b,d),cdA=cross(c,d,a),cdB=cross(c,d,b);
 const on=(p,q,r)=>Math.abs(cross(p,q,r))<=eps&&r[0]>=Math.min(p[0],q[0])-eps&&r[0]<=Math.max(p[0],q[0])+eps&&r[1]>=Math.min(p[1],q[1])-eps&&r[1]<=Math.max(p[1],q[1])+eps;
 return (abC*abD<0&&cdA*cdB<0)||on(a,b,c)||on(a,b,d)||on(c,d,a)||on(c,d,b);
}
export function validateParcelGeometry(g){
 obj(g,['type','coordinates'],'Geometry');
 // Unsupported shapes fail explicitly. Never discard holes or disconnected parts.
 if(g.type!=='Polygon'||!Array.isArray(g.coordinates)||g.coordinates.length!==1)throw Error('Only simple single-ring Polygon supported; do not remove holes or parts');
 const ring=g.coordinates[0];
 if(!Array.isArray(ring)||ring.length<4||ring.length>1000)throw Error('Polygon requires 4–1000 positions');
 for(const p of ring)if(!Array.isArray(p)||p.length!==2||p.some(n=>typeof n!=='number'||!Number.isFinite(n))||p[0]<101.5||p[0]>101.9||p[1]<2.9||p[1]>3.4)throw Error('Coordinates must be WGS84 longitude, latitude within Kuala Lumpur study extent');
 if(ring[0][0]!==ring.at(-1)[0]||ring[0][1]!==ring.at(-1)[1])throw Error('Ring must be closed');
 const keys=ring.slice(0,-1).map(p=>p.join(','));
 if(new Set(keys).size!==keys.length)throw Error('Repeated polygon position');
 let area=0;const origin=ring[0];
 for(let i=0;i<ring.length-1;i++)area+=cross(origin,ring[i],ring[i+1]);
 if(Math.abs(area)<1e-12)throw Error('Degenerate polygon');
 const n=ring.length-1;
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){if(j===i+1||(i===0&&j===n-1))continue;if(touches(ring[i],ring[i+1],ring[j],ring[j+1]))throw Error('Self-intersecting polygon');}
 return JSON.parse(JSON.stringify(g));
}
export function validateParcelRegistry(raw,siteIds=null){
 obj(raw,['schema','type','features'],'Registry');
 if(raw.schema!==PARCEL_SCHEMA||raw.type!=='FeatureCollection'||!Array.isArray(raw.features)||raw.features.length>100)throw Error('Invalid parcel registry');
 if(JSON.stringify(raw).length>2000000)throw Error('Parcel registry exceeds 2 MB text limit');
 const ids=new Set();let points=0;
 for(const f of raw.features){
  obj(f,['type','id','properties','geometry'],'Feature');
  if(f.type!=='Feature'||typeof f.id!=='string'||!/^[-a-z0-9_]{1,80}$/.test(f.id)||ids.has(f.id))throw Error('Invalid or duplicate feature ID');ids.add(f.id);
  const p=f.properties;obj(p,['site','kind','label','sourceType','sourceUrl','reference','checked','confidence','rights','review','sourceAreaSqm','controls'],'Properties');
  str(p.site,80,'Site');if(siteIds&&!siteIds.includes(p.site))throw Error('Unknown site');
  one(p.kind,['cadastral','planning'],'boundary kind');
  if(p.sourceType!==(p.kind==='cadastral'?'OFFICIAL_CADASTRAL':'OFFICIAL_PLANNING'))throw Error('Boundary/source type mismatch');
  str(p.label,200,'Label');url(p.sourceUrl);str(p.reference,1000,'Document reference');day(p.checked);one(p.confidence,['HIGH','MEDIUM','LOW'],'confidence');
  obj(p.rights,['status','reference'],'Rights');one(p.rights.status,['permitted','unknown'],'reuse status');str(p.rights.reference,2000,'Rights reference',p.rights.status==='unknown');
  const r=p.review;obj(r,['status','date','role','siteMatch','note'],'Review');one(r.status,['pending','reviewed'],'review status');day(r.date,r.status==='pending');one(r.role,['unassigned','planner','surveyor'],'review role');one(r.siteMatch,['unconfirmed','confirmed'],'site match');str(r.note,2000,'Review note',r.status==='pending');
  if(r.status==='reviewed'&&(r.role==='unassigned'||r.siteMatch!=='confirmed'||!r.date||!r.note.trim()))throw Error('Reviewed record needs role, date, confirmed match and note');
  if(r.status==='reviewed'&&r.role!==(p.kind==='cadastral'?'surveyor':'planner'))throw Error('Boundary review needs the appropriate surveyor/planner role');
  if(p.sourceAreaSqm!==null&&(typeof p.sourceAreaSqm!=='number'||!Number.isFinite(p.sourceAreaSqm)||p.sourceAreaSqm<=0||p.sourceAreaSqm>100000000))throw Error('Invalid source area');
  if(!Array.isArray(p.controls)||p.controls.length>20)throw Error('Invalid controls');
  for(const c of p.controls){
   obj(c,['label','value','sourceType','sourceUrl','reference','checked','scope','reviewed'],'Planning control');
   str(c.label,160,'Control');str(c.value,2000,'Control text');if(c.sourceType!=='OFFICIAL_PLANNING')throw Error('Planning source required');url(c.sourceUrl);str(c.reference,1000,'Control reference');day(c.checked);one(c.scope,['site_specific','area_context'],'control scope');if(typeof c.reviewed!=='boolean')throw Error('Control review flag required');
  }
  if(f.geometry!==null){if(p.rights.status!=='permitted')throw Error('Do not commit geometry without documented reuse permission');validateParcelGeometry(f.geometry);points+=f.geometry.coordinates[0].length;}
 }
 if(points>10000)throw Error('Too many polygon positions');
 return JSON.parse(JSON.stringify(raw));
}
export function parcelPublication(f,today=new Date().toISOString().slice(0,10)){
 day(today);const p=f.properties,r=p.review;const reasons=[];
 if(!f.geometry)reasons.push('Boundary geometry missing');
 if(p.rights.status!=='permitted')reasons.push('Reuse permission unresolved');
 if(r.status!=='reviewed')reasons.push('Professional review pending');
 if(r.siteMatch!=='confirmed')reasons.push('Site match unconfirmed');
 for(const [name,date] of [['Source',p.checked],['Review',r.date]]){
  if(!date)continue;const age=(Date.parse(today)-Date.parse(date))/86400000;
  if(age<0)reasons.push(name+' date is in the future');else if(age>90)reasons.push(name+' check is over 90 days old');
 }
 return {visible:reasons.length===0,reasons};
}
