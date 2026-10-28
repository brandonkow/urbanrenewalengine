/* ---------- site comparison: consistent scenario basis, no ranking shortcut ---------- */
let CMP={ids:['taiping','salak','pantai'],basis:'base'};
function comparisonInput(id,basis){
 const s=SITE[id];if(!s?.rlv)return null;
 const x=JSON.parse(JSON.stringify(basis==='live'?st(id):presetState(s,'base')));x.dc=dcRate(x);
 if(basis==='g26'){if(!INC_DEFAULT[id])return null;x.prUp=Math.min(G26.cap,INC_DEFAULT[id].redev);x.sc='g26'}
 return x;
}
function comparisonResult(s,x,evidence,transactions,deals){
 const m=x?model(x):null,own=m?.own;
 const gaps=[];
 if(!s.area||s.area.type!=='OFFICIAL_CADASTRAL')gaps.push('Cadastral site area / boundary unverified');
 if(s.prType!=='OFFICIAL_PLANNING')gaps.push('Parcel plot ratio unverified');
 if(!own)gaps.push('Owner economics not assessed');
 else if(!x.owner.nConfirmed)gaps.push(x.owner.mode==='landed'?'Lot values and ownership roll unverified':'Ownership-interest count unverified');
 if(!transactions.length)gaps.push('No imported completed-sale records');
 else gaps.push('Imported sales and new-product comparability need independent review');
 const ticket=s.area&&own?own.reqTotal:null;
 return {id:s.id,name:s.name,x,m,gaps,evidenceCount:evidence.length,transactionCount:transactions.length,
  coverage:own?.coverage??null,gap:own?Math.max(0,own.reqTotal-m.rlv):null,surplus:own?m.rlv-own.reqTotal:null,
  requiredPR:own?.reqPR??null,requiredASP:own?.reqASP??null,
  areaBasis:!s.area?'Normalised test parcel; assembled site area unknown':x?.areaConfirmed?'User-confirmed area; inspect source':s.area.type==='OFFICIAL_CADASTRAL'?'Cadastral area':'Public-map proxy; boundary unverified',
  buyers:landBuyerFit(s,deals,ticket),ticket};
}
function comparisonRows(){
 return CMP.ids.map(id=>{const s=SITE[id];return comparisonResult(s,comparisonInput(id,CMP.basis),EVIDENCE.filter(e=>e.site===id),txRows(id),LAND_DEALS)});
}
function viewCompare(){
 const rows=comparisonRows(),num=(v,f)=>v===null?'Not assessed':Number.isFinite(v)?f(v):'Not achievable at this ASP';
 const metrics=[
 ['Area basis',r=>esc(r.areaBasis)],
 ['Test area (acres)',r=>r.x?fmt2(r.x.area):'Not modelled'],
 ['Effective plot ratio',r=>r.m?fmt2(r.m.epr)+'×':'Not modelled'],
 ['ASP (RM / saleable sf)',r=>r.x?fmtRM(r.x.asp):'Not modelled'],
 ['RLV per acre',r=>r.m?fmtM(r.m.rlvAc):'Not modelled'],
 ['RLV for test parcel',r=>r.m?fmtM(r.m.rlv):'Not modelled'],
 ['Owner budget for test parcel',r=>r.m?.own?fmtM(r.m.own.reqTotal):'Not assessed'],
 ['Owner coverage',r=>num(r.coverage,v=>fmtPct(v,1))],
 ['Funding shortfall',r=>num(r.gap,fmtM)],
 ['Surplus / deficit',r=>num(r.surplus,fmtM)],
 ['Owner-required PR',r=>num(r.requiredPR,v=>fmt2(v)+'×')],
 ['Owner-required ASP',r=>num(r.requiredASP,v=>fmtRM(v)+' psf')],
 ['Owner test',r=>r.m?.own?esc(ownerStatus(r.m,r.x).l):'Not assessed'],
 ['Evidence entries / imported sales',r=>r.evidenceCount+' / '+r.transactionCount],
 ['Next investigation',r=>esc(SITE[r.id].next||'Evidence gathering required')]
 ];
 return '<div class="page cmp-page">'+head('Compare sites','Compare two to four sites on one scenario basis. Financial coverage does not resolve planning, ownership or market-evidence gaps.')+
 '<form id="cmp-form"><div class="mass-fields">'+[0,1,2,3].map(i=>'<label class="mass-field">Site '+(i+1)+'<select data-cmp="'+i+'"><option value="">'+(i<2?'Choose a site':'Optional')+'</option>'+SITES.map(s=>'<option value="'+s.id+'" '+(CMP.ids[i]===s.id?'selected':'')+'>'+esc(s.name)+'</option>').join('')+'</select></label>').join('')+
 '<label class="mass-field">Scenario basis<select id="cmp-basis">'+[['base','Recorded base: no incentive'],['g26','DBKL incentive as read'],['live','Current live scenarios']].map(([v,l])=>'<option value="'+v+'" '+(CMP.basis===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label></div><button class="btn">Compare selected sites</button><p id="cmp-error" role="alert"></p></form>'+
 '<p class="note info">'+(CMP.basis==='g26'?'Guideline classification as read, with no residing/open-space/transit bonus. Discretionary approval is unresolved.':CMP.basis==='live'?'Live scenarios may contain different presets, incentives and analyst edits. Compare the displayed inputs before comparing outcomes.':'Recorded base inputs with the current global development-charge setting. No discretionary incentive is included.')+' Per-acre residuals normalize scale; total amounts refer only to each displayed test parcel. One-acre village cases are not assembled-site budgets.</p>'+
 '<div class="tw" role="region" tabindex="0" aria-label="Site comparison"><table id="cmp-results"><thead><tr><th>Measure</th>'+rows.map(r=>'<th><a href="#/site/'+r.id+'">'+esc(r.name)+'</a></th>').join('')+'</tr></thead><tbody>'+metrics.map(([label,fn])=>'<tr><th scope="row">'+label+'</th>'+rows.map(r=>'<td>'+fn(r)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+
 '<div class="sec"><h2>Evidence gaps and buyer research</h2><div class="lr-grid">'+rows.map(r=>'<article class="block"><h3>'+esc(r.name)+'</h3><ul>'+r.gaps.map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul><h4>Analytical buyer candidates</h4><p class="small">Heuristic match points, not a probability or expression of interest. Product assumes high-rise redevelopment. '+(r.ticket?'Ticket uses '+fmtM(r.ticket)+' test owner budget; ownership remains subject to review.':'Ticket omitted: total site budget is unknown.')+'</p>'+r.buyers.map(b=>'<p><b>'+esc(b.buyer)+'</b> · '+fmt0(b.score)+'/100<br><span class="small">'+(b.km===null?'Location unknown':'Approx. '+fmt1(b.km)+' km to supporting deal')+'; '+esc(b.deal.intended_use||'product unconfirmed')+'. <a href="#/land/'+b.deal.id+'">Inspect deal evidence</a></span></p>').join('')+'<p><a href="#/transactions/'+r.id+'">Review transactions</a> · <a href="#/site/'+r.id+'">Open dossier</a></p></article>').join('')+'</div></div>'+
 '<p class="small">No composite winner is calculated. A missing owner model is not a pass; a positive surplus does not establish legal assembly or planning feasibility. '+badge('MODEL_OUTPUT')+'</p><button class="btn ghost" id="cmp-export">Export comparison JSON</button></div>';
}
function bindCompare(root){
 root.querySelector('#cmp-form').onsubmit=e=>{e.preventDefault();const ids=[...root.querySelectorAll('[data-cmp]')].map(e=>e.value).filter(Boolean);
  if(ids.length<2||new Set(ids).size!==ids.length){root.querySelector('#cmp-error').textContent='Choose two to four different sites.';return}
  CMP={ids,basis:root.querySelector('#cmp-basis').value};render();
 };
 root.querySelector('#cmp-export').onclick=()=>saveText('klure-comparison.json',JSON.stringify({asOf:new Date().toISOString(),basis:CMP.basis,notice:'Screening outputs; not verified site feasibility.',sites:comparisonRows()},(k,v)=>typeof v==='number'&&!Number.isFinite(v)?'Not achievable':v,2),'application/json');
}


