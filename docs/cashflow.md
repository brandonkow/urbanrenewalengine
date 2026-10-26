# Cash flow and IRR — Build 5.9

Open Cash flow & IRR or the funding summary in any modelled site's scenario lab. The calculation reads the current live development inputs without changing them. Static RLV and all recorded presets/golden values remain unchanged.

## Scope and assumptions
This is a pre-tax quarterly development/funding model, before promote. All timing, billing and lender parameters are UNDERWRITING_ASSUMPTION. It is not a statutory Schedule H schedule or an approved bank facility. Intraperiod peaks, restricted housing-development accounts, tax, lender fees not entered as additional costs and legal allocation of receipts are outside the model.

Default land consideration equals the current owner budget, or non-negative static RLV if no owner model exists. That fallback is an illustrative input, not proof of owner feasibility. Unknown site areas retain the existing normalized test parcel and are not presented as assembled-site budgets. Defaults use 16 construction quarters, a smoothstep S-curve, delayed uniform take-up, 65% debt funding, a facility at 65% GDV, 6% nominal annual interest and a 15% effective annual equity return target. These are illustrative, not market terms.

## Timing
Construction and take-up are separate editable percentage lists, one entry per quarter, each summing to 100%. Up to 0.001 percentage points of rounding is normalized. Zero quarters model delays. Sales are assumed fully achieved by the end of the supplied profile; slower/unsold outcomes require an updated profile or development inputs.

For every new-sale cohort, the collection due at sale is:
deposit + progress share × cumulative construction progress + retention if already released.
Existing cohorts pay incremental construction progress and the retention on its release date. Late sales catch up to completed billing milestones. Retention release occurs at completion plus the selected delay; the calculation horizon extends to that date.

Hard cost, professional fees and contingency follow construction. Statutory costs, unchanged static development charge and additional costs are paid in Q1. Demolition/relocation is paid at the first construction quarter. Additional net relocation/rent spreads from Q1 to completion. Selling costs follow collections.

## Owner structures
- Cash: selected percentage at Q0/signing, remainder at construction completion.
- Deferred cash: entire consideration at completion.
- JV: the entered nominal entitlement, expressed as a share of this scenario's GDV, is paid at completion. This is not a full negotiated JV waterfall.
- Replacement units: entitlement / current ASP is reserved saleable floor area. Foregone sales are deducted from receipts; all construction remains costed. Selling costs on replacement units are removed. No duplicate cash land payment is charged. Entitlements above saleable GDV are rejected.

Inputs are separate from Deal structures. Additional rent must be net of the lab's existing relocation allowance; additional fees must be entered explicitly. The module does not silently import deal fees or promote assumptions.

## Funding
Q0 land is funded by debt/equity at the chosen debt share, subject to the facility cap. Each later quarter:
1. Interest = opening outstanding debt × annual nominal rate / 4.
2. Receipts plus retained cash fund construction, other costs, owner payments and interest.
3. Any deficit draws the selected debt share, limited by facility headroom; equity supplies the rest.
4. Surpluses repay debt, then remain as cash earning no interest.
5. At the final quarter, any remaining debt requires an explicit terminal equity call. Remaining cash is distributed to equity.

Quarter-end netting can understate intraperiod peaks. No claim is made that a bank permits these drawdown or repayment terms.

## Returns and target price
Project IRR excludes financing. Developer equity IRR uses actual contributions and the final distribution. Quarterly roots are compounded to effective annual returns. A positive and negative cash flow with one sign change is required; otherwise IRR is withheld with a reason. NPV, total profit/loss and funding remain visible.

The target solver uses equity NPV at the selected annual target return, checks monotonicity across the bracket, then bisects. The search bracket is zero to twice GDV (once GDV for replacement units). If the target cannot be met at zero land or no supported boundary exists, no price is invented. If a conventional equity IRR does not exist at the boundary, the result is labelled a target-NPV ceiling.

## Static reconciliation
Pre-tax equity profit =
static RLV + flat finance allowance + developer profit reserve
− owner consideration + replacement selling-cost saving
− additional relocation − additional costs − modelled interest.

Developer profit reserve is a return, not another cash cost. Static development charge remains unchanged, including its existing allowance basis. Reversing this bridge recovers static RLV within RM0.01; flat-timing tests verify the same identity. Summed debt draws and repayments reconcile to zero after the terminal call.

## Storage and export
Cash-flow settings are per site and join existing workspace save/sync/export/import. Saved consideration and facility amounts remain explicit when live inputs change. Reset regenerates current illustrative defaults. Imports discard invalid configurations and unknown fields. The JSON export records scenario inputs, all assumptions, quarterly ledger, return outputs and target-price result.

## Validation
Independent examples cover a one-acre PR1 project (RM21.78m GDV and RM4.356m build cost), exact interest/draw arithmetic, capped funding, a 25%/65%/10% collection example, late sales, replacement sales foregone, negative/multiple IRRs, target-price NPV, terminal equity and flat-timing reconciliation. All modelled sites and base/as-read/live scenarios run through all four structures. UI checks cover validation, saved settings, site isolation, lab summary, export, theme and phone containment. GitHub Actions executes the full regression suite and screenshot sweep.
