/* ---------- transaction evidence: user-supplied completed-sale records ---------- */
const TX_FIELDS={date:'Transaction date',scheme:'Scheme / address',size:'Area',price:'Price (RM)',tenure:'Tenure',propertyType:'Property type',basis:'Area basis',unit:'Area unit'};
const TX_ALIASES={date:['date','transaction_date','sale_date'],scheme:['scheme','address','project'],size:['size','unit_size','area','size_sqft','built_up_sqft'],price:['price','price_rm','transacted_price'],tenure:['tenure'],propertyType:['property_type','type'],basis:['basis','area_basis'],unit:['unit','area_unit']};
function txCSV(text){
 if(typeof text!=='string'||text.length>2000000)throw Error('CSV must be text under 2 MB.');
 text=text.replace(/^\uFEFF/,'');const rows=[];let row=[],cell='',quoted=false,closed=false;
 const push=()=>{row.push(cell);cell='';closed=false};
 for(let i=0;i<text.length;i++){const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else{quoted=false;closed=true}}else cell+=c;continue}
  if(c==='"'){if(cell||closed)throw Error('Unexpected quote in CSV.');quoted=true}
  else if(c===','){push()}
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;push();if(row.some(v=>v.trim()))rows.push(row);row=[]}
  else {if(closed&&!/\s/.test(c))throw Error('Unexpected text after a quoted field.');if(!closed)cell+=c}
 }
 if(quoted)throw Error('Unclosed quoted field.');push();if(row.some(v=>v.trim()))rows.push(row);
 if(rows.length<2)throw Error('Include a header and at least one transaction.');
 if(rows.length>5001)throw Error('Import at most 5,000 transactions at once.');
 const headers=rows.shift().map(v=>v.trim());
 if(headers.some(v=>!v)||new Set(headers.map(v=>v.toLowerCase())).size!==headers.length)throw Error('Headers must be non-empty and unique.');
 return {headers,rows};
}
function txMapping(headers){return Object.fromEntries(Object.keys(TX_FIELDS).map(k=>[k,headers.findIndex(h=>TX_ALIASES[k].includes(h.toLowerCase().replace(/[\s-]+/g,'_')))]))}
function txNumber(v){const s=String(v??'').trim();return /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(s)?Number(s.replaceAll(',','')):NaN}
function txURL(v){try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null}catch(e){return null}}
function txRow(v,asOf){
 const bad=[];const trim=k=>String(v[k]??'').trim();
 const date=trim('date'),scheme=trim('scheme'),tenure=trim('tenure').toLowerCase(),propertyType=trim('propertyType').toLowerCase(),basis=trim('basis').toLowerCase(),unit=trim('unit').toLowerCase();
 const size=typeof v.size==='number'?v.size:txNumber(v.size),price=typeof v.price==='number'?v.price:txNumber(v.price);
 if(reviewDay(date)===null||date>asOf)bad.push('date must be a real ISO date, not in the future');
 if(!scheme||scheme.length>200)bad.push('scheme / address required, max 200 characters');
 if(!['freehold','leasehold','unknown'].includes(tenure))bad.push('tenure: freehold, leasehold or unknown');
 if(!['apartment','condominium','terrace','semi-d','detached','shop','land','other'].includes(propertyType))bad.push('choose a supported property type');
 if(!['built-up','land'].includes(basis))bad.push('area basis: built-up or land');
 if(!['sqft','sqm'].includes(unit))bad.push('area unit: sqft or sqm');
 if(!Number.isFinite(size)||size<=0||size>1e8)bad.push('area must be positive and at most 100 million');
 if(!Number.isFinite(price)||price<=0||price>1e11)bad.push('price must be positive and at most RM100 billion');
 const sqft=unit==='sqm'?size/0.09290304:size;
 return {errors:bad,row:bad.length?null:{date,scheme,tenure,propertyType,basis,unit,size,price,sqft,psf:price/sqft}};
}
function txKey(r){return JSON.stringify([r.date,r.scheme.toLowerCase(),r.tenure,r.propertyType,r.basis,+r.sqft.toFixed(6),r.price])}
function txGroup(r){return JSON.stringify([String(r.scheme||'').toLowerCase(),r.tenure,r.propertyType,r.basis])}
function txStage(parsed,mapping,defaults,existing,asOf){
 const seen=new Set(existing.map(txKey)),rows=[],rejected=[];let duplicates=0;
 parsed.rows.forEach((cells,i)=>{
  if(cells.length!==parsed.headers.length){rejected.push({line:i+2,reason:'Column count differs from header.'});return}
  const raw=Object.fromEntries(Object.keys(TX_FIELDS).map(k=>[k,mapping[k]>=0?cells[mapping[k]]:defaults[k]||'']));
  const r=txRow(raw,asOf);
  if(r.errors.length){rejected.push({line:i+2,reason:r.errors.join('; ')});return}
  const key=txKey(r.row);if(seen.has(key)){duplicates++;return}seen.add(key);rows.push(r.row);
 });
 return {rows,rejected,duplicates};
}
function txCutoff(asOf){
 const d=new Date(asOf+'T00:00:00Z');const day=d.getUTCDate();d.setUTCDate(1);d.setUTCFullYear(d.getUTCFullYear()-1);
 const max=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,max));return d.toISOString().slice(0,10);
}
function txStats(rows,asOf){
 if(!rows.length)return {n:0,median:null,old:0,from:null,to:null};
 const p=rows.map(r=>r.psf).sort((a,b)=>a-b),dates=rows.map(r=>r.date).sort(),n=p.length;
 return {n,median:n%2?p[(n-1)/2]:(p[n/2-1]+p[n/2])/2,min:p[0],max:p[n-1],from:dates[0],to:dates[n-1],old:rows.filter(r=>r.date<txCutoff(asOf)).length};
}
function txClean(raw,asOf){
 const out={};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
 for(const id of Object.keys(raw)){
  if(!Object.hasOwn(SITE,id)||!Array.isArray(raw[id]))continue;
  const seen=new Set();out[id]=[];
  for(const v of raw[id].slice(0,5000)){
   if(!v||typeof v!=='object')continue;
   const result=txRow(v,asOf),url=txURL(v.url),checked=String(v.checked||''),source=String(v.source||'').trim();
   if(!result.row||!url||!source||source.length>120||reviewDay(checked)===null||checked>asOf)continue;
   const key=txKey(result.row);if(seen.has(key))continue;seen.add(key);
   out[id].push({...result.row,source,url,checked,type:'TRANSACTION',conf:'PROVISIONAL'});
  }
 }
 return out;
}
let TX=txClean(store.get('transactions',{}),reviewToday());
let TXUI={site:'taiping',parsed:null,stage:null,group:'',min:'',max:'',from:'',to:''};
function txRows(id){return TX[id]||[]}
function txGroups(id){return [...new Map(txRows(id).map(r=>[txGroup(r),r])).entries()]}
function txSelected(id){
 const groups=txGroups(id),key=groups.some(([k])=>k===TXUI.group)?TXUI.group:groups[0]?.[0];
 return txRows(id).filter(r=>txGroup(r)===key&&(!TXUI.min||r.sqft>=Number(TXUI.min))&&(!TXUI.max||r.sqft<=Number(TXUI.max))&&(!TXUI.from||r.date>=TXUI.from)&&(!TXUI.to||r.date<=TXUI.to));
}
function txEvidence(id){
 return txRows(id).map(r=>({site:id,f:'Imported completed-sale record: '+r.scheme,v:fmtRM(r.price)+' / '+fmt1(r.sqft)+' sf '+r.basis+' ('+fmtRM(r.psf)+' psf)',type:'TRANSACTION',conf:'PROVISIONAL',url:r.url,chk:r.checked,n:r.date+'; '+r.tenure+'; '+r.propertyType+'; user-supplied '+r.source+'. Completion and comparability not independently verified.'}));
}
function txSummary(id){
 const groups=txGroups(id);
 return '<div class="block tx-summary"><h3>Imported transaction evidence</h3><p><a href="#/transactions/'+id+'">Import or review transactions</a></p>'+
 (groups.length?'<p class="small">User-supplied completed-sale records, provisional confidence. Groups keep scheme, tenure, property type and area basis separate. These are not automatically new-product selling prices.</p>'+groups.map(([key,r])=>{const q=txStats(txRows(id).filter(v=>txGroup(v)===key),reviewToday());return '<p><b>'+esc(r.scheme)+'</b> · '+esc(r.tenure)+' · '+esc(r.propertyType)+' · '+esc(r.basis)+'<br>'+q.n+' records · median '+fmtRM(q.median)+' psf · '+q.from+' to '+q.to+' · '+q.old+' older than 12 months</p>'}).join(''):'<p class="muted">No imported records. Existing asking-price evidence remains separate.</p>')+'</div>';
}
function txTable(rows){return '<div class="tw" tabindex="0" role="region" aria-label="Transaction records"><table><thead><tr><th>Date / scheme</th><th>Tenure / type</th><th>Area basis</th><th class="num">Area sf</th><th class="num">Price RM</th><th class="num">RM/psf</th><th>Source / checked</th></tr></thead><tbody>'+rows.slice(0,100).map(r=>'<tr><td>'+esc(r.date)+'<br>'+esc(r.scheme)+'</td><td>'+esc(r.tenure)+'<br>'+esc(r.propertyType)+'</td><td>'+esc(r.basis)+'</td><td class="num">'+fmt1(r.sqft)+'</td><td class="num">'+fmt0(r.price)+'</td><td class="num">'+fmt2(r.psf)+'</td><td>'+(r.url?'<a target="_blank" rel="noopener" href="'+esc(r.url)+'">'+esc(r.source)+'</a><br>'+esc(r.checked):'Staged')+'</td></tr>').join('')+'</tbody></table></div>'+(rows.length>100?'<p class="small">Showing the first 100 of '+rows.length+' records; statistics use the full filtered set.</p>':'')}
function viewTransactions(id){
 const sid=Object.hasOwn(SITE,id||'')?id:TXUI.site;
 if(sid!==TXUI.site)TXUI={site:sid,parsed:null,stage:null,group:'',min:'',max:'',from:'',to:''};
 const selected=txSelected(sid),q=txStats(selected,reviewToday()),groups=txGroups(sid),p=TXUI.parsed;
 return '<div class="page tx-page">'+head('Transaction evidence','Import completed-sale records you obtained yourself. Review comparability before using any median as a selling-price assumption.',siteSelect(sid,SITES,'tx-site'))+
 '<p><a href="#/site/'+sid+'">Site dossier</a> · <a href="#/sources">Sources & diligence</a></p>'+
 '<div class="block"><h2>1. Read a CSV</h2><p class="small">Required: date (YYYY-MM-DD), scheme/address, area and price in RM. Map your columns below. Tenure, property type, area basis and unit can be set for the whole file. Unknown columns are discarded. Exclude owner names and contact details before import.</p>'+
 '<label for="tx-file">CSV file (up to 2 MB; 5,000 rows)</label><input id="tx-file" type="file" accept=".csv,text/csv"><p class="small">Or paste CSV text. Example headers: date,scheme,size,price,tenure,property_type,basis,unit</p><textarea id="tx-text" rows="5" aria-label="CSV text" placeholder="Paste your CSV here"></textarea><button class="btn" id="tx-read">Read pasted CSV</button><p id="tx-error" role="alert"></p>'+
 (p?'<form id="tx-map"><h3>2. Map and validate</h3><div class="mass-fields">'+Object.entries(TX_FIELDS).map(([k,l])=>'<label class="mass-field">'+l+'<select data-tx-map="'+k+'"><option value="-1">Use shared value / missing</option>'+p.headers.map((v,i)=>'<option value="'+i+'" '+(txMapping(p.headers)[k]===i?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label>').join('')+
 [['tenure',['freehold','leasehold','unknown']],['propertyType',['apartment','condominium','terrace','semi-d','detached','shop','land','other']],['basis',['built-up','land']],['unit',['sqft','sqm']]].map(([k,vals])=>'<label class="mass-field">Shared '+TX_FIELDS[k]+'<select data-tx-default="'+k+'"><option value="">Choose explicitly</option>'+vals.map(v=>'<option>'+v+'</option>').join('')+'</select></label>').join('')+
 '<label class="mass-field">Source name / export reference<input id="tx-source" maxlength="120" required></label><label class="mass-field">Source URL<input id="tx-url" type="url" required placeholder="https://"></label><label class="mass-field">Source checked on<input id="tx-checked" type="date" required max="'+reviewToday()+'" value="'+reviewToday()+'"></label></div>'+
 '<label class="tog"><input id="tx-completed" type="checkbox" required> These rows represent completed sales, not asking prices or bookings; no owner personal details are included.</label><button class="btn" type="submit">Validate rows</button></form>':'')+'</div>'+
 (TXUI.stage?'<div class="block" id="tx-preview"><h2>3. Review import</h2><p>'+TXUI.stage.rows.length+' valid new rows · '+TXUI.stage.rejected.length+' rejected · '+TXUI.stage.duplicates+' exact duplicates skipped. Exact duplicates share date, scheme, tenure, type, area basis, area and price; check the source if separate identical sales were intended.</p>'+txTable(TXUI.stage.rows)+
 (TXUI.stage.rejected.length?'<details><summary>Rejected rows and reasons</summary><ul>'+TXUI.stage.rejected.slice(0,100).map(r=>'<li>CSV record '+r.line+': '+esc(r.reason)+'</li>').join('')+'</ul></details>':'')+
 '<button class="btn" id="tx-import" '+(!TXUI.stage.rows.length?'disabled':'')+'>Import valid rows</button> <button class="btn ghost" id="tx-cancel">Discard staged import</button></div>':'')+
 '<div class="block"><h2>Recorded transactions</h2>'+badge('TRANSACTION')+' '+badge('INFERRED','Statistics derived from user-supplied records')+'<p class="small">Confidence: provisional. Completion, condition, restrictions and source rights are user assertions. No source is scraped or independently verified by importing. Data joins the existing private workspace storage and export; it is never committed to this public repository.</p>'+
 (groups.length?'<form id="tx-filter"><div class="mass-fields"><label class="mass-field">Comparable group<select id="tx-group">'+groups.map(([k,r])=>'<option value="'+esc(k)+'" '+(txGroup(selected[0]||{})===k||TXUI.group===k?'selected':'')+'>'+esc([r.scheme,r.tenure,r.propertyType,r.basis].join(' / '))+'</option>').join('')+'</select></label>'+
 [['min','Minimum size (sf)','number'],['max','Maximum size (sf)','number'],['from','From date','date'],['to','To date','date']].map(([k,l,t])=>'<label class="mass-field">'+l+'<input id="tx-'+k+'" type="'+t+'" '+(t==='number'?'min="0" step="any"':'')+' value="'+esc(TXUI[k])+'"></label>').join('')+'</div><button class="btn ghost">Filter comparable rows</button></form>'+
 '<p id="tx-stats"><b>'+q.n+' comparable records'+(q.n?' · median '+fmtRM(q.median)+' psf':'')+'</b>'+(q.n?' · range '+fmtRM(q.min)+'–'+fmtRM(q.max)+' psf · '+q.from+' to '+q.to+' · '+q.old+' older than 12 months':'')+'</p><p class="small">Median is the median of individual price ÷ area values, not total price ÷ total area. '+(q.n<5?'Small sample: fewer than five records. ':'')+'Stale means transaction date is before '+txCutoff(reviewToday())+'. Size and period filters do not control floor, condition, restrictions or incentives.</p>'+txTable(selected)+
 (SITE[sid].rlv?'<form id="tx-apply"><h3>Apply an ASP assumption</h3><p>Current live ASP: '+fmtRM(st(sid).asp)+' psf. Applying changes the live scenario, watchlist and triggers. Recorded workbook presets and owner packs retain their original assumptions. Land-area psf cannot be applied as built-up ASP.</p><label class="mass-field">Chosen end-product ASP (RM / saleable sf)<input id="tx-asp" type="number" min="1" max="100000" step="any" required value="'+(q.median&&selected[0]?.basis==='built-up'?q.median.toFixed(2):'')+'"></label><label class="mass-field">Why these sales support the proposed new product<textarea id="tx-reason" maxlength="1000" required></textarea></label><label class="tog"><input id="tx-accept" type="checkbox" required> I reviewed the area basis, tenure, age, property type, condition and differences from the new product.</label><button class="btn" '+(!q.n||selected[0]?.basis!=='built-up'?'disabled':'')+'>Apply to live scenario</button></form>':'')+
 '<p><button class="btn ghost" id="tx-clear">Remove this site’s imported records</button></p>':'<p>No transactions imported for this site.</p>')+'</div>'+
 txApplicationHTML(sid)+'</div>';
}
function txApplicationHTML(id){
 const a=stSafeTX(id)?.transactionASP;if(!a||![a.old,a.value,a.count].every(Number.isFinite)||!Array.isArray(a.sources))return '';
 const active=stSafeTX(id).asp===a.value;
 return '<div class="block"><h3>Last transaction-based ASP application</h3><p>'+fmtRM(a.old)+' → '+fmtRM(a.value)+' psf · '+esc(a.at)+' · '+(active?'Value still matches live ASP':'Live ASP has since changed')+'</p><p>'+esc(a.reason)+'</p><p class="small">'+a.count+' records, '+esc(a.from)+' to '+esc(a.to)+'. Sources: '+esc(a.sources.join('; '))+'. '+badge('EDITED')+' Analyst assumption, not a verified new-launch price.</p>'+(active?'<button class="btn ghost" id="tx-undo">Restore previous ASP</button>':'')+'</div>';
}
function stSafeTX(id){return SITE[id]?.rlv?st(id):null}
function txApply(id,rows,asp,reason,at){
 if(!SITE[id]?.rlv||!rows.length||rows.some(r=>r.basis!=='built-up'||txGroup(r)!==txGroup(rows[0]))||!Number.isFinite(asp)||asp<=0||asp>100000||!String(reason).trim())return false;
 const x=st(id),q=txStats(rows,at.slice(0,10));
 x.transactionASP={old:x.asp,value:asp,reason:String(reason).trim().slice(0,1000),at,count:q.n,from:q.from,to:q.to,sources:[...new Set(rows.map(r=>r.source+' '+r.url+' checked '+r.checked))]};
 x.asp=asp;saveState();return true;
}
function bindTransactions(root){
 const sid=TXUI.site,err=t=>{root.querySelector('#tx-error').textContent=t};
 root.querySelector('#tx-site').onchange=e=>go('#/transactions/'+e.target.value);
 const read=text=>{try{TXUI.parsed=txCSV(text);TXUI.stage=null;render()}catch(e){TXUI.parsed=null;TXUI.stage=null;render();document.getElementById('tx-error').textContent=e.message}};
 root.querySelector('#tx-read').onclick=()=>read(root.querySelector('#tx-text').value);
 root.querySelector('#tx-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>2000000){err('File exceeds 2 MB.');return}try{const text=await f.text();if(TXUI.site===sid)read(text)}catch(e){err('Could not read this file.')}};
 const form=root.querySelector('#tx-map');if(form)form.onsubmit=e=>{
  e.preventDefault();const url=txURL(root.querySelector('#tx-url').value),checked=root.querySelector('#tx-checked').value,source=root.querySelector('#tx-source').value.trim();
  if(!url||!source||reviewDay(checked)===null||checked>reviewToday()){err('Enter a source name, http(s) URL and valid check date.');return}
  const mapping=Object.fromEntries([...root.querySelectorAll('[data-tx-map]')].map(e=>[e.dataset.txMap,Number(e.value)])),defaults=Object.fromEntries([...root.querySelectorAll('[data-tx-default]')].map(e=>[e.dataset.txDefault,e.value]));
  const stage=txStage(TXUI.parsed,mapping,defaults,txRows(sid),reviewToday());
  stage.rows=stage.rows.map(r=>({...r,source,url,checked,type:'TRANSACTION',conf:'PROVISIONAL'}));TXUI.stage=stage;render();
 };
 const imp=root.querySelector('#tx-import');if(imp)imp.onclick=()=>{
  const added=TXUI.stage.rows.filter(r=>!new Set(txRows(sid).map(txKey)).has(txKey(r)));
  if(txRows(sid).length+added.length>5000){err('Limit is 5,000 stored rows per site.');return}
  TX[sid]=[...txRows(sid),...added];store.set('transactions',TX);TXUI.stage=null;TXUI.parsed=null;render();toast('Imported '+added.length+' transaction records; ASP unchanged');
 };
 const cancel=root.querySelector('#tx-cancel');if(cancel)cancel.onclick=()=>{TXUI.stage=null;render()};
 const filter=root.querySelector('#tx-filter');if(filter)filter.onsubmit=e=>{e.preventDefault();
  const v=Object.fromEntries(['group','min','max','from','to'].map(k=>[k,root.querySelector('#tx-'+k).value]));
  if((v.min&&v.max&&Number(v.min)>Number(v.max))||(v.from&&v.to&&v.from>v.to)){err('Filter minimum must not exceed maximum.');return}Object.assign(TXUI,v);render();
 };
 const apply=root.querySelector('#tx-apply');if(apply)apply.onsubmit=e=>{e.preventDefault();if(txApply(sid,txSelected(sid),Number(root.querySelector('#tx-asp').value),root.querySelector('#tx-reason').value,new Date().toISOString())){render();toast('Live ASP updated; workbook presets unchanged')}};
 const clear=root.querySelector('#tx-clear');if(clear)clear.onclick=()=>{if(!confirm('Remove imported records for this site? Any applied ASP remains until you restore or change it.'))return;delete TX[sid];store.set('transactions',TX);TXUI.group='';render()};
 const undo=root.querySelector('#tx-undo');if(undo)undo.onclick=()=>{const x=st(sid);if(x.asp===x.transactionASP.value){x.asp=x.transactionASP.old;delete x.transactionASP;saveState();render();toast('Previous ASP restored')}};
}


