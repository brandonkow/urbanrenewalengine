# Massing check — build 5.3

Added 11 October 2026 at #/massing/<site>. This is an envelope and cost sensitivity, not an architectural feasibility certificate. The engine and golden numbers are unchanged.

## Basis and scope

The new page reads each site's base preset, an explicit copy of the global development-charge rate, the guideline reading and its classification ceiling. It does not read scenario-lab edits or incentive-page edits. Four columns compare base PR, Category B as read, classification ceiling and a custom PR. Taiping starts at PR 4.0 / 6.0 / 6.8.

A rectangular site is assumed. Taiping uses the existing public-map area proxy. Any site without an area uses an editable 5-acre proxy. Landed ownership counts are recalculated with the existing owner-density formula; strata interest counts stay fixed when the area changes. Sites without an owner model have no owner-coverage result.

## Source review (11 October 2026)

- [PTKL2040 Volume 1 Part 1: development control](https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf), Figure 3.3.2, printed page B1-32. The indexed official page text directs the reader to the site-level DCP2 intensity map. This reference does not establish a tower-height limit for these parcels. The whole 21 MB PDF could not be opened by the web reader; no claim is made to have reviewed every page.
- [DBKL guidelines](https://www.dbkl.gov.my/en/garis-panduan) lists the Planning Guidelines for Vehicle Parking Requirement in WPKL, 2024 edition. The applicable numeric standards, exemptions and parcel-specific use classifications were not verified. Listing a guideline is not evidence of a parking rate.
- The existing handoff's cost-basis issue remains unresolved: the Arcadis benchmark is on construction floor area (CFA), whereas the engine charges hard cost on gross floor area (GFA). No QS reconciliation or explicit parking-inclusion breakdown was supplied.

Official references are distinguished from assumptions in EVIDENCE. New diligence tasks cover geometry and height, parking standards / GFA treatment, and QS cost reconciliation. Do not present the following defaults as DBKL standards or market quotations.

## Editable assumptions

| Input | Default and basis |
| --- | --- |
| Shape | Rectangle, depth / width 1.5; unsurveyed |
| Setbacks | 6 m front, rear and each side; assumption |
| Tower / parking footprint caps | 35% / 65% of site; assumption |
| Tower / parking floor height | 3.2 m / 3.0 m; assumption |
| Height limit | 0 = unknown; never an unlimited permission |
| Average new unit size | Existing INC_DEFAULT unitSf by site, otherwise 900 sf; assumption |
| Resident / visitor car bays | 1.0 / 0.1 per unit; assumption |
| Gross parking area | 320 sf per bay, intended to include circulation; assumption |
| Podium / basement hard cost | RM120 / RM180 per built parking sf; unbenchmarked sensitivities |
| Parking included in engine cost | Checked by default to avoid double counting; inclusion is NOT confirmed |
| Parking floor-area treatment | Outside chargeable GFA; confirmation required |

## Calculation

All geometry uses the same parcel area as its financial scenario. Exact conversion: 1 sf = 0.09290304 m²; 1 acre = 43,560 sf.

1. Width = square root of (site m² / aspect); depth = width × aspect.
2. Setback envelope = max(0, width − 2 × side) × max(0, depth − front − rear).
3. Tower plate = min(setback envelope, site area × tower footprint cap).
4. Tower storeys = ceil(GFA / tower plate). Only the requested GFA is sold; the last floor may be partial.
5. Units = ceil(saleable area / average unit size). Rounding up avoids understating parking; the last unit may be smaller.
6. Car bays = ceil(units × (resident + visitor rates)); required parking area = bays × gross area per bay.
7. Parking plate = min(setback envelope, site area × parking footprint cap). Parking levels = ceil(required parking area / parking plate). Cost full levels, including spare capacity: built parking area = parking levels × plate.
8. Additional cost is zero if parking is assumed included. Otherwise it is built parking area × selected parking cost × (1 + professional-fee rate + contingency rate).
9. Adjusted RLV = engine RLV − additional cost. Adjusted coverage = adjusted RLV / existing owner budget. GDV-based allowances and development charge are held constant, making this an explicit cost sensitivity rather than a new charge assessment.
10. Height = tower storeys × tower floor height + podium parking storeys × parking floor height. Basement floors do not add above-ground height.

No footprint means no adjusted residual or coverage is offered. A failed assumed height check still displays financial figures at the requested density, clearly marked as above the assumed limit; those figures do not establish buildability.

The SVG depicts one equivalent block with a compressed vertical scale. It is not a multiple-tower layout, surveyed polygon or building approval. Access, fire routes, tower separation, structure, services, excavation, slope and construction staging remain untested. Motorcycle / accessible-bay allocation and mixed-use parking remain diligence items.

## Persistence and verification

Massing inputs are stored per site under workspace key massing, included in JSON export/import and the existing private account sync hook. Numeric imports are bounded before calculations. This extends the app's existing persistence; no project files were saved to the operator's local folders during this delivery.

Tests in tests/massing.mjs include a hand-worked 1-acre example, area scaling, parking inclusion, full-floor costing, height, blocked geometry, invalid inputs, model isolation, UI controls, reload, navigation, workspace round trip and phone / desktop themes. The full existing npm test suite and screenshot workflow run in GitHub Actions. See the associated commit's Actions results for actual pass/fail status.

## Suggested next improvements

1. Replace rectangle proxies with surveyed cadastral polygons and verified parcel controls; keep unknown controls visible.
2. Obtain a QS GFA/CFA and parking reconciliation before treating a marginal coverage result as actionable.
3. Continue roadmap C: sourced land-deal tracker and buyer fit, with proposed calibration shown separately from current golden assumptions.
4. Add time-phased cash flow after land-payment, sales and construction schedules are agreed; keep its IRR distinct from today's static residual screen.
