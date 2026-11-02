# V215 — Guided teaching takes priority over quizzes

**Canonical downloadable HTML:** `Study_Table_V215_Taught_Not_Tested.html`, built from the full V214 standalone (not GitHub main).

## Product shift
V214 already introduced 28 authored guided lessons in 10 subjects and a calendar. V215 introduces another **28 subject-specific, worked-with-you examples**, one for each lesson. The learner sees a real situation, reflects on the problem, can ask for a specific hint, follows three explicit reasoning steps, sees a reusable principle and tries to transfer it to a new setting. **No automatic grading in these sessions.**

A new lesson only earns completion credit after its initial guided instruction, coached worked example and deliberate user confirmation. Historical V214 completions still count. V214 records without `coached` import as `false`; new backups include `coached:true` on completed lessons. Review quizzes remain optional.

## Source and reproducibility
- `source/st215-teaching-room.js` replaces the *entire* V214 teaching-room script and includes authored cases.
- `source/st215-teacher.css` supplements the existing V214 teaching-room style.
- The V215 developer package, delivered in ChatGPT, contains the complete V214 HTML baseline, full V215 HTML, 28 authored case JSON, portable `build_st215.py`, and the V215 test script.
- The rebuild produces byte-identical V215 HTML from its baseline + authored cases.

## Tested
Playwright/Chromium, full standalone (~8.7 MB): 28 cases, 10 subjects, specific hint + stepwise reasoning, no early lesson completion, calculus and Spanish lessons, calendar credit, older teaching record compatibility, backup export/restore/undo, malformed imported record rejection, 390px mobile sizing, zero uncaught JS errors in exercised flows. V214 backup and calendar tests were also rerun successfully. No claim of full-browser, all-subject, user-study validation.

## Integration blockers
GitHub `main` is still the old V169-era base; don't deploy or merge that as V215. The branch has additive overlays but still needs the full current standalone baseline integrated into an authoritative reproducible source/build with cross-subject browser tests. Preserve Spanish V4, guided labs, V214 calendar, old backups, Undo and offline no-API behavior.

## Next instruction priority
Broaden depth **within lessons** before writing more quizzes: simple intuition, concrete worked example, guided application, help when stuck, and short optional review. Track learner comprehension honestly; avoid claiming that button clicks prove mastery.