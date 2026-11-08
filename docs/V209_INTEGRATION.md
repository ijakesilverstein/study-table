# Study Table V209 — Codex integration handoff

## Current state
The current standalone downloadable app is **V209** (created 2026-11-01), based on the V205 unified app and V207 chapter-check overlay. GitHub main is still V169. **Do not deploy main as a replacement for V209** without reconciliation.

## What changed since V207/V208
- Fixed V208 HTML composition: backup <style>/<script> was embedded inside the V207 script tag, making it invalid. In V209 these are discrete closed tags.
- Expanded chapter bank from 78 to 156 authored short answers across 39 Piano, Chess, Calculus, Physics, Medicine, and Business chapters. Two new application/transfer questions per chapter.
- Added a plain-language explain-this-chapter disclosure for all 39 chapters.
- Added chapter score review notes listing missed answers and explanations; four independent answers determine mastery.
- Spaced-review schedules: retry tomorrow after mistakes/hints; 3, then 7, then 14 days after independent passes.
- Legacy two-answer review saves remain valid; new records store total and streak.
- Existing V208 backup import now reloads the in-memory chapter state immediately.

## Verification
- Node syntax check passed for the new chapter-check source.
- Playwright + Chromium smoke test exercised the full HTML with 156 questions, four-question Physics practice, first-try scoring, saved progress reload, backwards-compatible validation, review navigation, mistaken-answer handling. 0 page errors in this test.

## Required before merge/deploy
1. Reconcile V209 full HTML into a reproducible GitHub build, *preserving* Spanish V4 and all existing course and lesson content.
2. Keep V169 improvements that demonstrably work; do not overwrite newer V205–V209 features.
3. Extend cross-course regression tests, keyboard/mobile checks and backup roundtrips. Do not assume four short questions prove mastery.
4. Run no-API and offline tests, then deploy the reconciled build only after gates pass.
