# Roadmap: tasks for Claude Code

Do task 0 first, then the free builds A–C, then the numbered tasks as they become relevant. Start each task with `/clear` so the session begins clean. Paste the prompt, then let Claude plan before it edits (Shift+Tab into plan mode for anything marked **plan first**). A task is done when its checks pass and `npm test` is green.

---

## 0. First session: safety net
**Prompt**
> Read CLAUDE.md and docs/handoff.md sections 1, 8 and 14. Run `npm test` and tell me the result in three lines. Then initialise a git repository, commit everything as "Build 5 baseline", and explain how I can undo a bad change later.

**Done when:** tests pass, there is a first commit, and you know how to roll back (`git restore`, or `/rewind` inside a session).

---

## Free builds: nothing to buy

These three use only what is already in the kit plus free public sources; running them uses your Claude plan's usage and nothing else. They can go in any order. Do A first if you plan to meet owners soon.

### A. Owner briefing packs *(plan first)*
**Prompt**
> Build owner briefing packs for the sites that have an owner model: Apartmen Taman Taiping, Kampung Baru Salak Selatan, Kampung Pantai, and both Jinjang sites.
>
> Add a page to app/index.html at #/pack/<site> with a language switch (Bahasa Malaysia, English, Simplified Chinese), a scenario switch (base case, or the DBKL 2026 incentive as read) and an A4 print layout. Add `npm run packs`, which uses Playwright to export every site, language and scenario to PDF in out/packs/.
>
> Write for owners, not investors, in one to two A4 pages:
> 1. What redevelopment could mean for this building or village, and why it is being discussed now (DBKL's 2026 guideline), without promising any incentive.
> 2. Three ways owners could be paid: cash, a replacement unit, or a share of the new project. For each, show the indicative figures per interest or lot from the engine's deal model (for Taiping, residential and shop owners separately): package value, replacement unit size and how it compares with today's home, rent allowance during construction, and years to completion.
> 3. Owners' rights: under current law every owner must agree, nothing happens without them, and the main steps with a rough timeline.
> 4. A short FAQ (tax, temporary housing, elderly owners, what happens if some owners say no) and a contact block with placeholders for me to fill in.
> 5. A plain disclaimer: an indicative illustration for discussion, not a valuation, an offer or legal advice.
>
> Rules:
> - Take every number from the engine at run time; never type numbers into the template. Print which scenario the numbers come from.
> - If owner coverage in the chosen scenario is below 100%, show no payment figures. Show a short "not ready yet" note instead, listing what would have to change (use the levers), because owners must never see money the project cannot pay.
> - In the DBKL 2026 scenario, say next to the figures that they depend on DBKL approving the incentive.
> - No owners' names or other personal data anywhere.
> - Write natural Malaysian Malay and Simplified Chinese, not word-for-word translations. Keep official terms (Rumah Ganti, Residensi MADANI, RMM) with a short explanation, and mark both versions "for native-speaker review" until I confirm they have been checked.
> - Make sure Chinese characters render in the PDFs (a CJK system font stack, or Noto Sans SC bundled locally).
> - Add tests: each figure in a pack equals the engine's value; no NaN or undefined in any language; the "not ready yet" note appears whenever coverage is below 100%. Then run /check-engine.

**Done when:**
- In the DBKL 2026 scenario, Taiping and Salak Selatan produce full packs in all three languages.
- Kampung Pantai and the Jinjang sites produce "not ready yet" notes; in the base case every site does.
- Tests pass.

Before anything is printed, have a native speaker check the Malay and Chinese, and a lawyer read the disclaimer.

### B. Massing check *(plan first)*
**Prompt**
> Add a massing check: can a given plot ratio physically be built on a site, and what does car parking do to the residual? Start with Apartmen Taman Taiping (the 1.29-acre public-map proxy) at base PR 4.0, the guideline's 6.0 and the 70% cap of 6.8. Then make it work for any site and plot ratio, with an editable assumed parcel size for the villages (default 5 acres), because they are modelled per acre.
>
> 1. Find the development-control rules in PTKL2040's free documents (the development-control volume is linked in docs/handoff.md) and in DBKL's published guidelines: building setbacks, plot coverage or plinth limits, height controls, and residential parking standards. Record each rule in EVIDENCE as OFFICIAL_PLANNING with the document and page. Where you can't find one, use a clearly labelled UNDERWRITING_ASSUMPTION and add a checklist item to confirm it.
> 2. For each plot ratio, compute:
>    - gross floor area, net saleable area, and units at the site's unit size;
>    - buildable footprint after setbacks, tower floor plate and number of storeys;
>    - building height at an assumed 3.2 m floor-to-floor;
>    - parking bays required, parking area at an editable gross area per bay, and the number of basement or podium parking levels.
> 3. Cost the parking, with an editable cost for basement and podium levels. First work out whether the engine's hard cost per sf of floor area already includes parking, so it isn't counted twice. Make that a toggle, and explain which default you chose and why.
> 4. Show a massing-adjusted residual and owner coverage beside the engine's. Do not change the base engine or any golden number.
> 5. Draw a simple isometric block diagram in SVG, with no 3D library: site outline, setbacks, podium and tower, with storeys labelled. It must work in dark mode and at phone width.
> 6. Add tests built on a hand-worked example (write the arithmetic in the test), then run /check-engine.

**Done when:**
- For Taiping at PR 4.0, 6.0 and 6.8, the page shows storeys, height, parking levels and the adjusted coverage.
- Every rule has a source or an assumption label.
- Golden numbers are unchanged.

### C. Land-deal tracker
**Prompt**
> Build a land-deal tracker for Klang Valley development land.
>
> 1. **Data.** Create data/land-deals.csv from data/land-deals-seed.csv, which holds the deals already in the engine. Check every seed row against its source and fill in what is missing, such as dates. Then add land acquisitions from 2024 to 2026 by Bursa Malaysia-listed developers in Kuala Lumpur and Selangor, taken from public company announcements and press reports. Keep the seed file's columns. Use public pages only and read them politely: no logins, no bulk downloading. If a site blocks automated access, list those pages for me to save by hand.
> 2. **New provenance type.** Add COMPANY_FILING for Bursa announcements (an agreement signed, not yet a completed transaction). Update the badge legend and the list in CLAUDE.md.
> 3. **Land deals page.** Add it to app/index.html: a sortable table and pins on the map (deals outside the current Kuala Lumpur map frame can stay table-only, or widen the frame). For each deal show the land price psf, the land share of GDV where GDV is disclosed, and the plot ratio implied by the engine's existing calcLand logic.
> 4. **Buyers.** Summarise who is buying: developer, number of deals, total spend, typical size and price band, and areas. For each watchlist site, list the three most likely buyers by area, ticket size and product type, with the reasoning.
> 5. **Calibration stays put.** Keep the calibration bands and every golden number unchanged. Show what the bands would become with the new deals as a separate "proposed" line for me to approve.
> 6. **Refresh skill.** Create /refresh-land-deals: it finds deals announced since the latest date in the CSV, adds them with sources, and shows me the changes before saving.

**Done when:**
- At least 15 deals are in the file, each with a source.
- The page and the map show them, and each watchlist site has a likely-buyer list.
- Tests pass, and nothing in the base case has moved.

---

## 1. DBKL pre-consultation answers *(plan first; do this when DBKL replies)*
**Prompt**
> DBKL answered our pre-consultation. Here are the answers: [paste]. Update each site's Category B classification and eligibility in INC_DEFAULT, and set the development-charge rate. Add a double-privilege flag that sets Category B to zero where DBKL says the base PR already counts as an incentive. Record every answer in EVIDENCE as OFFICIAL_PLANNING with the date and letter reference, and set the matching triggers to confirmed. Show me which coverage figures move.

**Done when:** each answer appears in Sources with its date, the "DBKL confirms…" triggers read Met or Not met instead of Awaiting data, and `docs/CHANGELOG.md` lists the coverage changes.

---

## 2. Taiping strata roll *(when obtained)*
**Prompt**
> We have the Taman Taiping strata roll: [parcels, accessory parcels, share units, residential/commercial split]. Set the interest count and commercial share from it, mark the count confirmed, add the roll to EVIDENCE as OFFICIAL_STRATA, and report coverage at base, with Category B as read, and at the 70% cap.

**Done when:** the dossier shows "count confirmed", the verdict logic updates, and the golden Taiping numbers stay unchanged; they test the 40-interest stress case on purpose.

---

## 3. Make the code easier to change *(plan first)*
The single 250 KB file is fine to publish but hard to edit safely.

**Prompt**
> Split app/index.html into source modules under src/ (engine.js for the pure functions, guideline.js, data.js, one file per view, styles.css) with a build step that still writes one self-contained app/index.html. Use Vite with vite-plugin-singlefile, or esbuild with a small inline script, whichever is simpler. Add Vitest unit tests that import the pure engine functions directly. The existing Playwright tests must pass unchanged against the built file, and every golden number must stay identical. No CDN scripts.

**Done when:** `npm run build && npm test` passes; the engine and guideline functions have unit tests that run in under 5 seconds; the built file opens offline.

---

## 4. Transaction evidence importer
**Prompt**
> Add a CSV importer for transaction evidence (NAPIC/JPPH or Brickz exports that I download myself): date, address or scheme, unit size, price, tenure. Store rows as TRANSACTION evidence per site, show the median psf and its date range in the dossier, and flag evidence older than 12 months. Never scrape sites behind a login; the input is files I provide.

**Done when:** importing a sample CSV updates the dossier and Sources; stale evidence is flagged; the base case changes only when I accept a new ASP.

---

## 5. Real map with transit zones *(plan first)*
**Prompt**
> Replace the schematic SVG map with MapLibre GL on an OpenStreetMap basemap (respect the OSM tile usage policy, with attribution). Draw 400 m and 600 m station buffers with turf.js, site pins, and a layer slot for gazetted PTKL2040 TPZ/TIZ polygons and DBKL site polygons when we have them. Keep the schematic map as the offline fallback so the tests still run without network. Report the distance from each site to the nearest station box once polygons exist.

**Done when:** the map works online, falls back offline, and the transit reading in DBKL incentives uses the new distances. Check that the published claude.ai page can load the tiles; if it cannot, keep the schematic map in the published build.

---

## 6. Cash flow and IRR *(plan first)*
**Prompt**
> Add a time-phased cash flow beside the static residual: land payment timing (cash at signing, or deferred under replacement units or JV), a construction S-curve, sales take-up and progress billing (for example the Housing Development Act Schedule H pattern for strata), and finance cost on the peak debt instead of a flat 5% of GDV. Output developer IRR, peak debt, and the land value that hits a target IRR. The static RLV and every golden number must stay as they are; this is a second view, not a replacement.

**Done when:** the lab shows IRR and peak debt per site; with flat timing the cash-flow residual reconciles to the static RLV within a stated tolerance.

---

## 7. Probability of clearing the owner test
**Prompt**
> Add a Monte Carlo view: ranges for ASP, hard cost, interest count, lot value and development-charge rate, plus discrete DBKL outcomes (Category B as read, half eligibility, no incentive, double privilege). Show the probability that coverage reaches 1 for each site, and a tornado chart of which input matters most. Use a fixed random seed so the results are reproducible and testable.

**Done when:** the probabilities are stable across runs with the same seed, and the base case is unchanged.

---

## 8. More sites
**Prompt**
> Build owner models for Kampung Datuk Keramat, Flat Taman Bukit Angkasa, Kluster Jalan Rejang and Jalan Jujur & Jalan Ikhlas from the evidence in docs/sources and the web, each with provenance. Then add RLV cases for the 12 unmodelled JWP sites, marking PR as INFERRED until the PTKL intensity per lot is confirmed.

**Done when:** each site shows coverage in the watchlist with honest provenance, and the numbers-auditor agent agrees with the figures.

---

## 9. New modules
- **Powered industrial land:** grid capacity and substation distance, water, fibre, zoning, data-centre proximity; value per MW-ready acre less infrastructure. Johor, southern Selangor (Banting), Melaka and Perak corridors.
- **Old KL office, adaptive reuse:** reuse the residual engine with conversion cost, vacancy, rent and refinancing distress.

**Prompt**
> Plan a second module for [powered industrial land / office adaptive reuse] that reuses the site object, evidence register, residual engine and triggers. Propose the data model and the first three sites before writing code.

---

## 10. Automation (optional)
**Prompt**
> Put this project on a private GitHub repository, add a GitHub Actions workflow that runs `npm test` on every push, and explain how to use Claude Code on the web and the Claude GitHub app with it.

**Done when:** a push runs the tests in CI and a failing test blocks the merge.

---

**After any task:** ask the `numbers-auditor` agent to check the figures independently before you rely on them, and update the live artifact by bringing the new `app/index.html` back to a Claude chat.
