/* ---------- committee memo: dated snapshots, no decision or evidence promotion ---------- */
const MEMO_BASES={base:'Recorded base — no incentive',g26:'DBKL incentive as read — discretionary',live:'Current live scenario — inspect edits'};
const MEMO_DECISIONS={unreviewed:'Not reviewed by committee',investigate:'Investigate further',hold:'Hold pending evidence',decline:'Do not pursue'};
let MEMO={site:'taiping',basis:'base',decision:'unreviewed',rationale:'',next:'',snapshot:null};
function memoCapture(id,basis,decision='unreviewed',rationale='',next='',at=new Date().toISOString()){
 if(!Object.hasOwn(SITE,id)||!Object.hasOwn(MEMO_BASES,basis)||!Object.hasOwn(MEMO_DECISIONS,decision))throw Error('Choose a valid site, scenario and review position.');
 if(typeof rationale!=='string'||typeof next!=='string'||rationale.length>3000||next.length>3000)throw Error('Notes must be text up to 3,000 characters.');
 if(decision!=='unreviewed'&&!rationale.trim())throw Error('Explain the proposed committee position.');
 const s=SITE[id],x=comparisonInput(id,basis),m=x?model(x):null,ev=ddEvidence(id),r=comparisonResult(s,x,ev,txRows(id),LAND_DEALS);
 let funding=null,fundingError='';
 if(x)try{const p=cfConfig(id,x),c=cfModel(x,p),t=cfTarget(x,p);funding={settings:p,saved:!!CF[id],equityIRR:c.equityIRR,projectIRR:c.projectIRR,peakDebt:c.peakDebt,peakEquity:c.peakEquity,interest:c.interestTotal,profit:c.profit,npv:c.npv,terminalEquity:c.terminalEquity,completion:c.completion,release:c.release,target:t,bridgeError:c.bridgeError}}catch(e){fundingError=e.message}
 const tasks=ddRows(id).map(t=>({id:t.id,title:t.title,need:t.need,status:t.event.status,role:t.event.role,due:t.event.due,review:t.event.review,finding:t.event.finding,url:t.event.url,reference:t.event.reference,changed:t.changed,unreviewed:t.unreviewed,overdue:t.overdue}));
 // JSON snapshot detaches all mutable workspace references and represents unsupported numbers as null.
 return JSON.parse(JSON.stringify({schema:'klure.committee-memo.v1',build:'6.2',createdAt:at,site:{id,name:s.name,place:s.place,ref:s.ref,next:s.next,areaBasis:r.areaBasis},
 basis,decision,rationale:rationale.trim(),next:next.trim(),input:x,model:m,gaps:r.gaps,
 requiredPRReason:m?.own&&!Number.isFinite(m.own.reqPR)?'Not achievable at this ASP':'',
 funding,fundingError,evidence:ev,transactions:txRows(id),tasks,liveConditions:ddGates(id),
 limitations:['Screening model, not a valuation or an offer.','Planning incentives are discretionary scenarios; no approval is inferred.','Funding, timing and owner packages are underwriting assumptions.','Recorded task reviews and imported transactions are analyst assertions, not independent verification.','No committee approval or owner consent is created by this memo.']}));
}
function memoValue(v,f=fmtM){return typeof v==='number'&&Number.isFinite(v)?f(v):'Not assessed'}
function memoRows(rows){return '<table class="memo-table"><tbody>'+rows.map(([k,v])=>'<tr><th scope="row">'+esc(k)+'</th><td>'+esc(v)+'</td></tr>').join('')+'</tbody></table>'}
function memoBody(d){
 const x=d.input,m=d.model,o=m?.own,f=d.funding;
 const inputs=x?[
 ['Test parcel area (acres)',memoValue(x.area,fmt2)],['Area basis',d.site.areaBasis],
 ['Base PR / uplift / effective PR',fmt2(x.pr)+'× / '+fmtPct(x.prUp,1)+' / '+fmt2(m.epr)+'×'],
 ['ASP (RM / saleable sf)',fmtRM(x.asp)],['Hard cost (RM / GFA sf)',fmtRM(x.hc)],['Saleable efficiency',fmtPct(x.eff,1)],
 ['Professional fees / contingency (% hard cost)',fmtPct(x.pf,1)+' / '+fmtPct(x.cont,1)],
 ['Statutory / selling / flat finance (% GDV)',fmtPct(x.stat,1)+' / '+fmtPct(x.sm,1)+' / '+fmtPct(x.fin,1)],
 ['Demolition / profit reserve (% GDV)',fmtPct(x.demo,1)+' / '+fmtPct(x.profit,1)],
 ['Development-charge setting',fmtPct(x.dc,1)],
 ...(o?[['Ownership interests tested',fmt1(o.n)],['Owner-count basis',x.owner.nConfirmed?'User-confirmed setting; verify the cited records':'Unverified / derived assumption'],['Owner package per interest',fmtRM(o.per)],['Owner uplift / holdout allowance',fmtPct(x.owner.up,1)+' / '+fmtPct(x.owner.hold||0,1)]]:[])
 ]:[['Model status','No development model; no financial result is inferred']];
 const financial=[
 ['GDV for test parcel',memoValue(m?.gdv)],['Static residual land value',memoValue(m?.rlv)],
 ['Static residual per acre',memoValue(m?.rlvAc)],['Required owner consideration',memoValue(o?.reqTotal)],
 ['Owner coverage',memoValue(o?.coverage,v=>fmtPct(v,1))],
 ['Owner funding shortfall',o?fmtM(Math.max(0,o.reqTotal-m.rlv)):'Owner model missing'],
 ['Owner-required ASP (RM / saleable sf)',memoValue(o?.reqASP,fmtRM)],
 ['Owner-required PR',d.requiredPRReason||memoValue(o?.reqPR,v=>fmt2(v)+'×')]
 ];
 const funding=f?memoRows([
 ['Cash-flow settings',f.saved?'Saved settings: absolute land/facility amounts retained':'Illustrative defaults for the selected scenario'],
 ['Structure / owner consideration',f.settings.structure+' / '+fmtM(f.settings.land)],
 ['Signing cash / debt deficit share',fmtPct(f.settings.upfront/100,1)+' / '+fmtPct(f.settings.debt/100,1)],
 ['Facility / annual interest',fmtM(f.settings.facility)+' / '+fmtPct(f.settings.rate/100,1)],
 ['Deposit / retention / release lag',fmtPct(f.settings.deposit/100,1)+' / '+fmtPct(f.settings.retention/100,1)+' / '+f.settings.lag+' quarters'],
 ['Additional relocation / other costs',fmtM(f.settings.rent)+' / '+fmtM(f.settings.extra)],
 ['Completion / retention release', 'Q'+f.completion+' / Q'+f.release],
 ['Developer equity IRR',f.equityIRR.value===null?f.equityIRR.reason:fmtPct(f.equityIRR.value,1)],
 ['Project IRR before financing',f.projectIRR.value===null?f.projectIRR.reason:fmtPct(f.projectIRR.value,1)],
 ['Peak debt / peak equity',fmtM(f.peakDebt)+' / '+fmtM(f.peakEquity)],
 ['Modelled interest / pre-tax equity profit',fmtM(f.interest)+' / '+fmtM(f.profit)],
 ['Final equity call to repay debt',fmtM(f.terminalEquity)],
 ['Target return / equity NPV',fmtPct(f.settings.target/100,1)+' / '+fmtM(f.npv)],
 ['Nominal consideration at target return',f.target.land===null?f.target.reason:fmtM(f.target.land)+' — '+f.target.reason],
 ['Static reconciliation difference (RM)',fmtRM(f.bridgeError)]
 ])+'<p class="memo-small">Funding terms are assumptions. Quarter-end netting excludes intraperiod peaks, taxes, unentered lender fees, statutory account restrictions and promote. The target consideration is not a valuation or an agreed offer.</p>'+
 '<details class="memo-profiles"><summary>Quarterly construction and sales assumptions</summary><p>Percentages from Q1; each profile totals 100%.</p>'+
 memoRows([['Construction',f.settings.construction.map(v=>fmt2(v)).join(', ')],['Sales take-up',f.settings.sales.map(v=>fmt2(v)).join(', ')]])+'</details>':
 '<p>'+esc(d.fundingError?'Funding calculation unavailable: '+d.fundingError:'No development model; funding cannot be assessed.')+'</p>';
 const pending=d.tasks.filter(t=>t.unreviewed);
 return '<article class="committee-memo"><header><p class="memo-kicker">KL Urban Renewal Engine · Committee discussion · Build '+esc(d.build)+'</p><h1>'+esc(d.site.name)+'</h1><p>'+esc(d.site.place||'')+' · '+esc(d.site.ref||'')+'</p><p>Snapshot: '+esc(d.createdAt)+' (UTC)<br>Scenario: <b>'+esc(MEMO_BASES[d.basis])+'</b></p></header>'+
 '<section><h2>1. Proposed committee position</h2><p class="memo-position">'+esc(MEMO_DECISIONS[d.decision])+'</p><p class="memo-pre">'+esc(d.rationale||'No analyst rationale recorded. Committee review remains outstanding.')+'</p>'+
 '<p>Financial owner test: <b>'+(o?(o.coverage>=1?'Coverage reaches 100% in this scenario':'Coverage falls below 100% in this scenario'):'Not assessed — owner model missing')+'</b>. This does not clear the evidence gaps below.</p>'+
 '<p class="memo-warning">'+esc(d.site.areaBasis)+'. Total amounts apply to the test parcel; confirm the actual assembled site before relying on them.</p></section>'+
 '<section><h2>2. Economics</h2><p class="memo-small">Model outputs from the selected scenario; static residual retains its finance and profit allowances.</p>'+memoRows(financial)+'</section>'+
 '<section><h2>3. Assumptions behind the result</h2><p class="memo-small">Scenario inputs are underwriting assumptions unless supported by the cited evidence. “As read” uses the guideline classification; live scenarios may include analyst edits.</p>'+memoRows(inputs)+'</section>'+
 '<section><h2>4. Funding and timing</h2>'+funding+'</section>'+
 '<section><h2>5. Evidence gaps and investigation work</h2><ul>'+d.gaps.map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul>'+
 '<p>'+pending.length+' of '+d.tasks.length+' tasks await review or recheck. A recorded review does not resolve an underlying condition automatically.</p>'+
 '<div class="memo-tasks">'+d.tasks.map(t=>'<div class="memo-task"><h3>'+esc(t.title)+'</h3><p>'+esc(DD_STATUS[t.status])+' · '+esc(DD_ROLE[t.role])+' · '+esc(DD_FINDING[t.finding])+
 '<br>Due: '+esc(t.due||'Not set')+' · Review: '+esc(t.review||'Not recorded')+(t.changed?' · Evidence changed; recheck required':'')+(t.overdue?' · Overdue':'')+
 '</p><p>'+esc(t.need)+'</p>'+(t.url?'<p>'+ddLink(t.url,t.reference||t.url)+'</p>':'')+'</div>').join('')+'</div></section>'+
 '<section><h2>6. Current live trigger conditions</h2><p class="memo-warning">Captured from the live workspace at the snapshot time. These conditions may use different inputs from the selected memo scenario. A met numerical threshold is not approval or verified consent.</p>'+
 (d.liveConditions.length?'<ul>'+d.liveConditions.map(g=>'<li><b>'+esc(g.label)+'</b> — '+({await:'Awaiting data',no:'Not met',met:'Met'}[g.state]||'Not assessed')+'<p>'+esc(g.basis)+' · '+esc(g.need)+'</p></li>').join('')+'</ul>':'<p>No configured triggers. This does not imply clearance.</p>')+'</section>'+
 '<section><h2>7. Next actions</h2><p class="memo-pre">'+esc(d.next||d.site.next||'Assign investigation work and obtain the missing evidence before a decision.')+'</p><p>Committee decision and sign-off: not recorded by this report.</p></section>'+
 '<section class="memo-evidence"><h2>8. Evidence register at snapshot</h2><p class="memo-small">Types, confidence and check dates below are retained as recorded; generation does not refresh sources. Imported transactions: '+d.transactions.length+' (provisional). Review raw records and comparability in Transactions; no transaction is independently verified by this export.</p>'+
 (d.evidence.length?d.evidence.map(e=>'<div class="memo-source"><h3>'+esc(e.f)+'</h3><p>'+esc(e.v)+'</p><p class="memo-small">'+esc(e.type)+' · Confidence: '+esc(e.conf)+' · Checked: '+esc(e.chk||'Not recorded')+'</p><p>'+esc(e.n)+'</p><p>'+ddLink(e.url,e.url)+'</p></div>').join(''):'<p>No evidence entries available.</p>')+'</section>'+
 '<footer><h2>Scope and limitations</h2><ul>'+d.limitations.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><p>This is a dated discussion snapshot. Later changes to scenarios, source records and reviews do not update it. Regenerate and compare before reuse.</p></footer></article>';
}
const MEMO_EXPORT_CSS='body{--ink:#172b38;--paper:#fff;--rule:#999;--link:#154c72;font:15px/1.5 system-ui,sans-serif;color:var(--ink);background:var(--paper);margin:32px auto;max-width:900px;padding:0 20px}h1{font-size:30px}h2{font-size:21px;margin-top:30px;border-bottom:1px solid var(--rule)}h3{font-size:16px}a{color:var(--link);overflow-wrap:anywhere}.memo-table{border-collapse:collapse;width:100%;table-layout:fixed}.memo-table th,.memo-table td{text-align:left;vertical-align:top;border-bottom:1px solid var(--rule);padding:7px;overflow-wrap:anywhere}.memo-table th{width:45%}.memo-small,.memo-kicker{font-size:12px}.memo-pre{white-space:pre-wrap}.memo-warning,.memo-position{border-left:3px solid var(--rule);padding:10px}.memo-source,.memo-task{border-bottom:1px solid var(--rule);padding:8px 0;overflow-wrap:anywhere}.memo-position{font-weight:bold}section,footer{margin-top:24px}@page{size:A4;margin:14mm}@media print{body{margin:0;padding:0;font-size:10pt;max-width:none}h1{font-size:21pt}h2{font-size:14pt;break-after:avoid}h3{break-after:avoid}.memo-table tr,.memo-task,.memo-source{break-inside:avoid}.memo-profiles{display:block}}';
function memoHTML(d){
 // Standalone report is intentionally script-free; all dynamic text is escaped by memoBody.
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(d.site.name)+' — Committee memo</title><style>'+MEMO_EXPORT_CSS+'</style></head><body>'+memoBody(d).replace('<details class="memo-profiles">','<details class="memo-profiles" open>')+'</body></html>';
}
function viewMemo(id){
 if(Object.hasOwn(SITE,id)&&MEMO.site!==id){MEMO.site=id;MEMO.snapshot=null}
 if(!MEMO.snapshot)MEMO.snapshot=memoCapture(MEMO.site,MEMO.basis,MEMO.decision,MEMO.rationale,MEMO.next);
 return '<div class="page memo-page"><div class="no-print">'+head('Committee decision memo','Create a dated discussion report from a selected scenario, funding assumptions and the evidence register.')+
 '<form id="memo-form"><div class="mass-fields"><label class="mass-field">Site'+siteSelect(MEMO.site,SITES,'memo-site')+'</label><label class="mass-field">Scenario basis<select id="memo-basis">'+Object.entries(MEMO_BASES).map(([k,v])=>'<option value="'+k+'" '+(k===MEMO.basis?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label class="mass-field">Proposed position<select id="memo-decision">'+Object.entries(MEMO_DECISIONS).map(([k,v])=>'<option value="'+k+'" '+(k===MEMO.decision?'selected':'')+'>'+v+'</option>').join('')+'</select></label></div>'+
 '<div class="cols"><label class="mass-field">Analyst rationale<textarea id="memo-rationale" rows="3" maxlength="3000">'+esc(MEMO.rationale)+'</textarea></label><label class="mass-field">Next actions<textarea id="memo-next" rows="3" maxlength="3000">'+esc(MEMO.next)+'</textarea></label></div>'+
 '<p class="small">Do not enter owner personal data, access tokens or private document contents. Notes stay in this session until exported. Changing these controls does not update the report until you generate it.</p><button class="btn" type="submit">Generate / refresh snapshot</button><p id="memo-error" role="alert"></p></form>'+
 '<p class="memo-actions"><button class="btn ghost" id="memo-print" type="button">Print / save as PDF</button><button class="btn ghost" id="memo-html" type="button">Export standalone HTML</button><button class="btn ghost" id="memo-json" type="button">Export snapshot JSON</button></p>'+
 '<p class="note" id="memo-stamp">Exports use the displayed snapshot captured at '+esc(MEMO.snapshot.createdAt)+'. Review the scenario and refresh after changing underlying data.</p></div>'+memoBody(MEMO.snapshot)+'</div>';
}
function bindMemo(root){
 root.querySelector('#memo-form').onsubmit=e=>{e.preventDefault();try{
  const site=root.querySelector('#memo-site').value,basis=root.querySelector('#memo-basis').value,decision=root.querySelector('#memo-decision').value,rationale=root.querySelector('#memo-rationale').value,next=root.querySelector('#memo-next').value;
  const snapshot=memoCapture(site,basis,decision,rationale,next);MEMO={site,basis,decision,rationale,next,snapshot};
  if(location.hash!=='#/memo/'+site)go('#/memo/'+site);else render();
 }catch(err){root.querySelector('#memo-error').textContent=err.message}};
 root.querySelector('#memo-print').onclick=()=>{root.querySelectorAll('.memo-profiles').forEach(e=>e.open=true);window.print()};
 root.querySelector('#memo-html').onclick=()=>saveText('committee-memo-'+MEMO.snapshot.site.id+'.html',memoHTML(MEMO.snapshot),'text/html');
 root.querySelector('#memo-json').onclick=()=>saveText('committee-memo-'+MEMO.snapshot.site.id+'.json',JSON.stringify(MEMO.snapshot,null,2),'application/json');
}
