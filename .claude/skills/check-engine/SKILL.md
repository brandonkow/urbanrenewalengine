---
name: check-engine
description: Run the full engine check (formula tests, UI sweep, interaction checks, screenshots) and report what failed. Use before saying any change to app/index.html is done.
---
Check the engine after a change.

1. Run `npm test`. If Playwright reports a missing browser, run `npm run setup` and try again.
2. If a formula check fails, decide whether the change was meant to move that number.
   - Not meant to: fix the code, not the golden value.
   - Meant to: list each golden value that moves (old → new) and why, update `tests/expected.json`, and add an entry to `docs/CHANGELOG.md`.
3. Run `npm run shots` and open every image in `screenshots/`: the desktop views, `incentive_taiping_dark.png` and `board_phone.png`. Fix clipped tables, overlapping text, poor contrast in dark mode and any horizontal scroll at phone width.
4. Report in a few lines: checks passed and failed, numbers that moved (old → new), and anything you could not verify.
