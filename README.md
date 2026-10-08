# KL Urban Renewal Engine: Claude Code starter kit

This folder is a ready-to-open Claude Code project for the KL Urban Renewal Engine, build 5. That build applies DBKL's 2026 redevelopment incentive guideline.

## What is inside

| Path | What it is |
| --- | --- |
| `app/index.html` | The engine. One self-contained file: double-click it to use it in a browser. |
| `CLAUDE.md` | Project rules that Claude Code reads at the start of every session. |
| `docs/handoff.md` | The full handoff: formulas, assumptions, results, data model and code map. |
| `docs/roadmap.md` | Next tasks, each with a prompt to paste and a check for when it is done. |
| `docs/CHANGELOG.md` | One entry per change that moves numbers. |
| `docs/sources/` | The DBKL 2026 guideline PDF, workbook v3 and the original handoff. |
| `data/land-deals-seed.csv` | The land deals already in the engine, as a starting point for the land-deal tracker. |
| `tests/` | Formula tests with golden numbers (`expected.json`), a UI sweep, interaction checks and owner-pack checks. |
| `scripts/packs.mjs` | `npm run packs`: exports every owner briefing pack to PDF in `out/packs/`. |
| `.github/workflows/test.yml` | Runs `npm test` on every push and pull request. |
| `.claude/` | Project settings, two skills (`/check-engine`, `/add-evidence`) and a `numbers-auditor` subagent. |

## 1. Install (once)

**Claude Code** needs a Pro, Max, Team, Enterprise or Console (API) account; the free plan does not include it.

- **macOS or Linux:** `curl -fsSL https://claude.ai/install.sh | bash`
- **Windows (PowerShell):** `irm https://claude.ai/install.ps1 | iex`. Installing Git for Windows is recommended.
- **No terminal:** the Claude desktop app can run Claude Code on a local folder.

Check it with `claude --version`, and update with `claude update`. Docs: https://code.claude.com/docs/en/setup

**Node.js 20 or later** runs the tests (https://nodejs.org). Then, in this folder, run:

```
npm install
npm run setup      # downloads Chromium for the tests, once
npm test           # should end with four OK lines
```

## 2. Open the project

```
cd kl-urban-renewal-engine
claude
```

The first run opens a browser window to sign in. `CLAUDE.md` is loaded automatically, so you do not need to run `/init`.

**First prompt:** paste task 0 from `docs/roadmap.md`. Claude runs the tests, sets up git and makes a baseline commit you can always go back to. Then work through the free builds A–C in the roadmap (owner briefing packs, massing check, land-deal tracker); none of them needs paid data.

## 3. How to work with it

- **Plan before big changes.** Press Shift+Tab until the status bar shows plan mode. Claude reads and proposes without editing; you approve the plan, then it edits.
- **Choose how much it asks.** Shift+Tab cycles the permission modes. To approve every action while you learn, start with `claude --permission-mode default`. Running the tests is pre-approved in `.claude/settings.json`.
- **Make it prove the work.** End requests with "then run /check-engine". It runs every test, takes screenshots and looks at them.
- **Get an independent check.** Ask "use the numbers-auditor agent to check the figures". It re-derives key numbers without reusing the engine's code.
- **Keep sessions focused.** Use `/clear` between unrelated tasks and `/compact` when a long session gets slow. `/context` shows what is using the context window, and `/usage` shows your usage.
- **Undo.** `/rewind` (or Esc twice) rolls back to an earlier checkpoint in the session; git keeps the longer history.
- **Thinking harder.** Add `ultrathink` to a prompt for deeper reasoning on one turn, or set `/effort high`. `/model` switches models.
- **Pick up later.** `claude --continue` resumes the last session, and `/resume` lists earlier ones.

## 4. Updating the live engine

The live engine is a private claude.ai artifact. After a change, attach the new `app/index.html` in a Claude chat and ask Claude to republish it to the existing artifact link. You can also simply open the file in any browser.

## 5. Optional extras

- **Browser control for visual checks:** `claude mcp add playwright -- npx -y @playwright/mcp@latest` lets Claude open and click through the page itself.
- **GitHub:** put the folder in a private repository to use Claude Code on the web (claude.ai/code), run the tests in GitHub Actions, or mention `@claude` on pull requests (`/install-github-app`). See roadmap task 10.
- **Run tests after every edit automatically:** add a `PostToolUse` hook (https://code.claude.com/docs/en/hooks-guide). It is left out here because the full suite takes around 20–40 seconds.

## Ground rules (also in CLAUDE.md)

- Residual value must exceed the required owner consideration.
- Every figure keeps its provenance label; assumptions are never shown as official.
- DBKL incentives are scenarios, never the base case.
- Consent is unanimous until a new law passes.
- The Assembly tracker holds unit labels only, never owners' personal data.

Screening model only; not a valuation, legal or investment advice.
