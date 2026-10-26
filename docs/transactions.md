# Transaction evidence importer — Build 5.7

Open Transactions, or the link in a site dossier. Input is a user-supplied CSV, not a provider API or a licensed data feed. No private transaction dataset is included in this public repository.

## Import and comparability
1. Read a CSV (up to 2 MB and 5,000 rows), with quoted cells, embedded line breaks and BOM supported.
2. Map date, scheme/address, area and RM price. Map or explicitly select shared tenure, property type, area basis and unit. ISO dates only; sqft or sqm (1 sqft = 0.09290304 sqm). No guessing ambiguous dates or area bases.
3. Supply source name/reference, HTTP(S) URL and checked date; attest completed sales and no owner personal details.
4. Review valid, rejected and exact-duplicate counts; explicitly import valid rows. Unknown columns are discarded.
5. Inspect groups split by scheme, tenure, property type and built-up/land basis. Filter size and period within a group. Median is the unweighted median of row RM/psf values. Samples under five are labelled small. Staleness uses transaction date before the date 12 calendar months earlier, with leap-day clamping; it is separate from source checked date.

Exact duplicate keys use date, scheme, tenure, type, area basis, normalized area and price. Separate sales with identical attributes cannot be distinguished by this format; review the source before relying on counts. Records are user assertions with TRANSACTION / PROVISIONAL provenance, not independently verified sales. Unknown tenure and property type remain explicit. Condition, floor, restrictions, incentives and new-product comparability require analyst review.

## Model application
Import never changes ASP, calibration or workbook presets. Select a built-up cohort, choose an ASP and explain the adjustment, then explicitly accept application to the live scenario. Land-area psf is blocked. Live watchlist, triggers and lab reflect the edit; workbook presets and owner packs do not. The latest application stores previous/new value, rationale, date, sample range and sources. Restore is available while the live ASP still matches that application. Removing transaction records does not silently reverse an applied ASP.

## Storage and limits
Records join the existing browser/private Claude workspace sync and workspace JSON export/import. The import schema is validated on load; unknown fields are discarded and confidence is always provisional. This is not a new backend, multi-user database or source verification service. Existing sync/storage availability limits still apply. No uploaded file is published to GitHub. The table previews the first 100 rows; statistics use all filtered rows. There is a 5,000 stored-row limit per site.

## Validation
GitHub Actions runs existing golden and UI tests plus tests/transactions.mjs. Tests cover parser errors, units, dates, duplicate/rejected rows, independent median arithmetic, 12-month boundary, provenance, workspace roundtrip, staged file import, explicit ASP application/restore, dossier/Sources integration, reload, clear and phone width. Screenshots include light/dark/phone with clearly synthetic data.
