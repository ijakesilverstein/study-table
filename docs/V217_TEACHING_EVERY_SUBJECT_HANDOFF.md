# Study Table V217 — teaching-first coverage across all 10 subjects

**Canonical standalone artifact provided in ChatGPT:** `Study_Table_V217_Teaching_Across_All_Subjects.html` (November 1, 2026). It contains the complete earlier Study Table app plus V217 integration. **Do not deploy the old GitHub main as V217.**

## Source staged on this branch
- `source/st217-deep-teaching-full.js`: **complete replacement** for the V216 `<script id="st216-deep-teaching">` body. Contains 30 lesson records across 10 subjects and all model code, including the original 12 V216 lessons.
- `source/st217-teaching-expansion.css`: **additional CSS** to append after V216 styles, including the chessboard, models, responsive layout and a high-contrast sticky dialog header.
- The downloadable `Study_Table_V217_Codex_Developer_Pack.zip` includes both completed HTML versions (V216 baseline and V217 final), `build_st217.py`, authored extra lesson JSON, independent widget source, CSS, full generated source, and browser tests.

## Why this upgrade matters
The product is oriented around **teaching** rather than increasing quiz counts. Six more subjects now receive three substantial coached workshops each:
1. Medicine: cardiac output, physiological negative feedback, predictive value and prevalence.
2. Economics: opportunity cost, price elasticity and weighted basket inflation.
3. History: source reliability, multiple causation and missing perspectives.
4. Chess: coordinates/movement, knight geometry and illustrative forking tactics on a working 8×8 teaching board.
5. Business: contribution/break-even, customer acquisition payback and conversion estimates.
6. Books: short original passages for close reading, identifying claims/assumptions and analyzing tone.

Each lesson follows intuition → 3 staged explanations → concrete worked example → interactive exploration → application → worked instructor answer → voluntary completion. No fake mastery claims, AI feedback or scores. The interactive chessboard is a movement teaching model, not a chess engine; physiology models aren't clinical tools.

## Backwards compatibility
V217 adds lessons to **the existing V216 state and backup schema**, using `studytable:v216:deep-lessons` rather than creating another progress key. The validation limit grows from 4 to 10 subject groups. Older four-subject V216 saves are accepted; V213/V216 combined backups continue to export/restore/undo deep progress. Calendar records retain one event per finished workshop. Spanish V4, original courses and older quiz and guided-mission features remain.

## Verified tests
- Node syntax validation for the integrated JS.
- Playwright Chromium with complete 8.76MB standalone: all **18 new** lesson flows, all six interaction types, one original Spanish module, mobile width 390, calendar records, combined backup export/restore/undo, legacy record validation, invalid progress rejection. Zero uncaught page errors on exercised flows.
- Existing `test_st215.py` suite rerun against full V217: legacy 28 coached cases, Spanish and calculus flows, calendar, backup/undo and mobile; pass.
- Screenshot inspection caught low-contrast header; fixed in CSS and visual rechecked.
- **Not verified:** exhaustive historical modules, browser-to-browser file-origin persistence, commercial learning efficacy or all device audio support.

## Integrating safely
1. Starting from the **complete V216 standalone** (not old main), replace only its embedded `st216-deep-teaching` script with `source/st217-deep-teaching-full.js`. Add the V217 CSS as `<style id="st217-teaching-expansion">…</style>` before `</body>`. Set edition title to V217. The ZIP's `build_st217.py` does the exact reproducible transformation from the included V216 baseline.
2. Do not overwrite existing Spanish Studio, V215 guided lessons, calendar or progress backups.
3. Run ZIP's `test_st217.py` and `test_st217_legacy_teacher.py`, then add true offline file-origin tests for multiple browsers/devices.
4. Reconcile full current source into canonical GitHub build, only then merge and deploy. Deployment should not have password protection.

**Product next steps:** make all 30 workshops richer across varying difficulty; improve conversational Spanish without misrepresenting speech grading; unify many overlaid sources into one maintainable codebase; run real learner usability tests before claiming $14.99 readiness.