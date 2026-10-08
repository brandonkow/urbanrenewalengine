# Changelog

Add one entry per change that moves numbers or behaviour. When golden values in `tests/expected.json` change, list them as old → new with the reason.

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
