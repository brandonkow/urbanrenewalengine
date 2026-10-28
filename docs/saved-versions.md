# Build 6.3 — saved scenario comparison

Append-only versions in the UI retain explicit development-charge inputs, owner assumptions, cash-flow settings, model results, evidence register entries and investigation-review summaries. Versions hold a proposed analyst position and rationale, not approval or consent. Older lab saves remain available and are not given invented historical evidence.

Compare two versions of one site or refresh a current-live snapshot. The displayed current snapshot stays fixed until explicitly refreshed. Changes include input values, funding profiles, financial results, proposed positions and source text/check dates. An ordered substitution bridge explains model arithmetic for RLV, coverage and IRR; contributions are path-dependent, not causal market attribution. Absolute funding amounts remain fixed until the funding step. Unsupported intermediate IRRs are withheld.

History uses schema `klure.scenario-version.v1` and model version `static-v1/cashflow-v1`. Imports whitelist fields, bound sizes and values, reject duplicate identifiers and unsupported model versions, and recompute stored results before accepting the history. Imported evidence remains an analyst assertion. History can be replaced by workspace import/account sync; this is not an authenticated or tamper-proof audit trail.

Browser writes must succeed before history changes in memory. Limits are 60 versions and 4 MB; no silent truncation. Export before deleting or replacing versions. Invalid stored history is preserved for raw export. Account sync follows the existing private-workspace mechanism, without a new service or runtime dependency.

No financial formula, statutory conclusion, baseline expected result or source fact changes. Acceptance pending GitHub CI and rendered review.

## Acceptance record — 29 October 2026
Source commit fd4f966 passed GitHub Actions run 40728681255: 2,867 checks including 184 saved-version checks. All 43 screenshots were reviewed (unchanged images were byte-compared against the previously reviewed set). The generated offline HTML is committed with this record, and CI again checks it before rebuilding. `tests/expected.json` is unchanged. Private artifact publication and real-device acceptance remain outstanding.
