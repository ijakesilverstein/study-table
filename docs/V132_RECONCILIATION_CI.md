# V132 reconciliation and CI repair

This branch starts from canonical `main` at `2402e211dd74`, retaining Codex's 87 full lessons, eight specifically authored tutoring scenarios, 51 authored teacher turns, progress backup, keyboard/audio behavior and local-only dictation. Earlier V130 and V131 draft PRs were closed as superseded because their content was integrated into V132 through actual merge commits; no lesson content was removed.

## What failed

The prior hosted `npm test` timed out at the legacy Continue-reading test. On an independently run GitHub Actions regression and during the full regression, both legacy bookmark migrations worked: piano `performance` to `read-melody`, and chess `threats` to `chess-1`. The diagnostic records the local reading place, selected Continue label and actual frame title, to help distinguish intermittent navigation races from a broken migration.

The next hosted failure was repeatable: the calculus `product-rule` reader had document width 350px at a 320px viewport. Element diagnostics isolated an SVG inside `.v114-alternative .v114-figure .quantity-figure`, with computed `min-width:440px`; it was meant to scroll inside an optional reference but enlarged the page instead. The source fix constrains the optional reference and its local scrolling area at phone widths, without shrinking the SVG or altering teaching content.

## Generated release parity

Study Table is distributed as a bundled single HTML file, so source CSS alone is insufficient. The generated `public/index.html` and `public/study-table-v132.html` were rebuilt deterministically from current source and committed at `f3f3b72f21b2`. The temporary build-commit workflow was then removed and read-only GitHub Actions permissions restored. The continuing source check is `python3 scripts/build.py --check`.

## Merge standard

A successful isolated test is not equivalent to a passing full suite. Require the narrow-screen lesson test, all 87 unit tests, preservation checks, accessibility tests and downloadable HTML/ZIP packaging to finish successfully before merge or Vercel deployment. No change to assessment, learner data, scoring or password protection is included.