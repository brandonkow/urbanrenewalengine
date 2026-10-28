/* ---------- method ---------- */
function viewMethodCore(){
  const sum=Object.values(V2W).reduce((a,b)=>a+b,0);
  return `<div class="page">
   ${head('Method','How every number is produced, and how the engine ranks sites.')}
   <div class="cols">
    <div>
     <div class="block"><h3>Residual land value</h3><pre class="formula">effective PR = base PR × (1 + PR uplift)
GFA = land sf × effective PR
saleable = GFA × efficiency
GDV = saleable × ASP
hard = GFA × hard cost
RLV = GDV − hard × (1 + fees + contingency)
      − GDV × (statutory + sales + finance + demolition + profit)
breakeven ASP = hard cost × (1 + fees + contingency)
              ÷ (efficiency × (1 − GDV-based costs))</pre>
      <p class="small">RLV is the budget left for land and owner consideration. It is not developer profit, and it is before acquisition taxes and legal costs.</p></div>
     <div class="block"><h3>Owner economics</h3><pre class="formula">weighted value = residential × (1 − commercial share)
               + commercial × commercial share
package = weighted value × (1 + uplift)
owner budget = interests × package × (1 + holdout reserve)
max interests = RLV ÷ (package × (1 + holdout))
required ASP = (budget ÷ land sf ÷ PR + cost per GFA sf)
             ÷ (efficiency × (1 − GDV-based costs))
required PR = budget ÷ land sf ÷ (ASP × k − cost per GFA sf)
decision rule: RLV &gt; owner budget</pre></div>
     <div class="block"><h3>Deal structures</h3><pre class="formula">rent = years × 12 × (res interests × res rent + com interests × com rent)
       − share of the 2% relocation line
A cash:   surplus = RLV − Σ packages               (paid day one)
B units:  unit area = package ÷ ASP  (or old area × ratio)
          surplus = RLV − units at ASP × (1 − sales%
                    − profit% if margin waived) − rent
C JV:     surplus = RLV − entitlement% × GDV − rent
owner uplift today = headline value ÷ (1 + r)^years ÷ current − 1
your fee = rate × owner consideration (or × GDV)
your payoff = fee + promote × (surplus − fee), only if surplus ≥ fee</pre>
      <p class="small">Surplus is measured above the developer’s profit hurdle, so developer margin achieved = hurdle + surplus ÷ GDV.</p></div>
     <div class="block"><h3>DBKL 2026 incentive guideline</h3><pre class="formula">Category B (plot ratio)
share = min((redevelopment + residing + open space) × eligibility
            + transit zone, 70%)
  redevelopment 50% / 30% / 15%; residing 30% (commercial zones);
  open space ≤10%; transit zone ≤20%
  eligibility 100% if structures cover >50% of the site, else 50%
effective PR = base PR × (1 + share)
most reachable = same, with open space 10%, transit 20%
  and residing 30% (commercial zones only), capped at 70%

Category A (density, fully residential)
units = persons per acre × acres ÷ persons per unit
controlled ≥ share × units (rounded up); replacement units count
MADANI : RMM after replacement = 50:50 (≥10 acres), 30:70 (&lt;10)
GDV = (market + replacement) × unit size × ASP
      + MADANI × RM200k + RMM × RM300k
GFA = [(market + replacement) × unit size
      + MADANI × 750 sf + RMM × 900 sf] ÷ efficiency</pre>
      <p class="small">Replacement units are valued at market, so the owner test stays cash-equivalent. Under Category A the development charge applies only to the free-market share of floor area above the base, because replacement, MADANI and RMM floor area is relieved. Villages are modelled per acre, so tick “scheme of 10 acres or more” where the real scheme is that large.</p></div>
     <div class="block"><h3>Planning intensity and levers</h3><pre class="formula">incentive GFA = land sf × (effective PR − base PR)
development charge = rate × incentive GFA × (ASP × k − cost per GFA sf)
E (PR that still earns residual) = PR − rate × (PR − base PR)
required ASP = (budget ÷ land sf ÷ E + cost per GFA sf) ÷ k
required hard cost = (ASP × k − budget ÷ land sf ÷ E)
                     ÷ (1 + fees + contingency)
owner package move = coverage − 1
k = efficiency × (1 − GDV-based costs − profit)</pre>
      <p class="small">Each lever is solved holding every other input fixed, so the moves are alternatives, not a combined plan.</p></div>
     <div class="block"><h3>Landed owners and calibration</h3><pre class="formula">lots = site sf × share in lots ÷ lot size
value per lot = lot size × lot value psf
payable lot value = RLV ÷ (site sf × share in lots)
                    ÷ ((1 + uplift) × (1 + holdout))
implied PR from a land price = land psf
   ÷ (ASP × eff × (1 − GDV costs) − hard × (1 + fees + cont.))
implied PR from a project = units × size ÷ eff ÷ land sf</pre>
      <p class="small">Coverage below 60% returns owner density blocked even when the count is unconfirmed: no plausible count fixes a gap that large.</p></div>
     <div class="block"><h3>Model verdict logic</h3><dl class="kv small">
      <dt>PR not official</dt><dd>${verdictTag('PLANNING_UNCERTAIN')}</dd>
      <dt>RLV ≤ 0, ASP within 10% of breakeven</dt><dd>${verdictTag('TRIGGER_WATCH')}</dd>
      <dt>RLV ≤ 0, gap over 10%</dt><dd>${verdictTag('END_VALUE_TOO_LOW')}</dd>
      <dt>Coverage ≥ 1.25, count confirmed</dt><dd>${verdictTag('STRONG_BASE_CASE')}</dd>
      <dt>Coverage &lt; 1, count confirmed</dt><dd>${verdictTag('OWNER_DENSITY_BLOCKED')}</dd>
      <dt>Coverage &lt; 0.6, whatever is confirmed</dt><dd>${verdictTag('OWNER_DENSITY_BLOCKED')}</dd>
      <dt>Coverage 0.6–1.25, count or lot value unconfirmed</dt><dd>${verdictTag('CONDITIONAL_HIGH_POTENTIAL')}</dd></dl>
      <p class="small muted" style="margin-top:8px">Coverage = RLV ÷ owner budget. Recorded verdicts (analyst calls such as too fragmented or already in play) are kept separately from the model suggestion.</p></div>
    </div>
    <div>
     <div class="block"><h3>Opportunity score V2 weights</h3>
      <table class="cost"><tbody>${Object.keys(V2W).map(k=>`<tr><td><label for="w_${k}">${V2_LABEL[k]}</label></td><td class="num"><input class="wt" type="number" id="w_${k}" data-w="${k}" min="0" max="100" step="1" value="${Math.round(V2W[k]*100)}"> %</td></tr>`).join('')}
      <tr class="tot"><td>Total</td><td class="num ${Math.abs(sum-1)>.001?'neg':''}">${Math.round(sum*100)}%</td></tr></tbody></table>
      <p class="small muted" style="margin-top:6px">Scores are normalised by the total, so weights need not sum to 100. <button type="button" class="btn ghost" id="wReset">Reset weights</button></p>
      <p class="small">V1 (original): structural upside 35%, planning clarity 25%, dealability 25%, information edge 15%. V2 replaces qualitative upside with the modelled residual gap and adds owner feasibility, because owner density proved decisive.</p></div>
     <div class="block"><h3>Provenance badges</h3><dl class="kv small">
      ${Object.keys(SRC).map(k=>`<dt>${badge(k)}</dt><dd>${({OFFICIAL_PLANNING:'PTKL, JWP or DBKL planning documents',OFFICIAL_CADASTRAL:'Surveyed lot boundary or area',OFFICIAL_STRATA:'Strata roll or title data',TRANSACTION:'Filed transaction evidence',ASKING_LISTING:'Asking price or rent',PRESS_REPORT:'Published news or third-party benchmark',COMPANY_FILING:'Company filing or annual report; completion requires an explicit statement',COMPANY_RELEASE:'Primary company press release; status must be read separately',PUBLIC_MAP:'OSM or other non-legal geometry',INFERRED:'Analyst inference or judgement',UNDERWRITING_ASSUMPTION:'Chosen model input',MODEL_OUTPUT:'Calculated by the engine',MISSING:'Needed but not yet obtained',EDITED:'Changed in the scenario lab'})[k]}</dd>`).join('')}</dl></div>
     <div class="block"><h3>Stages</h3><p class="small">${STAGES.map(stageTag).join(' &nbsp; ')}</p></div>
     <div class="block"><h3>Not in scope yet</h3><p class="small">Powered industrial land and old-office adaptive reuse modules. The RLV engine is reusable for adaptive reuse; powered land needs grid, substation, water and fibre layers first.</p></div>
    </div>
   </div>
  </div>`;
}
function bindMethodCore(root){
  root.querySelectorAll('[data-w]').forEach(i=>i.onchange=()=>{const v=Math.max(0,Math.min(100,parseFloat(i.value)||0));V2W[i.dataset.w]=v/100;store.set('v2w',V2W);render();toast('Weights updated')});
  root.querySelector('#wReset').onclick=()=>{V2W={...V2W_DEFAULT};store.set('v2w',V2W);render();toast('Weights reset')};
}


/* =========================================================
   BUILD 2: deal structures, originator economics, assembly,
   building-form owner counts, account sync
   ========================================================= */

