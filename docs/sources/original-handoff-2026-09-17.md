# Malaysia Structural Real Estate Opportunity Engine
## Claude UI Handoff — Complete Conversation Framework

**Prepared:** 17 Sep 2026  
**Market:** Malaysia, initial focus Kuala Lumpur  
**Current stage:** Structural opportunity discovery → redevelopment screening → residual land value → owner economics

---

## 1. What the user actually wants

This project is **not** about choosing a third condo or finding another ordinary investment property.

The user's real question is:

> What is the next structural, potentially life-changing real-estate opportunity in Malaysia — the kind of opportunity where planning, policy, infrastructure, market structure and information asymmetry can create a non-linear payoff?

The user already understands data analysis, DCF/IRR, transaction comparables, TOD, rental demand and feasibility modelling. The UI should therefore behave like an **institutional opportunity-intelligence and deal-origination tool**, not a consumer property portal.

Target workflow:

```text
information
→ database
→ site ranking
→ planning / owner intelligence
→ feasibility
→ deal origination
→ developer / capital matching
→ transaction control
→ equity / fee / promote
```

---

## 2. How the thesis evolved

The conversation started from a broad question about the next Malaysian property opportunity. The first conclusion was that 2026 is not a uniform property boom; it is a **structural divergence market**.

The discussion then moved away from normal residential investing and identified three structural opportunity classes:

1. **Kuala Lumpur urban renewal / redevelopment arbitrage**
2. **Powered industrial land / data-centre infrastructure**
3. **Old KL office / adaptive reuse / distressed commercial assets**

The best fit for the user's skill set became:

> **Kuala Lumpur urban renewal / redevelopment rights repricing**

The core idea is not "buy an old flat and wait". The real opportunity is to detect where:

```text
future redevelopment-supported residual land value
>
current economic value of the existing building / strata interests
```

and then determine whether the gap is actually executable after owner compensation and assembly friction.

---

## 3. Primary structural thesis: KL urban renewal

Old low-density / under-utilised assets can have large latent value where the following combine:

- ageing buildings,
- low current use intensity,
- high surrounding end-product ASP,
- planning intensity / plot-ratio optionality,
- rail / employment access,
- urban renewal policy,
- fragmented ownership,
- land scarcity.

The key wealth mechanism is:

> **information + deal structure + assembly + planning intelligence**, not passive appreciation.

---

## 4. The 139 redevelopment sites

The Kuala Lumpur planning framework identifies **139 priority redevelopment sites**.

| Category | Count |
|---|---:|
| Residential | 91 |
| Commercial | 14 |
| Industrial | 3 |
| Mixed development | 1 |
| Institution / public facilities | 14 |
| Infrastructure & utilities | 15 |
| Transportation | 1 |
| **Total** | **139** |

Important modelling rule:

> The 139-site planning map is indicative. Do not automatically treat a named planning area as a legal lot boundary.

The UI must distinguish:

- planning area,
- specific redevelopment polygon,
- cadastral lot,
- strata parcel,
- public-map proxy geometry.

---

## 5. Eight higher-priority Specific Redevelopment Incentive Sites

These have clearer PTKL redevelopment controls and should be a dedicated filter.

| Site | Zone | Base PR | Notes |
|---|---|---:|---|
| Kampung Datuk Keramat | R3 | 1:3.0 | comprehensive / cluster framework |
| Kampung Baru Salak Selatan | R3 | 1:3.5 | redevelopment framework |
| Kampung Pantai, Pantai Dalam | R3 | 1:3.5 | specific redevelopment designation |
| Perumahan Kluster Jalan Rejang | R3 | 1:3.5 | cluster redevelopment |
| Perumahan Jalan Jujur & Jalan Ikhlas | R3 | 1:3.5 | specific redevelopment framework |
| Apartmen Taman Taiping, Jalan Tandok | R3 | **1:4.0** | strongest base intensity of the eight |
| Jalan Jinjang Aman | R2 | 1:2.5 | lower-basis / underfollowed thesis |
| Jalan Jinjang Selatan | R2 | 1:2.5 | lower-basis / underfollowed thesis |

---

## 6. JWP 49 exact-lot list

A separate Jabatan Wilayah Persekutuan document provides **49 redevelopment sites with Mukim/Seksyen and lot numbers**. This is more useful for GIS anchoring than the broad 139-site map.

Examples already used:

- Flat Taman Maluri — Lots 6946, 6949
- Flat Taman Pertama — Lots 40010–40013
- Flat Taman Shamelin Perkasa — Lot 54591
- Flat PKNS Jalan Tun Razak — Lots 3351–3357
- Flat Taman Bukit Angkasa — 6 listed lots
- Flat Kuchai Entrepreneurs Park — Lots 32082, 32087
- Flat Kuchai Jaya — Lot 33598
- Flat Jalan Walter Granier — 58 lots
- Flat Jalan Tiong Nam — 15 lots
- Jalan Barat / TRX-adjacent cluster — highly fragmented multi-lot cluster

UI fields should include:

```text
Mukim/Seksyen
official_lot_numbers
known_lot_count
planning_source
cadastral_confidence
```

---

## 7. First-pass opportunity scoring model

The first screen used:

| Component | Weight |
|---|---:|
| Structural upside | 35% |
| Planning clarity | 25% |
| Dealability | 25% |
| Information edge | 15% |

Formula:

```text
Opportunity Score =
0.35 × Structural Upside
+ 0.25 × Planning Clarity
+ 0.25 × Dealability
+ 0.15 × Information Edge
```

Initial ranking:

| Site | Score |
|---|---:|
| Apartmen Taman Taiping | 8.48 |
| Jalan Jujur & Jalan Ikhlas | 8.25 |
| Jalan Rejang | 8.21 |
| Jalan Jinjang Aman | 8.06 |
| Jalan Jinjang Selatan | 8.06 |
| Kampung Datuk Keramat | 8.00 |
| Kampung Pantai | 7.97 |
| Flat Taman Shamelin Perkasa | 7.83 |
| Flat Taman Bukit Angkasa | 7.76 |
| Flat Kuchai Jaya | 7.73 |
| Flat Taman Pertama | 7.70 |
| Flat Taman Maluri | 7.61 |
| Flat Taman Melati | 7.61 |
| Flat Kuchai Entrepreneurs Park | 7.60 |
| Flat Bandar Baru Sentul Fasa 3 | 7.49 |
| Flat PKNS Jalan Kuching | 7.46 |
| Flat Jalan Tiong Nam | 7.43 |
| Flat Jalan Barat / TRX | 7.35 |
| Flat Jalan Walter Granier | 7.08 |
| Flat PKNS Jalan Tun Razak | 6.70 |

Lesson:

> **Highest raw land value ≠ best actionable opportunity.**

Fragmentation, competition and dealability matter.

---

## 8. Residual Land Value (RLV) framework

Core formula:

```text
RLV
= GDV
- hard cost
- professional fees
- contingency
- statutory / infrastructure charges
- sales & marketing
- finance
- demolition / relocation
- developer profit
```

Interpretation:

> RLV is the residual budget theoretically available for land / owner consideration under the model assumptions.

It is **not** developer profit.

---

## 9. Base underwriting assumptions

The first model normalised each site to **1 acre = 43,560 sf**.

| Variable | Base |
|---|---:|
| Saleable efficiency | 78% |
| Professional fees | 8% of hard cost |
| Contingency | 5% of hard cost |
| Statutory / infra | 3% of GDV |
| Sales & marketing | 3% of GDV |
| Finance | 5% of GDV |
| Demolition / relocation | 2% of GDV |
| Developer profit hurdle | 20% of GDV |
| Base PR uplift | 0% |
| Upside-only PR sensitivity | +25% |

All should be editable.

---

## 10. First-pass RLV results

| Site | Base PR | Base ASP | Base Hard Cost | Base RLV / acre | RLV / land sf | Breakeven ASP |
|---|---:|---:|---:|---:|---:|---:|
| Taman Taiping | 4.0 | RM1,100 | RM400/GFA sf | **RM21.41m** | **RM491** | RM865 |
| Bukit Angkasa | 3.5 provisional | RM775 | RM320 | **RM6.62m** | RM152 | RM692 |
| Kampung Datuk Keramat | 3.0 | RM850 | RM350 | **RM6.37m** | RM146 | RM757 |
| Jalan Rejang | 3.5 | RM600 | RM290 | **-RM2.16m** | -RM49 | RM627 |
| Jalan Jujur / Ikhlas | 3.5 | RM550 | RM280 | **-RM4.42m** | -RM101 | RM605 |

Interpretation:

- **Taman Taiping:** strongest first-pass development math.
- **Bukit Angkasa:** interesting if PR 3.5 is verified.
- **Keramat:** redevelopment may work but open-market individual land asking may already price in too much upside.
- **Jalan Rejang:** trigger-watch asset; only ~RM27 psf ASP gap to base break-even.
- **Jalan Jujur:** strong story, weak conventional base economics.

---

# 11. Taman Taiping deep dive

## 11.1 Official planning input

```text
Site: Apartmen Taman Taiping / Jalan Tandok
Zone: R3
Base PR: 1:4
Redevelopment: whole-site or block-cluster framework
Access: Jalan Tandok
```

Any extra redevelopment incentive should be treated as optional / subject to approval, not guaranteed.

---

## 11.2 Per-acre development model

```text
Land area: 43,560 sf
PR: 4.0
GFA: 174,240 sf
Saleable efficiency: 78%
Saleable area: ~135,907 sf
ASP: RM1,100 psf
GDV: ~RM149.5m / acre
```

Base result:

```text
RLV ≈ RM21.407m / acre
RLV ≈ RM491 / land sf
Breakeven ASP ≈ RM865 psf
```

This initially looked extremely strong.

---

# 12. Owner-economics framework

The key insight was that redevelopment is constrained by:

> **how many ownership interests must share the residual.**

The site has evidence of both residential and ground-floor commercial occupation, so a homogeneous owner value is unrealistic.

## Residential benchmark

```text
Observed residential value proxy: RM470,000 / interest
Observed public transaction: ~RM295 psf
Implied floor area: ~1,593 sf
```

Thin public sample; not a valuation.

## Commercial proxy

Observed ground-floor asking rent:

```text
RM8,000 / month
1,540 sf
```

Assumed cap rate:

```text
6%
```

Indicative capital value:

```text
RM8,000 × 12 / 6% = RM1.60m
```

Again: underwriting proxy, not formal valuation.

---

# 13. Mixed owner-value proxy

Assumption:

```text
75% residential interests
25% commercial-like interests
```

Weighted current value:

```text
0.75 × RM470k + 0.25 × RM1.60m
= RM752,500 / interest
```

Required owner uplift:

```text
30%
```

Required package:

```text
RM752,500 × 1.30
= RM978,250 / interest
```

Using RLV RM21.407m/acre:

```text
Max supportable interests per acre
= RM21.407m / RM978,250
≈ 21.88 interests / acre
```

This became the critical owner-density screen.

---

# 14. Ownership-density interpretation

| Interests / acre | Interpretation |
|---:|---|
| <20 | strong |
| 20–25 | workable but sensitive |
| 25–35 | difficult |
| >35 | weak base case unless PR / ASP / deal structure improves |

Approximate minimum site areas at current package assumption:

```text
40 interests → ~1.83 acres
60 interests → ~2.74 acres
```

---

# 15. Free public-data area proxy

Because official DBKL GIS download cost was considered too high for early screening, a free proxy workflow was used.

OpenStreetMap way:

```text
890986893
```

Calculated public-map polygon:

```text
~5,215 sqm
~56,134 sf
~1.2886663 acres
```

Important:

> This is **NOT** the legal DBKL Site 6 boundary. It is a screening proxy only.

---

# 16. Public address evidence

Examples found along Taman Taiping / Jalan Tandok include:

```text
21-G
23 Ground Floor
25
27-G
29-G
31
51A
57 Ground Floor
59-1
```

This suggests:
- multiple frontage commercial premises,
- upper-level separately addressed premises,
- likely ownership density higher than a very small scheme.

A **40-interest stress case** was therefore used.

This is **not** a confirmed strata parcel count.

---

# 17. Taman Taiping using the 1.289-acre proxy

```text
Proxy area: 1.2886663 acres
Base RLV / acre: RM21.407m
Total base RLV: ~RM27.587m
Required owner package: RM978,250 / interest
```

Max interests supportable:

```text
~28.2 interests
```

This materially changed the thesis.

Taman Taiping moved from:

> clear top opportunity

into:

> **conditional high-potential redevelopment option constrained by owner density.**

---

# 18. Required ASP / PR by ownership count

At:
- proxy site area 1.289 acres,
- PR 4,
- same cost structure,
- 30% owner uplift target,

| Interests | Required ASP | Owner premium at RM1,100 ASP | Required PR if ASP stays RM1,100 |
|---:|---:|---:|---:|
| 20 | RM1,032 | +83.3% | 2.84x |
| 30 | RM1,115 | +22.2% | 4.26x |
| **40** | **RM1,198** | **-8.4%** | **5.67x** |
| 50 | RM1,282 | -26.7% | 7.09x |
| 60 | RM1,365 | -38.9% | 8.51x |

Interpretation:

- ~30 interests: potentially workable.
- ~40 interests: RM1,100 / PR4 is not enough for 30% owner uplift.
- ~50–60 interests: base case deteriorates materially.

Ways a 40-interest case could work:

- ASP ~RM1,200 psf,
- effective PR ~5.67x,
- lower costs,
- lower required owner cash compensation,
- JV / replacement-unit structure,
- fewer true legal interests than public addresses imply.

---

# 19. Current Taman Taiping verdict

```text
Verdict: CONDITIONAL_HIGH_POTENTIAL
```

Why:
- strong base development RLV,
- strong location / planning intensity,
- but owner-density feasibility is not yet confirmed.

Critical missing data:

```text
actual strata parcel count
accessory parcel count
share units
block count
master lot
official Site 6 land area
owner concentration
residential vs commercial legal interests
```

Most important next number:

> **actual legal ownership-interest count**

---

# 20. Low-cost diligence workflow

Do not buy expensive GIS data before the thesis survives free screening.

Workflow:

```text
1. PTKL / DBKL public planning documents
2. DBKL public map / OSM
3. transaction and listing evidence
4. public address / block evidence
5. obtain strata parcel count / share units / master lot
6. rerun owner economics
7. only then pay for official legal / GIS data if still attractive
```

---

# 21. UI product vision

The product should feel like:

> **Bloomberg / Mapbox / institutional development underwriting for latent land value**

Not like:
- PropertyGuru,
- a condo catalogue,
- a retail buy/sell recommender.

Design language:
- analytical,
- geospatial,
- finance-heavy,
- restrained,
- evidence-led,
- confidence-aware.

---

# 22. Core screens

## A. Dashboard / Watchlist

Columns:

```text
rank
site
structural upside
planning clarity
owner feasibility
dealability
information edge
opportunity score
RLV / acre
RLV / land sf
breakeven ASP
owner-density status
data confidence
stage
trigger
verdict
next action
```

Suggested stages:

```text
DISCOVERY
SCREENING
DILIGENCE
TRIGGER_WATCH
DEALABLE
IN_PLAY
CAPTURED
REJECTED
```

---

## B. Interactive Map

Layers:

```text
139 redevelopment sites
8 specific incentive sites
JWP 49 exact-lot sites
MRT / LRT / KTM
employment nodes
major commercial nodes
new-launch ASP heatmap
old-stock / building-age layer
optional land-value layer
```

Pin states:

```text
green = base economics work
amber = sensitive / trigger watch
red = base case fails
purple = official incentive site
grey = insufficient data
```

---

## C. Site Detail

### Identity
- name
- planning category
- Mukim/Seksyen
- lots
- area and confidence

### Planning
- zone
- base PR
- possible incentive PR
- assembly rules
- access conditions

### Market
- old-stock transaction psf
- asking land psf
- nearby new launch ASP
- mature project ASP
- rent / yield

### Development
- GFA
- saleable area
- GDV
- cost stack
- developer margin
- RLV

### Owner economics
- parcel count
- residential / commercial split
- weighted current value
- required uplift
- max supportable owners
- required ASP / required PR

### Verdict
- base case
- downside
- upside
- gating variable
- next action

---

# 23. RLV calculator formulas

Inputs:

```text
land_area_sf
base_plot_ratio
plot_ratio_uplift_pct
saleable_efficiency_pct
asp_rm_psf
hard_cost_rm_gfa_sf
professional_fee_pct_hard_cost
contingency_pct_hard_cost
statutory_infra_pct_gdv
sales_marketing_pct_gdv
finance_pct_gdv
demolition_relocation_pct_gdv
developer_profit_pct_gdv
```

Derived:

```text
effective_pr = base_plot_ratio * (1 + plot_ratio_uplift_pct)

gfa_sf = land_area_sf * effective_pr

saleable_area_sf = gfa_sf * saleable_efficiency_pct

gdv = saleable_area_sf * asp_rm_psf

hard_cost = gfa_sf * hard_cost_rm_gfa_sf

professional_fees = hard_cost * professional_fee_pct_hard_cost

contingency = hard_cost * contingency_pct_hard_cost

statutory_infra = gdv * statutory_infra_pct_gdv

sales_marketing = gdv * sales_marketing_pct_gdv

finance = gdv * finance_pct_gdv

demolition_relocation = gdv * demolition_relocation_pct_gdv

developer_profit = gdv * developer_profit_pct_gdv

rlv =
gdv
- hard_cost
- professional_fees
- contingency
- statutory_infra
- sales_marketing
- finance
- demolition_relocation
- developer_profit

rlv_per_land_sf = rlv / land_area_sf
```

---

# 24. Owner-economics formulas

Inputs:

```text
residential_interest_value
commercial_interest_value
residential_share_pct
commercial_share_pct
required_owner_uplift_pct
number_of_interests
site_area_acres
```

Weighted value:

```text
weighted_value =
residential_value * residential_share
+ commercial_value * commercial_share
```

Required package:

```text
required_package = weighted_value * (1 + owner_uplift_pct)
```

Max supportable interests:

```text
max_interests = total_rlv / required_package
```

Required land area:

```text
required_area_acres =
(number_of_interests * required_package)
/ rlv_per_acre
```

Most important urban-renewal decision rule:

```text
Residual Value > Required Owner Consideration
```

---

# 25. Required sensitivity charts

## Chart 1 — RLV vs ASP
- x: ASP
- y: RLV
- overlay owner-budget requirement

## Chart 2 — Max supportable owners vs site area
- x: site area
- y: interests
- series for 20%, 30%, 40% owner uplift

## Chart 3 — Required ASP vs ownership count
- x: interests
- y: ASP

## Chart 4 — Required PR vs ownership count
- x: interests
- y: plot ratio

These should update live.

---

# 26. Data confidence system

Every data point should carry:

```text
value
source_type
source_url
verified_status
last_checked
confidence
notes
```

Source types:

```text
OFFICIAL_PLANNING
OFFICIAL_CADASTRAL
OFFICIAL_STRATA
TRANSACTION
ASKING_LISTING
PUBLIC_MAP
INFERRED
UNDERWRITING_ASSUMPTION
MODEL_OUTPUT
```

Recommended confidence:

```text
HIGH
MEDIUM
LOW
PROVISIONAL
```

The UI must never visually treat an assumption as an official fact.

---

# 27. Recommended Opportunity Score V2

The first qualitative score should evolve because owner density proved critical.

| Factor | Weight |
|---|---:|
| Residual-value gap | 25% |
| Planning certainty | 15% |
| Owner-density feasibility | 20% |
| End-value confidence | 15% |
| Dealability / assembly | 10% |
| Information edge | 10% |
| Capital accessibility | 5% |

```text
OpportunityScoreV2 =
0.25 * ResidualGap
+ 0.15 * PlanningCertainty
+ 0.20 * OwnerFeasibility
+ 0.15 * EndValueConfidence
+ 0.10 * Dealability
+ 0.10 * InformationEdge
+ 0.05 * Accessibility
```

---

# 28. Trigger-watch logic

A site may not be good or bad today. It may be waiting for a trigger.

Example Jalan Rejang:

```text
Base ASP: RM600
Breakeven ASP: ~RM627
```

Possible triggers:

```text
ASP >= 650
effective_pr >= 4.0
owner_count <= 32
hard_cost <= target
```

UI status should automatically change when trigger conditions become true.

---

# 29. Broader structural opportunity modules

The architecture should support more than urban renewal.

## Powered industrial land

Variables:

```text
grid capacity
substation proximity
water
fibre
industrial zoning
renewable-energy access
data-centre proximity
land basis
utility readiness
```

Potential geographies discussed:
- Johor
- southern Selangor / Banting
- Melaka
- selected Perak corridors

Core concept:

> "Powered land" is economically different from generic industrial land.

## Old office / adaptive reuse

Variables:

```text
building age
vacancy
rent
land value
PR
adaptive reuse potential
residential / hospitality conversion
refinancing distress
institutional seller
```

Same RLV architecture can be reused.

---

# 30. Current strategic priority

```text
PRIMARY:
KL Urban Renewal / Redevelopment Intelligence

SECONDARY:
Powered Industrial Land

TERTIARY:
Old KL Office / Adaptive Reuse
```

---

# 31. Suggested site object schema

```json
{
  "site_id": "tt_jalan_tandok",
  "name": "Apartmen Taman Taiping",
  "city": "Kuala Lumpur",
  "planning_category": "Specific Redevelopment Incentive Site",
  "zone": "R3",
  "base_plot_ratio": 4.0,
  "base_plot_ratio_status": "OFFICIAL_PLANNING",
  "official_lots": [],
  "land_area_sf": 56134,
  "land_area_status": "PUBLIC_MAP",
  "land_area_source": "OpenStreetMap way 890986893",
  "rlv_model": {
    "saleable_efficiency": 0.78,
    "asp": 1100,
    "hard_cost": 400,
    "professional_fee_pct": 0.08,
    "contingency_pct": 0.05,
    "statutory_infra_pct": 0.03,
    "sales_marketing_pct": 0.03,
    "finance_pct": 0.05,
    "demo_relocation_pct": 0.02,
    "developer_profit_pct": 0.20
  },
  "owner_model": {
    "residential_value": 470000,
    "commercial_value": 1600000,
    "residential_share": 0.75,
    "commercial_share": 0.25,
    "required_owner_uplift": 0.30,
    "actual_interest_count": null,
    "stress_interest_count": 40
  },
  "current_verdict": "CONDITIONAL_HIGH_POTENTIAL",
  "gating_variable": "Actual strata interest count",
  "next_action": "Obtain parcel count / share units / master lot"
}
```

---

# 32. Exact prototype numbers to preserve

For Taman Taiping:

```text
Base PR: 4.0
Proxy land area: 1.2886663 acres
Proxy land area: ~56,134 sf
Base ASP: RM1,100 psf
Base hard cost: RM400 / GFA sf
Base RLV / acre: RM21.407m
Total base RLV at proxy area: RM27.587m
Residential benchmark value: RM470,000 / interest
Commercial proxy value: RM1,600,000 / interest
Residential share: 75%
Commercial share: 25%
Weighted current value: RM752,500 / interest
Required owner uplift: 30%
Required package: RM978,250 / interest
Max supportable interests: ~28.2
Stress-case interests: 40
Required ASP at 40 interests: ~RM1,198 psf
Required PR at 40 interests if ASP stays RM1,100: ~5.67x
Owner premium at 40 interests under base: ~-8.4%
```

Only the official planning PR and properly sourced market evidence should be shown as verified. Others are assumptions, public proxies or model outputs.

---

# 33. Verdict taxonomy

```text
STRONG_BASE_CASE
CONDITIONAL_HIGH_POTENTIAL
TRIGGER_WATCH
OWNER_DENSITY_BLOCKED
PLANNING_UNCERTAIN
END_VALUE_TOO_LOW
ALREADY_IN_PLAY
TOO_FRAGMENTED
LOW_INFORMATION_EDGE
REJECTED
```

Current Taman Taiping:

```text
CONDITIONAL_HIGH_POTENTIAL
```

---

# 34. Recommended navigation

```text
Dashboard
Map
Watchlist
Sites
RLV Model
Owner Economics
Triggers
Sources
Diligence
Saved Deals
```

---

# 35. MVP build order for Claude

## Page 1 — Watchlist
- Top 20 table
- sortable score columns
- verdict badge
- RLV / acre
- breakeven ASP
- owner-density status
- confidence
- next action

## Page 2 — Site Detail
Start with **Taman Taiping**.

Left:
- map
- planning controls
- source/confidence panel

Right:
- RLV model
- owner economics
- charts
- verdict

## Page 3 — Scenario Lab
Live sliders / fields for:

```text
ASP
PR
site area
owner count
owner uplift
hard cost
saleable efficiency
developer margin
commercial share
commercial value
```

Outputs:

```text
GDV
RLV
RLV/acre
RLV/land sf
max supported interests
required ASP
required PR
owner premium / discount
```

---

# 36. TypeScript guidance

```ts
type SourceStatus =
  | "OFFICIAL_PLANNING"
  | "OFFICIAL_CADASTRAL"
  | "OFFICIAL_STRATA"
  | "TRANSACTION"
  | "ASKING_LISTING"
  | "PUBLIC_MAP"
  | "INFERRED"
  | "UNDERWRITING_ASSUMPTION"
  | "MODEL_OUTPUT";

type Verdict =
  | "STRONG_BASE_CASE"
  | "CONDITIONAL_HIGH_POTENTIAL"
  | "TRIGGER_WATCH"
  | "OWNER_DENSITY_BLOCKED"
  | "PLANNING_UNCERTAIN"
  | "END_VALUE_TOO_LOW"
  | "ALREADY_IN_PLAY"
  | "TOO_FRAGMENTED"
  | "LOW_INFORMATION_EDGE"
  | "REJECTED";
```

Core pure functions:

```text
calculateGFA()
calculateSaleableArea()
calculateGDV()
calculateRLV()
calculateBreakevenASP()
calculateWeightedOwnerValue()
calculateOwnerPackage()
calculateMaxSupportedInterests()
calculateRequiredASPForOwnerCount()
calculateRequiredPRForOwnerCount()
```

---

# 37. Non-negotiable product principle

For every site the UI must separately answer:

### 1. Planning
What can legally / realistically be built?

### 2. Development
Does the project-level RLV work?

### 3. Owners
Can existing ownership interests be economically satisfied?

### 4. Dealability
Can the user actually control, aggregate or originate the deal?

A site should **not** rank highly just because the planning story is attractive.

---

# 38. Most important insight from the entire conversation

The question evolved from:

> "Where is the next big property opportunity?"

into:

> "Where is current economic value materially lower than redevelopment-supported residual value?"

and finally into the more important question:

> **"How many ownership interests must share that residual?"**

That is the heart of this framework.

---

# 39. Existing working spreadsheets

Created during the conversation:

```text
KL_Urban_Renewal_Opportunity_Screener.xlsx
KL_Urban_Renewal_Opportunity_Screener_v2.xlsx
KL_Urban_Renewal_Opportunity_Screener_v3.xlsx
```

Latest working version:

```text
KL_Urban_Renewal_Opportunity_Screener_v3.xlsx
```

Important sheets:

```text
Method
8 Specific Sites
JWP 49 Exact Lots
Top 20 Watchlist
RLV Inputs
RLV Model
RLV Summary
Taman Taiping Owner Econ
Free Diligence Proxy
```

---

# 40. Source URLs already used

## Official / planning

PTKL2040 Development Control  
https://ppkl.dbkl.gov.my/wp-content/uploads/2025/06/1.-VOLUME-1-PART-1_DEVELOPMENT-CONTROL_.pdf

PTKL2040 portal  
https://ppkl.dbkl.gov.my/

DBKL CPS product list  
https://cps.dbkl.gov.my/ePlanCPS/senaraiProduk.aspx

DBKL eMap  
https://cps.dbkl.gov.my/eplancps/Default.aspx

JWP 49 redevelopment sites  
https://www.jwp.gov.my/storage/media/49-TAPAK-PEMBANGUNAN-SEMULA-KL.pdf

## Market / map

Brickz  
https://www.brickz.my/

PropertyGuru  
https://www.propertyguru.com.my/

iProperty  
https://www.iproperty.com.my/

OpenStreetMap proxy polygon  
https://www.openstreetmap.org/way/890986893

## Construction-cost benchmark

Arcadis Q4 2025  
https://media.arcadis.com/-/media/project/arcadiscom/com/perspectives/asia/publications/qcc/2025/cnhk-qcc-2025-q4.pdf

---

# 41. Suggested Claude build prompt

> Build a professional web UI for a **Malaysia Structural Real Estate Opportunity Engine**. It is an institutional-style redevelopment screening and deal-origination tool, not a consumer property portal.
>
> The core use case is Kuala Lumpur urban renewal. Users should be able to rank redevelopment sites, inspect planning data, run residual land value models, model owner compensation, test owner density, and see whether a site is actually dealable.
>
> Use the formulas, data structures, assumptions and Taman Taiping case in this markdown as the seeded dataset.
>
> Design language: institutional, analytical, geospatial, finance-heavy, restrained. Avoid glossy condo imagery or marketing-style "best investment" signals.
>
> Build an MVP with:
> 1. Dashboard / Watchlist
> 2. Interactive Map
> 3. Site Detail
> 4. RLV Scenario Lab
> 5. Owner Economics sensitivity
> 6. Source-confidence badges
> 7. Trigger-watch logic
>
> Every data point must clearly show whether it is official, transaction evidence, asking-market evidence, public proxy, inference, underwriting assumption or model output.
>
> Make **Taman Taiping** the first complete site example using the exact current numbers in this document.
>
> The most important decision rule is:
>
> `Residual Value > Required Owner Consideration`
>
> Do not treat positive planning sentiment alone as an investment signal.

---

# 42. Final product objective

The application should answer, for any site:

```text
PLANNING
What can be built?

MARKET
What can the new product realistically sell for?

DEVELOPMENT
What is the residual land value?

OWNERS
How much must existing ownership interests receive?

DEAL
Can the project actually be assembled / controlled?

TRIGGER
What must change for the site to become actionable?

CONFIDENCE
Which inputs are verified and which are assumptions?
```

The system's purpose is to move the user from:

> interesting property story

into:

> **quantified, evidence-labelled, actionable deal thesis.**
