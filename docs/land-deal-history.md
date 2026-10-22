# Land-deal status history — Build 5.5

Reviewed **23 October 2026**. This is a targeted status update for three existing deals, not a comprehensive refresh of all 17 records.

## Verified changes

| Deal | Evidence stage | Date basis | Source |
| --- | --- | --- | --- |
| Mah Sing / Corus | Completion reported | Notice dated 2 March 2026; it does not specify a separate completion day | [Filing mirror, GA1-02032026-00079](https://www.klsescreener.com/v2/announcements/view/11185277) |
| Paramount / Jalan Ampang | Completion reported | Completion explicitly dated 16 June 2026 | [Filing mirror, GA1-18032026-00065](https://www.klsescreener.com/v2/announcements/view/11614685) |
| Sime Darby Property / UNIRAZAK | SPA signed; completion unverified | SPA dated 19 August 2026, following the 6 July offer | [Filing mirror, GA1-19082026-00039](https://www.klsescreener.com/v2/announcements/view/11650269) |

All three mirrors were read. Their original Bursa links returned HTTP 403; this limitation is displayed next to the evidence. Confidence is MEDIUM, source type COMPANY_FILING, with the filing reference and original URL retained. These are issuer filing texts reproduced by a third party, not a direct retrieval from Bursa.

The Paramount filing also identifies **Lot 20009** off Jalan Ampang. It gives 14,974 sqm and RM257,888,218. The canonical acquisition record retains its original rounded 3.7 acres and RM258m: this build updates lifecycle evidence, not price inputs. Its pin is still an inferred locality centre; the title reference does not validate coordinates or a boundary.

## What the screen now does

- Filter deals by announced, offer, SPA signed, completion reported, termination reported or unverified.
- Show a dated history beside each selected acquisition, including date basis, check date, confidence, provenance and source.
- Separate acquisition-data check dates (13 Oct) from the three new status-source checks (23 Oct).
- Report **2 of 15** scoped deals with completion evidence and **RM518m** of recorded gross consideration for that subset. This is not independently verified cash flow; rounding and asset/JV scope caveats still apply.
- Keep all historical rows visible in the table. A reported termination excludes the record from buyer summaries, buyer-fit candidates, implied PR, locality pins and proposed bands. There are **no confirmed terminated rows in the current dataset**; fixture tests verify this behaviour without inventing a real cancellation.
- Show completion counts in buyer-fit cards. Announcements with unverified completion can still support labelled research candidates; a match is not an expression of interest.

The two legacy rows remain outside the scoped sample. A completion filter does not change the site-wide buyer-fit panel or proposed calibration panel; those use the full eligible dataset and say so. Filters apply to the deal table, its map and buyer summary.

## Canonical ledger

`data/land-deal-events.json` is embedded verbatim as `LAND_DEAL_EVENTS`. Each event has:
- `id`, `dealId`, `date` (ISO day or null) and `dateBasis`.
- `state`: announced, offer, signed, completed, terminated or unverified.
- `kind`: baseline or notice.
- `sourceType`, `url`, `checked`, `confidence`, `note`.
- Where supported: `reference`, `originalUrl`, `parcelReference`.

Seventeen baseline events preserve the earlier acquisition source and its original check date. Three dated notices are added separately. A baseline is a migration snapshot of a previously checked source, not a claim of a fresh source review.

Current state is the last dated event per deal; undated events sort first, and a notice takes precedence over a baseline on the same day. The check date never changes event chronology. Events are sorted on a copy, so filtering and rendering do not mutate evidence. For multiple substantive notices on the same day, reconcile their content before committing; do not rely on the final ID tie-break to resolve conflicting claims.

Existing metadata `status` remains the historical Build 5.4 snapshot for audit compatibility; current UI status comes only from the event ledger. Add future changes as new events and update EVIDENCE with each newly checked source. Do not overwrite historical dates or mark every baseline fresh after a partial review.

## Research boundaries and next work

Targeted searches also covered M Aspira, M Aurora, M Aria, Brunsfield and Eco Forest 2. Results describing sales galleries, launches, expected acquisition dates and building completion were not accepted as land-purchase completion evidence. These records remain unverified here; that is not proof that they remain open. Other records were not rechecked in this build.

All parcel coordinates remain approximate. Next, obtain original completion/termination notices for the remaining records and source parcel identifiers/polygons before moving map pins. Keep missing cadastral and ownership facts pending.

## Validation

`npm test` includes `tests/land-deal-history.mjs`: canonical parity, event provenance/dates, chronology, unknown records, completion arithmetic, synthetic termination exclusions, combined filters, deep links, reset, phone width and state isolation. The existing 164 land-deal checks and all golden tests remain in the suite. `npm run shots` includes Corus and Paramount detail pages as well as light/dark/phone land views.

No engine formulas, CSV prices, coordinates, calibration bands or golden values change. All project writes and Playwright/screenshot execution occur in GitHub; in-memory source preparation creates no local project files.
