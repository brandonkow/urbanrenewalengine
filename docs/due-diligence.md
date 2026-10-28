# Due-diligence workspace (Build 6.0)

Open Due diligence, or the link in a site dossier. All 21 sites have seven investigation questions: boundary, ownership, planning, market, cost, consent and funding. Taiping also has the existing checklist questions, initially unreviewed regardless of old checkbox ticks.

## Recording work
Select a task, responsible role, due date and status. A recorded review requires a nonfuture review date, finding, note, source URL and document/page reference. A finding can support, contradict or be inconclusive about the stated question. Recording it never certifies approval, legal consent or feasibility. Existing triggers remain visible and unchanged. Dates use UTC.

Select evidence from the register or cite a separate document. Linked evidence is copied into the review entry with its original value, type, confidence, check date and notes. Changed or removed workspace evidence raises a recheck flag; a previously reviewed task then counts as awaiting review and can become overdue. External document changes are not automatically fetched or monitored. MISSING evidence cannot substantiate a recorded review.

## History and storage
New saves append to each task's history. Existing entries have no edit/delete UI. At 500 entries per task, further saves fail visibly without dropping old history; export before arranging an archive. A failed browser-storage write does not advance the visible review history.

The `diligence` workspace key participates in existing private Claude sync and JSON export/import, with browser localStorage fallback. Imports and remote sync replace supplied review history; this is not an authenticated, tamper-proof or multi-user audit system. A site export contains its own review workspace plus the displayed tasks and conditions. The full workspace export remains the backup for all sites. Export before importing or changing devices.

Imports allow only known sites/tasks, enums and fields, validate date/timestamp order and source URLs, and strip unknown fields. An invalid task history is rejected in full with a warning instead of silently presenting an earlier entry as current. Source documents are linked, never uploaded.

## Privacy and scope
Responsible roles are generic. There are no owner-name, phone, IC or personal assignment fields. Free-text fields still require care: do not enter personal data, tokens or private document contents. No scenario, Assembly, source-confidence, financial formula or legal threshold is changed by this workflow.

## Validation
`npm run test:diligence` covers source snapshots/recheck, immutable append, invalid imports, privacy allowlists, storage failure, persistence/export, per-site isolation, unchanged triggers/models and responsive themed controls. The full suite and screenshots are required before acceptance; see completion-programme.md.
