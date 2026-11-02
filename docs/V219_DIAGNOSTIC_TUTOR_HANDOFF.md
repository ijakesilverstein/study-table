# Study Table V219 — Diagnostic Tutor handoff

**Canonical downloadable artifact:** `Study_Table_V219_Diagnostic_Tutor.html` (8,810,013 bytes; SHA-256 `418fd73dafad08d390a3d3ebea3b13c359102068108565acdf4dfea1e94aec51`).

This source is staged on branch `feature/v207-unified-chapter-checks`. It is **not deployed**. GitHub `main` has an older app baseline; never deploy the older main and claim it includes V219.

## Stage files
- `source/st219-diagnostic-tutor.js`: **compiled and self-contained** tutor script with all 30 cases and 60 authored prompts across 10 subjects.
- `source/st219-diagnostic-tutor.css`: teaching response styles, keyboard focus and mobile layout.
- `source/st219-combined-backup.js`: **replacement** script for `<script id="st213-study-path">` (V213 combined backup); now includes optional `coaching` record, strict validation before importing, restore+undo, older-backup compatibility.

The developer package delivered to the user also includes the full canonical V218 baseline, V219 standalone, authored cases JSON, source placeholders, reproducible `build_st219.py`, and browser tests. The builder aligns three older title watchers to V219; appending a competing title watcher causes infinite title oscillation.

## What was built
- 30 exercises × two situations; users get a specific misconception explanation, prerequisite refresher, worked solution on request and a *different* retry example.
- Numeric, short Spanish text and multiple-choice modes, without quiz scores or false mastery.
- Check user answers with bounded rule-based comparison only; no network/API, automatic speech grading, or arbitrary prose understanding.
- Stores only counts, hints, changed-example success and needs-review flags at `studytable:v219:coaching` (not raw answers).
- `My next 10 minutes` adds a **revisit a difficult idea** button if saved evidence indicates a topic needs review.
- Existing 28 original coached lessons, 30 deeper teaching workshops, Spanish V4, calendar, quizzes and labs remain intact.

## Test evidence
- `test_st219.py`: full HTML in Chromium, **all 30** cases wrong → specific reteach → shown answer → correct changed scenario; Spanish missing-accent explanation; persistence; no false lesson-completion; mobile; state validation; no uncaught errors.
- `test_st219_backup.py`: combined backup JSON download, restore, undo, old V218 import without deleting V219 work, malformed record rejection, storage write failure rollback; pass.
- `test_st219_path.py`: difficult concept in Chess routes to **exact** prior lesson; pass.
- `test_st219_legacy.py`: earlier 28 coached lessons and calendar/backup tests; pass.
- `node --check` for the compiled scripts; pass.
- **Not tested:** broad browser/file-origin persistence on consumer hardware; exhaustive old 8.8 MB app pathways; actual learning outcomes and accessibility certification.

## Next priorities
1. Canonical, maintainable build: consolidate the sprawling legacy overlays without regressing Spanish V4 or progress saves.
2. Test actual offline `file://` persistence in Safari/Chrome/Firefox and after moved files; publish clear backup guidance.
3. Improve answer diagnosis where free-form reasoning is required without pretending string-matching is conversational AI.
4. Real user research and iterative lesson depth before selling at $14.99.

Keep this branch as **source staging only** until the integrated full build passes release gates. No password protection on a later Vercel deployment.