# Engine completion programme

User-authorized order, 26 October 2026. Project changes and CI are GitHub-only. This programme delivers the five proposed software builds; source-dependent planning confirmations remain explicit unresolved evidence, not fabricated completion.

| Build | Acceptance evidence required | Status |
| --- | --- | --- |
| 5.7 Transaction importer | Validated CSV mapping, source metadata, comparable medians, 12-month flag, dossier/Sources, explicit ASP application, persistence and UI tests | Accepted with 5.8 fixes; CI run 40355964578 and rendered review passed |
| 5.8 Site comparison | 2–4 selected sites, consistent scenario basis, coverage/gap/required PR, buyer-fit explanation and evidence gaps, missing-data handling, isolation tests | Accepted: commit 339b687, CI run 40355964578, 2,117 checks; all 31 screenshots inspected |
| 5.9 Cash flow / IRR | Editable timing, construction and sales profiles, debt/interest ledger, IRR/peak debt/target land value, static reconciliation, independent arithmetic and UI tests | Accepted: commit 596b341, CI run 40360153016, 2,389 checks; all 34 screenshots inspected |
| 6.0 Due diligence | Per-site evidence-linked tasks, dates/status/review history, unresolved gates visible, workspace persistence/export, no owner personal fields, tests | Accepted: implementation d33b58a; final UI 503dbfe, CI run 40717705067; all 37 screenshots inspected |
| 6.1 Modularisation | Source modules, deterministic self-contained offline HTML build, direct pure-function unit tests, existing regression suite unchanged, reproducibility check | Accepted: source 503dbfe, CI run 40717705067; 2,503 checks and reproducible offline build |

## Invariants
Preserve existing recorded presets and golden values; keep discretionary incentives as scenarios. Never claim planning approval, completed sales, cadastral accuracy or owner consent from a user checkbox or an import. Keep owner personal data out of schema. New features must be reachable, usable at phone width and in dark mode. Financial formulas are tested against independent examples, not just self-comparison.

## External evidence still required
DBKL written pre-consultation, Taiping official strata roll, parcel-specific controls and gazetted GIS, licensed transaction inputs, native-speaker/legal review of owner packs and private artifact deployment acceptance depend on external evidence/access. Software can track these gaps; it cannot manufacture their resolution. These are recorded for the final audit separately from software acceptance.

## Final audit
For each row above inspect current committed implementation, exact-head GitHub Actions results and rendered artifacts. Verify all changes are remote, no local project files, preserved base outputs, no unverified evidence promoted, and document any external acceptance remaining. Do not declare the programme complete while a build or its validation is pending.

## Accepted builds 5.7–5.8
Implementation commit: `339b68725ae6697a0b07103527a191023e31b97d`. [GitHub Actions run 40355964578](https://github.com/brandonkow/urbanrenewalengine/actions/runs/40355964578) passed the full test suite (2,117 checks) and screenshot sweep. All 31 rendered images were reviewed, including comparison and importer desktop, dark and phone layouts. Golden values are unchanged. Long transaction-group names are contained; dark dropdowns use theme colors. All project changes and test execution remained on GitHub; screenshots were inspected in memory without local project files.

Builds 6.0–6.1 are accepted below. The private Claude artifact has not been republished or accepted on the user's device.


## Accepted Build 5.9
Implementation commit: `596b3415ff246ddc04b21fe60948a452802cc0e9`. [GitHub Actions run 40360153016](https://github.com/brandonkow/urbanrenewalengine/actions/runs/40360153016) passed all 2,389 checks, including 262 cash-flow checks and the 128-check route/phone sweep. The separate screenshot sweep also passed. All 34 screenshots were opened and inspected in memory, including the cash-flow desktop, dark and phone layouts and the updated scenario lab. Independent hand arithmetic covers interest, debt caps, terminal equity, billing, replacement receipts, IRR and target-return NPV. Golden values remain unchanged. GitHub-only changes and CI; no local project files were written. Private Claude publication and real financing terms remain unverified.


## Accepted Builds 6.0–6.1 (28 October 2026)
Due-diligence implementation: `d33b58a4b16159d11329d4931853cd9a1e846df1`; [run 40716144204](https://github.com/brandonkow/urbanrenewalengine/actions/runs/40716144204) passed 2,487 browser checks. The source split and due-diligence summary-spacing correction are in `503dbfed7dc7685014b796142d4d5a4a2e15c72d`.

[Run 40717705067](https://github.com/brandonkow/urbanrenewalengine/actions/runs/40717705067) built the final offline artifact, passed deterministic build checks, all 16 direct Vitest tests (318 ms) and all 2,487 browser checks: **2,503 total, zero failures**. The separate 150-check screenshot sweep passed. All 37 PNGs were opened and visually inspected in memory, including due diligence, transactions, comparison and cash flow at desktop/phone widths and in dark mode. Due-diligence coverage includes rejected imports, source-change rechecks, storage failure, history persistence and unchanged financial/gating outputs.

The GitHub-generated HTML has Git blob SHA `c14637ae16351804629cc2d93ce491f8664de70e`; the generated lockfile has SHA `0a4d9e6974abfd76e236c1d01ab240afe317461f`. Both are committed with this acceptance record. Subsequent CI checks the committed HTML before rebuilding, installs only from the lockfile, and reruns the suite. The source split did not change the existing browser regression scripts or golden file.

## Software programme outcome
All five scoped builds are implemented and accepted against the evidence above. Source edits and generated files were committed using GitHub APIs; builds and browser tests ran in GitHub Actions. Artifact ZIPs and screenshots were inspected in memory. No local project files were written.

The programme completes the scoped software, not the external evidence work. Official planning/parcel/strata confirmations, licensed real transaction inputs, native-speaker/legal pack review and private Claude artifact publication/device acceptance remain unresolved as stated above. Review histories are local/private-workspace records, not authenticated multi-user audit logs; evidence links do not upload or independently verify documents.
