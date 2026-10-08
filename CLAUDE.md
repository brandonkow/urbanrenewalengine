# KL Urban Renewal Engine

Redevelopment screener and deal-origination tool for Kuala Lumpur, module 1 of the Malaysia Structural Real Estate Opportunity Engine. Decision rule: **residual land value (RLV) must exceed the required owner consideration**. It is a screening model only, not a valuation or investment advice.

## Files
- `app/index.html`: the whole engine, one self-contained HTML file (vanilla JS, hash router, no build step). It is the reference implementation and the file that gets published.
- `docs/handoff.md`: the build-5 handoff. Formulas are in §5, assumptions §6, results §7–8, data model §13, code map §14 and roadmap §16. Read the relevant section before changing anything.
- `docs/roadmap.md`: next tasks, each with a prompt and an acceptance check.
- `docs/CHANGELOG.md`: append one entry per change that moves numbers or behaviour.
- `docs/sources/`: the DBKL 2026 guideline PDF (in Malay), workbook v3 and the original handoff. These are read-only evidence; cite guideline section numbers, such as 6.0(8).
- `data/`: data files the engine or tools read, such as `land-deals-seed.csv`. Every row carries a source URL and a source type.
- `tests/`: Playwright scripts that open `app/index.html` offline and call the engine's own globals. `tests/expected.json` holds the golden numbers.

## Commands
- `npm install`, then `npm run setup` once (installs Chromium for Playwright).
- `npm test`: formula tests, UI sweep and interaction checks. It must pass before a change counts as done.
- `npm run test:numbers -- --verbose`: every formula check, with values.
- `npm run shots`: screenshots in `screenshots/`. Look at them after any UI change.
- `npm run packs`: exports every owner briefing pack (site × language × scenario) to PDF in `out/packs/`. Add `-- --contact file.json` to print your own contact block.
- Set `CHROMIUM_PATH=/path/to/chrome` to use an existing browser instead of `npm run setup`.

## Rules that must not break
1. **Decision rule:** coverage = RLV ÷ owner budget, and a site passes the owner test only at coverage ≥ 1.
2. **Provenance:** every figure carries one of OFFICIAL_PLANNING, OFFICIAL_CADASTRAL, OFFICIAL_STRATA, TRANSACTION, ASKING_LISTING, PRESS_REPORT, PUBLIC_MAP, INFERRED, UNDERWRITING_ASSUMPTION, MODEL_OUTPUT, MISSING or EDITED. Never present an assumption, listing or model output as official.
3. **No incentive in the base case:** DBKL 2026 incentives are discretionary, so they appear as scenarios beside the base case, never inside it.
4. **Consent is unanimous** until a new law is passed. The withdrawn Urban Renewal Bill's 75–80% thresholds are for reference only.
5. **Golden numbers:** base scenarios must keep reproducing the workbook (handoff §7.1), the Taiping handoff figures (§7.4) and the guideline results (§8). `tests/expected.json` encodes them.
6. **Changing golden numbers:** edit `tests/expected.json` only when a change is meant to move numbers. Record which values moved, old → new, and why in `docs/CHANGELOG.md`.
7. **Privacy:** the Assembly tracker stores unit or parcel labels only; owner packs carry only your own contact details. Never add fields for owners' names, phone numbers, IC numbers or other personal data.
8. **Evidence:** every new data point needs a source URL, a check date and a confidence level in `EVIDENCE`. Use the `add-evidence` skill.

## How app/index.html is organised (top to bottom)
- **Seed data:** `RAW`, `U` (source URLs), `SITES`, `SITE`, `MODELLED`.
- **Persistence:** `store` (localStorage with the `klure:` prefix, plus a sync hook), `GLOB`, `STATE`, `st(id)`, `presetState(site, preset)`.
- **DBKL 2026 guideline:** `G26`, `AFF`, `INC_DEFAULT`, `INC`, `incP`, `incB`, `incMax`, `g26Share`, `catA`, `g26Row`.
- **Engine (pure functions):** `calcRLV`, `calcOwner`, `model`, `requiredASP`, `requiredPR`, `requiredHC`, `applyOwnerDerived`, `dealCalc`.
- **Judgement:** `suggestVerdict`, `TRIGGERS`, `evalTrigger`, `levers`, `prBand`, `v2Score`.
- **Owner packs:** `PK` (English, Malay, Chinese text), `PACK_REVIEWED`, `packState`, `packData`, `packHTML`, `viewPack`. Packs read the base preset and the guideline as read, never lab edits, and show payment figures only when coverage ≥ 1 and the option is fundable.
- **Views:** one `view…` and `bind…` pair per route, with the router (`render()`) at the end.
- **Sync:** on claude.ai the page saves a private workspace through the artifact runtime (`window.claude`); elsewhere it uses localStorage. Keep that fallback.

The full map is in handoff §14.

## Working conventions
- **Engine or formula changes:** start in plan mode. Name the functions you will touch and the golden numbers that should and should not move.
- **Pure functions stay pure:** no DOM access, and inputs come in as arguments, so they stay testable.
- **UI changes:** run `npm run shots` and look at desktop, the dark-mode incentive page and the 390 px phone board. Fix clipping, overlap, contrast and horizontal scroll.
- **UI copy:** sentence case and plain words. Numbers carry units: RM, psf, acres, ×.
- **Colours:** use the CSS tokens on `:root`, which cover light and dark. Never hard-code a colour.
- **Dependencies:** add no runtime dependency or CDN script without asking. The page must stay one self-contained file.
- **Malaysian terms:** keep them as the source writes them (Rumah Ganti, Residensi MADANI, RMM, Kaedah 3, JKPS), with an English gloss on first use.
- **Scope:** if a request would bend one of the rules above, say so and propose the compliant version.

## Publishing
The live engine is a private claude.ai artifact. To update it, attach the new `app/index.html` in a Claude chat and ask for it to be republished to the existing artifact link. Never put API keys or tokens in the code.
