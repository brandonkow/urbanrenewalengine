# Parcel registry and map — Build 6.4 foundation

The production registry is deliberately empty. No official geometry or reuse permission has been obtained for the watchlist. Approximate pins remain approximate. This is software infrastructure, not completion of the evidence-dependent verified-parcel deliverable.

## Files and review
- `data/parcel-registry.json`: source records and optional WGS84 GeoJSON geometry.
- `src/parcel-validator.js`: schema, bounds, polygon and publication checks.
- Map: site selector, boundary layer, document references and focused geometry view.
- `npm run test:parcels`: validation, display gating, interaction and financial isolation.
- Synthetic geometry exists only in `tests/fixtures/parcels.mjs` and ephemeral CI screenshot browsers; never import it into production data.

Records require a stable ID and a known site ID. Properties are explicitly allowlisted; unknown fields fail rather than leaking ownership data. Never include owner names, contacts, identification numbers, private documents or access tokens.

Each record identifies cadastral versus planning geometry, the corresponding official source type, source URL/document reference, check date, confidence, source-stated area (optional), reuse status/reference and a dated professional review with a confirmed site match. A source URL alone is insufficient. A review is a recorded assertion, not authenticated professional certification. Inspect source documents and geographic alignment before accepting a record.

Geometry is accepted only with documented reuse permission. Initially only a single simple Polygon ring is supported, with 4–1000 WGS84 positions in longitude/latitude order, closed and non-self-intersecting. Study extent: 101.5–101.9 E and 2.9–3.4 N. Holes, multipart geometry and other types fail explicitly: do not discard parts to bypass validation. Up to 100 records and 10,000 positions; 2 MB text cap.

Missing geometry, pending review, unconfirmed site match, future dates or source/review dates older than 90 days withhold outlines. This 90-day interval is an editorial review policy, not a statutory expiration. Review content, not just its date, before refreshing. Planning controls have their own URL, reference, check date, review flag and site-specific versus area-context scope.

## Adding real records
1. Obtain an official document/data extract and verify reuse terms for this repository and publication.
2. Match the parcel, lot, scheme and geometry against the actual watchlist site. Check source date and cadastral/planning distinction.
3. Use the repository add-evidence skill: register source facts in EVIDENCE with source type, date, confidence and limits. Add supporting metadata here; do not silently change financial inputs.
4. Have the boundary and any controls reviewed by the appropriate surveyor/planner. Record the review role, date, matched identity and limitations.
5. Add source records through GitHub, build and run the full checks, inspect overview and focused geometry/screenshots, and commit regenerated HTML. A claimed review or permission in JSON is not independent proof.
6. If a separately authorized financial assumption changes, record its evidence and model effect using existing workflows.

A planning polygon does not establish cadastral ownership. Source-stated area is displayed but never automatically applied to model area. Likewise controls do not set PR, incentives or transit eligibility. Economic numbers and consent status are unchanged.

## Research, 29 October 2026
DBKL's [public redevelopment planning-layer directory](https://cps.dbkl.gov.my/server/rest/services/CPS_Public/CPS_Public/MapServer/42) describes polygon geometry and a geographic coordinate system. This was a metadata review only; its feature geometry and reuse rights were not obtained. Direct access failed DNS resolution in the available runtime. A blank copyright field does not establish reuse permission. No map-source fact was promoted into parcel evidence.

The user confirmed that no official parcel/strata documents are currently available. Verified geometry remains an external evidence requirement. Existing approximate location and planning-reference data retain their existing provenance.

## Acceptance
Implementation acceptance is pending GitHub CI and rendered review. Even after software acceptance, Build 6.4 remains evidence-incomplete until real source records and rights pass review.
