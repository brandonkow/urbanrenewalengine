# Land deals and buyer fit — Build 5.4

Checked **13 October 2026**. This is a curated evidence sample, not a complete market database or a record of expressions of interest.

## Delivery and calculation boundary

Added `landDealStats`, `landDealFiltered`, `landDealBand`, `landBuyerFit`, `ldImplied` and the Land deals view. Existing `calcLand` is reused as-is. `calcRLV`, `calcOwner`, `model`, guideline calculations, calibration inputs, existing comparable arrays and `tests/expected.json` are unchanged. The user requested GitHub-only work; source preparation and preliminary checks are in memory, with Playwright and screenshot generation in GitHub Actions.

The page opens at `#/land`; `#/land/<deal-id>` opens a supporting record. All 21 site dossiers also have three analytical buyer candidates.

## Canonical records

- `data/land-deals.csv` preserves all 15 columns of the original seed.
- `data/land-deals-meta.json` has one matching row per CSV row: stable ID, check date, confidence, status/date basis, approximate locality, inferred product/tier and inclusion flags.
- The self-contained HTML embeds both arrays. Tests enforce exact equality with these canonical files.
- 17 records: 15 sourced 2024–2026 KL/Selangor acquisitions or proposals by seven listed developer groups, plus two legacy records. Multiple parcels under one announcement count as one deal.
- Company annual reports / announcements use COMPANY_FILING. Company press releases use COMPANY_RELEASE. Company-hosted press clippings remain PRESS_REPORT. These are evidence-source labels, not completion statuses.
- Blank fields mean not verified, not zero. Report dates are explicitly distinguished from SPA dates. Status reflects the cited document rather than a claim that every pending transaction is still pending today.
- Seller fields contain companies only. No private-owner contact information is collected.
- Full links, notes, confidence and check dates also appear in the app's EVIDENCE register.

### Seed reconciliation

| Seed | Treatment |
|---|---|
| AYER / Kuchai Lama | Price and area retained. Original page intermittently failed; original filing, exact date, vendor and tenure still need verification. Excluded from buyer profiles and proposed bands. |
| Malton / Johor Bahru | Article supports 3.72 acres, RM97.23m, freehold, vendor Tanjung Nakhoda and RM950m planned GDV. It shows June 3 without a reliable publication year in retrieved text. Retained outside KL/Selangor scope with date blank. |
| Selangor Dredging / PJ | Filled Jalan Subang 2, Taman Industri Penaga; Hectare Square vendor; freehold; existing building. 1.214 hectares converted using 4,046.8564224 sqm/acre. January 13, 2026 is established contextually by Tuesday and the March 2027 financial-year target; original filing is still preferred. |
| Sime Darby Property / UNIRAZAK | Replaced incomplete figures with 6 July 2026 company release: RM160m, rounded 1.46 acres, RM900m projected GDV, PNB vendor, freehold; binding offer, existing office. Derived ratio 17.78%. |
| Paramount / U-Thant | Matched to March 2026 acquisition in annual report (rounded RM258m, 3.7 acres, RM1.1bn GDV). Kept separate from December 2024 Brunsfield acquisition. June 16 completion is reported in the linked filing mirror; original Bursa notice remains preferable. |

### Important comparability differences

M Legasi 2 uses approximately **305 gross acres**, not 275 net developable acres, for land psf. Its RM1.7bn GDV covers only 175 acres, so land/GDV is deliberately blank.

Brunsfield's RM300m is a **minimum** projected GDV, so its 48.33% ratio is an upper bound. Brunsfield, Corus, UNIRAZAK and the SDB site include existing buildings. Their price per land sf is a whole-asset price divided by land area, not a vacant-land valuation.

Eco Forest 2 records RM742.4m at 100% transaction level; the purchaser vehicle is 81% EcoWorld and 19% Boustead. Buyer totals therefore show **reported gross consideration**, not cash paid or equity-attributable spend.

The Mah Sing Sepang proposal was not added: research identified a reported termination in November 2025. It must not be treated as an active acquisition without reconciling the termination notice.

## Derived numbers

`land_psf = price_rm / (acres * 43560)`; stored to four decimal places. Land/GDV is stored to six decimals, with mismatched scope withheld. Source rounding is retained rather than implying survey precision.

Implied PR calls unchanged `calcLand` with a separate `ld_` ID and editable comparison ASP (default RM750/saleable sf). Hard cost and efficiency are read from current calibration; fees, contingency and 20% margin use its existing stack. This assumption is not a verified ASP for any deal. If per-floor residual is non-positive, no PR is returned. Township and excluded legacy rows have no PR estimate. None of these controls writes to CAL, STATE or the base case.

### Proposed bands — review only

New urban high-rise sample, min–max land/GDV:

- Suburban: **10.30–17.12%**, five deals (M Aspira, M Aurora, M Aria, OSK Metropark, M Mira).
- Prime: **23.45%**, one deal (Paramount March 2026), insufficient to establish a range.

Excluded: existing buildings, townships, mixed-product schemes, partial-site or lower-bound GDV, missing GDV and legacy/out-of-region records. Affordable-housing obligations at M Aspira still limit comparability. Tier assignments are analytical. Existing bands remain unchanged (about 10.23–12.43% suburban and 17.8–23.4% prime); there is no apply button.

## Buyer-fit method

Each developer's best single matching tracked deal supports its score:

- Area: 40 points, declining linearly to zero at 25 km from the inferred locality centre.
- Ticket: up to 30 points, `30 * min(target,deal price)/max(target,deal price)`.
- Product: 30 for high-rise, 15 for mixed residential/commercial, zero for township. The target product is an explicitly labelled urban high-rise redevelopment assumption, including unmodelled watchlist sites.
- Missing ticket or locality removes that component and normalises over available weights. No fake one-acre total is used. Only Taiping currently has both an area proxy and an owner model to support a total-ticket proxy, based on the unchanged base preset; its ownership count remains unverified.
- Ties sort by developer name. Scores are match points, not probabilities. The sample is sparse and does not establish mandate, appetite, funding, assembly capability or actual interest.

Map pins are manually inferred **locality centres**, rounded to 0.01 degrees, from the named areas in sources. They are not independently geocoded parcels. KL-frame pins are keyboard-accessible; coincident centres are grouped. Out-of-frame and unverified rows remain in the table. The model does not use these pins as cadastral evidence.

## Access limitations and follow-up documents

Public sources only; no logins or bulk downloads. These pages need a user-supplied/publicly saved copy or a direct replacement source:

- [AYER original article](https://propnewstime.com/latestnewsstories/Mzc0NjI=/ayer-holdings-to-acquire-9-11-acre-kuala-lumpur-land-parcels-for-rm138-million): initial response, then follow-up fetch errors.
- [NST original seed comparison](https://www.nst.com.my/amp/business/corporate/2026/07/1487396/sd-propertys-unirazak-project-seen-upside-higher-plot-ratio): 403 on follow-up. Alternative company sources used for UNIRAZAK and Paramount.
- [Mah Sing Q3 2025 report](https://www.mahsing.com.my/web/storage/Q3-2025-Interim-Report.pdf): redirects to home page. Press sources used instead.
- Original Bursa notices for AYER, SDB and Paramount completion; M Aria's exact SPA date; missing vendors/tenure noted in CSV.

Recommended next improvements: reconcile all completion/termination notices with a dated status history; obtain parcel coordinates and title references; broaden the developer sample before trusting fit rankings; then add comparable transaction imports with explicit user acceptance before ASP calibration changes.

- [M Mira supporting research note](https://www.midf.com.my/sites/corporate/files/2025-11/mah_sing-cu-land_acquisition_in_setapak_for_m_series_project-mbsbr-241125.pdf): indexed text supports leasehold, vendor and SPA date, but direct PDF retrieval timed out; those fields have a separate low-confidence evidence entry.
