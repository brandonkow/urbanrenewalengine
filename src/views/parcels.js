/* Reviewed parcel records stay read-only and separate from economic assumptions. */
let PARCELS=URECore.validateParcelRegistry(URECore.parcelRegistry,SITES.map(s=>s.id));
function parcelRows(id){return PARCELS.features.filter(f=>f.properties.site===id);}
function parcelVisible(id){return parcelRows(id).filter(f=>URECore.parcelPublication(f).visible);}
function parcelPath(f){return f.geometry.coordinates[0].map((p,i)=>{const[x,y]=PX(p[1],p[0]);return (i?'L':'M')+x.toFixed(4)+' '+y.toFixed(4)}).join(' ')+' Z';}
function parcelViewBox(id,focus){
 const rows=parcelVisible(id);if(!focus||!rows.length)return '0 0 '+MW+' '+MH;
 const points=rows.flatMap(f=>f.geometry.coordinates[0].map(p=>PX(p[1],p[0]))),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y,pad=Math.max(w,h)*0.15+0.1;
 return [x-pad,y-pad,w+2*pad,h+2*pad].join(' ');
}
function parcelShapes(site=null){
 if(MAP.boundaries===false)return '';
 return PARCELS.features.filter(f=>{const s=SITE[f.properties.site];return (!site||f.properties.site===site)&&URECore.parcelPublication(f).visible&&(site||(!(s.group==='specific'&&!MAP.spec)&&!(s.group==='jwp'&&!MAP.jwp)));}).map(f=>{
 const p=f.properties;return '<path class="parcel-shape parcel-'+p.kind+'" d="'+parcelPath(f)+'" fill-rule="evenodd"><title>'+esc(p.label+' — reviewed '+p.kind+' record; source '+p.reference)+'</title></path>';
 }).join('');
}
function parcelPanel(id){
 const rows=parcelRows(id),visible=parcelVisible(id),today=new Date().toISOString().slice(0,10);
 return '<section class="parcel-panel" aria-label="Parcel evidence"><h2>Parcel evidence</h2><p class="small">'+visible.length+' of '+rows.length+' source records pass the display checks. These checks do not establish a new survey or planning approval.</p>'+
 (!rows.length?'<p class="note">No reviewed boundary records for this site. The pin remains approximate; site area, title interests and parcel-specific controls remain unverified.</p>':'')+
 rows.map(f=>{const p=f.properties,status=URECore.parcelPublication(f),r=p.review;return '<details class="parcel-record"><summary>'+esc(p.label)+' · '+(status.visible?'Reviewed '+p.kind+' record':'Withheld from map')+'</summary>'+
 '<p>'+badge(p.sourceType)+' · Confidence '+esc(p.confidence)+' · Source checked '+esc(p.checked)+'</p>'+
 '<p>'+ddLink(p.sourceUrl,p.reference)+'</p><p>Review: '+esc(r.status)+' · '+esc(r.role)+' · '+esc(r.date||'Not recorded')+' · Site match '+esc(r.siteMatch)+'</p><p>'+esc(r.note)+'</p>'+
 '<p>Reuse: '+esc(p.rights.status)+' · '+esc(p.rights.reference||'No permission reference')+'</p>'+
 (p.sourceAreaSqm===null?'<p>Source area: not recorded.</p>':'<p>Source-stated area: '+fmt2(p.sourceAreaSqm)+' m². It has not been applied to the economic model.</p>')+
 (status.reasons.length?'<ul>'+status.reasons.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ul>':'')+
 '<h3>Planning controls from documents</h3>'+
 (p.controls.length?p.controls.map(c=>{const age=(Date.parse(today)-Date.parse(c.checked))/86400000;const good=c.reviewed&&age>=0&&age<=90;return '<div class="parcel-control"><strong>'+esc(c.label)+'</strong><p>'+esc(c.value)+'</p><p>'+esc(c.scope==='site_specific'?'Site-specific document':'Area context only; parcel applicability unresolved')+' · '+(good?'Reviewed record':'Needs review / recheck')+'</p><p>'+ddLink(c.sourceUrl,c.reference)+' · Checked '+esc(c.checked)+'</p></div>';}).join(''):'<p>No parcel-specific planning controls recorded.</p>')+'</details>';}).join('')+
 '<p class="small">Planning outlines are dashed. Cadastral records use solid outlines. Neither layer changes site area, plot ratio, owner counts, transit eligibility or financial results. The 90-day display review interval is an editorial check, not a statutory expiry.</p>'+
 '<p><a href="#/sources">Existing evidence register</a> · <a href="#/diligence/'+id+'">Review missing documents</a></p></section>';
}
