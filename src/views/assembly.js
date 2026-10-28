/* ---------- assembly view ---------- */
let ASEL = store.get('asel','taiping');
function viewAssembly(id){
  const owned=MODELLED.filter(i=>st(i)&&st(i).owner);
  const sid=owned.includes(id)?id:(owned.includes(ASEL)?ASEL:'taiping'); ASEL=sid; store.set('asel',sid);
  const s=SITE[sid], x=st(sid), m=model(x), n=x.owner.n, a=asm(sid,n), items=a.items.slice(0,n);
  const cnt=[0,0,0,0,0]; items.forEach(it=>cnt[it.s]++);
  const signed=cnt[3], pct=signed/n, per=m.own.per, committed=signed*per, remainingRLV=m.rlv-committed, remainingNeed=(n-signed)*per;
  const sel=Math.min(a.sel||0,n-1), it=items[sel];
  const blocked=cnt[4]>0;
  const grid=items.map((q,i)=>`<button type="button" class="aq a-${ASM_ST[q.s][1]}${i===sel?' on':''}" data-aq="${i}" aria-label="Interest ${i+1}${q.l?' '+esc(q.l):''}: ${ASM_ST[q.s][0]}" aria-pressed="${i===sel}">${q.l?esc(q.l.slice(0,4)):i+1}</button>`).join('');
  const extra=a.items.length>n?a.items.slice(n).filter(q=>q.s>0||q.l).length:0;
  return `<div class="page">
   ${head('Assembly','Consent, interest by interest. Under current law every interest must sign before a strata scheme can be terminated for redevelopment.',
    `<div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">${siteSelect(sid,owned.map(i=>SITE[i]),'asmSel')}</div>`)}
   <div class="metrics">
    <div class="metric"><span class="v">${signed} of ${n}</span><span class="k">Signed</span></div>
    <div class="metric"><span class="v">${fmtPct(pct,0)}</span><span class="k">Consent</span></div>
    <div class="metric"><span class="v ${blocked?'neg':''}">${cnt[4]}</span><span class="k">Refused</span></div>
    <div class="metric"><span class="v">${fmtM(committed,1)}</span><span class="k">Committed at ${fmtK(per)} each</span></div>
    <div class="metric"><span class="v ${remainingRLV<remainingNeed?'neg':''}">${fmtM(remainingRLV-remainingNeed,1)}</span><span class="k">Residual left after all remaining packages</span></div>
   </div>
   <div class="consent" aria-hidden="true">
    <i style="width:${pct*100}%"></i>
    <b style="left:75%"><span>75%</span></b><b style="left:80%"><span>80%</span></b><b class="req" style="left:100%"><span>100% required</span></b>
   </div>
   <p class="small muted">The 75% and 80% marks are the thresholds proposed in the withdrawn Urban Renewal Bill. They are shown for reference only; they are not law.</p>
   ${blocked?`<p class="note bad">${cnt[4]} refusal${cnt[4]>1?'s':''} on record. Under unanimous consent the scheme cannot proceed until ${cnt[4]>1?'they convert':'it converts'} or the plan excludes ${cnt[4]>1?'those parcels':'that parcel'}.</p>`:''}
   <div class="cols" style="margin-top:22px">
    <div>
     <div class="sec-head"><h2>Interests</h2><span class="muted">Select a square to update it</span></div>
     <div class="agrid" role="group" aria-label="Ownership interests">${grid}</div>
     <div class="alegend">${ASM_ST.map(([l,c],i)=>`<span><i class="aq a-${c}"></i>${l} (${cnt[i]})</span>`).join('')}</div>
     ${extra?`<p class="small muted">${extra} tracked record${extra>1?'s sit':' sits'} beyond the current count of ${n}. Raise the count in the lab to see ${extra>1?'them':'it'}.</p>`:''}
    </div>
    <div>
     <div class="side">
      <h2>Interest ${sel+1}</h2>
      <label class="small muted" for="aLab" style="display:block;margin-top:6px">Unit or parcel label</label>
      <input type="text" id="aLab" value="${esc(it.l)}" maxlength="24" placeholder="For example 27-G or parcel 12" style="width:100%;border:1px solid var(--rule);background:var(--paper);border-radius:4px;padding:6px 8px">
      <p class="small muted" style="margin-top:6px">Use unit or parcel labels, not owners’ names or contact details.</p>
      <p class="small muted" style="margin:12px 0 4px">Status</p>
      <div class="seg" role="group" aria-label="Status" style="flex-wrap:wrap">${ASM_ST.map(([l],i)=>`<button type="button" data-as="${i}" aria-pressed="${it.s===i}">${l}</button>`).join('')}</div>
      <p style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn ghost" id="aPrev">Previous</button><button type="button" class="btn ghost" id="aNext">Next</button></p>
     </div>
     <div class="sec" style="margin-top:22px"><div class="sec-head"><h2>Pipeline</h2></div>
      <table class="cost"><tbody>${ASM_ST.map(([l],i)=>`<tr><td>${l}</td><td class="num">${cnt[i]}</td><td class="num muted">${fmtPct(cnt[i]/n,0)}</td></tr>`).join('')}</tbody></table>
      <p class="small muted" style="margin-top:10px">Interest count comes from the site scenario (${x.owner.nConfirmed?'confirmed from the strata roll':'not yet confirmed'}). ${SYNC.mode==='synced'?'Tracking saves privately to your account.':'Tracking is saved in this browser.'}</p>
      <p><button type="button" class="btn ghost" id="aClear">Clear all tracking for this site</button></p>
     </div>
    </div>
   </div>
  </div>`;
}
function bindAssembly(root){
  const sid=ASEL, a=ASM[sid], n=st(sid).owner.n;
  const sel=root.querySelector('#asmSel'); if(sel) sel.onchange=()=>go('#/assembly/'+sel.value);
  const save=()=>store.set('asm',ASM);
  root.querySelectorAll('[data-aq]').forEach(b=>b.onclick=()=>{a.sel=+b.dataset.aq;save();render();const f=document.querySelector(`[data-aq="${a.sel}"]`);if(f)f.focus()});
  root.querySelectorAll('[data-as]').forEach(b=>b.onclick=()=>{a.items[a.sel].s=+b.dataset.as;save();render()});
  const lab=root.querySelector('#aLab'); let t=0;
  lab.oninput=()=>{a.items[a.sel].l=lab.value;clearTimeout(t);t=setTimeout(()=>{save();const q=document.querySelector(`[data-aq="${a.sel}"]`);if(q)q.textContent=lab.value?lab.value.slice(0,4):a.sel+1},400)};
  lab.onchange=()=>{clearTimeout(t);save();const q=document.querySelector(`[data-aq="${a.sel}"]`);if(q){q.textContent=lab.value?lab.value.slice(0,4):a.sel+1;q.setAttribute('aria-label',`Interest ${a.sel+1} ${lab.value}`)}};
  root.querySelector('#aPrev').onclick=()=>{a.sel=(a.sel-1+n)%n;save();render()};
  root.querySelector('#aNext').onclick=()=>{a.sel=(a.sel+1)%n;save();render()};
  armConfirm(root.querySelector('#aClear'),()=>{delete ASM[sid];save();render();toast('Tracking cleared')});
}

