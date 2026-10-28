/* ---------- land evidence review queue (read-only) ---------- */
function reviewToday(){return new Date().toISOString().slice(0,10)}
function reviewDay(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const n=Date.parse(value+'T00:00:00Z');
 return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===value?n:null;
}
function reviewAge(checked,asOf){
 const c=reviewDay(checked),a=reviewDay(asOf);
 return c===null||a===null||c>a?null:Math.floor((a-c)/86400000);
}
function landReviewRows(rows,events,asOf,days=90){
 return rows.map(d=>{
  const current=ldCurrent(d,events),acquisitionAge=reviewAge(d.checked,asOf),statusAge=reviewAge(current?.checked,asOf);
  const dateIssue=acquisitionAge===null||statusAge===null;
  const overdue=acquisitionAge!==null&&acquisitionAge>=days||statusAge!==null&&statusAge>=days;
  const unresolved=!['completed','terminated'].includes(ldStatus(d,events));
  // Current dataset contains locality proxies only. A title reference is not a verified boundary.
  const parcelMissing=true;
  const reasons=[];
  if(dateIssue)reasons.push('Check missing, invalid or future review date');
  if(overdue)reasons.push('Recheck evidence at the review interval');
  if(unresolved)reasons.push('Find a later acquisition status notice');
  reasons.push('Verify parcel boundary and coordinates');
  return {deal:d,current,acquisitionAge,statusAge,dateIssue,overdue,unresolved,parcelMissing,reasons,
   priority:dateIssue?0:overdue?1:unresolved?2:3};
 }).sort((a,b)=>a.priority-b.priority||Math.max(b.acquisitionAge??-1,b.statusAge??-1)-Math.max(a.acquisitionAge??-1,a.statusAge??-1)||a.deal.id.localeCompare(b.deal.id));
}
let LR={asOf:reviewToday(),filter:'all',q:'',legacy:false};
function viewReview(){
 const all=landReviewRows(LAND_DEALS.filter(d=>LR.legacy||ldEligible(d)),LAND_DEAL_EVENTS,LR.asOf);
 const q=LR.q.trim().toLowerCase(),rows=all.filter(r=>(LR.filter==='all'||r[LR.filter])&&(!q||[r.deal.buyer,r.deal.location].join(' ').toLowerCase().includes(q)));
 const age=(date,n)=>n===null?'Review date needs checking':esc(date)+' · '+n+' days ago';
 return '<div class="page review-page">'+head('Land evidence review','A work queue for source checks and parcel verification. Review flags do not change the evidence or the financial model.')+
 '<p><a href="#/land">Back to land deals</a> · <a href="#/sources">Sources &amp; diligence</a></p>'+
 '<p class="note small">Review interval: 90 days or more since a recorded source check. This is an editorial reminder, not an expiry date or a claim that evidence is wrong. Acquisition and latest-status checks age separately. As-of date uses UTC today by default; changing it previews review timing, not historical deal status.</p>'+
 '<form id="lr-filter" class="ld-controls"><label>As-of date<input class="sel" type="date" id="lr-date" required value="'+esc(LR.asOf)+'"></label><label>Review need<select class="sel" id="lr-need">'+Object.entries({all:'All review work',overdue:'Evidence due for recheck',dateIssue:'Review date needs checking',unresolved:'Completion status unresolved',parcelMissing:'Parcel verification missing'}).map(([k,v])=>'<option value="'+k+'" '+(LR.filter===k?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Buyer or location<input class="sel" id="lr-search" type="search" value="'+esc(LR.q)+'"></label><label class="small ld-toggle"><input type="checkbox" id="lr-legacy" '+(LR.legacy?'checked':'')+'> Include legacy / outside-region rows</label><button class="btn" type="submit">Apply review filters</button><button class="btn ghost" type="button" id="lr-reset">Reset</button></form>'+
 '<p class="small muted" role="status">'+rows.length+' matching deals of '+all.length+' in scope · '+all.filter(r=>r.overdue).length+' due for recheck · '+all.filter(r=>r.unresolved).length+' with unresolved completion status · '+all.filter(r=>r.parcelMissing).length+' without verified parcel geometry. Counts can overlap. Sorted by date problems, overdue checks, unresolved status, then parcel work; oldest checks first within each group.</p>'+
 '<div class="lr-grid">'+rows.map(r=>{const d=r.deal;return '<article class="block lr-card" data-review="'+esc(d.id)+'"><h2>'+esc(d.buyer)+'</h2><p>'+esc(d.location)+'</p>'+ldStatusHTML(d)+
 '<dl class="kv"><dt>Acquisition checked</dt><dd>'+age(d.checked,r.acquisitionAge)+'</dd><dt>Latest status checked</dt><dd>'+age(r.current?.checked,r.statusAge)+'</dd><dt>Parcel evidence</dt><dd>'+esc(ldHistory(d).map(e=>e.parcelReference).filter(Boolean).join('; ')||'No parcel reference recorded; locality pins are approximate.')+'</dd></dl>'+
 '<h3>Next checks</h3><ul>'+r.reasons.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>'+
 '<p class="small">Read the source and record any verified changes with its URL, check date and confidence. Absence of a completion notice does not prove the deal is still open.</p>'+
 '<p><a href="#/land/'+esc(d.id)+'">Inspect deal and history</a> · <a href="'+esc(d.url)+'" target="_blank" rel="noopener">Acquisition source</a>'+
 (r.current? ' · <a href="'+esc(r.current.url)+'" target="_blank" rel="noopener">Latest status source</a>':'')+'</p></article>'}).join('')+'</div>'+
 (!rows.length?'<p class="note" id="lr-empty">No matching review work. Try another review need, clear the search or include legacy rows.</p>':'')+'</div>';
}
function bindReview(root){
 root.querySelector('#lr-filter').onsubmit=e=>{e.preventDefault();const asOf=root.querySelector('#lr-date').value;if(reviewDay(asOf)===null)return;LR={asOf,filter:root.querySelector('#lr-need').value,q:root.querySelector('#lr-search').value,legacy:root.querySelector('#lr-legacy').checked};render()};
 root.querySelector('#lr-reset').onclick=()=>{LR={asOf:reviewToday(),filter:'all',q:'',legacy:false};render()};
}

function viewLand(id){
 if(LAND_DEALS.some(d=>d.id===id)&&LAST!==location.hash){LD.sel=id;LD.q='';LD.buyer='';LD.status='';LD.legacy=!ldEligible(LAND_DEALS.find(d=>d.id===id))}
 const rows=landDealFiltered(LAND_DEALS,LD),stats=landDealStats(rows),selected=rows.find(d=>d.id===LD.sel)||rows[0],allStats=landDealStats(LAND_DEALS);
 const th=(key,label)=>'<th aria-sort="'+(LD.sort===key?(LD.dir===1?'ascending':'descending'):'none')+'"><button class="btn ghost" data-ldsort="'+key+'">'+label+(LD.sort===key?(LD.dir===1?' ↑':' ↓'):'')+'</button></th>';
 const s=SITE[LD.site]||SITE.taiping;
 return '<div class="page land-page">'+head('Land deals','Public acquisition evidence, 2024–2026. Acquisition data checked 13 Oct; three status notices checked 23 Oct 2026. A curated sample of Bursa-listed developers, not a complete market register.')+
 '<div class="metrics"><div class="metric"><span class="v">'+rows.length+'</span><span class="k">Rows shown</span></div><div class="metric"><span class="v">'+stats.length+'</span><span class="k">Buyers in scoped rows</span></div><div class="metric"><span class="v">'+fmtM(stats.reduce((n,b)=>n+b.total,0))+'</span><span class="k">Reported consideration, not cash paid</span></div></div>'+
 '<p class="note small">Agreements and offers do not prove completion. Consideration may include buildings or joint-venture partners; GDV is projected. Sources were checked on the stated date, but completion status is only as reported in each linked document. Two legacy rows remain outside the ranked sample. Reported terminations are excluded from buyer fit, summary totals and proposed bands.</p>'+ldCompletionHTML(rows)+'<p><a href="#/review">Open land evidence review queue</a></p>'+
 '<form id="ld-filter" class="ld-controls"><label>Search area or product<input id="ld-search" class="sel" type="search" value="'+esc(LD.q)+'"></label><label>Buyer<select id="ld-buyer" class="sel"><option value="">All buyers</option>'+allStats.map(b=>'<option '+(b.buyer===LD.buyer?'selected ':'')+'value="'+esc(b.buyer)+'">'+esc(b.buyer)+'</option>').join('')+'</select></label><label>Deal status<select id="ld-status" class="sel"><option value="">All stages</option>'+Object.entries(LAND_STATUS_LABELS).map(([v,l])=>'<option value="'+v+'" '+(LD.status===v?'selected':'')+'>'+esc(l)+'</option>').join('')+'</select></label><label>Assumed ASP (RM/saleable sf)<input class="sel" id="ld-asp" type="number" min="100" max="10000" step="25" value="'+LD.asp+'"></label><label class="small ld-toggle"><input id="ld-legacy" type="checkbox" '+(LD.legacy?'checked':'')+'> Show legacy / outside-region rows</label><button class="btn" type="submit">Apply filters</button><button class="btn ghost" type="button" id="ld-reset">Reset</button></form>'+
 '<p class="small muted">Implied PR reuses the current calibration cost stack: '+fmtRM(CAL.hc)+' hard cost / GFA sf, '+fmtPct(CAL.eff)+' efficiency and 20% developer margin. ASP above is an assumption for comparison, not a verified selling price. No positive residual per floor means no solution; township PR is withheld.</p>'+
 '<p class="small muted">Scroll the table horizontally to view all columns.</p><div class="tw" tabindex="0" role="region" aria-label="Land deals table"><table class="cost ld-table"><thead><tr>'+th('date','Date')+th('buyer','Buyer')+th('location','Location')+th('acres','Gross acres')+th('price_rm','Price RM')+th('land_psf','RM/land sf')+th('land_share_of_gdv','Land/GDV')+'<th>Implied PR</th><th>Source / status</th></tr></thead><tbody>'+
 rows.map(d=>{const pr=ldImplied(d,LD.asp);return '<tr data-deal="'+d.id+'"><td>'+esc(d.date||'Unverified')+'<br><span class="small muted">'+esc(d.dateBasis)+'</span></td><td>'+esc(d.buyer)+'</td><td><button type="button" class="ld-link" data-ldselect="'+d.id+'">'+esc(d.location)+'</button>'+(d.asset?'<br><span class="small muted">Includes buildings</span>':'')+'</td><td class="num">'+fmt2(d.acres)+'</td><td class="num">'+fmtM(d.price_rm)+'</td><td class="num">'+fmtRM(d.land_psf)+'</td><td class="num">'+(d.land_share_of_gdv===null?'—':(d.gdvLowerBound?'≤ ':'')+fmtPct(d.land_share_of_gdv))+'</td><td class="num">'+(pr===null?'No estimate':fmt2(pr)+'×')+'</td><td>'+badge(d.source_type)+'<br>'+ldStatusHTML(d)+'</td></tr>'}).join('')+
 (!rows.length?'<tr><td colspan="9">No matching deals. Clear the search or reset filters.</td></tr>':'')+'</tbody></table></div>'+
 (selected?'<section class="sec"><div class="sec-head"><h2>Inspect a deal</h2><span class="muted">Select a location or map pin</span></div><div class="ld-layout">'+landDealMap(rows,selected.id)+ldDetail(selected)+'</div></section>':'')+
 '<section class="sec"><div class="sec-head"><h2>Who is buying?</h2><span class="muted">Filtered, non-terminated scoped sample</span></div><p class="small muted">Scroll the table horizontally to view all columns.</p><div class="tw" tabindex="0" role="region" aria-label="Buyer summary table"><table class="cost ld-summary"><thead><tr><th>Developer</th><th>Deals</th><th>Total consideration</th><th>Median acres</th><th>Ticket range</th><th>Land psf range</th><th>Areas</th></tr></thead><tbody>'+stats.map(b=>'<tr><td>'+esc(b.buyer)+'</td><td>'+b.count+'</td><td>'+fmtM(b.total)+'</td><td>'+fmt2(b.medianAc)+'</td><td>'+fmtM(b.minPrice)+'–'+fmtM(b.maxPrice)+'</td><td>'+fmtRM(b.minPsf)+'–'+fmtRM(b.maxPsf)+'</td><td>'+esc(b.areas.join('; '))+'</td></tr>').join('')+'</tbody></table></div><p class="small muted">Gross amounts from non-terminated scoped records, including uncompleted proposals; not equity-attributable cash outlay. A purchase of multiple parcels counts once. Mixed asset and land-only deals make price bands descriptive, not valuations.</p></section>'+
 '<section class="sec">'+siteSelect(s.id,SITES,'ld-site')+'<p class="small"><a href="#/site/'+s.id+'">Open selected site dossier</a></p>'+buyerFitHTML(s)+'</section>'+landBandHTML()+'</div>';
}
function bindLand(root){
 const form=root.querySelector('#ld-filter');
 form.onsubmit=e=>{e.preventDefault();const asp=+root.querySelector('#ld-asp').value;if(!Number.isFinite(asp)||asp<100||asp>10000)return;LD={...LD,q:root.querySelector('#ld-search').value,buyer:root.querySelector('#ld-buyer').value,status:root.querySelector('#ld-status').value,asp,legacy:root.querySelector('#ld-legacy').checked};render()};
 root.querySelector('#ld-reset').onclick=()=>{LD={q:'',buyer:'',status:'',sort:'date',dir:-1,legacy:false,asp:750,sel:'sime-unirazak',site:'taiping'};if(location.hash!=='#/land')go('#/land');else render()};
 root.querySelectorAll('[data-ldsort]').forEach(el=>el.onclick=()=>{const k=el.dataset.ldsort;LD.dir=LD.sort===k?-LD.dir:1;LD.sort=k;render()});
 const select=id=>{LD.sel=id;go('#/land/'+id)};
 root.querySelectorAll('[data-ldselect]').forEach(el=>el.onclick=()=>select(el.dataset.ldselect));
 root.querySelectorAll('[data-ldpin]').forEach(el=>{el.onclick=()=>select(el.dataset.ldpin);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(el.dataset.ldpin)}}});
 root.querySelector('#ld-site').onchange=e=>{LD.site=e.target.value;render()};
}


