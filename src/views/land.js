/* ---------- land deals: canonical CSV + metadata snapshots; no calibration writes ---------- */
U.land_mira_detail="https://www.midf.com.my/sites/corporate/files/2025-11/mah_sing-cu-land_acquisition_in_setapak_for_m_series_project-mbsbr-241125.pdf";
const LAND_DEAL_DATA = [
 {
  "date": "2024-07-03",
  "buyer": "Mah Sing",
  "seller": "",
  "location": "Taman Desa — M Aspira",
  "state": "Kuala Lumpur",
  "acres": 6.169,
  "price_rm": 108000000,
  "land_psf": 401.9029,
  "tenure": "",
  "intended_use": "Serviced residences and affordable housing",
  "gdv_rm": 1010000000,
  "land_share_of_gdv": 0.106931,
  "source_type": "PRESS_REPORT",
  "url": "https://www.businesstoday.com.my/2024/07/03/mah-sing-acquiring-land-in-taman-desa-for-1600-residential-unit-with-gdv-of-rm1-01-billion/",
  "notes": "Combined 6.169-acre acquisition includes M Aspira and Residensi Madani; not just the 3.7-acre market housing phase. Tenure and vendor require filing check."
 },
 {
  "date": "2024-11-07",
  "buyer": "Mah Sing",
  "seller": "Team Keris Bhd",
  "location": "Old Klang Road — M Aurora",
  "state": "Kuala Lumpur",
  "acres": 5.24,
  "price_rm": 113000000,
  "land_psf": 495.0617,
  "tenure": "Freehold",
  "intended_use": "Apartments and retail",
  "gdv_rm": 660000000,
  "land_share_of_gdv": 0.171212,
  "source_type": "PRESS_REPORT",
  "url": "https://theedgemalaysia.com/node/733054",
  "notes": "SPA signed 7 Nov 2024. Source describes Old Klang Road, near Jalan Gasing. Gross development value is a projection."
 },
 {
  "date": "2024-12-12",
  "buyer": "Paramount",
  "seller": "Prismaworld Embassyview Sdn Bhd",
  "location": "Taman U-Thant — Brunsfield Residence",
  "state": "Kuala Lumpur",
  "acres": 4.526229272334067,
  "price_rm": 145000000,
  "land_psf": 735.4338,
  "tenure": "Leasehold",
  "intended_use": "High-end residential redevelopment",
  "gdv_rm": 300000000,
  "land_share_of_gdv": 0.483333,
  "source_type": "PRESS_REPORT",
  "url": "https://theedgemalaysia.com/node/737550",
  "notes": "Price includes land and 93 existing condominium units. Area converted from 18,317 sqm. GDV at least RM300m; ratio is an upper bound, not a point estimate."
 },
 {
  "date": "2025-01-22",
  "buyer": "Mah Sing",
  "seller": "",
  "location": "Sentul — M Aria",
  "state": "Kuala Lumpur",
  "acres": 2.78,
  "price_rm": 32000000,
  "land_psf": 264.2514,
  "tenure": "Freehold",
  "intended_use": "Apartments",
  "gdv_rm": 283000000,
  "land_share_of_gdv": 0.113074,
  "source_type": "PRESS_REPORT",
  "url": "https://www.thestar.com.my/business/business-news/2025/01/22/mah-sing-unit-acquires-sentul-land",
  "notes": "Date is the report publication date, not asserted as SPA date. Multiple vendors; identities not extracted."
 },
 {
  "date": "2025-04-16",
  "buyer": "SkyWorld",
  "seller": "M S Tan Corporation Sdn Bhd",
  "location": "Sungai Teba / Mont Kiara",
  "state": "Kuala Lumpur",
  "acres": 3.032,
  "price_rm": 110000000,
  "land_psf": 832.8669,
  "tenure": "Freehold",
  "intended_use": "Residential development",
  "gdv_rm": null,
  "land_share_of_gdv": null,
  "source_type": "COMPANY_FILING",
  "url": "https://skyworld.listedcompany.com/newsroom/SWD_Annual_Report_2025_Part_2.pdf",
  "notes": "Annual report 2025 note 40(a): SPA on 16 Apr 2025, completion pending conditions at reporting date. No GDV entered from this source."
 },
 {
  "date": "2025-08-07",
  "buyer": "Mah Sing",
  "seller": "MUI Group",
  "location": "KLCC — Corus Hotel site",
  "state": "Kuala Lumpur",
  "acres": 1.485,
  "price_rm": 260000000,
  "land_psf": 4019.3796,
  "tenure": "Freehold",
  "intended_use": "Premium serviced apartments",
  "gdv_rm": 1280000000,
  "land_share_of_gdv": 0.203125,
  "source_type": "PRESS_REPORT",
  "url": "https://www.mahsing.com.my/news/mah-sing-acquires-land-within-klcc-for-rm260mil/",
  "notes": "Company-hosted Star report. Date is report date. Price includes existing hotel asset; not a vacant-land comparable."
 },
 {
  "date": "2025-09-02",
  "buyer": "OSK Holdings",
  "seller": "",
  "location": "Bandar Country Homes, Rawang",
  "state": "Selangor",
  "acres": 14.477,
  "price_rm": 58000000,
  "land_psf": 91.9733,
  "tenure": "Freehold",
  "intended_use": "Residential and commercial",
  "gdv_rm": 1260000000,
  "land_share_of_gdv": 0.046032,
  "source_type": "COMPANY_RELEASE",
  "url": "https://www.oskgroup.com/osk-property-enters-new-market-in-rawang-with-a-rm1-26-billion-gdv-project/",
  "notes": "Three parcels; total transaction considered one deal. Vendor not named in release. Plans remain preliminary."
 },
 {
  "date": "2025-09-30",
  "buyer": "OSK Holdings",
  "seller": "Tropicana Metropark Sdn Bhd",
  "location": "Tropicana Metropark, Subang Jaya",
  "state": "Selangor",
  "acres": 3.312,
  "price_rm": 44000000,
  "land_psf": 304.9822,
  "tenure": "Freehold",
  "intended_use": "Serviced apartments",
  "gdv_rm": 427000000,
  "land_share_of_gdv": 0.103044,
  "source_type": "COMPANY_RELEASE",
  "url": "https://www.oskgroup.com/osk-property-expands-presence-in-the-subang-shah-alam-corridor-with-rm427-million-gdv-development/",
  "notes": "SPA date and preliminary GDV from company release."
 },
 {
  "date": "2025-11-03",
  "buyer": "Mah Sing",
  "seller": "Petaling Garden Sdn Bhd",
  "location": "Semenyih — M Legasi 2",
  "state": "Selangor",
  "acres": 305,
  "price_rm": 273500000,
  "land_psf": 20.5859,
  "tenure": "Freehold",
  "intended_use": "Mixed township",
  "gdv_rm": 1700000000,
  "land_share_of_gdv": null,
  "source_type": "PRESS_REPORT",
  "url": "https://www.thestar.com.my/business/business-news/2025/11/03/mah-sing-acquires-275-acre-parcel-for-m-legasi-2-project",
  "notes": "Gross area approximately 305 acres; 275 net developable acres. RM1.7bn GDV covers only 175 acres; remaining 100 acres under review. Land/GDV ratio suppressed due to mismatched scope."
 },
 {
  "date": "2025-11-21",
  "buyer": "Mah Sing",
  "seller": "The Rampai Development Sdn Bhd",
  "location": "Sri Rampai, Setapak — M Mira",
  "state": "Kuala Lumpur",
  "acres": 2.79,
  "price_rm": 44500000,
  "land_psf": 366.1575,
  "tenure": "Leasehold",
  "intended_use": "Residential apartments",
  "gdv_rm": 300000000,
  "land_share_of_gdv": 0.148333,
  "source_type": "PRESS_REPORT",
  "url": "https://www.edgeprop.my/content/1914519/mah-sing-acquires-279-acre-land-sri-rampai-setapak-m-mira-development",
  "notes": "SPA and planned mass-market residential project; expected dates are not completion evidence."
 },
 {
  "date": "2025-12-17",
  "buyer": "Paramount",
  "seller": "SJ Properties Sdn Bhd",
  "location": "Section U9 Shah Alam / Mukim Bukit Raja",
  "state": "Selangor",
  "acres": 48.489,
  "price_rm": 113500000,
  "land_psf": 53.7359,
  "tenure": "Leasehold",
  "intended_use": "Terraces, townhouses and low-rise condominiums",
  "gdv_rm": 579000000,
  "land_share_of_gdv": 0.196028,
  "source_type": "COMPANY_RELEASE",
  "url": "https://paramountproperty.my/paramount-acquires-48-489-acres-of-land-in-mukim-bukit-raja-selangor/",
  "notes": "Three contiguous parcels under one agreement. Development order is reported by the company, not independently verified."
 },
 {
  "date": "2026-01-13",
  "buyer": "Selangor Dredging",
  "seller": "Hectare Square Sdn Bhd",
  "location": "Jalan Subang 2, Taman Industri Penaga, Petaling Jaya",
  "state": "Selangor",
  "acres": 2.999859331011387,
  "price_rm": 63000000,
  "land_psf": 482.1163,
  "tenure": "Freehold",
  "intended_use": "Serviced apartments",
  "gdv_rm": 507000000,
  "land_share_of_gdv": 0.12426,
  "source_type": "PRESS_REPORT",
  "url": "https://theedgemalaysia.com/node/789055",
  "notes": "Seed verified: 1.214 hectares converted to acres. Existing building included. Tuesday 13 January and FY ending March 2027 contextualise 2026; obtain original filing for the completion update."
 },
 {
  "date": "2026-03-18",
  "buyer": "Paramount",
  "seller": "",
  "location": "U-Thant enclave / off Jalan Ampang",
  "state": "Kuala Lumpur",
  "acres": 3.7,
  "price_rm": 258000000,
  "land_psf": 1600.7743,
  "tenure": "Freehold",
  "intended_use": "High-end serviced apartments",
  "gdv_rm": 1100000000,
  "land_share_of_gdv": 0.234545,
  "source_type": "COMPANY_FILING",
  "url": "https://www.pcb.my/wp-content/uploads/2026/04/Paramount-Corporation-Berhad-AR2025.pdf",
  "notes": "Annual report land-replenishment table uses rounded 3.7 acres and RM258m. Distinct from December 2024 Brunsfield acquisition. Completion reported 16 Jun 2026 in linked announcement mirror; figures retained at annual-report precision."
 },
 {
  "date": "2026-07-06",
  "buyer": "Sime Darby Property",
  "seller": "Permodalan Nasional Berhad",
  "location": "Jalan Tun Razak — Wisma UNIRAZAK",
  "state": "Kuala Lumpur",
  "acres": 1.46,
  "price_rm": 160000000,
  "land_psf": 2515.8182,
  "tenure": "Freehold",
  "intended_use": "Premium mixed-use redevelopment",
  "gdv_rm": 900000000,
  "land_share_of_gdv": 0.177778,
  "source_type": "COMPANY_RELEASE",
  "url": "https://www.simedarbyproperty.com/press-releases/sime-darby-property-acquires-prime-asset-rm160-million-marking-entry-kuala-lumpur",
  "notes": "Binding offer accepted; not reported as completed. Price includes a 15-storey office with basement parking. Area rounded in release. Replaces incomplete seed record; 17.78% derived from disclosed price/GDV."
 },
 {
  "date": "2024-11-07",
  "buyer": "Eco World Development",
  "seller": "Boustead Properties group",
  "location": "Beranang / Semenyih — Eco Forest 2",
  "state": "Selangor",
  "acres": 847.249,
  "price_rm": 742400000,
  "land_psf": 20.1159,
  "tenure": "Freehold",
  "intended_use": "Landed residential and commercial township",
  "gdv_rm": 4600000000,
  "land_share_of_gdv": 0.161391,
  "source_type": "COMPANY_RELEASE",
  "url": "https://ecoworld.my/news/ecoworld-malaysia-inks-deal-to-develop-847-25-acres-of-land-as-eco-forest-2-in-semenyih-corridor/",
  "notes": "Two conditional SPAs for ten parcels. Buyer vehicle Mutiara Balau is 81% EcoWorld and 19% Boustead; consideration is 100% gross deal value, not EcoWorld equity spend."
 },
 {
  "date": "",
  "buyer": "AYER Holdings",
  "seller": "",
  "location": "Jalan Kuchai Lama",
  "state": "Kuala Lumpur",
  "acres": 9.11,
  "price_rm": 138000000,
  "land_psf": 347.7546,
  "tenure": "",
  "intended_use": "",
  "gdv_rm": null,
  "land_share_of_gdv": null,
  "source_type": "PRESS_REPORT",
  "url": "https://propnewstime.com/latestnewsstories/Mzc0NjI=/ayer-holdings-to-acquire-9-11-acre-kuala-lumpur-land-parcels-for-rm138-million",
  "notes": "Legacy seed retained. Source returned errors during follow-up; report date, vendor and tenure not fully verified. Excluded from buyer rankings and proposed bands pending original announcement."
 },
 {
  "date": "",
  "buyer": "Malton",
  "seller": "Tanjung Nakhoda (M) Sdn Bhd",
  "location": "Johor Bahru — W City Larkinton",
  "state": "Johor",
  "acres": 3.72,
  "price_rm": 97230000,
  "land_psf": 600.0252,
  "tenure": "Freehold",
  "intended_use": "Serviced apartments",
  "gdv_rm": 950000000,
  "land_share_of_gdv": 0.102347,
  "source_type": "PRESS_REPORT",
  "url": "https://theedgemalaysia.com/node/805704",
  "notes": "Seed figures and conditional SPA verified in article; June 3 reported but publication year not established from page. Outside KL/Selangor scope; retained for audit only."
 }
];
const LAND_DEAL_META = [
 {
  "id": "ms-aspira",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "high-rise",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.1,
   101.69
  ]
 },
 {
  "id": "ms-aurora",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "high-rise",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.09,
   101.66
  ]
 },
 {
  "id": "param-brunsfield",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "high-rise",
  "tier": "prime",
  "eligible": true,
  "pin": [
   3.16,
   101.73
  ],
  "asset": true,
  "gdvLowerBound": true
 },
 {
  "id": "ms-aria",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Report date; SPA date unverified",
  "product": "high-rise",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.18,
   101.69
  ]
 },
 {
  "id": "sky-montkiara",
  "checked": "2026-10-13",
  "confidence": "HIGH",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "high-rise",
  "tier": "prime",
  "eligible": true,
  "pin": [
   3.17,
   101.65
  ],
  "extraSource": "https://skyworld.listedcompany.com/newsroom/SWD_Annual_Report_2025_Part_1.pdf"
 },
 {
  "id": "ms-corus",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Report date; SPA date unverified",
  "product": "high-rise",
  "tier": "prime",
  "eligible": true,
  "pin": [
   3.16,
   101.71
  ],
  "asset": true
 },
 {
  "id": "osk-rawang",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "mixed",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.32,
   101.53
  ]
 },
 {
  "id": "osk-subang",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "high-rise",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.06,
   101.56
  ]
 },
 {
  "id": "ms-legasi",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "township",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   2.96,
   101.84
  ],
  "partialGDV": true
 },
 {
  "id": "ms-mira",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "high-rise",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.2,
   101.73
  ],
  "extraSource": "https://www.midf.com.my/sites/corporate/files/2025-11/mah_sing-cu-land_acquisition_in_setapak_for_m_series_project-mbsbr-241125.pdf"
 },
 {
  "id": "param-u9",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "mixed",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.17,
   101.49
  ]
 },
 {
  "id": "sdb-penaga",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Report day; year inferred from article context",
  "product": "high-rise",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   3.07,
   101.61
  ],
  "asset": true
 },
 {
  "id": "param-ampang",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Completion reported 16 Jun 2026 (filing mirror)",
  "dateBasis": "Announcement date",
  "product": "high-rise",
  "tier": "prime",
  "eligible": true,
  "pin": [
   3.16,
   101.73
  ],
  "extraSource": "https://www.klsescreener.com/v2/announcements/view/11614685"
 },
 {
  "id": "sime-unirazak",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Binding offer accepted; completion unverified",
  "dateBasis": "Announcement date",
  "product": "mixed",
  "tier": "prime",
  "eligible": true,
  "pin": [
   3.16,
   101.72
  ],
  "asset": true
 },
 {
  "id": "eco-forest2",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Signed/proposed; completion not verified",
  "dateBasis": "Announcement date",
  "product": "township",
  "tier": "suburban",
  "eligible": true,
  "pin": [
   2.91,
   101.86
  ],
  "joint": true
 },
 {
  "id": "ayer-seed",
  "checked": "2026-10-13",
  "confidence": "LOW",
  "status": "Legacy seed; verification incomplete",
  "dateBasis": "Date unverified",
  "product": "unknown",
  "tier": "suburban",
  "eligible": false,
  "pin": null
 },
 {
  "id": "malton-seed",
  "checked": "2026-10-13",
  "confidence": "MEDIUM",
  "status": "Conditional SPA reported; outside region",
  "dateBasis": "June 3; year unverified",
  "product": "high-rise",
  "tier": "suburban",
  "eligible": false,
  "pin": null
 }
];
const LAND_DEAL_EVENTS = [
  {
    "id": "ms-aspira-baseline",
    "dealId": "ms-aspira",
    "date": "2024-07-03",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://www.businesstoday.com.my/2024/07/03/mah-sing-acquiring-land-in-taman-desa-for-1600-residential-unit-with-gdv-of-rm1-01-billion/",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "ms-aurora-baseline",
    "dealId": "ms-aurora",
    "date": "2024-11-07",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://theedgemalaysia.com/node/733054",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "param-brunsfield-baseline",
    "dealId": "param-brunsfield",
    "date": "2024-12-12",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://theedgemalaysia.com/node/737550",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "ms-aria-baseline",
    "dealId": "ms-aria",
    "date": "2025-01-22",
    "dateBasis": "Report date; SPA date unverified",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://www.thestar.com.my/business/business-news/2025/01/22/mah-sing-unit-acquires-sentul-land",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "sky-montkiara-baseline",
    "dealId": "sky-montkiara",
    "date": "2025-04-16",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "COMPANY_FILING",
    "url": "https://skyworld.listedcompany.com/newsroom/SWD_Annual_Report_2025_Part_2.pdf",
    "checked": "2026-10-13",
    "confidence": "HIGH",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "ms-corus-baseline",
    "dealId": "ms-corus",
    "date": "2025-08-07",
    "dateBasis": "Report date; SPA date unverified",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://www.mahsing.com.my/news/mah-sing-acquires-land-within-klcc-for-rm260mil/",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "osk-rawang-baseline",
    "dealId": "osk-rawang",
    "date": "2025-09-02",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "COMPANY_RELEASE",
    "url": "https://www.oskgroup.com/osk-property-enters-new-market-in-rawang-with-a-rm1-26-billion-gdv-project/",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "osk-subang-baseline",
    "dealId": "osk-subang",
    "date": "2025-09-30",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "COMPANY_RELEASE",
    "url": "https://www.oskgroup.com/osk-property-expands-presence-in-the-subang-shah-alam-corridor-with-rm427-million-gdv-development/",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "ms-legasi-baseline",
    "dealId": "ms-legasi",
    "date": "2025-11-03",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://www.thestar.com.my/business/business-news/2025/11/03/mah-sing-acquires-275-acre-parcel-for-m-legasi-2-project",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "ms-mira-baseline",
    "dealId": "ms-mira",
    "date": "2025-11-21",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://www.edgeprop.my/content/1914519/mah-sing-acquires-279-acre-land-sri-rampai-setapak-m-mira-development",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "param-u9-baseline",
    "dealId": "param-u9",
    "date": "2025-12-17",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "COMPANY_RELEASE",
    "url": "https://paramountproperty.my/paramount-acquires-48-489-acres-of-land-in-mukim-bukit-raja-selangor/",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "sdb-penaga-baseline",
    "dealId": "sdb-penaga",
    "date": "2026-01-13",
    "dateBasis": "Report day; year inferred from article context",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://theedgemalaysia.com/node/789055",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "param-ampang-baseline",
    "dealId": "param-ampang",
    "date": "2026-03-18",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "COMPANY_FILING",
    "url": "https://www.pcb.my/wp-content/uploads/2026/04/Paramount-Corporation-Berhad-AR2025.pdf",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Initial acquisition announcement; see the separate completion notice. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "sime-unirazak-baseline",
    "dealId": "sime-unirazak",
    "date": "2026-07-06",
    "dateBasis": "Announcement date",
    "state": "offer",
    "kind": "baseline",
    "sourceType": "COMPANY_RELEASE",
    "url": "https://www.simedarbyproperty.com/press-releases/sime-darby-property-acquires-prime-asset-rm160-million-marking-entry-kuala-lumpur",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Binding offer accepted; completion unverified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "eco-forest2-baseline",
    "dealId": "eco-forest2",
    "date": "2024-11-07",
    "dateBasis": "Announcement date",
    "state": "announced",
    "kind": "baseline",
    "sourceType": "COMPANY_RELEASE",
    "url": "https://ecoworld.my/news/ecoworld-malaysia-inks-deal-to-develop-847-25-acres-of-land-as-eco-forest-2-in-semenyih-corridor/",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Signed/proposed; completion not verified. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "ayer-seed-baseline",
    "dealId": "ayer-seed",
    "date": null,
    "dateBasis": "Date unverified",
    "state": "unverified",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://propnewstime.com/latestnewsstories/Mzc0NjI=/ayer-holdings-to-acquire-9-11-acre-kuala-lumpur-land-parcels-for-rm138-million",
    "checked": "2026-10-13",
    "confidence": "LOW",
    "note": "Initial acquisition record. Legacy seed; verification incomplete. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "malton-seed-baseline",
    "dealId": "malton-seed",
    "date": null,
    "dateBasis": "June 3; year unverified",
    "state": "unverified",
    "kind": "baseline",
    "sourceType": "PRESS_REPORT",
    "url": "https://theedgemalaysia.com/node/805704",
    "checked": "2026-10-13",
    "confidence": "MEDIUM",
    "note": "Initial acquisition record. Conditional SPA reported; outside region. Baseline source was checked on 13 Oct 2026; it was not rechecked as part of this status update."
  },
  {
    "id": "ms-corus-completion-20260302",
    "dealId": "ms-corus",
    "date": "2026-03-02",
    "dateBasis": "Completion reported by this announcement; exact completion day not stated",
    "state": "completed",
    "kind": "notice",
    "sourceType": "COMPANY_FILING",
    "url": "https://www.klsescreener.com/v2/announcements/view/11185277",
    "originalUrl": "https://www.bursamalaysia.com/market_information/announcements/company_announcement/announcement_details?ann_id=3641608",
    "checked": "2026-10-23",
    "confidence": "MEDIUM",
    "reference": "GA1-02032026-00079",
    "note": "The company reports that the RM260m Corus Hotel site acquisition has completed. The notice does not give a separate completion date. Filing text read on KLSE Screener; original Bursa page returned 403."
  },
  {
    "id": "param-ampang-completion-20260616",
    "dealId": "param-ampang",
    "date": "2026-06-16",
    "dateBasis": "Completion date explicitly stated in announcement",
    "state": "completed",
    "kind": "notice",
    "sourceType": "COMPANY_FILING",
    "url": "https://www.klsescreener.com/v2/announcements/view/11614685",
    "originalUrl": "https://www.bursamalaysia.com/market_information/announcements/company_announcement/announcement_details?ann_id=3676791",
    "checked": "2026-10-23",
    "confidence": "MEDIUM",
    "reference": "GA1-18032026-00065",
    "parcelReference": "Lot 20009, off Jalan Ampang; parcel coordinates not verified",
    "note": "The company reports final payment and completion on 16 June 2026. The filing identifies Lot 20009, 14,974 sqm and RM257,888,218; the tracker retains its original rounded area and RM258m price. Filing mirror read; original Bursa page returned 403."
  },
  {
    "id": "sime-unirazak-spa-20260819",
    "dealId": "sime-unirazak",
    "date": "2026-08-19",
    "dateBasis": "SPA signing date explicitly stated in announcement",
    "state": "signed",
    "kind": "notice",
    "sourceType": "COMPANY_FILING",
    "url": "https://www.klsescreener.com/v2/announcements/view/11650269",
    "originalUrl": "https://www.bursamalaysia.com/market_information/announcements/company_announcement/announcement_details?ann_id=3695920",
    "checked": "2026-10-23",
    "confidence": "MEDIUM",
    "reference": "GA1-19082026-00039",
    "note": "The purchaser signed the SPA on 19 August 2026, following the 6 July offer announcement. This notice does not establish completion. Filing text read on KLSE Screener; original Bursa page returned 403."
  }
];
const LAND_DEALS = LAND_DEAL_DATA.map((d,i)=>({...d,...LAND_DEAL_META[i]}));
const LAND_STATUS_LABELS={announced:'Announced / completion unverified',offer:'Offer accepted / completion unverified',signed:'SPA signed / completion unverified',completed:'Completion reported',terminated:'Termination reported',unverified:'Status unverified'};
function ldHistory(d,events=LAND_DEAL_EVENTS){
 return events.filter(e=>e.dealId===d.id).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.kind==='baseline'?-1:1)-(b.kind==='baseline'?-1:1)||a.id.localeCompare(b.id));
}
function ldCurrent(d,events=LAND_DEAL_EVENTS){
 const h=ldHistory(d,events);return h[h.length-1]||null;
}
function ldStatus(d,events=LAND_DEAL_EVENTS){return ldCurrent(d,events)?.state||'unverified'}
function ldUsable(d,events=LAND_DEAL_EVENTS){return ldEligible(d)&&ldStatus(d,events)!=='terminated'}
function ldStatusHTML(d){
 const e=ldCurrent(d),state=ldStatus(d);
 return '<span class="chip '+(state==='completed'?'ok':state==='terminated'?'bad':'warn')+'">'+esc(LAND_STATUS_LABELS[state]||LAND_STATUS_LABELS.unverified)+'</span>'+
 (e?'<br><span class="small muted">'+esc(e.date||'Date unverified')+' · '+(e.kind==='notice'?'dated notice':'baseline record')+'</span>':'');
}

function ldCompletionHTML(rows){
 const scoped=rows.filter(d=>ldUsable(d)),complete=scoped.filter(d=>ldStatus(d)==='completed');
 return '<p class="note small ld-completion"><b>'+complete.length+' of '+scoped.length+' non-terminated scoped deals have completion reports.</b> Their recorded gross consideration is '+fmtM(complete.reduce((n,d)=>n+d.price_rm,0))+'. Other records have no completion evidence in this tracker; that does not mean they are still open. Status filters also apply to the table, map and buyer summary.</p>';
}

function ldHistoryHTML(d){
 const events=ldHistory(d).reverse();
 return '<section class="ld-history" aria-label="Deal status history"><h3>Deal status history</h3><p class="small muted">Acquisition stages only. A project launch, target date or building completion does not prove that a land purchase completed.</p><ol>'+events.map(e=>'<li><p><b>'+esc(e.date||'Date unverified')+' · '+esc(LAND_STATUS_LABELS[e.state])+'</b></p><p class="small muted">'+esc(e.dateBasis)+'</p><p class="small">'+esc(e.note)+'</p><p class="small">'+badge(e.sourceType)+' · Checked '+esc(e.checked)+' · '+esc(e.confidence)+' confidence'+(e.reference?'<br>Filing reference: '+esc(e.reference):'')+(e.parcelReference?'<br>Parcel reference: '+esc(e.parcelReference):'')+'</p><p class="small"><a href="'+esc(e.url)+'" target="_blank" rel="noopener">'+(e.kind==='notice'?'Read filing mirror':'Read baseline source')+'</a>'+(e.originalUrl?' · <a href="'+esc(e.originalUrl)+'" target="_blank" rel="noopener">Original Bursa link (access blocked at check)</a>':'')+'</p></li>').join('')+'</ol><p class="small muted">Source checks are selective, not a complete Bursa search. No later notice found here is not proof that a transaction remains open. Locality pins remain approximate; title references do not establish a parcel boundary.</p></section>';
}

let LD={q:'',buyer:'',status:'',sort:'date',dir:-1,legacy:false,asp:750,sel:'sime-unirazak',site:'taiping'};
function ldEligible(d){return d.eligible&&d.date>='2024-01-01'&&d.date<='2026-12-31'&&['Kuala Lumpur','Selangor'].includes(d.state)}
function ldMedian(ns){const a=ns.filter(Number.isFinite).slice().sort((a,b)=>a-b),n=a.length;return n?n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2:null}
function landDealStats(rows){
 const names=[...new Set(rows.filter(d=>ldUsable(d)).map(d=>d.buyer))];
 return names.map(buyer=>{
  const deals=rows.filter(d=>ldUsable(d)&&d.buyer===buyer),prices=deals.map(d=>d.price_rm).filter(Number.isFinite),sizes=deals.map(d=>d.acres).filter(Number.isFinite),psfs=deals.map(d=>d.land_psf).filter(Number.isFinite);
  return {buyer,deals,count:deals.length,completed:deals.filter(d=>ldStatus(d)==='completed').length,total:prices.reduce((a,b)=>a+b,0),medianAc:ldMedian(sizes),minPrice:prices.length?Math.min(...prices):null,maxPrice:prices.length?Math.max(...prices):null,minPsf:psfs.length?Math.min(...psfs):null,maxPsf:psfs.length?Math.max(...psfs):null,areas:[...new Set(deals.map(d=>d.location))]};
 }).sort((a,b)=>b.total-a.total||a.buyer.localeCompare(b.buyer));
}
function landDealFiltered(rows,cfg){
 const q=cfg.q.trim().toLowerCase(),numeric=new Set(['acres','price_rm','land_psf','land_share_of_gdv']);
 return rows.filter(d=>(cfg.legacy||ldEligible(d))&&(!cfg.buyer||d.buyer===cfg.buyer)&&(!cfg.status||ldStatus(d)===cfg.status)&&(!q||[d.buyer,d.location,d.intended_use].join(' ').toLowerCase().includes(q))).slice().sort((a,b)=>{
  const x=a[cfg.sort],y=b[cfg.sort],missing=v=>v===null||v===undefined||v==='';
  if(missing(x)||missing(y))return missing(x)?missing(y)?a.id.localeCompare(b.id):1:-1;
  return (numeric.has(cfg.sort)?x-y:String(x).localeCompare(String(y)))*cfg.dir||a.id.localeCompare(b.id);
 });
}
function landDealBand(rows,tier){
 // Prospective min/max on comparable urban deals only. Buildings, townships,
 // partial/lower-bound GDV and unknown fields cannot silently enter the band.
 const deals=rows.filter(d=>ldUsable(d)&&d.tier===tier&&d.product==='high-rise'&&!d.asset&&!d.partialGDV&&!d.gdvLowerBound&&Number.isFinite(d.land_share_of_gdv));
 return {deals,lo:deals.length?Math.min(...deals.map(d=>d.land_share_of_gdv)):null,hi:deals.length?Math.max(...deals.map(d=>d.land_share_of_gdv)):null};
}
function ldDistance(lat,lon,pin){
 if(!pin)return null;
 const rad=Math.PI/180,dl=(pin[0]-lat)*rad,dn=(pin[1]-lon)*rad;
 const a=Math.sin(dl/2)**2+Math.cos(lat*rad)*Math.cos(pin[0]*rad)*Math.sin(dn/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)));
}
function landBuyerFit(site,rows,ticket=null){
 // Heuristic only. Each buyer is represented by its single best-matching deal,
 // preventing an unrelated small purchase from supplying a large site's ticket fit.
 return landDealStats(rows).map(b=>{
  const matches=b.deals.map(d=>{
   const km=ldDistance(site.lat,site.lon,d.pin),area=km===null?0:40*Math.max(0,1-km/25);
   const hasTicket=Number.isFinite(ticket)&&ticket>0&&d.price_rm>0;
   const ticketScore=hasTicket?30*Math.min(ticket,d.price_rm)/Math.max(ticket,d.price_rm):0;
   const product=d.product==='high-rise'?30:d.product==='mixed'?15:0;
   const available=(km===null?0:40)+(hasTicket?30:0)+30;
   return {deal:d,km,area,ticket:ticketScore,product,hasTicket,score:available?(area+ticketScore+product)/available*100:0};
  }).sort((a,b)=>b.score-a.score||a.deal.id.localeCompare(b.deal.id));
  return {...b,...matches[0]};
 }).sort((a,b)=>b.score-a.score||a.buyer.localeCompare(b.buyer)).slice(0,3);
}
function ldSiteTicket(s){
 // Only known-area sites have a total target; never treat normalised 1 acre as an assembled site.
 if(!s.area||!s.rlv||!s.owner)return null;
 const x=presetState(s,'base'),m=model(x);
 return m.own&&m.own.reqTotal>0?m.own.reqTotal:null;
}
function buyerFitHTML(s){
 const ticket=ldSiteTicket(s),fits=landBuyerFit(s,LAND_DEALS,ticket);
 return '<section class="sec ld-fit"><div class="sec-head"><h2>Potential buyer fit</h2>'+badge('INFERRED','Analytical candidates, not evidence of buyer interest')+'</div>'+
 '<p class="small muted">Three research candidates from the full scoped sample, independent of table filters; not expressions of interest. Product assumption: urban high-rise redevelopment. Area uses approximate locality centres; ticket uses '+(ticket?fmtM(ticket)+' base owner-budget proxy, with unconfirmed interests.':'no total budget because site area or owner model is missing; ticket match is omitted.')+' Scores are heuristic match points, not probabilities.</p>'+
 '<div class="ld-cards">'+fits.map((b,i)=>'<article class="ld-card"><p class="small muted">CANDIDATE '+(i+1)+'</p><h3>'+esc(b.buyer)+'</h3><p><b>'+fmt0(b.score)+'/100</b> match points</p><p class="small">Area: '+(b.km===null?'unknown':'about '+fmt0(b.km)+' km to '+esc(b.deal.location))+'. Product: '+esc(b.deal.intended_use||'not disclosed')+'. '+(b.hasTicket?'Ticket: '+fmtM(b.deal.price_rm)+' recorded consideration versus '+fmtM(ticket)+' target proxy.':'Ticket: not scored; site total is unverified.')+'</p><p class="small muted">'+b.count+' tracked deal'+(b.count===1?'':'s')+'; sparse sample, not a complete acquisition history. Completion reported for '+b.completed+' of these deals. Terminated deals are excluded. Ownership fragmentation and mandate still require diligence.</p><a class="small" href="#/land/'+b.deal.id+'">Inspect supporting deal</a></article>').join('')+'</div></section>';
}
function ldImplied(d,asp){
 if(!ldUsable(d)||!d.acres||!d.price_rm||d.product==='township'||!Number.isFinite(asp)||asp<=0)return null;
 return calcLand({id:'ld_'+d.id,ac:d.acres,price:d.price_rm,asp,hc:270}).impliedPR;
}
function ldInFrame(d){return d.pin&&d.pin[0]>=MB.lat0&&d.pin[0]<=MB.lat1&&d.pin[1]>=MB.lon0&&d.pin[1]<=MB.lon1}
function landDealMap(rows,selected){
 const pins=rows.filter(d=>ldUsable(d)&&ldInFrame(d)),groups=new Map();
 pins.forEach(d=>{const k=d.pin.join(',');if(!groups.has(k))groups.set(k,[]);groups.get(k).push(d)});
 let svg='<rect width="'+MW+'" height="'+MH+'" fill="var(--sunk)"/>';
 for(let lat=3.08;lat<=3.24;lat+=.04){const y=PX(lat,MB.lon0)[1];svg+='<line x1="0" x2="'+MW+'" y1="'+y+'" y2="'+y+'" stroke="var(--rule)"/><text x="8" y="'+(y-6)+'" fill="var(--ink2)" font-size="16">'+lat.toFixed(2)+'°N</text>'}
 RAIL.forEach(r=>{svg+='<path fill="none" stroke="var(--rail)" stroke-width="2" d="'+r.st.map((p,i)=>{const[x,y]=PX(p[1],p[2]);return(i?'L':'M')+x+' '+y}).join('')+'"/>'});
 groups.forEach(ds=>{const d=ds.find(x=>x.id===selected)||ds[0],[x,y]=PX(...d.pin),on=ds.some(d=>d.id===selected);
 svg+='<g class="ld-pin" data-ldpin="'+d.id+'" tabindex="0" role="button" aria-label="'+esc(ds.map(d=>d.buyer+' — '+d.location).join('; '))+'" transform="translate('+x+' '+y+')"><title>'+esc(ds.map(d=>d.location).join('; '))+' — approximate locality, not parcel boundary</title><circle r="'+(on?16:12)+'" fill="var(--zone)" stroke="var(--ink)" stroke-width="'+(on?4:2)+'"/>'+(ds.length>1?'<text text-anchor="middle" y="5" font-size="15" fill="var(--ink)">'+ds.length+'</text>':'')+'</g>';
 });
 return '<div class="ld-map"><svg viewBox="0 0 '+MW+' '+MH+'" role="group" aria-label="Land deal locality pins over schematic Kuala Lumpur rail lines">'+svg+'</svg><p class="small muted">'+pins.length+' deals in this KL frame; '+(rows.length-pins.length)+' table-only. Shared locality pins are grouped; select either deal from the table. '+badge('INFERRED','Manually estimated locality centres at 0.01 degree precision, not geocoded parcels')+'</p></div>';
}
function ldDetail(d){
 const pr=ldImplied(d,LD.asp);
 return '<aside class="ld-card" id="ld-detail"><h2>'+esc(d.buyer)+'</h2><p>'+esc(d.location)+'</p><p>'+badge(d.source_type)+' '+ldStatusHTML(d)+'</p><dl class="kv small"><dt>Date basis</dt><dd>'+esc(d.date||'Unverified')+' — '+esc(d.dateBasis)+'</dd><dt>Seller</dt><dd>'+esc(d.seller||'Not extracted; filing check pending')+'</dd><dt>Tenure</dt><dd>'+esc(d.tenure||'Not verified')+'</dd><dt>Use</dt><dd>'+esc(d.intended_use||'Not confirmed')+'</dd><dt>Consideration</dt><dd>'+fmtM(d.price_rm)+' / '+fmt2(d.acres)+' gross ac'+(d.asset?' (includes buildings)':'')+'</dd><dt>Land psf</dt><dd>'+fmtRM(d.land_psf)+' '+badge('MODEL_OUTPUT')+'</dd><dt>Disclosed GDV</dt><dd>'+(d.gdv_rm?fmtM(d.gdv_rm)+(d.partialGDV?' — partial site only':d.gdvLowerBound?' — minimum':' — estimate'):'Not disclosed')+'</dd><dt>Land / GDV</dt><dd>'+(d.land_share_of_gdv===null?'Not comparable or not disclosed':(d.gdvLowerBound?'≤ ':'')+fmtPct(d.land_share_of_gdv))+'</dd><dt>Implied PR</dt><dd>'+(pr===null?'Not available for these inputs':fmt2(pr)+'× at assumed '+fmtRM(LD.asp)+' psf ASP')+' '+badge('MODEL_OUTPUT')+'</dd><dt>Acquisition data checked</dt><dd>'+d.checked+' · '+d.confidence+' confidence</dd></dl><p class="small">'+esc(d.notes)+'</p><p><a href="'+esc(d.url)+'" target="_blank" rel="noopener">Open source</a>'+(d.extraSource?' · <a href="'+esc(d.extraSource)+'" target="_blank" rel="noopener">Supporting source</a>':'')+'</p>'+ldHistoryHTML(d)+'</aside>';
}
function landBandHTML(){
 return '<section class="sec"><div class="sec-head"><h2>Proposed calibration bands</h2><span class="chip warn">Review only — not applied</span></div><p class="small muted">Min–max land/GDV from the full comparable urban high-rise sample, independent of table filters. Existing bands remain authoritative for the current model. New sample excludes buildings, townships, mixed-product schemes, partial-site GDV, lower-bound GDV and legacy rows. Tier assignments are analytical. Thin samples are not market ranges. Scroll the table horizontally to view all columns.</p><div class="tw" tabindex="0" role="region" aria-label="Proposed calibration bands table"><table class="cost ld-bands"><thead><tr><th>Tier</th><th>Existing band</th><th>Proposed sample</th><th>Included evidence</th></tr></thead><tbody>'+['suburban','prime'].map(t=>{
 const old=GDVCOMPS.filter(g=>g.tier===(t==='prime'?'prime':'sub')).map(gShare),b=landDealBand(LAND_DEALS,t);
 return '<tr><td>'+esc(t)+'</td><td>'+fmtPct(Math.min(...old))+'–'+fmtPct(Math.max(...old))+'</td><td>'+(b.lo===null?'Insufficient data':b.deals.length===1?fmtPct(b.lo)+' (1 deal; insufficient range)':fmtPct(b.lo)+'–'+fmtPct(b.hi)+' ('+b.deals.length+' deals)')+'</td><td>'+b.deals.map(d=>'<a href="#/land/'+d.id+'">'+esc(d.buyer+' / '+d.location)+'</a>').join('<br>')+'</td></tr>'
 }).join('')+'</tbody></table></div><p class="small muted">Approving a change requires a separate documented calibration edit and regression checks; this page cannot alter calibration.</p></section>';
}

