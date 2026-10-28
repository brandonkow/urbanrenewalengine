# Source layout and offline build (Build 6.1)

Edit `src/`; `app/index.html` is the generated publication artifact. The build uses esbuild as a development dependency and produces one HTML with all JavaScript and CSS inline. There are no runtime packages, CDN scripts, web fonts or external stylesheets. The existing system font stack works offline.

## Boundaries
- `engine.js`: ES module exporting residual, owner, deal and owner-derivation calculations. All financial assumptions are explicit inputs; absent development charge means zero.
- `guideline.js`: ES module exporting guideline constants and pure Category A/B calculations. Inputs supply the scenario, site and incentive settings.
- `core.js`: the ES-module entry bundled to the private URECore namespace.
- `data.js`: source URLs, taxonomies and site seed records; `evidence.js` retains dated provenance.
- `views/`: one browser source file per route, containing its renderer, event binding and feature helpers.
- `manifest.json`: explicit order for browser source units, which retain the established shared lexical scope for offline publishing and existing interaction tests. They are classic-script units, not independent ES modules.
- Named adapters pass browser defaults into the pure core. The global development-charge fallback is resolved here, never inside the pure modules.
- `styles.css` and `template.html`: shared styling and document shell.

The split deliberately preserves the existing route/global test API and initialization order. There is no duplicated financial implementation: browser adapters delegate to the same core functions imported by unit tests. The owner-derivation helpers retain their explicit mutation of the passed scenario object; they do not access browser state.

## Commands
Use Node 22.12+ (or supported newer Node), `npm ci`, then:
- `npm run build`: generate the offline publication file.
- `npm run build:check`: verify committed HTML is current and two independent builds are identical.
- `npm run test:unit`: Vitest imports engine and guideline functions directly in Node, without Chromium.
- `npm test`: direct unit tests followed by the unchanged existing browser regression scripts.
- `npm run shots`: rendered visual review.

CI uses the lockfile, checks the committed build, rebuilds and runs the full suite offline in Chromium. Commit source and regenerated HTML together. No timestamps, random identifiers or machine paths enter the artifact. The existing browser suite and golden file are unchanged by the source split.

Implementation references: [esbuild API](https://esbuild.github.io/api/) and [Vitest guide](https://vitest.dev/guide/).
