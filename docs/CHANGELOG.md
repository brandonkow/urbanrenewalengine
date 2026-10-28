# Changelog

Add one entry per change that moves numbers or behaviour. When golden values in `tests/expected.json` change, list them as old → new with the reason.

## Build 5.9 (27 Oct 2026): quarterly cash flow and IRR
- Added an independent live-scenario view with editable construction S-curve, sales take-up, progress collections, deposits and retention.
- Cash, deferred cash, JV entitlement and replacement-unit structures feed an explicit debt/equity ledger; facility caps and terminal equity calls stay visible.
- Developer/project IRR, peak debt/equity, interest, target-return consideration and static reconciliation are displayed, with a summary in each scenario lab.
- Invalid and non-conventional IRRs are withheld; all timing/funding terms remain assumptions. Settings join workspace persistence and exports.
- Existing static formulas, source facts and golden numbers are unchanged. See docs/cashflow.md for methods and limits.

## Build 5.8 (27 Oct 2026): site comparison
- Compare two to four sites on a common selected scenario basis, showing per-acre residual, owner coverage, funding gaps and required PR/ASP.
- Missing owner models and unknown assembled-site budgets stay explicit. Buyer candidates link to evidence and carry heuristic limitations.
- Export input/output snapshots and evidence gaps. Comparison does not write to scenarios or calibration; golden numbers are unchanged.
- Fixed transaction dropdown dark-mode contrast and phone-width containment for long scheme names.
- Added independent arithmetic, isolation, selection/export and rendering checks. See docs/comparison.md.

## Build 5.7 (26 Oct 2026): transaction evidence importer
- CSV mapping, validation, staged import, duplicate detection and source metadata; completed-sale assertions remain provisional.
- Comparable groups separate scheme, tenure, type and area basis; size/period filters, median psf and 12-calendar-month flags appear in Transactions, dossiers and Sources.
- Explicit built-up ASP application with rationale and restore; live scenarios change only on application. Recorded presets, calibration and golden numbers are unchanged.
- Workspace sync/export/import includes validated transaction rows. Added independent arithmetic and end-to-end UI tests plus synthetic light/dark/phone screenshots.
- See docs/transactions.md and docs/completion-programme.md. CI and rendered review determine release acceptance.

## Build 5.6 (24 Oct 2026): land evidence review queue
- Added read-only review queue with search, review-need and legacy filters, as-of date, source links and deal-history links.
- Acquisition and latest-status checks age independently against an explicit 90-day editorial interval. Missing/future dates, unresolved status and unverified parcel geometry are visible without claiming a deal remains open.
- All current parcel geometry remains unverified. No evidence, check dates, financial formulas, calibration inputs or golden numbers changed.
- Added review scheduling/isolation tests and desktop, phone and dark screenshots. See docs/evidence-review.md.

## Build 5.5 (23 Oct 2026): dated land-deal status history
- Added canonical event ledger, stage filter, completion subtotal and linked timelines with separate event/date/check bases.
- Corus: completion reported in 2 March 2026 notice (exact completion day unspecified). Paramount Jalan Ampang: completion on 16 June 2026. UNIRAZAK: SPA signed 19 August 2026; completion unverified. Filing mirrors read; original Bursa pages returned 403.
- Retained all 17 acquisition snapshots and their original check dates. Two scoped deals have completion reports, representing RM518m of unchanged rounded gross consideration.
- Reported terminations remain in the historical table but are excluded from buyer summaries/fit, implied PR, locality pins and proposed bands. No current row was labelled terminated without evidence.
- Added sourced Lot 20009 reference for Paramount; coordinates remain approximate. No prices, financial formulas, calibration inputs or golden numbers changed.
- Added event parity, chronology, termination, filtering and isolation tests, plus completion-detail screenshots. Validation runs in GitHub Actions.
- See docs/land-deal-history.md for methods, access limitations and remaining source work.

## Build 5.4 (13 Oct 2026): land deals and buyer fit
- Added Land deals route with sortable table, search/buyer filters, inferred locality pins, keyboard selection, source detail and comparison ASP.
- Canonical CSV preserves the seed schema; aligned metadata and embedded snapshots are checked for exact parity. Fifteen sourced KL/Selangor records across seven developer groups plus two legacy rows retained for audit.
- Buyer profiles show count, gross consideration, median area, ticket/psf range and locations. All 21 dossiers have three explained analytical candidates, not expressions of interest. Unknown site budgets are not invented.
- Added COMPANY_FILING and COMPANY_RELEASE provenance, evidence records, source-access limitations and a refresh skill.
- Land psf uses gross area; partial GDV ratios are withheld and minimum GDV marked as a bound. Existing buildings and JV consideration receive explicit notes.
- Proposed bands remain review-only: suburban 10.30–17.12% (five records), prime 23.45% (one record; insufficient range). Existing calibration and all golden values are unchanged.
- Added independent arithmetic, data/provenance, ranking, isolation and UI tests plus route/phone/dark screenshots. Validation runs in GitHub Actions; see commit checks for the result. No local project files created.
- Screenshot review fixed dark-mode input contrast and phone table wrapping; wide tables have keyboard-accessible scroll regions. Single-record bands explicitly state that the range is insufficient.
- See docs/land-deals.md for methods, sample limits, pending source fields and follow-up recommendations.

## Build 5.3 (11 Oct 2026): massing and parking sensitivity
- New Massing check route for every modelled site. Compare base, DBKL as read, classification ceiling and custom PR; Taiping includes 4.0, 6.0 and 6.8.
- Editable rectangular parcel, setbacks, tower/parking footprints, unit size, parking demand, full-floor basement/podium cost and assumed height check. A theme-aware SVG shows an equivalent block.
- Explicit parking-inclusion toggle avoids double counting. Additional parking cost includes professional fees and contingency; the result is a separate residual and owner-coverage sensitivity.
- Unverified controls/rates are labelled UNDERWRITING_ASSUMPTION. Added evidence and three diligence items; source limits and calculation are documented in docs/massing.md.
- Per-site settings join the workspace export/import and existing sync. Added independent arithmetic and interaction tests, massing route/phone coverage and screenshots.
- Golden values: none changed. Existing base, incentive, deal, owner-pack and odds calculations are unchanged.
- Compared the user's supplied Build 4 handoff with the newer repository version; details in docs/handoff-comparison-2026-10-11.md. They are not identical; §7.1–7.3 match.
- CI found a repeated change event during numeric-input blur; unchanged values now return before a redraw, preventing nested DOM replacement.
- Validation executes in GitHub Actions; refer to this commit's checks for the outcome. No local project files were created.

## Build 5.2 (8 Oct 2026): owner-test odds
- New page `#/odds/<site>` (nav: Owner-test odds): the chance that each owner-model site clears the owner test once its inputs are uncertain. Seeded Monte Carlo (2,000 draws per site by default) over end price (triangular from the downside, base and upside presets), hard cost (0.92–1.15 × base), ownership interests (Taiping 30/40/80) or lot value (village asking ranges), the development-charge rate (0/10/30%) and DBKL's decision (Category B as set 45%, half eligibility 15%, no incentive 30%, double privilege 10%).
- Each draw runs the engine's own `model()`. The base case, the lab and every golden number are unchanged.
- At the default ranges: Salak Selatan 20%, Kampung Pantai 19%, Taiping 12%, both Jinjang sites 0%. End price is the biggest driver everywhere; for Taiping the ownership count and hard cost come next.
- A coverage histogram and a tornado chart (one input at a time across its range) per site, each with a table view. Two chart tokens, `--viz1` and `--viz2`, checked with the dataviz palette validator in light and dark.
- Ranges are editable, saved and synced with the workspace (`mc`), and included in export and import.
- 40 new checks in `npm test` (`npm run test:odds`): reproducibility by seed, agreement with the engine when every range collapses to the base case, direction, the tornado centre, conditional odds adding up, and that the base case never moves.

## Build 5.1 (8 Oct 2026): owner briefing packs
- New page `#/pack/<site>/<language>/<scenario>` (nav: Owner packs) for the five sites with an owner model: Taiping, Salak Selatan, Kampung Pantai and both Jinjang sites. English, Bahasa Malaysia and Simplified Chinese; base case or the DBKL 2026 incentive as read; A4 print layout of two pages.
- Numbers come from the engine at run time: the site's base preset (never lab edits), the default deal assumptions and the guideline share as read (never as set in DBKL incentives). The global development charge applies and is printed when it is above 0%.
- Payment figures appear only when owner coverage is at least 100%. Stricter than the roadmap asked: each payment option is also shown only when the project can fund it (developer surplus ≥ 0), so Taiping's DBKL 2026 pack offers cash and marks the replacement-unit and JV options "not offered" (short by about RM0.4m and RM1.6m once four years of rent allowance are paid).
- Below 100% the pack shows a "not ready yet" note with the single-lever changes that would close the gap (end price, building cost, plot ratio and where that sits against the guideline), and no money per owner.
- Malay and Chinese are marked for native-speaker review until `PACK_REVIEWED` is set to true for that language.
- `levers(s)` now delegates to `leversFor(s, x)`, so the same maths runs on any scenario. No formula changed; no golden value moved.
- `npm run packs` exports all 30 PDFs to `out/packs/` and fails if a pack runs past two pages or a Chinese pack has no CJK font. `npm test` adds 1,208 pack checks; the UI sweep adds 15 pack routes and two phone views.
- GitHub Actions runs `npm test` on every push and pull request.

## Build 5 (8 Oct 2026): DBKL 2026 guideline applied
- Encoded *Garis Panduan Insentif Pelaksanaan Pembangunan Semula Kuala Lumpur (2026)*, First Amendment: Category B components, eligibility and the 70% cap; Category A tiers and the controlled-housing split; the section 6.0 conditions.
- Per-site reading: Taiping and Bukit Angkasa +50% (Jadual 5.2.1); villages and clusters +30% (5.2.2); residing closed to residential zones, so 30%-tier residential sites top out at +60%.
- New DBKL incentives calculator, a guideline table on Distance to deal, a DBKL 2026 lab preset, five triggers, twelve evidence entries, four issues, four checklist items, and transit-zone rings on the map.
- Results as read: Taiping 106% covered at 40 interests (PR 6.0); Salak Selatan 103% (PR 4.55); Kampung Pantai 93%, needing +40%. Jinjang, Rejang and Jujur stay negative. Category A loses to Category B everywhere.
- Golden values added for the guideline; build-4 values unchanged.

## Build 4 (7 Oct 2026)
Distance-to-deal board, planning-intensity module with a development-charge control, market-tier land-share cross-check, JSON/CSV export and import, review fixes. 80 formula tests.

## Build 3
RLV and landed-owner cases for Kampung Baru Salak Selatan, Kampung Pantai and both Jinjang sites; calibration view (density, not cost, explains land prices).

## Build 2
Deal structures (cash, replacement units, JV), originator fee and promote; assembly tracker; building-form control; private account sync.

## Build 1
Watchlist, map, dossier, scenario lab, triggers, sources, site universe and method, seeded from workbook v3, reproducing every workbook and handoff figure.

## Build 6.0 — Due-diligence workspace (28 October 2026)

Adds per-site investigation queues, responsible roles, due/review dates, findings, linked evidence snapshots, source-change rechecks and review history. Integrates workspace sync/import/export with validation and visible storage errors. Existing checklist ticks, evidence, consent records and model results remain separate and unchanged. No golden values move. See docs/due-diligence.md; acceptance is tracked in docs/completion-programme.md.
