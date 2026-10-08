---
name: add-evidence
description: Add or update a data point in the engine (a price, count, plot ratio, cost or planning rule) with its provenance type, source URL, check date and confidence.
argument-hint: [site id] [what changed]
---
Add or update evidence for: $ARGUMENTS

1. Read the source itself. Note the URL, today's date and the exact figure, with its unit and basis (psf of land or of floor area, asking or transacted, date of the deal).
2. Choose the provenance type honestly:
   - `OFFICIAL_PLANNING`, `OFFICIAL_CADASTRAL`, `OFFICIAL_STRATA`: government plans, titles or the strata roll only.
   - `TRANSACTION`: completed sales (NAPIC/JPPH, Brickz).
   - `ASKING_LISTING`: portal asking prices.
   - `PRESS_REPORT`: news reports.
   - `PUBLIC_MAP`: OpenStreetMap and similar.
   - `INFERRED`: derived by us. `UNDERWRITING_ASSUMPTION`: a judgement.
3. Add or edit the entry in `EVIDENCE` (fields `site, f, v, type, conf, url, chk, n`). Add the URL to `U` if it is new.
4. If the figure feeds a model input (ASP, hard cost, owner values, interest count, plot ratio, guideline reading), update the site object or `INC_DEFAULT`. State what the change does to RLV and owner coverage.
5. If a golden value in `tests/expected.json` moves, follow the `check-engine` skill.
6. Never record owners' names, contact details or other personal data.
