# KL Urban Renewal Engine

A Kuala Lumpur redevelopment screener with a single-file offline dashboard. The screening decision compares residual land value with required owner consideration; discretionary incentives remain separate scenarios and missing evidence stays visible.

## Current capabilities
- Site dossiers, watchlist, schematic map, scenario lab and trigger monitoring.
- DBKL incentive scenarios, owner/deal economics, assembly tracking and owner briefing packs.
- Owner-test probability, massing/parking sensitivity and land-deal evidence/history.
- User-supplied transaction CSVs with comparable-group statistics and explicit ASP application.
- Comparison of 2–4 sites on a consistent scenario basis.
- Quarterly cash flow, debt, equity IRR and target-return land consideration.
- Per-site due-diligence tasks, evidence snapshots, dates and review history.
- Saved scenario versions with dated inputs, evidence and proposed positions, result-change explanations and workspace backup.
- Dated committee memos with scenario economics, funding, evidence gaps, next actions and PDF/HTML/JSON exports.

The five-build completion programme and its test/visual acceptance evidence are in [docs/completion-programme.md](docs/completion-programme.md). The next programme is tracked in [docs/continuation-programme.md](docs/continuation-programme.md). Current source architecture is Build 6.3; [docs/CHANGELOG.md](docs/CHANGELOG.md) records changes.

## Use and publish
`app/index.html` is the self-contained publication artifact. It has no runtime package, external script, stylesheet or web-font requirement. Outside the private Claude artifact runtime, workspace settings use browser localStorage. Use the Method page's JSON export/import for backups and transfer.

Private Claude artifact publication is separate from GitHub delivery: the generated HTML must be republished to the existing private artifact and checked there. GitHub CI does not establish private deployment or real-device acceptance.

## Development
Edit `src/`, then regenerate `app/index.html`. See [build-system.md](docs/build-system.md) for module boundaries and reproducibility.

Use Node 22.12+ or a supported newer Node version:

```sh
npm ci
npm run setup
npm run build
npm run build:check
npm test
npm run shots
```

The unit tests import the pure engine/guideline modules directly. Existing Playwright checks exercise the built HTML with network requests blocked. Inspect every screenshot before accepting a UI change. For this GitHub-only delivery programme, source edits, builds, tests and generated artifacts are handled through GitHub; no local project folder is required.

## Project references
| Reference | Purpose |
| --- | --- |
| [CLAUDE.md](CLAUDE.md) | Development rules and code map |
| [Original handoff](docs/handoff.md) | Historical formulas, assumptions and baseline |
| [Attachment comparison](docs/handoff-comparison-2026-10-11.md) | Why the supplied Build 4 handoff differs from the newer repository handoff |
| [Roadmap](docs/roadmap.md) | Future evidence-dependent work and extensions |
| [Transactions](docs/transactions.md) | CSV requirements and comparability limits |
| [Comparison](docs/comparison.md) | Scenario basis and missing-data handling |
| [Cash flow](docs/cashflow.md) | Timing model, reconciliation and limitations |
| [Saved versions](docs/saved-versions.md) | Dated snapshots, comparison, recovery and backup limits |
| [Committee memo](docs/committee-memo.md) | Snapshot basis, exports and discussion limits |
| [Due diligence](docs/due-diligence.md) | Review workflow, privacy and history limits |

## Evidence and scope
Preserve provenance and baseline golden values. A checklist, review entry, imported row or favourable model result cannot establish planning approval, verified sale, cadastral accuracy or owner consent. The Assembly schema stores unit labels, not owner personal data. DBKL confirmations, strata records, parcel controls, licensed transaction evidence and native-speaker/legal review of owner packs remain external work.

Screening model only; not a valuation, legal opinion or investment recommendation.
