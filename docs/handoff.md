# KL Urban Renewal Engine: transferable handoff

**Malaysia Structural Real Estate Opportunity Engine, module 1: Kuala Lumpur urban renewal**
Build 5: DBKL's 2026 redevelopment incentive guideline applied to every underwritten site. Prepared 8 October 2026. Market and policy evidence checked between 17 September and 8 October 2026. The guideline was read from the copy supplied (First Amendment, in force 1 October 2026).

- **Live engine:** https://claude.ai/artifact/J4kUwbkJNbhtFF3MrFHPfa (private to its owner until shared from the page's Share menu)
- **Standalone copy:** `kl_urban_renewal_engine.html`, one self-contained file that opens in any modern browser
- **Seed inputs:** `KL_Urban_Renewal_Opportunity_Screener_v3.xlsx` and `malaysia_structural_real_estate_opportunity_engine_handoff.md` (17 Sep 2026)
- **Guideline:** *Garis Panduan Insentif Pelaksanaan Pembangunan Semula Kuala Lumpur (2026)*, Pindaan Pertama (DBKL, Jabatan Perancangan Bandaraya; 20 pages)

> Screening model only. Not a valuation, not legal advice and not investment advice. Every figure carries a provenance label in the engine; this file keeps those labels.

## 0. How to use this file

- **To get the answer:** read sections 1 and 2.
- **For the numbers:** section 7 (base case), section 8 (the DBKL 2026 guideline re-run), and sections 9 and 10 (calibration and planning). Every number in them was generated from the build-5 engine at its base scenarios, so the tables match the HTML exactly.
- **For what to do next:** sections 1, 12 and 16.
- **To rebuild or extend the engine in another tool:** sections 5 (formulas), 13 (data model), 14 (code map) and 17 (continuation prompt, including Claude Code). The HTML file is the reference implementation; if this text and the code ever disagree, the code is what produced the numbers.

## 1. Executive summary

**The question.** Where in Kuala Lumpur is the redevelopment-supported residual land value (RLV) materially above the current value of the existing buildings, and can that residual actually pay every ownership interest that must sign? The handoff's decision rule still governs everything: **residual value must exceed required owner consideration.**

**1. At base density, no underwritten site pays its owners in full** (no incentive, 30% owner uplift):
- **Kampung Baru Salak Selatan:** covers 79% of the owner budget.
- **Kampung Pantai:** covers 71%; village lot values are an unverified assumption.
- **Apartmen Taman Taiping:** covers 70% at the 40-interest stress case.

**2. DBKL's 2026 guideline, as we read it, closes the gap for two sites.** Category B adds up to 70% of the base plot ratio, built from components: redevelopment 50%, 30% or 15%; residing 30% (commercial zones only); surrendered public open space up to 10%; a transit zone up to 20%.
- **Apartmen Taman Taiping** (whole strata scheme, Jadual 5.2.1: +50%, PR 6.00): covers **106%** at 40 interests. At the 70% cap (PR 6.80), which needs open space and a transit zone on top, 120%.
- **Kampung Baru Salak Selatan** (landed scheme, Jadual 5.2.2: +30%, PR 4.55): covers **103%**. In its R3 zone, the most that classification can reach is +60% (PR 5.60), worth 127%.
- **Kampung Pantai** (+30%, PR 4.55): covers 93%. It needs +40%, meaning one more component: 10% of surrendered open space, or a transit-zone bonus (the pin is about 559 m from Kerinchi LRT, a possible TIZ). At +60% it covers 114%.
- **Jinjang (both sites), Rejang and Jujur:** the residual is negative at base density, and each added floor loses money, so neither guideline route helps.
- **Keramat and Bukit Angkasa:** the residual is positive, but no owner model exists yet.

**3. The density route (Category A) loses to Category B on every site.** Category A trades 800–1,400 persons per acre for 20–100% controlled housing. Residensi MADANI (up to RM200,000 for 750 sf, about RM267 psf) and RMM (up to RM300,000 for 900 sf, about RM333 psf) sell below what it costs to build a saleable square foot (about RM375–580 psf here). The best tier everywhere is IV (800 persons per acre, 20% controlled); for Taiping it covers 89%. Replacement units count toward the controlled share, which helps owner-dense strata sites, not villages.

**4. Three things can take the guideline gain away:**
- **Discretion and double privilege.** Every grant goes through objections (Kaedah 3), technical studies, JKPS and the Mayor. The guideline bars double privilege (6.0(8)); if a specific site's PTKL base PR, such as Taiping's 1:4, already counts as an incentive, Category B may not stack on it.
- **Development charge.** Relief covers only replacement, MADANI and RMM floor area (6.0(6)). At a 30% charge on the market-sold incentive floor area, coverage falls to 95% for Taiping, 96% for Salak and 86% for Pantai.
- **Eligibility.** If existing structures cover half the site or less, the components halve (6.0(2)). For villages, whether "plot area with existing structures" means building footprints or built-on lots decides this.

**5. Taiping is still gated by its legal interest count.** At PR 6.0 the residual pays 42.3 interests at the current package. At 60 interests coverage is 70% (63% with the 20 × 3 building form), and even the 70% cap gives only 80%.

**6. Consent is unanimous today.** The Urban Renewal Bill was withdrawn on 23 Jan 2026; a search on 8 Oct 2026 found no retabling. Every interest can hold out, so model a holdout reserve and do not price in the withdrawn Bill's 75–80% thresholds.

**7. Deal structure rarely creates value; it moves timing and risk.** At base density for Taiping at 40 interests, the shortfall is RM11.5m under a cash buyout, RM15.2m with replacement units and RM16.3m under a JV entitlement.

**8. The prime-deal cross-check is an upper bound, not a base case.** City-centre deals paid 17.8%–23.4% of GDV for land, against the model's 14.3% for Taiping; those were PR 8–10 commercial plots.

**Recommended next actions, in order:**

1. **Pre-consult DBKL** at the enquiry point the guideline names: Unit Pembaharuan Bandar, Jabatan Perancangan Bandaraya, Menara DBKL 1 (03-2617 9691 / 9692; jprb@dbkl.gov.my). Ask four things:
   - each site's Category B classification (Taiping 5.2.1; the villages 5.2.2, or 5.2.1 as housing not fit for occupation);
   - double privilege on the specific-site base PR;
   - the development charge on market-sold incentive floor area;
   - how "plot area with existing structures" is measured for villages.
2. **Taiping:** obtain the strata roll. With the guideline it is now the swing factor between about 106% and 70% coverage.
3. **Salak Selatan:** collect structure-coverage evidence for the eligibility test, track Tuan Straits take-up at RM675+ psf, and sample village lot titles.
4. **Kampung Pantai:** get lot transaction evidence (NAPIC/JPPH), the gazetted PTKL2040 transit-zone category near Kerinchi, and any open-space surrender opportunity.
5. **Confirm the development-charge rate** and set it under Distance to deal.

## 2. Thesis and decision rule

The project started as "what is the next structural, potentially life-changing real-estate opportunity in Malaysia?" It narrowed to three classes: KL urban renewal, powered industrial land, and old-office adaptive reuse. **KL urban renewal** fits the user's skills best and is the primary module.

The thesis evolved through five questions:

1. Where is the next big property opportunity?
2. Where is current economic value materially below redevelopment-supported residual value?
3. **How many ownership interests must share that residual?** This was the handoff's key insight.
4. **How much floor area will DBKL actually allow, and at what charge?** This is build 3–4's addition: land prices only make sense at densities well above the PTKL base plot ratios.
5. **What does DBKL's 2026 guideline grant each site, and on what conditions?** This is build 5's addition: the guideline turns the density question into rules that can be applied site by site.

For every site the engine answers seven questions separately:

- **Planning:** what can be built?
- **Market:** what can it sell for?
- **Development:** what is the residual?
- **Owners:** what must existing interests receive?
- **Deal:** can it be assembled?
- **Trigger:** what must change?
- **Confidence:** which inputs are verified?

A site should not rank highly just because its planning story is attractive. The wealth mechanism is information + deal structure + assembly + planning intelligence, not passive appreciation.

## 3. The engine

One self-contained HTML page. It has no build step and no server code; the only external requests are Google Fonts and the claude.ai runtime when it is hosted there.

| View | What it does |
| --- | --- |
| Watchlist | Ranks the 20 workbook sites plus Kampung Baru Salak Selatan on the owner-aware V2 score (or the original V1). Shows RLV/acre, RLV per land sf, breakeven ASP, owner-density status, nearest lever, coverage with the DBKL 2026 incentive, confidence, stage, verdict, trigger and next action. Hero panel: Taiping's residual against its owner budget. |
| Distance to deal | For each underwritten site, the single-lever moves (ASP, hard cost, owner package, effective PR) that bring owner coverage to 100%, with a guideline-aware planning read. Then the DBKL 2026 table for every site (Category B as read, the most it could reach, the best Category A tier, the better route), the planning-intensity facts and a global development-charge control. |
| DBKL incentives | Site-by-site calculator for the 2026 guideline. Category B components (redevelopment tier, residing, open space, transit zone, eligibility) with the 70% cap; Category A density tiers with the controlled-housing split; routes compared on residual and owner coverage; the guideline's conditions; one click to carry the share into the scenario lab. |
| Map | Schematic pins (approximate) against approximate rail alignments, with draft transit-zone rings (400 m and 600 m) around mapped LRT and MRT stations. Pin colour = economics; purple ring = official specific incentive site. The side panel names the nearest station. |
| Site dossier | Identity, planning, market, deal, score, development (presets), owners, verdict, owner sensitivity tables, triggers, four sensitivity charts, evidence register. |
| Scenario lab | Live sliders for every input. Shows outputs, verdict, interest grid, triggers, charts and cost stack. Presets restore workbook values; a DBKL 2026 preset adds the site's guideline share to the base case. Includes a building-form control (bays × levels), evidence-status toggles and saved scenarios. |
| Deal structures | Cash buyout against replacement units against JV entitlement, with timing, rent allowance, owner uplift in today's money, developer margin, day-one cash, originator fee and promote. |
| Assembly | Consent tracker, one square per interest: not contacted, contacted, interested, signed, refused. Measured against the 100% requirement, with the withdrawn Bill's 75% and 80% marked for reference only. |
| Calibration | Back-solves real projects and land prices into implied plot ratios and land shares. Includes a market-tier land-share cross-check. |
| Triggers | 28 conditions across 9 sites, each met, not met or awaiting data. |
| Sources & diligence | Issues register, Taiping diligence checklist, evidence registry filterable by source type, source library. |
| Site universe | The 139-site PTKL summary, the 8 specific incentive sites and the JWP 49 exact-lot list (searchable). |
| Method | Every formula, the verdict logic, V2 weights (editable), provenance badge legend, and data export and import. |

**Persistence.**
- Every edit saves to the browser (`localStorage`, keys prefixed `klure:`).
- On claude.ai the page also syncs privately to the owner's account. It uses one document at `data/users/<viewer id>/workspace` in the artifact's database; other viewers cannot read it.
- Synced keys: `state`, `saved`, `checks`, `v2w`, `deal`, `asm`, `cal`, `glob`, `inc` (guideline settings, build 5).

**Capabilities declared:** `db`, `user`, `downloads`.

**Export and import (Method → Data):**
- Download the full workspace as JSON (workspace, site data, evidence, issues and current results).
- Download site results as CSV, or show the JSON to copy.
- Import a workspace file or pasted JSON. This replaces the workspace and uses a two-click confirmation instead of a browser dialog.

**Provenance labels on every figure.** Official planning, cadastral and strata roll show as filled badges. Transaction, asking listing and press report are solid outlines. Public-map proxy, inferred and assumption are dashed. Model output is dotted. Not-yet-obtained is red dashed, and edited-in-lab is blue dashed.

## 4. Site universe

**PTKL2040: 139 priority redevelopment sites** (indicative map only; geometry not ingested):

| Category | Count |
| --- | ---: |
| Residential | 91 |
| Commercial | 14 |
| Industrial | 3 |
| Mixed development | 1 |
| Institution / public facilities | 14 |
| Infrastructure & utilities | 15 |
| Transportation | 1 |
| **Total** | **139** |

**Eight specific redevelopment incentive sites** (PTKL2040 development control). These have explicit base plot ratios:

| Site | Reference | Zone | Base PR | Assembly rule | Stage | Recorded verdict |
| --- | --- | --- | --- | --- | --- | --- |
| Kampung Datuk Keramat | PTKL Specific Site 1 | R3 | 1:3 | Comprehensive/cluster development; minimum 30,000 sq ft; direct access via Jalan Keramat or Jalan Datuk Keramat | Screening | Too fragmented |
| Kampung Baru Salak Selatan | PTKL Specific Site 2 | R3 | 1:3.5 | Comprehensive/cluster; minimum 30,000 sq ft for identified sub-area(s) | Trigger watch | Trigger watch |
| Kampung Pantai | PTKL Specific Site 3 | R3 | 1:3.5 | Subject to PTKL2040 redevelopment controls | Trigger watch | Trigger watch |
| Kluster Jalan Rejang | PTKL Specific Site 4 | R3 | 1:3.5 | Comprehensive or cluster development; access through listed Jalan Rejang roads | Trigger watch | Trigger watch |
| Jalan Jujur & Jalan Ikhlas | PTKL Specific Site 5 | R3 | 1:3.5 | Comprehensive or cluster development | Screening | End value too low |
| Apartmen Taman Taiping | PTKL Specific Site 6 | R3 | 1:4 | Comprehensive whole-site or block-cluster redevelopment; direct access via Jalan Tandok | Diligence | Conditional high potential |
| Jalan Jinjang Aman | PTKL Specific Site 7 | R2 | 1:2.5 | Comprehensive/cluster; minimum 30,000 sq ft; 15m main access reserve | Screening | End value too low |
| Jalan Jinjang Selatan | PTKL Specific Site 8 | R2 | 1:2.5 | Comprehensive/cluster; minimum 30,000 sq ft; 15m main access reserve | Screening | End value too low |

**JWP exact-lot sites on the watchlist** (13 of the 49; lot numbers from the JWP list):

| Site | Reference | Mukim / Seksyen | Parliament | Official lots | Stage | Recorded verdict |
| --- | --- | --- | --- | --- | --- | --- |
| Flat Taman Shamelin Perkasa | JWP site 22 | Kuala Lumpur | Cheras | 54591 | Discovery | Not underwritten |
| Flat Taman Bukit Angkasa | JWP site 33 | Kuala Lumpur | Lembah Pantai | 474828, 474829, 747831, 52003, 53664, 58138 | Screening | Planning uncertain |
| Flat Kuchai Jaya | JWP site 40 | Petaling | Seputeh | 33598 | Discovery | Not underwritten |
| Flat Taman Pertama | JWP site 20 | Kuala Lumpur | Cheras | 40010, 40011, 40012, 40013 | Discovery | Not underwritten |
| Flat Taman Maluri | JWP site 23 | Ampang | Titiwangsa | 6946, 6949 | Discovery | Low information edge |
| Flat Taman Melati | JWP site 26 | Setapak | Wangsa Maju | 25092, 25093, 25117, 25118 | Discovery | Not underwritten |
| Flat Kuchai Entrepreneurs Park | JWP site 38 | Petaling | Seputeh | 32082, 32087 | Discovery | Not underwritten |
| Flat Bandar Baru Sentul Fasa 3 | JWP site 27 | Seksyen 85A | Batu | 136, 138, 139, 140, 142, 143, 144, 145, 146, 147, 149, 150, 151, 152, 153, 156, 157, 158 | Discovery | Not underwritten |
| Flat PKNS Jalan Kuching | JWP site 30 | Batu | Batu | 63178, 63179, 63181, 63182, 63184, 63185, 63186, 63187, 63188, 63189 | Discovery | Not underwritten |
| Flat Jalan Tiong Nam | JWP site 45 | Seksyen 46 | Bukit Bintang | 791, 794-797, 1754-1763 (15 lots) | Discovery | Not underwritten |
| Flat Jalan Barat | JWP site 43 | Seksyen 67 | Cheras | Multiple clusters across Jalan Barat / Jalan Melati / Jalan Khoo Teik Ee / Jalan Horley / Jalan Imbi / Medan Imbi; see official source for full list | Screening | Too fragmented |
| Flat Jalan Walter Granier | JWP site 41 | Seksyen 67 | Bukit Bintang | 884-889, 977-984, 1000-1009, 1169-1170, 765-772, 891-896, 986-987, 989, 1010-1019, 1241, 1288, 20032, 1171-1172 (58 lots) | Screening | Too fragmented |
| Flat PKNS Jalan Tun Razak | JWP site 29 | Seksyen 41 | Titiwangsa | 3351, 3352, 3353, 3354, 3355, 3356, 3357 | Rejected | Already in play |

**Geometry rule.** The engine keeps five geometry types apart and never treats one as another:

- **Planning area:** a named area in PTKL; indicative.
- **Redevelopment polygon:** the DBKL specific-site polygon, a paid GIS layer.
- **Cadastral lot:** a surveyed parcel; JWP lists lot numbers.
- **Strata parcel:** the legal interest that must be paid.
- **Public-map proxy:** OpenStreetMap or similar; screening only.

Taiping's 1.2887-acre area is an OSM proxy (way 890986893), **not** the legal Site 6 boundary.

## 5. Formulas

All functions are pure. Notation: `k = efficiency × (1 − GDV-based costs − profit)`; `c = hard cost × (1 + fees + contingency)`, the cost per GFA sf.

**Residual land value**
```
effective PR = base PR × (1 + PR uplift)
GFA = land sf × effective PR;  saleable = GFA × efficiency;  GDV = saleable × ASP
hard = GFA × hard cost;  fees = hard × 8%;  contingency = hard × 5%
GDV-based lines = GDV × (statutory 3% + sales 3% + finance 5% + demolition/relocation 2% + profit 20%)
incentive GFA = land sf × max(0, effective PR − base PR)
development charge = rate × incentive GFA × max(0, ASP × k − c)        (rate defaults to 0%)
RLV = GDV − hard − fees − contingency − GDV-based lines − development charge
breakeven ASP = c ÷ k;   breakeven hard cost = ASP × k ÷ (1 + fees + contingency)
E (PR that still earns residual) = effective PR − rate × (effective PR − base PR)
```

**Owner economics: strata (Taiping and any flat)**
```
weighted value = residential × (1 − commercial share) + commercial × commercial share
package = weighted value × (1 + uplift);   budget per interest = package × (1 + holdout reserve)
owner budget = interests × budget per interest
coverage = RLV ÷ owner budget;   max interests = RLV ÷ budget per interest
premium to current value = RLV ÷ (interests × (1 + holdout)) ÷ weighted value − 1
required ASP = (owner budget ÷ land sf ÷ E + c) ÷ k
required PR: r = owner budget ÷ land sf ÷ (ASP × k − c); if r > base PR and rate > 0: r = (r − rate × base PR) ÷ (1 − rate)
required land = owner budget ÷ RLV per acre
building form (optional): interests = bays × levels; commercial share = 1 ÷ levels
decision rule: RLV > owner budget  (coverage ≥ 1)
```

**Owner economics: landed villages (Salak Selatan, Pantai, Jinjang)**
```
lots = site sf × share of site in private lots ÷ average lot size
value per lot = lot size × lot value psf
payable lot value psf = RLV ÷ (site sf × share in lots) ÷ ((1 + uplift) × (1 + holdout))
```
Coverage for landed sites does not depend on site area, because the lot count scales with the land.

**Distance to deal (single-lever moves to coverage = 1, everything else fixed)**
```
ASP move = required ASP ÷ ASP − 1
hard-cost move = [(ASP × k − owner budget ÷ land sf ÷ E) ÷ (1 + fees + contingency)] ÷ hard cost − 1
owner-package move = coverage − 1        (unreachable when RLV ≤ 0)
PR needed = required PR;  uplift over base = required PR ÷ base PR − 1
nearest lever = the smallest absolute move among ASP, hard cost and owner package
```
Planning bands for the PR needed (guideline-aware since build 5):
- **Base PR enough:** no uplift needed.
- **Within the guideline:** at or below the site's Category B share as read (or as set in DBKL incentives).
- **Needs more components:** above that, but within what the classification can reach with open space and a transit zone.
- **Beyond this classification:** more than the classification can reach, though within 70%; only a higher redevelopment tier gets there.
- **Beyond the 70% cap.**
- **Density can't help:** when `ASP × k ≤ c`.

**DBKL 2026 guideline (build 5)**
```
Category B (plot ratio)
share = min((redevelopment + residing + open space) × eligibility + transit zone, 70%)
  redevelopment 50% / 30% / 15%  (Jadual 5.2.1 / 5.2.2 / 5.2.3)
  residing 30%, only with ≥50% residential floor area in a commercial zone
  open space ≤ 10% (surrendered above the standard, pro rata);  transit zone ≤ 20% (TPZ/TIZ per PTKL2040)
  eligibility = 100% if existing structures cover > 50% of the site, else 50%  (transit zone not scaled)
effective PR = base PR × (1 + share)
most reachable = same formula with open space 10%, transit zone 20%, residing 30% (commercial zones only)

Category A (density, fully residential)
units U = floor(persons per acre × acres ÷ persons per unit)          persons per unit = 4 (assumed)
controlled C = ceil(controlled share × U); replacement units G = min(owners, U) count toward C
affordable = max(0, C − G); MADANI = round(affordable × 30%) below 10 acres, × 50% at 10 acres or more; RMM = the rest
free market F = U − G − affordable
GDV = (F + G) × unit size × ASP + MADANI × RM200,000 + RMM × RM300,000
GFA = [(F + G) × unit size + MADANI × 750 sf + RMM × 900 sf] ÷ efficiency
development charge = rate × max(0, GFA − land sf × base PR) × (F × unit size ÷ NFA) × max(0, ASP × k − c)
RLV = GDV − GFA × c − GDV × (statutory + sales + finance + demolition + profit) − development charge
```
Replacement units are valued at market, so the owner test stays cash-equivalent. Engine check against the guideline's own worked examples (base PR 6.0, components 90%, transit 15%): PR 9.6 at 50% eligibility and 10.2 at 100% after the cap; the guideline gives 9.6 and 10.2.

**Deal structures**
```
rent allowance = years × 12 × (res interests × res rent + com interests × com rent) − min(that, share × demolition line)
A cash buyout:      surplus = RLV − Σ packages                 (paid at signing)
B replacement units: unit area = package ÷ ASP  (or old area × ratio; optionally grossed up to today's money)
                    surplus = RLV − units at ASP × (1 − sales% − profit% if margin waived) − rent
C JV entitlement:   surplus = RLV − entitlement% × GDV − rent  (entitlement defaults to the package-matching share)
owner uplift in today's money = headline value ÷ (1 + r)^years ÷ current value − 1
developer margin achieved = profit hurdle + surplus ÷ GDV
originator fee = rate × owner consideration (or × GDV);  payoff = fee + promote × (surplus − fee), only if surplus ≥ fee
```

**Calibration**
```
implied PR (project) = units × average size ÷ efficiency ÷ land sf
implied PR (land price) = land psf ÷ (ASP × k − c)
land share of GDV (model) = RLV ÷ GDV;  market bands: suburban 10.2–12.4%, prime KL 17.8–23.4%
```

**Scores**
```
V1 = 0.35 structural upside + 0.25 planning clarity + 0.25 dealability + 0.15 information edge   (workbook)
V2 = 0.25 residual gap + 0.15 planning certainty + 0.20 owner feasibility + 0.15 end-value confidence
   + 0.10 dealability + 0.10 information edge + 0.05 capital accessibility   (normalised by total weight)
residual gap = clamp(5 + RLV per land sf ÷ 100, 0, 10)   [no RLV: V1 upside × 0.7]
owner feasibility = clamp(7 × coverage, 0, 10)            [no owner model: analyst proxy]
planning certainty = V1 planning clarity, capped at 6.5 if PR is not official
```

**Model verdict logic** (the recorded analyst verdict is kept separately):
- PR not official → Planning uncertain.
- RLV ≤ 0 and ASP within 10% of breakeven → Trigger watch; gap over 10% → End value too low.
- Coverage ≥ 1.25 with a confirmed count → Strong base case.
- Coverage < 1 with a confirmed count, or coverage < 0.6 regardless → Owner density blocked.
- Coverage 0.6–1.25 with an unconfirmed count or lot value → Conditional high potential.

Owner-density bands (handoff): under 20 interests per acre is strong, 20–25 workable, 25–35 difficult, over 35 weak.

## 6. Assumptions

**Cost stack** (fees and contingency on hard cost; the rest on GDV):

| Line | Downside | Base | Upside | Status |
| --- | ---: | ---: | ---: | --- |
| Saleable efficiency | 75% | 78% | 80% | Assumption |
| PR uplift | 0% | 0% | 25% | Assumption; never an entitlement |
| Hard-cost multiplier | 1.10× | 1.00× | 0.95× | Assumption |
| Developer profit (of GDV) | 22% | 20% | 18% | Assumption |
| Professional fees (of hard cost) | 8% | 8% | 8% | Assumption |
| Contingency (of hard cost) | 5% | 5% | 5% | Assumption |
| Statutory / infrastructure (of GDV) | 3% | 3% | 3% | Assumption; replace with authority charges |
| Sales & marketing (of GDV) | 3% | 3% | 3% | Assumption |
| Finance (of GDV) | 5% | 5% | 5% | Assumption |
| Demolition / relocation (of GDV) | 2% | 2% | 2% | Assumption |
| Development charge on incentive GFA | 0% | 0% | 0% | Assumption; rate unverified |

**Per-site underwriting inputs** (ASP is RM per saleable sf; hard cost is RM per GFA sf):

| Site | Base PR | ASP down / base / up | Hard cost | Area | Evidence behind ASP |
| --- | --- | --- | --- | --- | --- |
| Apartmen Taman Taiping | 1:4 | RM900 / RM1,100 / RM1,250 | RM400 | 1.2887 ac (public-map proxy) | Nadi Bangsar asks span roughly RM733–1,378 psf; base set at RM1,100. |
| Kampung Baru Salak Selatan | 1:3.5 | RM550 / RM650 / RM700 | RM270 | 1 acre (normalised) | Tuan Straits Residency launched 2Q2026 from RM675 psf (GDV RM765m); sub-sale condos ask ≈RM518–615. |
| Kampung Pantai | 1:3.5 | RM600 / RM680 / RM770 | RM270 | 1 acre (normalised) | Nestree Residence (in Kampung Pantai) averages ≈RM624 psf asking; Kampung Pantai area average ≈RM684; a nearby new launch asks RM770. |
| Flat Taman Bukit Angkasa | 1:3.5 (provisional) | RM650 / RM775 / RM900 | RM320 | 1 acre (normalised) | Pantai new launch asks ≈RM770 psf; Residensi Rimba transactions ≈RM817–841 psf. |
| Kampung Datuk Keramat | 1:3 | RM700 / RM850 / RM1,000 | RM350 | 1 acre (normalised) | Residential-land asks range ≈RM144 to RM600+ psf land. End ASP is an underwriting assumption. |
| Kluster Jalan Rejang | 1:3.5 | RM500 / RM600 / RM700 | RM290 | 1 acre (normalised) | Residensi Rampai II asks ≈RM446–568 psf; M Azura ≈RM541. Base assumes a new-product premium. |
| Jalan Jujur & Jalan Ikhlas | 1:3.5 | RM450 / RM550 / RM650 | RM280 | 1 acre (normalised) | Residensi Razakmas 2 asks ≈RM353 psf but is a controlled affordable scheme; base stress-tested above it. |
| Jalan Jinjang Aman | 1:2.5 | RM420 / RM480 / RM550 | RM260 | 1 acre (normalised) | Suite Enesta, opposite MRT Jinjang, asks ≈RM411–470 psf; Sri Jinjang fell from ≈RM374 to RM318 psf over 2023–25. |
| Jalan Jinjang Selatan | 1:2.5 | RM420 / RM480 / RM550 | RM260 | 1 acre (normalised) | Closest comparable is Suite Enesta (≈RM411–470 psf asks), directly opposite MRT Jinjang. |

**Owner inputs:**

| Site | Mode | Inputs | Provenance |
| --- | --- | --- | --- |
| Apartmen Taman Taiping | Strata | Residential RM470,000 per interest; commercial RM1,600,000 (RM8,000/month asking rent ÷ 6% yield); commercial share 25%; 40 interests (stress case); uplift 30%; holdout 0% | Residential: one 2020 transaction. Commercial: asking rent + assumed yield. Count: inferred from addresses. |
| Kampung Baru Salak Selatan | Landed | Lot 4,000 sf at RM160 psf land; 70% of site in lots; uplift 30% | Village lot asks ≈RM122–203 psf of land on 3,580–5,091 sf lots, mostly leasehold. |
| Kampung Pantai | Landed | Lot 2,500 sf at RM300 psf land; 65% of site in lots; uplift 30% | No Kampung Pantai lot evidence found. RM300 psf sits between Salak/Jinjang village asks and a Pantai Murni terrace at ≈RM458 psf of land. |
| Jalan Jinjang Aman / Selatan | Landed | Lot 4,000 sf at RM200 psf land; 70% of site in lots; uplift 30% | Village lot asks ≈RM176–229 psf of land on 2,600–5,400 sf lots. |
| Keramat, Angkasa, Rejang, Jujur | None yet | Owner model not built | Start one in the scenario lab |

**Guideline readings and assumptions** (build 5; our reading, not DBKL decisions):

| Site | Zone | Redevelopment component as read | Residing available | Most reachable | Category A unit size | Reading |
| --- | --- | --- | --- | --- | --- | --- |
| Apartmen Taman Taiping | R3 | +50% (Whole scheme with permanent structures) | no (residential zone) | +70% | 1,000 sf | Strata flats on a PTKL specific redevelopment site: Jadual 5.2.1. |
| Kampung Baru Salak Selatan | R3 | +30% (Replanning old, dilapidated, abandoned or squatter areas) | no (residential zone) | +60% | 850 sf | Landed village scheme: Jadual 5.2.2. The 50% tier is arguable if DBKL treats it as housing not fit for occupation. |
| Kampung Pantai | R3 | +30% (Replanning old, dilapidated, abandoned or squatter areas) | no (residential zone) | +60% | 850 sf | Landed village scheme: Jadual 5.2.2. |
| Flat Taman Bukit Angkasa | not recorded | +50% (Whole scheme with permanent structures) | unknown: zone not recorded | +70% | 900 sf | Strata flats on the JWP redevelopment list: Jadual 5.2.1. Its base PR 3.5 is itself provisional. |
| Kampung Datuk Keramat | R3 | +30% (Replanning old, dilapidated, abandoned or squatter areas) | no (residential zone) | +60% | 900 sf | Landed kampung: Jadual 5.2.2. |
| Kluster Jalan Rejang | R3 | +30% (Replanning old, dilapidated, abandoned or squatter areas) | no (residential zone) | +60% | 850 sf | Cluster housing treated as a landed scheme: Jadual 5.2.2 (classification unverified). |
| Jalan Jujur & Jalan Ikhlas | R3 | +30% (Replanning old, dilapidated, abandoned or squatter areas) | no (residential zone) | +60% | 850 sf | Housing treated as a landed scheme: Jadual 5.2.2 (classification unverified). |
| Jalan Jinjang Aman | R2 | +30% (Replanning old, dilapidated, abandoned or squatter areas) | no (residential zone) | +60% | 850 sf | Landed new village: Jadual 5.2.2. |
| Jalan Jinjang Selatan | R2 | +30% (Replanning old, dilapidated, abandoned or squatter areas) | no (residential zone) | +60% | 850 sf | Landed new village: Jadual 5.2.2. |

Other guideline assumptions: existing structures cover more than half of each site (100% eligibility); no open space or transit-zone component unless set; 4 persons per unit (Nestree's 630 units on 2.10 acres equal 1,200 persons per acre at 4 per unit, exactly the Category II density); schemes under 10 acres for the MADANI:RMM split, because the villages are modelled per acre. MADANI and RMM prices and sizes are the programme ceilings and floors.


**Deal-structure defaults** (all assumptions):
- **Timing:** a 4-year build and a 6% owner discount rate.
- **Rent allowance:** RM2,000/month residential (site-specific for the landed sites) and RM8,000/month commercial. 50% of the demolition/relocation line offsets rent.
- **Replacement units:** sized to match the owner package.
- **Originator economics:** fee 2% of owner consideration and promote 20% of the surplus remaining after the fee.

## 7. Results (base scenarios, generated from the engine)

### 7.1 Residual land value by scenario (normalised to 1 acre)

| Site | Downside RLV/acre | Base RLV/acre | Upside RLV/acre | Base RLV per land sf | Base breakeven ASP | Base ASP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Apartmen Taman Taiping | −RM10.18m | RM21.41m | RM56.76m | RM491 | RM865 | RM1,100 |
| Kampung Baru Salak Selatan | −RM10.29m | RM5.27m | RM18.40m | RM121 | RM584 | RM650 |
| Kampung Pantai | −RM6.57m | RM7.66m | RM25.76m | RM176 | RM584 | RM680 |
| Flat Taman Bukit Angkasa | −RM12.33m | RM6.62m | RM29.21m | RM152 | RM692 | RM775 |
| Kampung Datuk Keramat | −RM12.26m | RM6.37m | RM28.79m | RM146 | RM757 | RM850 |
| Kluster Jalan Rejang | −RM17.80m | −RM2.16m | RM14.31m | −RM49 | RM627 | RM600 |
| Jalan Jujur & Jalan Ikhlas | −RM19.62m | −RM4.42m | RM11.10m | −RM101 | RM605 | RM550 |
| Jalan Jinjang Aman | −RM12.90m | −RM4.68m | RM3.33m | −RM107 | RM562 | RM480 |
| Jalan Jinjang Selatan | −RM12.90m | −RM4.68m | RM3.33m | −RM107 | RM562 | RM480 |

The five workbook sites reproduce the v3 workbook's RLV Model sheet to four decimal places. The upside case adds 25% PR uplift, which is not an entitlement.

### 7.2 Owner test

| Site | Mode | Interests | Package each | Owner budget | RLV | Coverage | Max interests | Required ASP | Required PR | Payable lot psf |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Kampung Baru Salak Selatan | Landed | 8 | RM832k | RM6.7m | RM5.3m | 79% | 6.3 | RM667 | 4.42× | RM133 |
| Kampung Pantai | Landed | 11 | RM975k | RM10.7m | RM7.7m | 71% | 7.9 | RM718 | 4.90× | RM208 |
| Apartmen Taman Taiping | Strata | 40 | RM978k | RM39.1m | RM27.6m | 70% | 28.2 | RM1,198 | 5.67× | – |
| Jalan Jinjang Aman | Landed | 8 | RM1.04m | RM8.3m | −RM4.7m | 0% | 0.0 | RM708 | none | −RM118 |
| Jalan Jinjang Selatan | Landed | 8 | RM1.04m | RM8.3m | −RM4.7m | 0% | 0.0 | RM708 | none | −RM118 |

Taiping uses its 1.289-acre proxy; landed sites are normalised to 1 acre, which does not affect their coverage. Salak's lots ask RM122–203 psf of land against a payable RM133; Pantai's assumed RM300 against a payable RM208.

### 7.3 Distance to deal

| Site | Owner coverage | ASP move | Hard-cost move | Owner-package move | Effective PR needed (vs base) | Nearest lever |
| --- | --- | --- | --- | --- | --- | --- |
| Kampung Baru Salak Selatan | 79% | +2.7% (RM667) | −3.0% (RM262) | −20.8% (RM659k) | 4.42× (+26%) | ASP +2.7% |
| Kampung Pantai | 71% | +5.7% (RM718) | −6.6% (RM252) | −28.5% (RM697k) | 4.90× (+40%) | ASP +5.7% |
| Apartmen Taman Taiping | 70% | +8.9% (RM1,198) | −11.4% (RM355) | −29.5% (RM690k) | 5.67× (+42%) | ASP +8.9% |
| Jalan Jinjang Aman | 0% | +47.6% (RM708) | −40.6% (RM154) | not reachable | none | Hard cost −40.6% |
| Jalan Jinjang Selatan | 0% | +47.6% (RM708) | −40.6% (RM154) | not reachable | none | Hard cost −40.6% |
| Flat Taman Bukit Angkasa | residual only | −10.7% (RM692) | +12.0% (RM358) | – | – | Residual positive (ASP headroom 10.7%); owner model missing |
| Kampung Datuk Keramat | residual only | −11.0% (RM757) | +12.3% (RM393) | – | – | Residual positive (ASP headroom 11.0%); owner model missing |
| Kluster Jalan Rejang | residual negative | +4.5% (RM627) | −4.3% (RM277) | – | – | Hard cost −4.3% to break even |
| Jalan Jujur & Jalan Ikhlas | residual negative | +10.1% (RM605) | −9.2% (RM254) | – | – | Hard cost −9.2% to break even |

Each move holds every other input fixed; they are alternatives, not a combined plan. For sites without an owner model, the moves shown are to break even.

### 7.4 Taman Taiping deep dive

**Base case (handoff numbers, all reproduced):**
- **Residual:** PR 4.0, RM1,100 psf, RM400 psf hard cost. RLV is RM21.407m per acre, or RM27.587m on the 1.2887-acre proxy.
- **Owner package:** weighted value RM752,500 per interest; at a 30% uplift the package is RM978,250.
- **Result:** the residual supports 28.2 interests. At 40 interests the owner premium is −8.4%, the required ASP RM1,198 and the required PR 5.67×.

**By ownership count** (25% commercial, 1.289 acres):

| Interests | Owner budget | Required ASP at PR 4 | Premium at RM1,100 | Required PR at RM1,100 |
| ---: | ---: | ---: | ---: | ---: |
| 20 | RM19.6m | RM1,032 | +83.3% | 2.84× |
| 30 | RM29.3m | RM1,115 | +22.2% | 4.26× |
| 40 | RM39.1m | RM1,198 | −8.4% | 5.67× |
| 50 | RM48.9m | RM1,282 | −26.7% | 7.09× |
| 60 | RM58.7m | RM1,365 | −38.9% | 8.51× |
| 80 | RM78.3m | RM1,532 | −54.2% | 11.35× |

**Building-form cases** (20 frontage bays, one commercial unit per bay; this keeps count and mix consistent):

| Bays × levels | Interests | Commercial share | Package each | Supported | Coverage | Required ASP | Required PR | Premium |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 20 × 2 | 40 | 50% | RM1.35m | 20.5 | 51% | RM1,324 | 7.80× | −33.4% |
| 20 × 3 | 60 | 33% | RM1.10m | 25.1 | 42% | RM1,428 | 9.58× | −45.7% |
| 20 × 4 | 80 | 25% | RM978k | 28.2 | 35% | RM1,532 | 11.35× | −54.2% |

A listing places a 1,579 sf four-bedroom unit on the "second floor", so blocks likely have three or more levels. The handoff's 40-interest case also implies a 50% commercial share, not 25%. The original 40-at-25% case is internally inconsistent; the form cases above are not.

**Deal structures at 40 interests:**

|  | Cash buyout | Replacement units | JV entitlement |
| --- | ---: | ---: | ---: |
| Developer surplus after paying owners (above the 20% hurdle) | −RM11.5m | −RM15.2m | −RM16.3m |
| Developer margin achieved (hurdle 20%) | 14.0% | 12.1% | 11.5% |
| Day-one cash for land | RM39.1m | RM0 | RM0 |
| Owner uplift, headline | +30.0% | +30.0% | +30.0% |
| Owner uplift in today’s money (6%, 4 years) | +30.0% | +3.0% | +3.0% |
| Interests supportable including a 2% originator fee | 27 | 25 | 25 |

Additional points:
- **Rent allowance:** owners must be housed for four years, costing RM4.8m net of the relocation allowance.
- **Replacement unit size:** a package-matched replacement flat is 555 sf, 35% of today's 1,579 sf.
- **Waiving margin:** if the developer waives its margin on replacement units, the shortfall narrows to RM7.3m.
- **Originator fee:** with a 2% fee included, the site supports only about 25–27 interests.

**Prime-tier cross-check:** Taiping's model land share is 14.3% of GDV. At the prime KL deals' 17.8%–23.4%, its land budget would be RM34.3m–RM45.1m. That pays 35.1–46.1 interests. Treat this as an upper bound, because those deals were PR 8–10 city-centre commercial plots.

**Verdict:** Conditional high potential. The gating variable is the legal ownership-interest count, followed by the incentive PR DBKL will grant for Site 6. As read, the 2026 guideline's +50% would let the residual pay 42.3 interests (section 8.4).

### 7.5 Ranking (V2 owner-aware score against the original V1)

| V2 rank | Site | V2 | V1 | Stage | Recorded verdict | Gating variable |
| ---: | --- | ---: | ---: | --- | --- | --- |
| 1 | Apartmen Taman Taiping | 7.49 | 8.47 | Diligence | Conditional high potential | Legal ownership-interest count |
| 2 | Kampung Baru Salak Selatan | 6.99 | – | Trigger watch | Trigger watch | End ASP versus the ≈RM667 owner-required ASP |
| 3 | Kampung Pantai | 6.69 | 7.97 | Trigger watch | Trigger watch | Village land value versus the ≈RM208 psf the residual can pay |
| 4 | Flat Taman Bukit Angkasa | 6.35 | 7.75 | Screening | Planning uncertain | DCP2 intensity (PR 3.5 is provisional) |
| 5 | Kluster Jalan Rejang | 6.35 | 8.21 | Trigger watch | Trigger watch | ASP versus ≈RM627 breakeven |
| 6 | Flat Taman Shamelin Perkasa | 6.14 | 7.83 | Discovery | Not underwritten | Title, owner count and PTKL intensity |
| 7 | Flat Kuchai Jaya | 6.12 | 7.72 | Discovery | Not underwritten | Owner count and tenure |
| 8 | Kampung Datuk Keramat | 6.09 | 8.00 | Screening | Too fragmented | Parcel basis versus modelled RLV |
| 9 | Flat Taman Maluri | 6.04 | 7.61 | Discovery | Low information edge | Existing developer interest |
| 10 | Flat Kuchai Entrepreneurs Park | 6.04 | 7.59 | Discovery | Not underwritten | Plot ratio and strata structure |
| 11 | Flat Taman Pertama | 5.99 | 7.70 | Discovery | Not underwritten | Intensity and end ASP |
| 12 | Jalan Jujur & Jalan Ikhlas | 5.97 | 8.24 | Screening | End value too low | Achievable new-product ASP |
| 13 | Flat Taman Melati | 5.92 | 7.61 | Discovery | Not underwritten | Intensity and end ASP |
| 14 | Flat Bandar Baru Sentul Fasa 3 | 5.67 | 7.49 | Discovery | Not underwritten | 18-lot fragmentation |
| 15 | Flat Jalan Tiong Nam | 5.59 | 7.43 | Discovery | Not underwritten | 15-lot assembly |
| 16 | Flat PKNS Jalan Kuching | 5.58 | 7.46 | Discovery | Not underwritten | Institutional ownership |
| 17 | Flat Jalan Barat | 5.30 | 7.35 | Screening | Too fragmented | Multi-cluster fragmentation |
| 18 | Flat Jalan Walter Granier | 5.29 | 7.08 | Screening | Too fragmented | 58-lot assembly |
| 19 | Jalan Jinjang Selatan | 5.13 | 8.05 | Screening | End value too low | End-product ASP versus ≈RM562 breakeven at PR 2.5 |
| 20 | Jalan Jinjang Aman | 5.06 | 8.05 | Screening | End value too low | End-product ASP versus ≈RM562 breakeven at PR 2.5 |
| 21 | Flat PKNS Jalan Tun Razak | 4.99 | 6.70 | Rejected | Already in play | Active developer process |

V2 factors marked as model output (residual gap, owner feasibility) move with the scenario. The rest are analyst proxies, editable through the V2 weights.

### 7.6 Triggers (5 met, 14 not met, 9 awaiting data)

| Site | Condition | Current | Threshold | Status | Basis |
| --- | --- | --- | --- | --- | --- |
| Apartmen Taman Taiping | Legal interest count within the supportable maximum | – | 28.2 interests | Awaiting data | Needs: Strata roll (parcel and accessory counts) |
| Apartmen Taman Taiping | Official site area covers the owner budget | – | 1.83 acres | Awaiting data | Needs: DBKL Site 6 polygon (eMap) |
| Apartmen Taman Taiping | Underwritten ASP clears the owner-required ASP | RM1,100 psf | RM1,198 psf | Not met | Current scenario value |
| Apartmen Taman Taiping | Effective PR clears the owner-required PR | 4.00 × | 5.67 × | Not met | Current scenario value |
| Apartmen Taman Taiping | Every interest signed (unanimous consent) | – | 100% | Awaiting data | Needs: Start tracking in Assembly |
| Apartmen Taman Taiping | DBKL confirms the 50% Category B redevelopment incentive for Site 6 | – | Yes | Awaiting data | Needs: Pre-consultation with DBKL’s Unit Pembaharuan Bandar |
| Apartmen Taman Taiping | Owner coverage with the DBKL 2026 incentive | 106% | 100% | Met | Current scenario value |
| Kampung Baru Salak Selatan | Owner coverage with the DBKL 2026 incentive | 103% | 100% | Met | Current scenario value |
| Kampung Baru Salak Selatan | DBKL confirms the 30% landed-scheme incentive | – | Yes | Awaiting data | Needs: Pre-consultation with DBKL’s Unit Pembaharuan Bandar |
| Kampung Pantai | Owner coverage with the DBKL 2026 incentive | 93% | 100% | Not met | Current scenario value |
| Kampung Baru Salak Selatan | Effective PR clears the owner-required PR | 3.50 × | 4.42 × | Not met | Current scenario value |
| Kluster Jalan Rejang | Setapak ASP at or above RM650 psf | RM600 psf | RM650 psf | Not met | Current scenario value |
| Kluster Jalan Rejang | ASP clears breakeven | RM600 psf | RM627 psf | Not met | Current scenario value |
| Kluster Jalan Rejang | Hard cost at or below breakeven cost | RM290 psf GFA | RM277 psf GFA | Not met | Current scenario value |
| Kluster Jalan Rejang | Effective PR at or above 4.0 | 3.50 × | 4.00 × | Not met | Current scenario value |
| Kluster Jalan Rejang | Owner count at or below 32 | – | 32 interests | Awaiting data | Needs: Title and strata search |
| Kampung Baru Salak Selatan | Underwritten ASP clears the owner-required ASP | RM650 psf | RM667 psf | Not met | Current scenario value |
| Kampung Baru Salak Selatan | Lowest observed lot ask at or below the payable land value | RM122 psf land | RM133 psf land | Met | Observed evidence |
| Kampung Baru Salak Selatan | Tuan Straits sells through at RM675+ psf | – | Yes | Awaiting data | Needs: Developer take-up data |
| Kampung Pantai | Effective PR clears the owner-required PR | 3.50 × | 4.90 × | Not met | Current scenario value |
| Kampung Pantai | Verified lot value at or below the payable land value | – | RM208 psf land | Awaiting data | Needs: Kampung Pantai lot transactions (NAPIC) |
| Jalan Jinjang Aman | ASP clears breakeven | RM480 psf | RM562 psf | Not met | Current scenario value |
| Jalan Jinjang Selatan | ASP clears breakeven | RM480 psf | RM562 psf | Not met | Current scenario value |
| Jalan Jujur & Jalan Ikhlas | ASP clears breakeven | RM550 psf | RM605 psf | Not met | Current scenario value |
| Jalan Jujur & Jalan Ikhlas | Hard cost at or below breakeven cost | RM280 psf GFA | RM254 psf GFA | Not met | Current scenario value |
| Kampung Datuk Keramat | Observed land ask at or below modelled RLV per land sf | RM144 psf land | RM146 psf land | Met | Observed evidence |
| Flat Taman Bukit Angkasa | PR 1:3.5 confirmed in the DCP2 intensity map | – | Yes | Awaiting data | Needs: PTKL DCP2 intensity map |
| Flat Taman Bukit Angkasa | ASP clears breakeven | RM775 psf | RM692 psf | Met | Current scenario value |

A “met” status on a scenario-based trigger means the current assumption clears the bar, not that the market has.

## 8. DBKL 2026 incentive guideline: the re-run

*Garis Panduan Insentif Pelaksanaan Pembangunan Semula Kuala Lumpur (2026)*, in force 15 June 2026; First Amendment in force 1 October 2026. DBKL may amend it without notice. Incentives are discretionary, so every figure in this section is a scenario. **None of it enters the base case.**

### 8.1 The rules, as read

**Category A: density, for fully residential schemes (Jadual 5.1)**

| Tier | Controlled housing | Free market | Density |
| --- | ---: | ---: | ---: |
| I | 100% | – | 1,400 persons per acre |
| II | 50% | 50% | 1,200 persons per acre |
| III | 30% | 70% | 1,000 persons per acre |
| IV | 20% | 80% | 800 persons per acre |

- Controlled housing = Rumah Ganti (replacement units) + Residensi MADANI + Rumah Mampu Milik (RMM).
- After replacement units, MADANI and RMM split 50:50 on schemes of 10 acres or more and 30:70 below. The guideline's example, with replacement units at 10% of all units: 20% MADANI and 20% RMM at 10 acres or more; 12% and 28% below.
- Residensi MADANI: up to RM200,000, at least 750 sf, household income up to RM8,000 a month. RMM (Residensi Wilayah): up to RM300,000, at least 900 sf.

**Category B: plot ratio, up to +70% of the PTKL2040 base (Jadual 5.2)**

| Component | Rate | Main criterion |
| --- | ---: | --- |
| Redevelopment | 50% | Whole scheme with permanent structures (5.2.1): multi-storey strata schemes, including DBKL or private housing not fit for occupation, or old schemes identified for redevelopment; single-owner buildings of 11 storeys and above. Expects replacement units, transit housing and full demolition. |
| Redevelopment | 30% | Replanning old, dilapidated, abandoned or squatter areas (5.2.2): landed schemes; abandoned projects over 3 years old; former landfill, sewage, depot, institutional or utility sites; squatter areas with relocation costs. |
| Redevelopment | 15% | Minor replanning (5.2.3): temporary structures over 10 years old; single lots or buildings up to 3 storeys (minimum 2 acres outside the city centre, 20,000 sf inside it); squatters settled by one-off payment. |
| Residing | 30% | At least 50% residential floor area in a commercial zone. Not for temporary structures or single-lot redevelopment. |
| Public open space | up to 10% | Open space surrendered above the standard, pro rata. |
| Transit zone | up to 20% | Inside a TPZ or TIZ, at the rate the PTKL2040 criteria set. The draft plan FAQ gave TPZ (within 400 m of the station) 30/20/10/5% by category and TIZ (400–600 m) 20/15/10/5%. |

- **Eligibility (6.0(2)):** existing structures on more than 50% of the site earn 100% of the redevelopment, residing and open-space components; 50% or less earns 50%. The transit component is not scaled.
- **Worked examples (section 7.2), reproduced by the engine:** base PR 6.0 with components of 90% and transit 15% gives PR 9.6 at 50% eligibility and 10.2 at 100% (capped at +70%).

### 8.2 Results by site

Each row uses the site's current base scenario; only density changes. Coverage is residual ÷ owner budget. "Most reachable" claims every optional component at its ceiling for the site's classification and zone.

| Site | Base PR | Redevelopment tier | No incentive | Category B as read | Most reachable | Category A best tier | B with a 30% charge | Better route |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Apartmen Taman Taiping | 1:4 | +50% | 70% | PR 6.00: 106% | +70%, PR 6.80: 120% | IV (PR 5.83): 89% | 95% | Category B clears |
| Kampung Baru Salak Selatan | 1:3.5 | +30% | 79% | PR 4.55: 103% | +60%, PR 5.60: 127% | IV (PR 5.01): 21% | 96% | Category B clears |
| Kampung Pantai | 1:3.5 | +30% | 71% | PR 4.55: 93% | +60%, PR 5.60: 114% | IV (PR 5.01): 46% | 86% | Category B still short |
| Jalan Jinjang Aman | 1:2.5 | +30% | 0% | PR 3.25: 0% | +60%, PR 4.00: 0% | IV (PR 5.01): 0% | 0% | Neither: residual negative |
| Jalan Jinjang Selatan | 1:2.5 | +30% | 0% | PR 3.25: 0% | +60%, PR 4.00: 0% | IV (PR 5.01): 0% | 0% | Neither: residual negative |
| Flat Taman Bukit Angkasa | 1:3.5 | +50% | RM6.62m/acre | PR 5.25: RM9.93m/acre | +70%, PR 5.95: RM11.25m/acre | IV (PR 5.24): −RM0.60m/acre | RM8.94m/acre | Category B; owners untested |
| Kampung Datuk Keramat | 1:3 | +30% | RM6.37m/acre | PR 3.90: RM8.28m/acre | +60%, PR 4.80: RM10.18m/acre | IV (PR 5.24): −RM1.11m/acre | RM7.70m/acre | Category B; owners untested |
| Kluster Jalan Rejang | 1:3.5 | +30% | −RM2.16m/acre | PR 4.55: −RM2.80m/acre | +60%, PR 5.60: −RM3.45m/acre | IV (PR 5.01): −RM9.60m/acre | −RM2.80m/acre | Neither: residual negative |
| Jalan Jujur & Jalan Ikhlas | 1:3.5 | +30% | −RM4.42m/acre | PR 4.55: −RM5.74m/acre | +60%, PR 5.60: −RM7.07m/acre | IV (PR 5.01): −RM11.69m/acre | −RM5.74m/acre | Neither: residual negative |

### 8.3 Taman Taiping with the guideline

By interest count (25% commercial, 1.289 acres, RM1,100 psf):

| Interests | No incentive (PR 4.0) | Category B as read (PR 6.0) | At the 70% cap (PR 6.8) |
| ---: | ---: | ---: | ---: |
| 30 | 94% | 141% | 160% |
| 40 | 70% | 106% | 120% |
| 50 | 56% | 85% | 96% |
| 60 | 47% | 70% | 80% |
| 80 | 35% | 53% | 60% |

Building-form cases (20 frontage bays, one commercial unit per bay):

| Bays × levels | Interests | Commercial share | No incentive | PR 6.0 | PR 6.8 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 20 × 2 | 40 | 50% | 51% | 77% | 87% |
| 20 × 3 | 60 | 33% | 42% | 63% | 71% |
| 20 × 4 | 80 | 25% | 35% | 53% | 60% |

So the guideline clears Taiping only if the legal count is at or below about 42.3 interests at a 25% commercial share. The building-form evidence points to 60–80 interests, where even the 70% cap falls short.

### 8.4 Category A in detail (Taiping)

| Tier | Controlled | Units | Replacement | MADANI / RMM | Free market | Equivalent PR | Residual | Coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| I | 100% | 451 | 40 | 123 / 288 | 0 | 8.94× | −RM123.0m | 0% |
| II | 50% | 386 | 40 | 46 / 107 | 193 | 8.31× | −RM11.4m | 0% |
| III | 30% | 322 | 40 | 17 / 40 | 225 | 7.17× | RM23.8m | 61% |
| IV | 20% | 257 | 40 | 4 / 8 | 205 | 5.83× | RM34.8m | 89% |

- Units are 1,000 sf at RM1,100 psf; the site's 1.29 acres put it below 10 acres, so the split is 30:70.
- Tiers I and II reach equivalent PRs of 8–9, but the controlled units destroy the residual. Tier IV is best, at 89% coverage, and 40 replacement units fill most of its 52-unit controlled obligation.
- Density caps units, not floor area: with 1,200 sf units, tier IV covers about 109% at an equivalent PR near 6.9. DBKL may still cap floor area through height and other controls.

### 8.5 Transit-zone first look

Distances run from each approximate pin to the nearest mapped LRT or MRT station. KTM Komuter and monorail stations are not mapped. Confirm the gazetted TPZ/TIZ and its category before counting any transit component.

| Site | Nearest mapped station | Line | Distance | Reading (draft PTKL2040: TPZ ≤ 400 m, TIZ 400–600 m) |
| --- | --- | --- | ---: | --- |
| Flat Taman Bukit Angkasa | Universiti | LRT Kelana Jaya line | 239 m | Possible TPZ |
| Kampung Datuk Keramat | Dato’ Keramat | LRT Kelana Jaya line | 310 m | Possible TPZ |
| Kampung Pantai | Kerinchi | LRT Kelana Jaya line | 559 m | Possible TIZ |
| Apartmen Taman Taiping | Abdullah Hukum | LRT Kelana Jaya line | 622 m | Near the TIZ edge |
| Jalan Jinjang Selatan | Jinjang | MRT Putrajaya line | 652 m | Near the TIZ edge |
| Kampung Baru Salak Selatan | Salak Selatan | LRT Ampang / Sri Petaling line | 656 m | Near the TIZ edge |
| Jalan Jujur & Jalan Ikhlas | Bandar Tun Razak | LRT Ampang / Sri Petaling line | 855 m | Outside transit zones |
| Kluster Jalan Rejang | Wangsa Maju | LRT Kelana Jaya line | 1,080 m | Outside transit zones |
| Jalan Jinjang Aman | Jinjang | MRT Putrajaya line | 1,513 m | Outside transit zones |

### 8.6 Conditions (section 6.0) and open questions

- Discretionary: each grant goes through the objection process (Kaedah 3), technical studies (TIA, EIA, SIA) where relevant, JKPS where a site cannot meet them, and the Mayor (6.0(7), 6.0(13)).
- No double privilege, for example a phase of a scheme that already received a redevelopment incentive (6.0(8)).
- Category A cannot add transit-zone, lot-amalgamation or affordable-housing-policy incentives. Category B cannot add lot amalgamation (6.0(1)–(2)).
- Eligibility is judged on the buildings standing at application, with a five-year lookback on records DBKL can verify (6.0(3)).
- Gazetted or reserved community-facility and open-space sites, and institutional sites already given a plot ratio in PTKL2040, are excluded (6.0(4)).
- Development-charge and ISF relief covers only replacement, MADANI and RMM components, under the charge policy in force (6.0(6)).
- Partial redevelopment is tied to the share demolished or altered, at most 50%, and not above the base plot ratio (6.0(9)); the clause is ambiguous.
- Not for individually developed shophouse rows: at least two rows and the back lane (6.0(10)).
- Subject to the gazetted land-use zone and intensity. The applicant reports on site eligibility, infrastructure and utility capacity, and community facilities (6.0(11)–(12)).

**Open questions for DBKL:**
1. Does a PTKL2040 specific site's base PR (for example Taiping's 1:4) count as an incentive already received, so that double privilege bars Category B?
2. Are the landed villages Jadual 5.2.2 (30%), or 5.2.1 (50%) as private housing not fit for occupation or an old scheme identified for redevelopment?
3. How is "plot area with existing structures" measured for villages: building footprints or built-on lots?
4. What development charge applies to market-sold incentive floor area, and at what rate?
5. Which TPZ/TIZ category applies to each site under the gazetted PTKL2040, and does a site need a direct station link?

## 9. Calibration: does the cost stack explain real land prices?

| Project | Area | Land | Units × size | Average ASP | Implied PR | RLV psf land (RM270 hard cost) | Land share of GDV | Same at PR 3.5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tuan Straits Residency | Salak Selatan | 4.67 ac | 1,310 × 840 sf | RM695 | 6.94× | RM404 | 10.7% | RM204 |
| Nestree Residence | Kampung Pantai | 2.10 ac | 630 × 900 sf | RM624 | 7.95× | RM167 | 4.3% | RM74 |

Tuan Straits figures are press-reported (GDV RM765m, 1,310 units of 840 sf, 4.67 acres). Nestree's average unit size is inferred from listings, and its ASP is the portal's average ask.

| Land comparable | Area | Size | Land psf | Local ASP used | Residual per GFA sf | Implied PR | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Development land (asking) | Pantai Dalam | 5.90 ac | RM524 | RM680 | RM50 | 10.41× | Asking listing |
| Mixed-development land (asking) | Salak South / Sungai Besi | 12.10 ac | RM228 | RM650 | RM35 | 6.58× | Asking listing |
| Large parcel (asking) | Jinjang Utara | 13.90 ac | RM250 | RM480 | −RM43 | none works | Asking listing |
| AYER Holdings purchase | Jalan Kuchai Lama | 9.11 ac | RM348 | RM750 | RM87 | 4.00× | Press report |

The Kuchai Lama ASP is a placeholder. The Jinjang parcel's asking price cannot be justified at any density at RM480 psf.

| Site | Tier | Model RLV ÷ GDV | Market band | Land budget at band | Interests that budget pays |
| --- | --- | --- | --- | --- | --- |
| Apartmen Taman Taiping | Prime fringe | 14.3% | 17.8%–23.4% | RM34.3m to RM45.1m | 35.1 to 46.1 |
| Jalan Jujur & Jalan Ikhlas | Suburban | -6.8% | 10.2%–12.4% | RM6.7m to RM8.1m | – |
| Kluster Jalan Rejang | Suburban | -3.0% | 10.2%–12.4% | RM7.3m to RM8.9m | – |
| Jalan Jinjang Aman | Suburban | -11.5% | 10.2%–12.4% | RM4.2m to RM5.1m | 4.0 to 4.9 |
| Jalan Jinjang Selatan | Suburban | -11.5% | 10.2%–12.4% | RM4.2m to RM5.1m | 4.0 to 4.9 |
| Kampung Datuk Keramat | Suburban | 7.3% | 10.2%–12.4% | RM8.9m to RM10.8m | – |
| Kampung Pantai | Suburban | 9.5% | 10.2%–12.4% | RM8.3m to RM10.0m | 8.5 to 10.3 |
| Kampung Baru Salak Selatan | Suburban | 6.8% | 10.2%–12.4% | RM7.9m to RM9.6m | 9.5 to 11.5 |
| Flat Taman Bukit Angkasa | Suburban | 7.2% | 10.2%–12.4% | RM9.4m to RM11.5m | – |

**Reading.**
- At RM270 psf hard cost, Tuan Straits implies PR 6.94× and land at RM404 psf, 10.7% of GDV. That matches disclosed suburban deals (Malton 10.2%, Selangor Dredging 12.4%).
- The same project at PR 3.5 leaves RM204 psf. Closing that gap through cost alone would need about a 19% cut.
- Every suburban site models below the 10–12% band at base PR. **That is a density gap, not a cost gap.**
- At 4 persons per unit, Tuan Straits works out to about 1,122 persons per acre and Nestree to 1,200: inside the 1,000–1,200 band that the guideline's Category A allows with 30–50% controlled housing.

## 10. Planning intensity and regulation

| Topic | Finding | Source type | Source |
| --- | --- | --- | --- |
| In force | PTKL2040 was gazetted on 28 May 2025 and took effect on 11 June 2025. | Press report | https://theedgemalaysia.com/node/760158 |
| Incentive channels | Redevelopment, lot amalgamation, transit-oriented and affordable-housing projects can be granted floor area above the base plot ratio. | Press report | https://theedgemalaysia.com/node/760158 |
| Caps | City-centre commercial is capped at 1:10; main commercial, commerce and mixed use at 1:8. | Press report | https://theedgemalaysia.com/node/760158 |
| How the draft sized them | A transit-zone bonus in % by zone category; three special-redevelopment categories; lot-amalgamation incentives in 17 areas, rising from 1:2.0 standalone toward 1:4.0 with assembled size. | Official planning | https://ppkl.dbkl.gov.my/wp-content/uploads/2024/01/FAQ-Draf-PTKL-2040_18012024_V1.pdf |
| Current rules | DBKL’s 2026 redevelopment incentive guideline (First Amendment in force 1 October 2026). Category B adds up to 70% of the base plot ratio; Category A sets 800–1,400 persons per acre in exchange for 20–100% controlled housing. See DBKL incentives. | Official planning | https://www.dbkl.gov.my/en/garis-panduan |
| Development charge | Approvals that raise intensity pay a development charge on the land-value increase (Section 40, Act 267). The 2026 guideline limits relief to replacement, MADANI and RMM components, so market-sold incentive floor area likely pays. The rate is unverified. | Official planning | https://www.dbkl.gov.my/en/soalan-lazim-mengikut-jabatan |
| Plan amendments | A separate route: DBKL took letters of intent for PTKL2040 amendments until 10 July 2026. | Press report | https://theedgemalaysia.com/node/806984 |

**Effective PR the owners need, by development-charge rate** (base ASP, 30% uplift):

| Site | Base PR | 0% charge | 30% charge | 60% charge |
| --- | ---: | ---: | ---: | ---: |
| Apartmen Taman Taiping | 4.0 | 5.67× | 6.39× | 8.18× |
| Jalan Jinjang Aman | 2.5 | none | none | none |
| Jalan Jinjang Selatan | 2.5 | none | none | none |
| Kampung Pantai | 3.5 | 4.90× | 5.50× | 6.99× |
| Kampung Baru Salak Selatan | 3.5 | 4.42× | 4.81× | 5.79× |

**Urban Renewal Bill:**
- **Status:** the Bill was withdrawn on 23 Jan 2026 for redrafting; searches on 17 Sep and 8 Oct 2026 found no retabling.
- **What applies instead:** strata termination relies on the Strata Titles Act route, which reports describe as needing unanimous consent.
- **The withdrawn Bill's thresholds:** 75%/80%, with 51% for dilapidated buildings, later proposed at a uniform 80%. These are shown in the engine for reference only.
- **Holdout risk:** build it into the owner budget through the holdout-reserve slider.

**Development charge:** levied under Section 40 of Act 267 when approvals change zoning or raise intensity. The 2026 guideline gives development-charge and ISF relief only to replacement, MADANI and RMM components, under the charge policy in force (6.0(6)), so market-sold incentive floor area likely pays. The rate is unverified; the engine's control defaults to 0%. The charge does not change any base case, but it raises the density a site must win (section 8.2 shows a 30% charge).

## 11. Evidence register (62 items)

| Site | Data point | Value | Source type | Confidence | Checked | Source | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Apartmen Taman Taiping | Base plot ratio | 1:4.0 | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | PTKL2040 Specific Site 6; zone R3. |
| Apartmen Taman Taiping | Redevelopment form | Whole-site or block-cluster; access via Jalan Tandok | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | Any extra incentive intensity is subject to assessment. |
| Apartmen Taman Taiping | Site area | 1.2887 ac (56,134 sf) | Public-map proxy | LOW | Handoff | https://www.openstreetmap.org/way/890986893 | OSM way 890986893, 8 boundary nodes. Not the legal Site 6 boundary. |
| Apartmen Taman Taiping | Official Site 6 polygon | Not obtained | Not yet obtained | — | — | https://cps.dbkl.gov.my/eplancps/Default.aspx | DBKL eMap lists GIS shapefiles at RM483/MB. |
| Apartmen Taman Taiping | Strata parcel count | Not obtained | Not yet obtained | — | — | – | The single most important number for this site. |
| Apartmen Taman Taiping | Residential value | RM470,000 per interest | Transaction | LOW | 17 Sep 2026 | https://www.brickz.my/transactions/residential/kuala-lumpur/bangsar/taman-taiping/non-landed/ | One transaction only, dated 21 Sep 2020 (RM295 psf). |
| Apartmen Taman Taiping | Unit form | 1,579 sf, 4-bed, "second floor" | Asking listing | MEDIUM | 17 Sep 2026 | https://www.iproperty.com.my/property/bangsar/taman-taiping/sale-100688672/ | Implies at least three levels, if the listing uses British floor numbering. |
| Apartmen Taman Taiping | Tenure | Freehold | Asking listing | MEDIUM | 17 Sep 2026 | https://www.iproperty.com.my/condo/taman-taiping-20941 | Portal building data, not a title search. |
| Apartmen Taman Taiping | Ground-floor shop rent | RM8,000/month, 1,540 sf | Asking listing | MEDIUM | Handoff | https://www.iproperty.com.my/property/bangsar/rent-500275849/ | Asking rent, not an executed lease. |
| Apartmen Taman Taiping | Shop capitalisation yield | 6.0% | Assumption | LOW | Handoff | – | Editable. |
| Apartmen Taman Taiping | Commercial interest value | RM1,600,000 | Model output | LOW | Handoff | – | RM8,000 × 12 ÷ 6%. Income-cap proxy. |
| Apartmen Taman Taiping | Commercial share of interests | 25% | Assumption | LOW | Handoff | – | Inconsistent with a 40-interest, two-level stress case (which implies ~50%). |
| Apartmen Taman Taiping | Frontage address span | 21 to 59 (odd numbers), plus 51A and 59-1 | Inferred | LOW | Handoff | https://www.hokucare.com/a/4036/klinik-pergigian-23-bangsar-dental | Address evidence is not a legal strata count. |
| Apartmen Taman Taiping | Stress interest count | 40 | Inferred | LOW | Handoff | https://evendo.com/locations/malaysia/kuala-lumpur/shop/arcadia-kl | ~20 frontage bays × 2 levels. Possibly understated. |
| Apartmen Taman Taiping | Required owner uplift | 30% | Assumption | LOW | Handoff | – | Proxy for the premium that induces voluntary assembly. |
| Apartmen Taman Taiping | End-product ASP | RM1,100 psf | Assumption | MEDIUM | Handoff | https://www.propertyguru.com.my/property-for-sale/at-nadi-bangsar-6050 | Informed by Nadi Bangsar asks of ≈RM733–1,378 psf. |
| Apartmen Taman Taiping | Hard cost | RM400 psf GFA | Assumption | MEDIUM | Handoff | https://media.arcadis.com/-/media/project/arcadiscom/com/perspectives/asia/publications/qcc/2025/cnhk-qcc-2025-q4.pdf | Within the Arcadis high-end band (≈RM313–656 psf CFA). |
| Jalan Jujur & Jalan Ikhlas | Base plot ratio | 1:3.5 | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | PTKL2040 Specific Site 5. |
| Jalan Jujur & Jalan Ikhlas | Nearby asking price | ≈RM353 psf | Asking listing | LOW | Handoff | https://www.propertyguru.com.my/bm/hartanah-dijual/di-residensi-razakmas-2-20796 | Controlled affordable scheme: weak comparable. |
| Kluster Jalan Rejang | Base plot ratio | 1:3.5 | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | PTKL2040 Specific Site 4. |
| Kluster Jalan Rejang | Nearby asking prices | ≈RM446–568 psf | Asking listing | MEDIUM | Handoff | https://www.propertyguru.com.my/condo-for-sale/at-residensi-rampai-ii-9686 | Residensi Rampai II; M Azura ≈RM541. |
| Kampung Datuk Keramat | Base plot ratio | 1:3.0 | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | Minimum 30,000 sf assembly. |
| Kampung Datuk Keramat | Land asking prices | ≈RM144 to RM600+ psf land | Asking listing | MEDIUM | Handoff | https://www.propertyguru.com.my/residential-land-for-sale/in-keramat-9vnxt | Most asks exceed the modelled RLV. |
| Flat Taman Bukit Angkasa | Base plot ratio | 1:3.5 (provisional) | Inferred | PROVISIONAL | Handoff | https://ppkl.dbkl.gov.my/ | Confirm in the DCP2 intensity map. |
| Flat Taman Bukit Angkasa | Nearby transactions | ≈RM817–841 psf | Transaction | MEDIUM | Handoff | https://www.brickz.my/transactions/residential/kuala-lumpur/pantai/residensi-rimba-pantai-dalam/non-landed/ | Residensi Rimba. |
| Kampung Baru Salak Selatan | Base plot ratio | 1:3.5; 30,000 sf minimum sub-areas | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | PTKL2040 Specific Site 2. |
| Kampung Baru Salak Selatan | New-launch price | From RM675 psf; GDV RM765m, 1,310 units | Press report | MEDIUM | 7 Oct 2026 | https://theedgemalaysia.com/node/796044 | Tuan Straits Residency, 4.67 acres, launched 2Q2026. |
| Kampung Baru Salak Selatan | Sub-sale condo asks | ≈RM518–615 psf | Asking listing | MEDIUM | 7 Oct 2026 | https://www.edgeprop.my/buy/kuala-lumpur/salak-selatan/all-residential?searchedLabel=Salak+Selatan&keyword=Salak%20Selatan | Central Residence, Taman Salak Selatan and Besraya listings. |
| Kampung Baru Salak Selatan | Village lot asks | ≈RM122–203 psf of land | Asking listing | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/property-for-sale/in-salak-south-baru-wjz68 | Lots of 3,580–5,091 sf; mostly leasehold. Lease expiries not yet checked. |
| Kampung Baru Salak Selatan | Affordable scheme inside the village | Residensi Salak South (RUMAWIP), Jalan 22 | Asking listing | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/condo/residensi-salak-south-23233 | Signals official intent, and possibly affordable-housing quotas on redevelopment. |
| Kampung Pantai | Base plot ratio | 1:3.5 | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | PTKL2040 Specific Site 3. |
| Kampung Pantai | New condo in the kampung | Nestree: avg ask ≈RM624 psf; area avg ≈RM684 | Asking listing | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/bm/hartanah-dijual/di-nestree-residence-22207 | 2.10 acres, two 40-storey towers, 630+ units: effective PR ≈7–8. |
| Kampung Pantai | Development land ask nearby | ≈RM524 psf of land (5.9 acres) | Asking listing | LOW | 7 Oct 2026 | https://www.propertyguru.com.my/property-for-sale/in-pantai-dalam-ae1kh | Asking, not transacted. |
| Kampung Pantai | Village lot value | RM300 psf of land (assumed) | Inferred | LOW | 7 Oct 2026 | https://www.iproperty.com.my/property/pantai/pantai-dalam/sale-501805517/ | No Kampung Pantai lot evidence; NAPIC shows only 3 transactions in 24 months. |
| Jalan Jinjang Aman | Base plot ratio | 1:2.5; 30,000 sf minimum; 15 m access reserve | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | PTKL2040 Specific Site 7. |
| Jalan Jinjang Aman | Nearest new-product comparable | Suite Enesta ≈RM411–470 psf ask | Asking listing | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/property-listing/suite-enesta-for-sale-by-luis-looi-39052136 | Opposite MRT Jinjang. |
| Jalan Jinjang Aman | Older stock trend | Sri Jinjang ≈RM374 → RM318 psf (2023–25) | Transaction | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/property-for-sale/at-sri-jinjang-396 | Portal transaction trend. |
| Jalan Jinjang Aman | Village lot asks | ≈RM176–229 psf of land | Asking listing | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/property-for-sale/p/jinjang-utara/2 | Lots of 2,600–5,400 sf. |
| Jalan Jinjang Selatan | Base plot ratio | 1:2.5; 30,000 sf minimum; 15 m access reserve | Official planning | HIGH | Handoff | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf | PTKL2040 Specific Site 8. |
| Jalan Jinjang Selatan | Nearest new-product comparable | Suite Enesta ≈RM411–470 psf ask | Asking listing | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/property-listing/suite-enesta-for-sale-by-luis-looi-39052136 | Opposite MRT Jinjang. |
| All sites | Kuchai Lama land deal | 9.11 acres for RM138m (≈RM348 psf) | Press report | MEDIUM | 7 Oct 2026 | https://propnewstime.com/latestnewsstories/Mzc0NjI=/ayer-holdings-to-acquire-9-11-acre-kuala-lumpur-land-parcels-for-rm138-million | AYER Holdings, freehold, announced 30 Sep 2026. Benchmark for the Kuchai JWP sites. |
| All sites | PTKL2040 status | Gazetted 28 May 2025; in force from 11 June 2025 | Press report | HIGH | 7 Oct 2026 | https://theedgemalaysia.com/node/760158 | The statutory local plan for every KL lot. |
| All sites | Incentive channels | Extra floor area for redevelopment, lot amalgamation, transit-oriented and affordable-housing projects | Press report | HIGH | 7 Oct 2026 | https://theedgemalaysia.com/node/760158 | Caps: city-centre commercial 1:10; main commercial, commerce and mixed use 1:8. |
| All sites | How the draft sized incentives | Transit-zone bonus in % by zone category; 3 special-redevelopment categories; lot amalgamation in 17 areas (e.g. 1:2.0 standalone rising toward 1:4.0 with assembled size) | Official planning | LOW | 7 Oct 2026 | https://ppkl.dbkl.gov.my/wp-content/uploads/2024/01/FAQ-Draf-PTKL-2040_18012024_V1.pdf | Draft-plan FAQ (Jan 2024). Superseded in detail by the 2026 guideline. |
| All sites | Incentive guideline | Garis Panduan Insentif Pelaksanaan Pembangunan Semula Kuala Lumpur (2026), First Amendment | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | In force 15 June 2026; First Amendment in force 1 October 2026. Read from the copy you provided (20 pages). |
| All sites | Category B cap (plot ratio route) | Up to +70% of the PTKL2040 base plot ratio | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | Guideline section 5.2 and 6.0(2). Incentives are discretionary. |
| All sites | Category B components | Redevelopment 50% / 30% / 15%; residing 30%; public open space ≤10%; transit zone ≤20% | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | Jadual 5.2. Residing needs ≥50% residential in a commercial zone, so it does not apply to R2/R3 sites. |
| All sites | Eligibility factor | Existing structures on >50% of the site: 100% of components; ≤50%: 50% | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | Section 6.0(2). The worked examples apply it to redevelopment, residing and open space, not to the transit zone. |
| All sites | Category A (density route) | 1,400 / 1,200 / 1,000 / 800 persons per acre for 100% / 50% / 30% / 20% controlled housing | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | Jadual 5.1. Fully residential schemes only. Controlled = replacement units + Residensi MADANI + RMM. |
| All sites | Controlled-housing split | After replacement units: MADANI 50% / RMM 50% on sites ≥10 acres; 30% / 70% below 10 acres | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | Section 5.1 and the worked example in 7.1. |
| All sites | Approval process | Objection process (Kaedah 3), TIA/EIA/SIA where relevant, JKPS, the Mayor | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | Section 6.0(7) and (13). No double privilege (6.0(8)). |
| All sites | Charge relief in the guideline | Development charge and ISF relief only for replacement, MADANI and RMM components | Official planning | HIGH | 8 Oct 2026 | https://www.dbkl.gov.my/en/garis-panduan | Section 6.0(6), under the charge policy in force. Market-sold incentive floor area likely pays. |
| All sites | Transit zones (draft PTKL2040) | TPZ ≤400 m from the station box: 30/20/10/5% by category; TIZ 400–600 m: 20/15/10/5% | Official planning | LOW | 8 Oct 2026 | https://ppkl.dbkl.gov.my/wp-content/uploads/2024/01/FAQ-Draf-PTKL-2040_18012024_V1.pdf | Draft-plan FAQ (Jan 2024); 10 criteria apply, including a direct station link. The 2026 guideline caps the component at 20%. |
| All sites | Residensi MADANI | Up to RM200,000 per unit; minimum 750 sf; household income ≤RM8,000 a month | Official planning | MEDIUM | 8 Oct 2026 | https://residensimadani.jwp.gov.my/faq | JWP programme page. |
| All sites | Rumah Mampu Milik (Residensi Wilayah) | Up to RM300,000 per unit; minimum 900 sf | Official planning | MEDIUM | 8 Oct 2026 | https://residensiwilayah.jwp.gov.my/dasar.pdf | JWP policy; development-charge exemption matches the affordable share (30/50/70/100%). |
| All sites | Persons per unit for density | 4 (assumed) | Inferred | LOW | 8 Oct 2026 | https://www.propertyguru.com.my/bm/hartanah-dijual/di-nestree-residence-22207 | Not stated in the guideline. Nestree’s 630 units on 2.10 acres equal 1,200 persons per acre at 4 per unit, exactly the Category II density. |
| All sites | Development charge | Levied on approvals that change zoning or raise intensity (s.40 Act 267) | Official planning | HIGH | 7 Oct 2026 | https://www.dbkl.gov.my/en/soalan-lazim-mengikut-jabatan | Rate, and whether incentive PR attracts it, not verified. Engine control defaults to 0%. |
| All sites | PTKL2040 amendment window | Letters of intent closed 10 July 2026 | Press report | HIGH | 7 Oct 2026 | https://theedgemalaysia.com/node/806984 | Route to a site-specific intensity change outside the incentive rules. |
| All sites | Prime KL land deals | Land at 17.8% (UniRazak) and 23.4% (Jalan U-Thant) of GDV | Press report | MEDIUM | 7 Oct 2026 | https://www.nst.com.my/amp/business/corporate/2026/07/1487396/sd-propertys-unirazak-project-seen-upside-higher-plot-ratio | HLIB analysis, Jul 2026. City-centre plots at PR 8–10; suburban deals sit at 10–12%. |
| Apartmen Taman Taiping | Portal check | 0 units for sale on PropertyGuru (7 Oct 2026) | Asking listing | MEDIUM | 7 Oct 2026 | https://www.propertyguru.com.my/property-for-sale/at-taman-taiping-20941 | The residential benchmark cannot be refreshed from portals. The portal also lists the address as Jalan Kurau, 59100. |
| All sites | Urban Renewal Bill | Withdrawn 23 Jan 2026; not retabled as of 17 Sep 2026 | Press report | MEDIUM | 17 Sep 2026 | https://www.thestar.com.my/news/nation/2026/01/23/govt-scraps-ura-to-table-new-bill-soon | Strata termination still relies on the Strata Titles Act route (reported as unanimous consent). |
| All sites | Construction-cost benchmark | US$360–715/m² CFA average; US$815–1,710/m² high-end | Press report | MEDIUM | Handoff | https://media.arcadis.com/-/media/project/arcadiscom/com/perspectives/asia/publications/qcc/2025/cnhk-qcc-2025-q4.pdf | Arcadis Q4 2025, US$1 = RM4.13. Per m² CFA, not GFA. |

## 12. Issues and diligence

**Issues register** (high impact first):

| Impact | Issue | Detail | Do | Source |
| --- | --- | --- | --- | --- |
| High | Guideline read: plot-ratio incentives top out at +70% of base. | Category B pays 50% for whole strata schemes, 30% for landed schemes and 15% for minor replans. The 30% residing component needs at least 50% residential in a commercial zone, so none of the R2/R3 sites can use it. Open space (up to 10%) and transit zones (up to 20%) need site-specific proof. As read, Taiping gets +50% (PR 6.0) and the landed villages +30%. | Confirm each site’s classification with DBKL’s Unit Pembaharuan Bandar before relying on it. | https://www.dbkl.gov.my/en/garis-panduan |
| High | Incentives are discretionary, and may not stack on a specific site’s base PR. | Every grant goes through DBKL’s objection process (Kaedah 3), technical studies (TIA, EIA, SIA) where relevant, JKPS and the Mayor. The guideline bars double privilege; if a specific site’s PTKL plot ratio already counts as an incentive, Category B may not apply on top. | Treat the guideline incentive as a scenario, never a base case. Ask DBKL about double privilege for Site 6 and the other specific sites. | https://www.dbkl.gov.my/en/garis-panduan |
| High | PTKL base densities sit far below what the land market prices in. | Tuan Straits in Salak Selatan builds 1,310 units of 840 sf on 4.67 acres, an effective PR of ≈6.4–6.9; Nestree in Kampung Pantai is ≈7–8. At those densities the engine’s cost stack reproduces land at ≈10–11% of GDV with hard cost near RM270 psf GFA, in line with disclosed deals at 10–12%. At the PTKL base of 2.5–3.5 the same economics leave RM0–200 psf of land. | Treat incentive intensity as the master variable for the specific sites. See Calibration. | https://theedgemalaysia.com/node/796044 |
| High | The RM470k residential benchmark is a single 2020 transaction. | Brickz shows one non-landed transaction at Taman Taiping: RM470,000 (RM295 psf) dated 21 Sep 2020. It is six years old and the only data point behind the residential owner value. No units were listed for sale on 7 Oct 2026, so portals cannot refresh it. | Pull recent sub-sale evidence (NAPIC/JPPH or agents) before trusting the owner package. | https://www.brickz.my/transactions/residential/kuala-lumpur/bangsar/taman-taiping/non-landed/ |
| High | The 40-interest stress case may be too low. | A listing for a 1,579 sf, 4-bedroom unit places it on the second floor, so blocks likely have at least three levels. With ~20 frontage bays, three levels means ≈60 interests and four levels ≈80. At 60 interests (25% commercial) the owner premium is −38.9% and required ASP ≈RM1,365; at 80 it is −54.2% and ≈RM1,532. | Count storeys per block on site or from street imagery while waiting for the strata roll. | https://www.iproperty.com.my/property/bangsar/taman-taiping/sale-100688672/ |
| High | The stress count and the commercial share contradict each other. | Twenty shops in 40 interests is a 50% commercial share, not 25%. At 40 interests and 50% commercial, the residual pays 20.5 interests, the premium is −33.4% and required ASP is ≈RM1,324. A 25% share is consistent with ≈80 interests (20 shops, 60 flats). | Treat count and mix as one assumption. The lab lets you move both together. | – |
| High | The Urban Renewal Bill is still withdrawn. | Cabinet withdrew the Bill on 23 Jan 2026 to redraft it; no retabling was found as of 17 Sep 2026. Without it, strata termination relies on the Strata Titles Act route, which reports describe as requiring unanimous consent. Every interest can hold out. | Use the holdout reserve control; do not price in the Bill’s proposed 75–80% thresholds. | https://www.thestar.com.my/news/nation/2026/01/23/govt-scraps-ura-to-table-new-bill-soon |
| Medium | Only replacement and affordable floor area gets development-charge relief. | Section 6.0(6) limits charge and Improvement Service Fund relief to replacement, Residensi MADANI and RMM components, under the policy in force. Incentive floor area sold at market price therefore likely pays the charge under Section 40 of Act 267. The rate is still unverified; the engine’s control defaults to 0%. | Confirm the rate with DBKL or a town planner; Distance to deal shows the effect. | https://www.dbkl.gov.my/en/soalan-lazim-mengikut-jabatan |
| Medium | The density route (Category A) carries a 20–100% controlled-housing obligation. | Residensi MADANI sells at up to RM200,000 (750 sf) and RMM at up to RM300,000 (900 sf), below build cost at these hard costs. Replacement units for existing owners count toward the controlled share, so owner-dense strata sites carry less of the burden than villages with few lots per acre. | Compare both routes per site in DBKL incentives. | https://www.dbkl.gov.my/en/garis-panduan |
| Medium | Prime land trades at 18–23% of GDV; the model gives Taiping about 14%. | Recent city-centre deals cleared at 17.8% and 23.4% of GDV. Either the cost stack is conservative for prime-fringe Bangsar, or those deals lean on PR 8–10 commercial land. The Calibration view tests Taiping at prime-tier land shares. | Ask two Bangsar developers what land share they would underwrite for a residential scheme here. | https://www.nst.com.my/amp/business/corporate/2026/07/1487396/sd-propertys-unirazak-project-seen-upside-higher-plot-ratio |
| Medium | Landed kampung owners are valued as land. | For the village sites the owner model runs on lot size × lot value. Several new-village lots are leasehold; remaining lease terms move value a lot and have not been checked. | Sample titles for tenure and lease expiry before trusting lot values. | https://www.propertyguru.com.my/property-for-sale/in-salak-south-baru-wjz68 |
| Medium | The cost benchmark is quoted per m² CFA, the model applies it per sf GFA. | Converted, Arcadis average-standard KL high-rise is ≈RM138–274 psf and high-end ≈RM313–656 psf. Rejang (RM290) and Jujur (RM280) sit above the average-standard ceiling; Rejang’s residual turns positive at ≈RM277 psf. CFA includes areas GFA excludes, so the cost per GFA sf is higher than per CFA sf. Calibrating against Tuan Straits points to ≈RM270 psf GFA for mass-market towers, used for the build 3 sites. | Rebase hard costs on a GFA basis with a QS before relying on any single figure. | https://media.arcadis.com/-/media/project/arcadiscom/com/perspectives/asia/publications/qcc/2025/cnhk-qcc-2025-q4.pdf |
| Low | Bukit Angkasa lot 747831 looks like a transcription error. | It sits beside lots 474828 and 474829 in the workbook; 474831 is the likely intended number. | Check against the JWP PDF. | https://www.jwp.gov.my/storage/media/49-TAPAK-PEMBANGUNAN-SEMULA-KL.pdf |
| Low | Kampung Baru Salak Selatan had no score (fixed in build 3). | It is one of the eight specific incentive sites (R3, PR 1:3.5) but was absent from the Top 20. It now has an RLV case, a landed owner model and provisional V2 factors. | Replace the provisional dealability and information-edge scores after a site visit. | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf |

**Diligence checklist** (Taiping-led; the guideline items apply to every specific site):

| Status at handoff | Item | Note |
| --- | --- | --- |
| Done | Read DBKL’s 2026 redevelopment incentive guideline | Read 8 Oct 2026 (First Amendment, in force 1 Oct 2026). Rules are now in the engine. |
| Open | Confirm each site’s Category B classification with DBKL | As read: 50% (strata scheme) for Taiping, 30% (landed scheme) for the villages. |
| Open | Existing structures on more than half the site | At half or less, the redevelopment, residing and open-space components are halved. |
| Open | Transit-zone category and distance from the station box | Draft PTKL2040: TPZ within 400 m, TIZ 400–600 m. Worth up to +20%. |
| Open | Double-privilege check on the specific-site base PR | If PR 1:4 already counts as an incentive, Category B may not stack. |
| Open | Confirm development-charge treatment of incentive PR | Section 40, Act 267. The engine control defaults to 0%. |
| Open | Official Site 6 polygon and land area | DBKL eMap; GIS layers listed at RM483/MB. Replaces the OSM proxy. |
| Open | Strata roll: parcel count, accessory parcels, share units | The gating number. |
| Open | Master lot number and title search | Also confirms tenure and encumbrances. |
| Partial | Storeys per block and block count | A listing implies at least three levels. |
| Open | Residential versus commercial legal interests | Sets the weighted owner value. |
| Open | Owner concentration (multi-parcel owners) | Fewer decision-makers than parcels would ease assembly. |
| Open | Residential transactions after 2023 | The current benchmark dates from Sep 2020. |
| Open | Executed commercial lease evidence | Current evidence is an asking rent. |
| Open | Refresh Bangsar new-launch ASP evidence | Owner-required ASP is ≈RM1,198 at 40 interests. |
| Open | PTKL incentive intensity eligibility | Required PR at 40 interests is ≈5.67× if ASP stays at RM1,100. |
| Done | Urban Renewal Bill status | Checked 17 Sep 2026: still withdrawn. |
| Done | Tenure | Freehold per portal data; confirm with the title search. |

**Low-cost diligence order (from the handoff, still valid).** Do not pay for official GIS until the thesis survives the free steps.

1. Public planning documents.
2. Public map.
3. Transaction and listing evidence.
4. Address and block evidence.
5. Strata roll.
6. Rerun the owner economics.
7. Only then, official GIS data (about RM483/MB from DBKL eMap).

## 13. Data model

**Site object** (static data in the HTML, `SITES` array):
```json
{
  "id": "taiping", "name": "Apartmen Taman Taiping", "place": "Jalan Tandok, Bangsar",
  "group": "specific | jwp", "ref": "PTKL Specific Site 6", "zone": "R3",
  "pr": 4.0, "prType": "OFFICIAL_PLANNING | INFERRED | MISSING",
  "lat": 3.1238, "lon": 101.6752,
  "stage": "DISCOVERY | SCREENING | DILIGENCE | TRIGGER_WATCH | DEALABLE | IN_PLAY | CAPTURED | REJECTED",
  "verdict": "CONDITIONAL_HIGH_POTENTIAL", "conf": "HIGH | MEDIUM | LOW | PROVISIONAL",
  "gating": "Legal ownership-interest count", "next": "…", "trig": "…",
  "v2": {"evc": 6.5, "acc": 5},
  "rlv": {"asp": [900, 1100, 1250], "hc": 400, "note": "…", "url": "…"},
  "area": {"ac": 1.2886663, "type": "PUBLIC_MAP", "note": "…"},
  "owner": {"res": 470000, "com": 1600000, "cs": 0.25, "up": 0.30, "n": 40, "hold": 0,
            "nConfirmed": false, "form": {"on": false, "bays": 20, "levels": 2}}
}
```
JWP sites add `jwp`, `mukim`, `parl`, `lots` and `cat`. Landed owner models use `{"mode": "landed", "lot", "lpsf", "net", "up", "hold"}`, with `ownerSrc`, `ownerNote` and `ownerUrl` for provenance.

**Scenario state** (`STATE[siteId]`, edited in the lab):
```json
{"sc": "base", "area": 1.2886663, "areaConfirmed": false, "asp": 1100, "pr": 4, "prUp": 0, "eff": 0.78,
 "hc": 400, "pf": 0.08, "cont": 0.05, "stat": 0.03, "sm": 0.03, "fin": 0.05, "demo": 0.02, "profit": 0.2,
 "dc": null, "owner": { … as above … }}
```
`dc` is optional per site; when absent, the global `GLOB.dc` applies.

**Workspace document** (synced to `data/users/<viewer id>/workspace`; also the core of the export):
```json
{"v": 2, "updatedAt": "ISO-8601", "state": {}, "saved": [], "checks": {}, "v2w": {}, "deal": {}, "asm": {}, "cal": {}, "glob": {"dc": 0}, "inc": {}}
```
- `deal[siteId]`: `{T, r, resRent, comRent, reloc, sizing, matchPV, ratio, oldRes, oldCom, waive, e, feeBasis, feeRate, promote}`.
- `asm[siteId]`: `{items: [{s: 0..4, l: "unit label"}], sel}`. Labels only: never owners' names or contacts.
- `cal`: `{hc, eff, share, asp: {compId: psf}}`.
- `inc[siteId]` (build 5): `{redev: 0.5|0.3|0.15|0, residing: 0|0.3, open: 0–0.10, tpz: 0–0.20, elig: 1|0.5, ppu, unitSf, big}`. Missing entries fall back to the reading in `INC_DEFAULT`.

**Export file** (Method → Data → Download workspace):
```json
{"engine": "KL Urban Renewal Engine", "build": 5, "exportedAt": "…", "note": "…",
 "workspace": { … }, "results": [ {per-site outputs} ], "sites": [ … ], "evidence": [ … ], "issues": [ … ]}
```
Each `results[]` entry carries `dbkl2026`: `{tier, asSet, components, share, effectivePR, coverage, rlv, rlvPerAcre, maxShare, maxPR, maxCoverage, maxRlvPerAcre, catA: {tier, personsPerAcre, prEquivalent, rlv, coverage}}`. The CSV adds `g26Share, g26PR, g26Coverage, g26MaxShare, g26MaxCoverage, catATier, catACoverage`.

Import accepts either this file or a bare workspace object. Unknown sites and invalid numbers are dropped and refilled from the presets.

**Provenance types:** `OFFICIAL_PLANNING`, `OFFICIAL_CADASTRAL`, `OFFICIAL_STRATA`, `TRANSACTION`, `ASKING_LISTING`, `PRESS_REPORT`, `PUBLIC_MAP`, `INFERRED`, `UNDERWRITING_ASSUMPTION`, `MODEL_OUTPUT`, `MISSING`, `EDITED`.

**Verdicts:** `STRONG_BASE_CASE`, `CONDITIONAL_HIGH_POTENTIAL`, `TRIGGER_WATCH`, `OWNER_DENSITY_BLOCKED`, `PLANNING_UNCERTAIN`, `END_VALUE_TOO_LOW`, `ALREADY_IN_PLAY`, `TOO_FRAGMENTED`, `LOW_INFORMATION_EDGE`, `REJECTED`.

## 14. Architecture and code map

The script inside the single HTML file runs top to bottom:

| Block | Key names |
| --- | --- |
| Seed data | `RAW` (JWP 49, 8 specific sites, Top 20 from the workbook), `U` (source URLs), `SITES`, `SITE`, `MODELLED` |
| Persistence | `store` (localStorage with sync hook), `GLOB`, `STATE`, `st(id)`, `presetState(site, preset)` |
| Engine (pure) | `calcRLV`, `weightedOwnerValue`, `ownerPackage`, `ownerBudgetPer`, `requiredASP`, `requiredPR`, `requiredHC`, `calcOwner`, `model`, `applyOwnerDerived`, `applyForm` |
| Judgement | `ownerStatus`, `econState`, `suggestVerdict`, `densityBand`, `v2Factors`, `v2Score`, `TRIGGERS`, `evalTrigger`, `levers`, `leverText`, `prBand` |
| Deals | `dealCalc`, `maxInterests`, `DEAL_DEFAULT`, `DEAL_SITE` |
| Calibration | `COMPS`, `LANDCOMPS`, `GDVCOMPS`, `calcComp`, `calcLand`, `tierSection` |
| Registers | `EVIDENCE`, `ISSUES`, `CHECK`, `INT_FACTS` |
| Guideline (build 5) | `G26` (rules), `AFF` (MADANI and RMM), `INC_DEFAULT` (per-site reading), `INC`, `incDefault`, `incP`, `incB`, `incMax`, `g26Share`, `incEdited`, `incTag`, `incResOK`, `modelB`, `catA`, `catAAll`, `g26Row`, `nearestStation`, `tpzRead`, `G26_COND`, `g26Section`, `g26Glance`, `viewIncentive` / `bindIncentive` |
| Views | `viewWatchlist`, `viewBoard`, `viewMap`, `viewSite`, `viewLab`, `viewDeal`, `viewAssembly`, `viewCalibration`, `viewTriggers`, `viewSources`, `viewUniverse`, `viewMethod` (each with a `bind…`) |
| Data | `siteResults`, `exportObj`, `resultsCSV`, `saveText`, `importWorkspace`, `armConfirm` |
| Sync | `initSync`, `pushNow`, `schedulePush`, `applyRemote`, `workspaceBody` |
| Router | hash routes `#/watchlist`, `#/board`, `#/incentive/<id>`, `#/site/<id>`, `#/lab/<id>`, `#/deal/<id>`, `#/assembly/<id>`, `#/calibration`, `#/triggers`, `#/sources`, `#/universe`, `#/method`, `#/map` |

**Verification done in build 5 (headless Chromium):**
- **133 formula tests, all passing.** The 80 from build 4, plus 53 for the guideline: the worked examples (9.6 and 10.2), Category B shares, caps, clamps and eligibility, the residing zone rule, the most-reachable share, the MADANI:RMM split below and above 10 acres, Category A unit counts and residuals against an independent calculation, the charge on free-market floor area only, transit readings, planning bands, trigger count and export fields. The build-4 tests cover:
  - Workbook RLV and breakeven for 5 sites × 3 scenarios.
  - Every handoff Taiping number.
  - Development-charge round trips at 0%, 30% and 60%.
  - Landed-site outputs and deal surpluses.
  - Calibration values.
  - Each lever re-applied returns coverage = 1.
  - Export → import round trip and CSV row count.
- **A 58-route UI sweep** across every view and site (including every incentive page), with no NaN, undefined or Infinity in the rendered text and no console errors.
- **21 interaction checks** on the incentive calculator: sliders commit on release, eligibility and tier buttons, reset, carrying the share into the lab, the lab's DBKL 2026 preset, site switching, navigation memory, and the export → import round trip of the guideline settings.
- **Layout and theme:** no horizontal overflow at 390 px width, and dark mode checked.

**Known limitations:**
- **Approximate geography:** map pins and rail alignments are approximate.
- **139-site layer:** geometry not ingested.
- **No time-phased cash flow:** finance is a simple % of GDV, with no IRR.
- **Affordable housing:** modelled for Category A only. Any RMM obligation that current policy attaches to Category B schemes is not modelled.
- **Guideline readings:** classifications, 100% eligibility and 4 persons per unit are our assumptions; transit distances use approximate pins and LRT/MRT only.
- **Single-value scenarios:** no probability ranges.
- **V2 proxies:** sites without models use analyst proxies.
- **Unreplicated landed sites:** the landed sites have no workbook to reproduce.

## 15. Changelog

- **Build 1:**
  - Watchlist, map, site dossier, scenario lab, triggers, sources and diligence, site universe, method.
  - Seeded from workbook v3; reproduced every workbook and handoff figure.
  - Found that the 40-interest case is internally inconsistent and the residential benchmark dates from 2020.
- **Build 2:**
  - Deal structures (cash, replacement units, JV), originator fee and promote.
  - Assembly consent tracker, building-form control, private account sync.
- **Build 3:**
  - RLV and landed-owner cases for Kampung Baru Salak Selatan, Kampung Pantai and both Jinjang sites.
  - Calibration view; the finding that density, not cost, explains land prices.
- **Build 4:**
  - Distance-to-deal board (single-lever moves).
  - Planning-intensity module with the PTKL2040 incentive channels, DBKL's 15 June 2026 guideline and a development-charge control wired into required ASP, PR and hard cost.
  - Market-tier land-share cross-check (prime 17.8–23.4% against suburban 10.2–12.4%).
  - JSON/CSV export and import.
  - Pantai verdict moved to trigger watch.
  - Review pass: 80 formula tests, a 48-route sweep and eight fixes. The main bug fixed: the board offered an impossible owner-package cut where the residual is negative. The rest were labels, a wider tier cross-check, updated verdict-logic text and two new sync keys.
- **Build 5 (8 Oct 2026): DBKL 2026 guideline applied.**
  - Encoded the guideline (First Amendment): Category B components, eligibility and the 70% cap; Category A tiers with the controlled-housing split; the section 6.0 conditions.
  - Our per-site reading: Taiping and Bukit Angkasa +50% (5.2.1), the villages and clusters +30% (5.2.2); residing closed to residential zones.
  - New DBKL incentives calculator, a guideline table on Distance to deal, a guideline-aware planning read, a DBKL 2026 lab preset, "With DBKL incentive" on the watchlist and dossiers, five triggers, twelve evidence entries, four issues and four checklist items.
  - Map: draft transit-zone rings and the nearest station for each site.
  - Found in review: residential sites on the 30% tier can reach only +60%, not the 70% cap, because the residing component needs a commercial zone. The engine now shows each classification's ceiling.
  - Export carries the guideline results; 133 tests, a 58-route sweep and 21 interaction checks.

## 16. Roadmap

**Within KL urban renewal (in priority order):**
1. **DBKL pre-consultation answers** (section 8.6) into the engine: set each classification, eligibility and the charge rate, and tick the matching triggers.
2. **Taiping strata roll.** Replace the stress count, tick "count confirmed", and the verdict logic and triggers update automatically.
3. **Evidence refresh:**
   - NAPIC/JPPH transactions for Taiping, Kampung Pantai lots and Salak lots (including lease expiries).
   - Tuan Straits take-up.
   - Kuchai Lama launch pricing.
4. **Owner models** for Keramat, Bukit Angkasa (after confirming PR 3.5 in DCP2), Rejang and Jujur.
5. **RLV cases** for the 12 unmodelled JWP sites. Each needs PTKL intensity per lot.
6. **Time-phased cash flow** (land payment timing, construction draw, sales curve) for IRR and finance cost, replacing the flat 5% of GDV.
7. **Ranges.** Low/base/high per input with a simple simulation for coverage probability.
8. **139-site, DBKL polygon and gazetted TPZ/TIZ layers** once the GIS purchase is justified; replace the approximate station distances.
9. **Affordable-housing obligations under Category B**, if current RMM policy attaches them, modelled as a share of GFA at a capped price.

**Secondary module: powered industrial land.** The same engine architecture applies: site object, evidence register, residual model and triggers.
- **Inputs:** grid capacity and substation distance (MW available, timeline), water, fibre, zoning, renewable-energy access, data-centre proximity, land basis.
- **Value:** what an end user pays per MW-ready acre, less infrastructure cost.
- **Geographies from the handoff:** Johor, southern Selangor (Banting), Melaka, selected Perak corridors.

**Tertiary module: old KL office and adaptive reuse.** This reuses the RLV engine directly.
- **Inputs:** building age, vacancy, rent, land value, PR, conversion cost, refinancing distress, institutional seller.
- **Test:** residual after conversion against acquisition price.

## 17. Continuation prompt (paste into another AI tool with this file and the HTML)

> You are continuing the KL Urban Renewal Engine, an institutional redevelopment-screening and deal-origination tool for Kuala Lumpur. The attached markdown is the full handoff; the attached HTML is the reference implementation (single file, vanilla JS, pure engine functions listed in section 14).
>
> Preserve these rules:
> 1. The decision rule is residual value > required owner consideration.
> 2. Never show an assumption as an official fact. Every figure carries one of the provenance types in section 13.
> 3. Incentive plot ratio is never part of a base case.
> 4. Consent is unanimous until a new law says otherwise.
> 5. The base scenarios must keep reproducing the workbook values in section 7.1, the Taiping numbers in section 7.4 and the guideline results in section 8. Run the formula tests after any change to the engine.
> 6. Guideline incentives are discretionary: show them as scenarios beside the base case, never inside it.
>
> Next task: [choose from section 16, for example "load DBKL's pre-consultation answers into each site's classification and charge rate"].

**Continuing in Claude Code.** A starter kit accompanies this handoff (`kl-urban-renewal-claude-code-starter.zip`). It holds a `CLAUDE.md` with these rules, the engine HTML, this handoff, a roadmap of ready-to-paste task prompts, golden numbers in `tests/expected.json` and a Playwright test runner. Unzip it into a new folder, open the folder in Claude Code and start with the first roadmap task.


## 18. Source library

| Source | URL |
| --- | --- |
| PTKL2040 Volume 1 Part 1, development control (PDF) | https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf |
| PTKL2040 portal | https://ppkl.dbkl.gov.my/ |
| JWP 49 redevelopment sites (PDF) | https://www.jwp.gov.my/storage/media/49-TAPAK-PEMBANGUNAN-SEMULA-KL.pdf |
| DBKL CPS product list | https://cps.dbkl.gov.my/ePlanCPS/senaraiProduk.aspx |
| DBKL eMap | https://cps.dbkl.gov.my/eplancps/Default.aspx |
| OpenStreetMap way 890986893 (Taiping proxy) | https://www.openstreetmap.org/way/890986893 |
| Brickz: Taman Taiping transactions | https://www.brickz.my/transactions/residential/kuala-lumpur/bangsar/taman-taiping/non-landed/ |
| iProperty: Taman Taiping 1,579 sf listing | https://www.iproperty.com.my/property/bangsar/taman-taiping/sale-100688672/ |
| iProperty: Taman Taiping building page | https://www.iproperty.com.my/condo/taman-taiping-20941 |
| iProperty: Taman Taiping shop for rent | https://www.iproperty.com.my/property/bangsar/rent-500275849/ |
| PropertyGuru: Nadi Bangsar | https://www.propertyguru.com.my/property-for-sale/at-nadi-bangsar-6050 |
| PropertyGuru: Residensi Razakmas 2 | https://www.propertyguru.com.my/bm/hartanah-dijual/di-residensi-razakmas-2-20796 |
| PropertyGuru: Residensi Rampai II | https://www.propertyguru.com.my/condo-for-sale/at-residensi-rampai-ii-9686 |
| PropertyGuru: Keramat land | https://www.propertyguru.com.my/residential-land-for-sale/in-keramat-9vnxt |
| Brickz: Residensi Rimba | https://www.brickz.my/transactions/residential/kuala-lumpur/pantai/residensi-rimba-pantai-dalam/non-landed/ |
| Arcadis construction cost Q4 2025 (PDF) | https://media.arcadis.com/-/media/project/arcadiscom/com/perspectives/asia/publications/qcc/2025/cnhk-qcc-2025-q4.pdf |
| The Star: Urban Renewal Bill withdrawn (23 Jan 2026) | https://www.thestar.com.my/news/nation/2026/01/23/govt-scraps-ura-to-table-new-bill-soon |
| Bernama: Urban Renewal Bill withdrawn | https://www.bernama.com/en/news.php?id=2516036 |
| The Vibes: Strata Titles Act s.57 consent | https://www.thevibes.com/articles/news/109827/urban-renewal-bill-drafted-after-unprecedented-101-stakeholder-sessions-says-minister |
| Address evidence: 23 Jalan Tandok | https://www.hokucare.com/a/4036/klinik-pergigian-23-bangsar-dental |
| Address evidence: 59-1 Taman Taiping | https://evendo.com/locations/malaysia/kuala-lumpur/shop/arcadia-kl |
| PropertyGuru: Nestree Residence | https://www.propertyguru.com.my/bm/hartanah-dijual/di-nestree-residence-22207 |
| PropertyGuru: Pantai Dalam listings incl. 5.9-acre land | https://www.propertyguru.com.my/property-for-sale/in-pantai-dalam-ae1kh |
| iProperty: Pantai Murni terrace | https://www.iproperty.com.my/property/pantai/pantai-dalam/sale-501805517/ |
| The Edge: CPI Land, Tuan Straits Residency | https://theedgemalaysia.com/node/796044 |
| PropertyGuru: Kampung Baru Salak Selatan lots | https://www.propertyguru.com.my/property-for-sale/in-salak-south-baru-wjz68 |
| EdgeProp: Salak Selatan residential | https://www.edgeprop.my/buy/kuala-lumpur/salak-selatan/all-residential?searchedLabel=Salak+Selatan&keyword=Salak%20Selatan |
| Mitula: Salak Selatan 12.1-acre land | https://homes.mitula.my/homes/bungalow-salak-selatan |
| PropertyGuru: Residensi Salak South (RUMAWIP) | https://www.propertyguru.com.my/condo/residensi-salak-south-23233 |
| PropertyGuru: Jinjang Utara lots | https://www.propertyguru.com.my/property-for-sale/p/jinjang-utara/2 |
| EdgeProp: Jinjang Utara incl. 13.9-acre parcel | https://www.edgeprop.my/buy/kuala-lumpur/jinjang/jinjang-utara/all-residential/197819 |
| PropertyGuru: Suite Enesta (MRT Jinjang) | https://www.propertyguru.com.my/property-listing/suite-enesta-for-sale-by-luis-looi-39052136 |
| PropertyGuru: Sri Jinjang | https://www.propertyguru.com.my/property-for-sale/at-sri-jinjang-396 |
| AYER Holdings Kuchai Lama land (Sep 2026) | https://propnewstime.com/latestnewsstories/Mzc0NjI=/ayer-holdings-to-acquire-9-11-acre-kuala-lumpur-land-parcels-for-rm138-million |
| The Edge: Malton Johor Bahru land | https://theedgemalaysia.com/node/805704 |
| The Edge: Selangor Dredging PJ land | https://theedgemalaysia.com/node/789055 |
| The Edge: PTKL2040 launched, plot ratio incentives (Jun 2025) | https://theedgemalaysia.com/node/760158 |
| The Edge: PTKL2040 amendments and 2026 incentive guideline (Jun 2026) | https://theedgemalaysia.com/node/806984 |
| Draft PTKL2040 FAQ (Jan 2024, PDF) | https://ppkl.dbkl.gov.my/wp-content/uploads/2024/01/FAQ-Draf-PTKL-2040_18012024_V1.pdf |
| DBKL guidelines page (2026 redevelopment incentive guideline) | https://www.dbkl.gov.my/en/garis-panduan |
| DBKL FAQ: development charge | https://www.dbkl.gov.my/en/soalan-lazim-mengikut-jabatan |
| NST: SD Property UniRazak and prime land-to-GDV ratios | https://www.nst.com.my/amp/business/corporate/2026/07/1487396/sd-propertys-unirazak-project-seen-upside-higher-plot-ratio |
| PropertyGuru: Taman Taiping building page | https://www.propertyguru.com.my/condo/taman-taiping-20941 |
| PropertyGuru: Taman Taiping for sale (0 listed, 7 Oct 2026) | https://www.propertyguru.com.my/property-for-sale/at-taman-taiping-20941 |
| JWP: Residensi MADANI FAQ | https://residensimadani.jwp.gov.my/faq |
| JWP: Residensi Wilayah policy (PDF) | https://residensiwilayah.jwp.gov.my/dasar.pdf |
