/* ---------- universe ---------- */
let UQ='';
function viewUniverse(){
  const cats=[['Residential',91],['Commercial',14],['Industrial',3],['Mixed development',1],['Institution / public facilities',14],['Infrastructure & utilities',15],['Transportation',1]];
  const bySpec=Object.fromEntries(SITES.filter(s=>s.group==='specific').map(s=>[s.spec,s]));
  const byJwp=Object.fromEntries(SITES.filter(s=>s.jwp).map(s=>[s.jwp,s]));
  const q=UQ.trim().toLowerCase();
  const jw=RAW.jwp.filter(j=>!q||[j.name,j.mukim,j.parl,j.lots,j.cat].join(' ').toLowerCase().includes(q));
  return `<div class="page">
   ${head('Site universe','The planning lists the watchlist is drawn from. A named planning area is not a legal lot boundary.')}
   <div class="cols3">
    <div><h3>PTKL 139 priority redevelopment sites</h3><table class="cost"><tbody>${cats.map(c=>`<tr><td>${c[0]}</td><td class="num">${c[1]}</td></tr>`).join('')}<tr class="tot"><td>Total</td><td class="num">139</td></tr></tbody></table><p class="small muted" style="margin-top:8px">Indicative map only. Geometry not yet ingested.</p></div>
    <div style="grid-column:span 2"><h3>Geometry types the engine keeps apart</h3><dl class="kv small"><dt>Planning area</dt><dd>Named area in PTKL; indicative</dd><dt>Redevelopment polygon</dt><dd>DBKL specific-site polygon; paid GIS layer</dd><dt>Cadastral lot</dt><dd>Surveyed land parcel (JWP lists lot numbers)</dd><dt>Strata parcel</dt><dd>The legal ownership interest that must be paid</dd><dt>Public-map proxy</dt><dd>OSM or similar; screening only</dd></dl></div>
   </div>
   <div class="sec"><div class="sec-head"><h2>Eight specific redevelopment incentive sites</h2><span class="muted">PTKL2040 development control</span></div>
    <div class="tw"><table><thead><tr><th>Site</th><th>Access</th><th>Zone</th><th class="num">Base PR</th><th>Assembly condition</th><th>Why it matters</th></tr></thead><tbody>
    ${RAW.spec.map(p=>{const s=bySpec[p.name];return `<tr><td>${s?siteLink(s,p.name):esc(p.name)}</td><td class="small">${esc(p.access)}</td><td>${esc(p.zone)}</td><td class="num">${esc(p.pr)}</td><td class="small">${esc(p.cond)}</td><td class="small">${esc(p.why)}</td></tr>`}).join('')}
    </tbody></table></div></div>
   <div class="sec"><div class="sec-head"><h2>JWP 49 exact-lot sites</h2><label class="small">Filter <input type="search" id="uq" value="${esc(UQ)}" placeholder="Name, mukim, parliament or lot"></label></div>
    <div class="tw"><table><thead><tr><th class="num">No.</th><th>Site</th><th>Category</th><th>Mukim / Seksyen</th><th>Parliament</th><th>Official lots</th><th>Watchlist</th></tr></thead><tbody>
    ${jw.map(j=>{const s=byJwp[j.no];return `<tr><td class="num">${j.no}</td><td>${s?siteLink(s,j.name):esc(j.name)}</td><td class="small">${esc(j.cat)}</td><td>${esc(j.mukim)}</td><td>${esc(j.parl)}</td><td class="small" style="max-width:380px">${esc(j.lots)}${j.no===33?' <span class="chip warn">check 747831</span>':''}</td><td>${s?stageTag(s.stage):'<span class="muted small">Not screened</span>'}</td></tr>`}).join('')||'<tr><td colspan="7" class="muted">No sites match that filter.</td></tr>'}
    </tbody></table></div></div>
  </div>`;
}
function bindUniverse(root){const i=root.querySelector('#uq');if(i){i.oninput=()=>{UQ=i.value;const pos=i.selectionStart;render();const n=document.querySelector('#uq');n.focus();n.setSelectionRange(pos,pos)}}}

