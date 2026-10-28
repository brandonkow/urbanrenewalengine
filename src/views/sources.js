/* ---------- sources & diligence ---------- */
let SRCF = 'ALL';
function viewSources(){
  const allEvidence=[...EVIDENCE,...SITES.flatMap(s=>txEvidence(s.id))];
  const types=['ALL',...new Set(allEvidence.map(e=>e.type))];
  const list=allEvidence.filter(e=>SRCF==='ALL'||e.type===SRCF);
  const done=CHECK.filter(c=>CHECKS[c.id]).length;
  return `<div class="page">
   ${head('Sources & diligence','What the numbers stand on. Each entry shows when it was last checked against its source.')}
   <p><a href="#/diligence">Open due-diligence workspace</a> · <a href="#/review">Open land evidence review queue</a> · <a href="#/transactions">Import transaction evidence</a></p>
   <div class="sec" style="margin-top:0"><div class="sec-head"><h2>Issues and open questions</h2><span class="muted">${ISSUES.length} items</span></div>
    <ul class="issues">${ISSUES.map(i=>`<li><span class="impact"><span class="chip ${i.imp==='High'?'bad':i.imp==='Medium'?'warn':'na'}">${i.imp} impact</span></span><div><h3>${esc(i.t)}</h3><p class="small">${esc(i.d)}</p><p class="small"><b>Do:</b> ${esc(i.a)}${i.src?` <a href="${i.src}" target="_blank" rel="noopener">Source</a>`:''}</p></div></li>`).join('')}</ul>
   </div>
   <div class="sec"><div class="sec-head"><h2>Taman Taiping diligence</h2><span class="muted">${done} of ${CHECK.length} complete</span></div>
    <ul class="check">${CHECK.map(c=>`<li><input type="checkbox" id="ck_${c.id}" data-ck="${c.id}" ${CHECKS[c.id]?'checked':''}><label for="ck_${c.id}"><span class="${CHECKS[c.id]?'done':''}">${esc(c.t)}</span><br><span class="small muted">${esc(c.n)}</span></label><span>${c.s===1&&!CHECKS[c.id]?'<span class="chip warn">Partial</span>':''}</span></li>`).join('')}</ul>
    <p class="small muted">Order of work: public planning, public map, market evidence, address evidence, strata roll, rerun owner economics. Pay for official GIS only if the thesis survives.</p>
   </div>
   <div class="sec"><div class="sec-head"><h2>Evidence registry</h2><span class="muted">Badge style shows provenance: filled is official, solid outline is market or press evidence, dashed is proxy or assumption, dotted is model output</span></div>
    <div class="filters" role="group" aria-label="Filter by source type">${types.map(t=>`<button type="button" data-f="${t}" aria-pressed="${SRCF===t}">${t==='ALL'?'All':SRC[t].l}</button>`).join('')}</div>
    ${evidenceTable(list)}
   </div>
   <div class="sec"><div class="sec-head"><h2>Source library</h2></div>
    <dl class="kv">
     <dt>PTKL2040 development control</dt><dd><a href="${U.ptkl}" target="_blank" rel="noopener">Volume 1, Part 1 (PDF)</a> ${badge('OFFICIAL_PLANNING')}</dd>
     <dt>PTKL2040 portal</dt><dd><a href="${U.ptklPortal}" target="_blank" rel="noopener">ppkl.dbkl.gov.my</a></dd>
     <dt>JWP 49 redevelopment sites</dt><dd><a href="${U.jwp}" target="_blank" rel="noopener">Lot-level list (PDF)</a> ${badge('OFFICIAL_PLANNING')}</dd>
     <dt>DBKL CPS products and eMap</dt><dd><a href="${U.cps}" target="_blank" rel="noopener">Product list</a>, <a href="${U.emap}" target="_blank" rel="noopener">eMap</a></dd>
     <dt>Urban Renewal Bill</dt><dd><a href="${U.uraStar}" target="_blank" rel="noopener">The Star, 23 Jan 2026</a>, <a href="${U.uraBernama}" target="_blank" rel="noopener">Bernama</a>, <a href="${U.uraVibes}" target="_blank" rel="noopener">The Vibes on s.57 consent</a> ${badge('PRESS_REPORT')}</dd>
     <dt>Transactions and listings</dt><dd><a href="https://www.brickz.my/" target="_blank" rel="noopener">Brickz</a>, <a href="https://www.propertyguru.com.my/" target="_blank" rel="noopener">PropertyGuru</a>, <a href="https://www.iproperty.com.my/" target="_blank" rel="noopener">iProperty</a></dd>
     <dt>Construction cost</dt><dd><a href="${U.arcadis}" target="_blank" rel="noopener">Arcadis Q4 2025 (PDF)</a></dd>
     <dt>Public-map proxy</dt><dd><a href="${U.osm}" target="_blank" rel="noopener">OpenStreetMap way 890986893</a> ${badge('PUBLIC_MAP')}</dd>
    </dl>
   </div>
  </div>`;
}
function bindSources(root){
  root.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{SRCF=b.dataset.f;render()});
  root.querySelectorAll('[data-ck]').forEach(c=>c.onchange=()=>{CHECKS[c.dataset.ck]=c.checked;store.set('checks',CHECKS);render()});
}

