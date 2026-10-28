/* ---------- deal view ---------- */
function dealCtrl(id,k,l,min,max,step,f,d){
  return `<div class="ctrl"><div class="ctrl-top"><label for="d_${k}">${l}</label><output id="d_${k}_o">${f(d[k])}</output></div>
   <input type="range" id="d_${k}" data-dk="${k}" min="${min}" max="${max}" step="${step}" value="${d[k]}">
   <div class="hint"><span>${f(min)} to ${f(max)}</span><span>${badge(DSRC_OV[k]||DEAL_SRC[k]||'UNDERWRITING_ASSUMPTION')}</span></div></div>`;
}
let DSEL = store.get('dsel','taiping');
function dealOutputs(s,x,d){
  const m=model(x), R=dealCalc(x,m,d), cols=[R.A,R.B,R.C], o=x.owner;
  const names={A:'Cash buyout',B:'Replacement units',C:'JV entitlement'};
  const when={A:'Cash at signing',B:'New unit at completion, plus rent allowance',C:`${fmtPct(R.C.e)} of GDV at completion, plus rent allowance`};
  const best=[...cols].sort((a,b)=>b.after-a.after)[0];
  const status=S=>S.after>=0?['Funds owners and your fee','ok']:S.surplus>=0?['Funds owners, not your fee','warn']:['Short','bad'];
  const row=(l,f,cls='')=>`<tr class="${cls}"><td>${l}</td>${cols.map(S=>`<td class="num${S.key===best.key?' best':''}">${f(S)}</td>`).join('')}</tr>`;
  const maxN={A:maxInterests(x,m,d,'A'),B:maxInterests(x,m,d,'B'),C:maxInterests(x,m,d,'C')};
  const ns=range(5,Math.max(80,o.n*1.6),50).map(Math.round);
  const chart=lineChart({aria:'Developer surplus after your fee by ownership count',
    series:[{name:'Cash buyout',c:0,pts:ns.map(n=>[n,dealCalc(x,m,{...d,e:null},n).A.after/1e6])},
            {name:'Replacement units',c:1,pts:ns.map(n=>[n,dealCalc(x,m,{...d,e:null},n).B.after/1e6])},
            {name:'JV entitlement',c:2,pts:ns.map(n=>[n,dealCalc(x,m,{...d,e:null},n).C.after/1e6])}],
    hl:[{y:0,l:'Break-even after fee',c:'ref'}],vl:[{x:o.n,l:`${o.n} interests`,c:'ref2'}],
    xl:'Ownership interests',yl:'Surplus after fee (RM m)',xf:v=>fmt0(v),yf:v=>fmt0(v)});
  const upCell=(v)=>v===null||v===undefined?'<span class="muted">–</span>':`<span class="${sgnCls(v)}">${fmtSPct(v)}</span>`;
  const bsz = o.com? `${fmt0(R.B.aR)} sf res (${fmtPct(R.B.ratioR,0)} of ${fmt0(d.oldRes)}); ${fmt0(R.B.aC)} sf com (${fmtPct(R.B.ratioC,0)})` : `${fmt0(R.B.aR)} sf (${fmtPct(R.B.ratioR,0)} of ${fmt0(d.oldRes)} sf)`;
  const read = (()=>{
    const out=[];
    if(best.after<0) out.push(`No structure funds the owners and your fee at ${o.n} interests. The best, ${names[best.key].toLowerCase()}, is short by ${fmtM(-best.after,1)}.`);
    else out.push(`${names[best.key]} works best here, leaving ${fmtM(best.after,1)} after your fee.`);
    if(!d.waive && R.B.surplus<R.A.surplus) out.push(`Replacement units cost more than cash because owners must be housed for ${d.T} years (${fmtM(R.rent,1)} net of the relocation allowance). They only pull ahead if the developer waives its margin on the replacement units.`);
    if(d.waive) out.push(`With margin waived on ${fmtM(R.B.VR,0)} of replacement units, the developer gives up ${fmtM(x.profit*R.B.VR,1)} of profit. Test that with a developer before relying on it.`);
    if(d.sizing==='value'&&R.B.ratioR<.8) out.push(`A value-matched residential replacement unit is only ${fmtPct(R.B.ratioR,0)} of the current floor area. Owners who think in square feet will read that as a downgrade.`);
    out.push(`A ${fmtPct(o.up,0)} uplift delivered in ${d.T} years is worth ${fmtSPct(R.B.pvR)} today at a ${fmtPct(d.r,0)} discount rate; deferred structures need a bigger headline number to feel equal to cash.`);
    out.push(`Cash needs ${fmtM(R.A.upfront,1)} on day one; the deferred structures need none, which widens the pool of developers who can fund the deal.`);
    return out;
  })();
  return `<div class="metrics">
    <div class="metric"><span class="v ${sgnCls(m.rlv)}">${fmtM(m.rlv,1)}</span><span class="k">RLV at ${fmt2(x.area)} ac</span></div>
    <div class="metric"><span class="v">${o.n}</span><span class="k">Interests (${fmtPct(o.cs,0)} commercial)</span></div>
    <div class="metric"><span class="v">${fmtM(R.paid,1)}</span><span class="k">Owner packages at ${fmtPct(o.up,0)} uplift</span></div>
    <div class="metric"><span class="v">${fmtM(R.rent,1)}</span><span class="k">Rent allowance, net (${d.T} yrs)</span></div>
   </div>
   <div class="sec"><div class="sec-head"><h2>Three ways to pay the owners</h2><span class="muted">Shaded column leaves the most after your fee</span></div>
   <div class="tw"><table class="cost struct"><thead><tr><th></th>${cols.map(S=>`<th class="num${S.key===best.key?' best':''}">${names[S.key]}</th>`).join('')}</tr></thead><tbody>
    ${row('What owners get',S=>`<span class="small">${when[S.key]}</span>`)}
    ${row('Per residential interest',S=>fmtK(S.perR))}
    ${o.com?row('Per commercial interest',S=>fmtK(S.perC)):''}
    ${row('New unit size',S=>S.key==='B'?`<span class="small">${bsz}</span>`:'<span class="muted">–</span>')}
    ${row('Owner uplift, headline',S=>upCell(S.upR))}
    ${row(`Owner uplift, today’s money (${fmtPct(d.r,0)}, ${d.T} yrs)`,S=>upCell(S.pvR))}
    ${row('Rent allowance paid',S=>S.rent?fmtM(S.rent,1):'<span class="muted">–</span>')}
    ${row('Developer surplus over hurdle',S=>`<b class="${sgnCls(S.surplus)}">${fmtM(S.surplus,1)}</b>`)}
    ${row('Developer margin achieved',S=>`<span class="${S.margin<x.profit?'neg':''}">${fmtPct(S.margin)}</span> <span class="muted small">vs ${fmtPct(x.profit,0)}</span>`)}
    ${row('Day-one cash for land',S=>S.upfront?fmtM(S.upfront,1):'RM0')}
    ${row('Max owner uplift it can fund',S=>upCell(S.maxUp))}
    ${row('Your fee',S=>`${fmtM(S.fee,2)}${S.fundable?'':' <span class="small neg">unfunded</span>'}`)}
    ${row(`Your promote (${fmtPct(d.promote,0)} of surplus)`,S=>fmtM(S.prom,2))}
    ${row('Your payoff',S=>`<b class="${S.payoff>0?'pos':'muted'}">${fmtM(S.payoff,2)}</b>`,'tot')}
    ${row('Interests it can support with your fee',S=>`<b>${maxN[S.key]}</b>`)}
    ${row('Status',S=>{const t=status(S);return `<span class="chip ${t[1]}">${t[0]}</span>`})}
   </tbody></table></div>
   ${!R.B.fits?'<p class="note bad">The replacement units exceed the scheme’s saleable area. Reduce unit size or owner count.</p>':''}
   </div>
   <div class="sec"><div class="sec-head"><h2>Reading</h2>${badge('MODEL_OUTPUT')}</div><ul class="read">${read.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>
   <div class="sec"><div class="sec-head"><h2>Where each structure breaks</h2><span class="muted">Surplus after your fee as the owner count rises; packages value-matched</span></div><div class="chart" style="max-width:760px">${chart}</div></div>`;
}
function viewDeal(id){
  const owned=MODELLED.filter(i=>st(i)&&st(i).owner);
  const sid=owned.includes(id)?id:(owned.includes(DSEL)?DSEL:'taiping'); DSEL=sid; store.set('dsel',sid);
  const s=SITE[sid], x=st(sid), d=dl(sid);
  DSRC_OV = x.owner.mode==='landed'?{oldRes:'UNDERWRITING_ASSUMPTION'}:{};
  const pct0=v=>fmtPct(v,0), pct1=v=>fmtPct(v,1);
  return `<div class="page">
   ${head('Deal structures','The same residual, paid to owners three ways, and what is left for you as originator. Structure changes timing and who carries risk; it rarely creates value on its own.',
     `<div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">${siteSelect(sid,owned.map(i=>SITE[i]),'dealSel')}<a class="btn ghost" style="text-decoration:none" href="#/lab/${sid}">Edit site scenario</a><a class="btn ghost" style="text-decoration:none" href="#/pack/${sid}">Owner briefing pack</a></div>`)}
   <p class="small muted" style="margin-top:-8px">Uses the current scenario for ${esc(s.name)}: ${fmtRM(x.asp)} ASP, PR ${fmt2(x.pr*(1+x.prUp))}×, ${fmt2(x.area)} ac, ${x.owner.n} interests. ${owned.length<2?'Start an owner model for another site in the scenario lab to compare it here.':''}</p>
   <div class="lab-grid">
    <aside class="ctrls" aria-label="Deal controls">
     <p class="ctrl-group" style="margin-top:0">Timing</p>
     ${dealCtrl(sid,'T','Construction period (years)',2,7,.5,v=>fmt1(v)+' yrs',d)}
     ${dealCtrl(sid,'r','Owner discount rate',0,.12,.005,pct1,d)}
     <p class="ctrl-group">Rent allowance while owners wait</p>
     ${dealCtrl(sid,'resRent','Residential, per month',0,6000,100,fmtRM,d)}
     ${dealCtrl(sid,'comRent','Commercial, per month',0,20000,250,fmtRM,d)}
     ${dealCtrl(sid,'reloc','Share of the 2% relocation line used for rent',0,1,.05,pct0,d)}
     <p class="ctrl-group">Replacement units</p>
     <div class="seg" role="group" aria-label="Sizing" style="margin-top:6px"><button type="button" data-dsz="value" aria-pressed="${d.sizing==='value'}">Match owner package</button><button type="button" data-dsz="area" aria-pressed="${d.sizing==='area'}">Match floor area</button></div>
     ${d.sizing==='area'?dealCtrl(sid,'ratio','New area as share of old',.3,1.5,.05,pct0,d):`<label class="tog"><input type="checkbox" id="dPV" ${d.matchPV?'checked':''}>Size units to match the package in today’s money</label>`}
     ${dealCtrl(sid,'oldRes',x.owner.mode==='landed'?'Current house floor area (sf)':'Current residential unit (sf)',400,4000,10,v=>fmt0(v)+' sf',d)}
     ${x.owner.com?dealCtrl(sid,'oldCom','Current commercial unit (sf)',400,4000,10,v=>fmt0(v)+' sf',d):''}
     <label class="tog"><input type="checkbox" id="dWaive" ${d.waive?'checked':''}>Developer waives margin on replacement units</label>
     <p class="ctrl-group">JV entitlement</p>
     <div class="ctrl"><div class="ctrl-top"><label for="d_e">Landowner share of GDV</label><output id="d_e_o">${d.e===null?'Matches package':pct1(d.e)}</output></div>
      <input type="range" id="d_e" data-dk="e" min="0" max=".5" step=".0025" value="${d.e===null?dealCalc(x,model(x),d).C.eReq:d.e}">
      <div class="hint"><span>0% to 50%</span><button type="button" class="btn ghost" id="eReset" style="padding:2px 8px;font-size:11px">Match package</button></div></div>
     <p class="ctrl-group">Your economics</p>
     <div class="seg" role="group" aria-label="Fee basis" style="margin-top:6px"><button type="button" data-fb="owner" aria-pressed="${d.feeBasis==='owner'}">Fee on owner consideration</button><button type="button" data-fb="gdv" aria-pressed="${d.feeBasis==='gdv'}">Fee on GDV</button></div>
     ${dealCtrl(sid,'feeRate','Origination fee rate',0,d.feeBasis==='gdv'?.03:.05,.0025,v=>fmtPct(v,2),d)}
     ${dealCtrl(sid,'promote','Promote on remaining surplus',0,.5,.01,pct0,d)}
     <p class="small muted">Fee and promote are paid by the developer out of surplus above its hurdle. If there is no surplus, there is no fee to collect.</p>
     <p style="margin-top:12px"><button type="button" class="btn ghost" id="dReset">Reset deal assumptions</button></p>
    </aside>
    <div id="dealOut" aria-live="polite">${dealOutputs(s,x,d)}</div>
   </div>
  </div>`;
}
function bindDeal(root){
  const sid=DSEL, s=SITE[sid];
  const sel=root.querySelector('#dealSel'); if(sel) sel.onchange=()=>go('#/deal/'+sel.value);
  const out=root.querySelector('#dealOut'); let raf=0;
  const refresh=()=>{out.innerHTML=dealOutputs(s,st(sid),dl(sid))};
  root.querySelectorAll('[data-dk]').forEach(inp=>inp.oninput=()=>{
    const d=dl(sid), k=inp.dataset.dk, v=parseFloat(inp.value); d[k]=v;
    const o=root.querySelector('#d_'+k+'_o');
    if(o) o.textContent = k==='e'?fmtPct(v,1):k==='T'?fmt1(v)+' yrs':k==='r'?fmtPct(v,1):/Rent$/.test(k)?fmtRM(v):/^old/.test(k)?fmt0(v)+' sf':k==='feeRate'?fmtPct(v,2):fmtPct(v,0);
    cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{refresh();store.set('deal',DEAL)});
  });
  root.querySelectorAll('[data-dsz]').forEach(b=>b.onclick=()=>{dl(sid).sizing=b.dataset.dsz;store.set('deal',DEAL);render()});
  root.querySelectorAll('[data-fb]').forEach(b=>b.onclick=()=>{const d=dl(sid);d.feeBasis=b.dataset.fb;d.feeRate=b.dataset.fb==='gdv'?.005:.02;store.set('deal',DEAL);render()});
  const pv=root.querySelector('#dPV'); if(pv) pv.onchange=()=>{dl(sid).matchPV=pv.checked;store.set('deal',DEAL);refresh()};
  root.querySelector('#dWaive').onchange=e=>{dl(sid).waive=e.target.checked;store.set('deal',DEAL);refresh()};
  root.querySelector('#eReset').onclick=()=>{dl(sid).e=null;store.set('deal',DEAL);render()};
  root.querySelector('#dReset').onclick=()=>{delete DEAL[sid];dl(sid);store.set('deal',DEAL);render();toast('Deal assumptions reset')};
}

