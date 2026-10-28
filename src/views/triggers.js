/* ---------- triggers ---------- */
function triggerTable(list,compact){
  const lab={met:['Met','ok'],no:['Not met','bad'],await:['Awaiting data','na']};
  return `<div class="tw"><table><thead><tr>${compact?'':'<th>Site</th>'}<th>Condition</th><th class="num">Current</th><th class="num">Threshold</th><th>Status</th><th>Basis</th></tr></thead><tbody>
  ${list.map(t=>{const r=evalTrigger(t),L=lab[r.state];return `<tr>${compact?'':`<td>${siteLink(SITE[t.site])}</td>`}<td>${esc(t.l)}${t.note?`<br><span class="small muted">${esc(t.note)}</span>`:''}</td>
   <td class="num">${r.cur===null||r.cur===undefined?'<span class="muted">–</span>':t.f(r.cur)+' '+t.u}</td>
   <td class="num">${isFinite(r.thr)?t.f(r.thr)+' '+t.u:'unreachable'}</td>
   <td><span class="chip ${L[1]}">${L[0]}</span></td>
   <td class="small">${r.state==='await'?'Needs: '+esc(t.need||'data'):t.basis==='scenario'?'Current scenario value':t.basis==='evidence'?'Observed evidence':'Confirmed input'}</td></tr>`}).join('')}
  </tbody></table></div>`;
}
function viewTriggers(){
  const all=TRIGGERS.map(t=>({t,r:evalTrigger(t)}));
  const c=k=>all.filter(a=>a.r.state===k).length;
  return `<div class="page">
   ${head('Triggers','Sites that are neither good nor bad today, and what has to change. Status re-evaluates whenever a scenario or evidence flag changes.')}
   <div class="metrics" style="max-width:640px">
    <div class="metric"><span class="v pos">${c('met')}</span><span class="k">Met</span></div>
    <div class="metric"><span class="v neg">${c('no')}</span><span class="k">Not met</span></div>
    <div class="metric"><span class="v">${c('await')}</span><span class="k">Awaiting data</span></div>
   </div>
   <p class="note small">A “met” status on a scenario-based trigger means your current assumption clears the bar, not that the market has. Only evidence-based and confirmed triggers describe the world.</p>
   ${[...new Set(TRIGGERS.map(t=>t.site))].map(id=>{const s=SITE[id];return `<div class="sec"><div class="sec-head"><h2>${siteLink(s)}</h2><span>${stageTag(s.stage)} ${verdictTag(s.verdict)}</span></div>${triggerTable(TRIGGERS.filter(t=>t.site===id),true)}</div>`}).join('')}
  </div>`;
}

