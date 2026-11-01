# V211: interactive learning labs — Codex integration instructions

**Downloadable standalone:** Study_Table_V211_Interactive_Learning_Labs.html. Built from full V210 standalone, not from GitHub main.

## Staged source
- `source/st211-interactive-labs.js`: six fully local labs.
- `source/st211-interactive-labs.css`: responsive, keyboard-friendly UI.
- V210 source is at `source/st210-adaptive-practice.js`; V210 developer handoff `docs/V210_ADAPTIVE_PRACTICE_HANDOFF.md`.
- Full HTML plus rebuild script and browser test harness are in the V211 Codex developer package delivered in ChatGPT.

## Actual new teaching
1. Physics F=ma: mass/force sliders, acceleration/displacement and force arrow.
2. Calculus: secant on x² approaches tangent; x and h sliders, live plotted curve.
3. Piano: audible C4–C5 keyboard; play C–E–G with corrective feedback.
4. Chess: correct 8×8 board; rook/bishop/knight/queen/king moves on otherwise empty board.
5. Medicine: simplified cardiac output from heart rate × stroke volume.
6. Business: contribution, net after fixed costs, and break-even under changed assumptions.

Each has a prediction and corrective explanation; labs award no mastery. Buttons appear inside the course hub and while answering relevant chapter checks; typed answers survive modal open/close.

## Verified, not verified
- Node syntax checks.
- Isolated Chromium Playwright tests for all six subjects, sliders, predictions, chess move squares, piano chord, mobile dialog sizing; no page errors.
- Separate Chromium test with **the actual V210 assessment JS**, confirming an in-progress Physics answer survives a lab roundtrip.
- Byte-for-byte reproducible V211 build using the distributed V210 baseline and the JS/CSS overlay.
- **Full 8.5 MB legacy app has not yet received end-to-end browser regression** in this iteration. Do not misstate the targeted test as full verification.

## Mandatory integration gate
Repository main is still V169. Preserve Spanish V4, previous curricula, backup/import and V210 review progress. Integrate the full V210 standalone baseline and V211 overlay in a canonical source build, then test all navigation, lesson-to-review handoff, keyboard/mobile, offline use, existing progress and Spanish. Do not merge/redeploy the older main over the newer standalone.
