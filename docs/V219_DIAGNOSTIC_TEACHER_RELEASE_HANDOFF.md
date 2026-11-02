# V219 Diagnostic Teacher — release and Codex handoff

**Standalone release:** `Study_Table_V219_Teaching_Release_A.html` (built 2026-11-01, 8,812,096 bytes) SHA-256 `ff54a5fa0211ef1061aac117023612cd3faefd9607d97779f192b49a95ec8eb1`. User-facing complete app and developer package were produced from the **full V218 HTML**, not older GitHub main.

## New source on this integration branch
- `source/st219-diagnostic-coach.js`: 30 authored lesson-specific mistake-repair sessions across ten subjects, 60 first/transfer situations, targeted Spanish accent/tense feedback, numeric misconception classification, explanation-choice reasoning, teach-prerequisite/worked-method controls, independent/guided completion, weak-spot prioritization, explicit calendar credit, strict versioned progress schema.
- `source/st219-diagnostic-coach.css`: responsive accessible layout, focus indication, mobile overflow safeguards and calendar/plan shortcuts.
- `source/st219-teacher-combined-backup.js`: V213/V216 path script including V219 `diagnosticCoaching` in validated combined JSON export, import, restore and Undo, backwards compatible with V218 backups.

**Important:** `source/st219-combined-backup.js` on the same branch is a *different concurrent V219 variant* using the separate `studytable:v219:coaching` key. Do **not** load both V219 implementations or assume their schemas are interchangeable. Select one canonical implementation after comparing both, migrate deliberate data where necessary, and regenerate from the full standalone. The shipped release described here uses `studytable:v219:diagnostic-coach`. Do not overwrite users' existing coaching records with another variant.

## Tested release
- 60 expected answers and 30 authored mistake traps were checked with the actual response checker (all passed).
- Chromium DOM flows in Spanish (text), Physics (numeric), History (reasoned choice): wrong answer → specific explanation/prerequisite → correct first response → second distinct problem → completed record.
- Separate modes for assisted and independent completion; weak-spot prioritization; calendar activity only after completing the second problem.
- Full complete-backup export → restore → Undo; invalid record preview rejection; V218-style backup accepted when the V219 field is absent.
- 390px mobile viewport and zero uncaught JavaScript page errors.
- Discovered a **critical regression**: V216/V217 each installed `document.title` MutationObservers that forced different titles. Harmonized both to **V219**; otherwise they continuously mutate the title and can hang the browser. The reproducible build explicitly applies this fix.
- Chrome testing loads the complete standalone using `page.set_content` plus a storage shim. `file://` persistence, other browsers, historic deep curriculum, audio hardware and learning outcomes are **not yet verified**.

## Build and release gates
Reproduce using the ZIP's `build_st219_teacher.py` and complete `Study_Table_V218_Teaching_Coach.html`, then run `test_st219_release_a.py` and check SHA. Keep course/content and existing Spanish Studio V4 intact. The repository's main remains stale; **do not merge/deploy an overlay atop old main and call it V219**. Before merging, reconcile complete HTML into a canonical source tree; test Chrome/Firefox/Safari file-origin storage and cross-subject regression; then deploy without password protection.

Product guidance: prioritize deeper meaningful instruction and real user feedback over adding quiz banks, avoid claiming AI or measured mastery, and teach errors by concept rather than treating clicks as knowledge.