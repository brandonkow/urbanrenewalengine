# Land evidence review queue

Build 5.6 adds `#/review`, linked from Land deals and Sources & diligence.

- Covers the 15 scoped land acquisitions, with an option to include both legacy/outside-region records.
- A 90-day editorial review interval uses UTC calendar dates, inclusive at day 90. It is not an evidence expiry rule or a statement that a source is wrong.
- Acquisition checks and the latest lifecycle event's check date age independently. A fresh filing notice never refreshes the original acquisition check.
- Missing, invalid or future check dates require attention. The as-of input previews scheduling; it does not reconstruct historical deal state.
- Unresolved status means no completion or termination report in the ledger. It is not proof that a transaction remains open.
- All current parcel geometry is unverified. Even Lot 20009 is a title reference without verified coordinates. The parcel flag is deliberately unconditional for this dataset; future verified geometry requires a sourced schema, implementation and test change.
- Sort order: date problems, overdue checks, unresolved status, then parcel-only work; oldest checks first within each group, then record ID.
- Review need, search and legacy filters combine independently of the Land deals table filters. Reset returns to UTC today and scoped records.
- Source and deal-history links support manual research. There is no checkbox that can falsely mark evidence verified. This build adds no new evidence and changes no check dates.
- No financial formula, calibration, acquisition record, lifecycle event or golden value changes.

Validation: boundary dates, leap days, invalid/future dates, source-age separation, status tasks, input isolation, search/filters, deep links and mobile overflow. GitHub Actions runs the complete existing suite and screenshots.
