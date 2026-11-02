# V214 Teaching First + Learning Calendar — Codex Integration Handoff

Current canonical downloadable artifact: **Study_Table_V214_Teaching_Calendar.html** (8.6 MB). Built additively on **complete V213 standalone**, not GitHub main.

## Implementation staged on this branch

- `source/st214-study-path.js`: teaching-first daily path, optional quizzes, combined backup with validated calendar and teaching-room records, consistent restore/undo and rollback.
- `source/st214-teaching-room.js` and `.css`: 28 authored teaching-first lessons across 10 subjects, three progressive worked-example steps, extra example, misconceptions, personal note and completion.
- `source/st214-learning-calendar.js` and `.css`: monthly dates, adjustable schedule/subject/day, automatic ten-subject rotation, optional study on rest days, real completed-learning markers, chapter review due markers, launch to guided lesson.
- Full standalone V214, full V213 baseline, `build_st214.py`, teaching-content build script/JSON, and two Playwright test scripts are in the **V214 Codex developer ZIP** delivered in ChatGPT.

## Important pedagogy choice

Do not turn this back into a quiz engine. Teaching sequence should be **explain → show three worked steps → transfer to another example → correct misconception → independent ungraded application**. Chapter checks remain available but optional. Opening a page never counts as completion; explicit acknowledgement after worked examples counts as *lesson completed*, NOT certified mastery. Any future feedback must not claim an AI tutor without an actual engine.

## Tested

Chromium loaded the complete 8.6 MB HTML; tests passed:
- 28 lessons spanning Spanish, Piano, Chess, Calculus, Physics, Medicine, Business, History, Economics and Books.
- Worked examples reveal in sequence; premature completion unavailable; second example/notes; saved completion; accurate calendar marker.
- Month navigation/daily subject plan; teacher from calendar; teaching-first dashboard; responsive 390px.
- Full combined backup/export, preview, restore, Undo, invalid teaching record rejected.
- Simulated failure after writing Spanish Studio during restore **rolls Spanish back** (V213 bug fix).
- No uncaught page errors in tested flows.

## Known limits and critical deployment gate

- Not yet exhaustive testing of legacy lessons, old Spanish V4 exercises, file-origin persistence in every browser, accessibility, or teaching efficacy. Calendar has no notifications or account sync; stored only in browser until JSON export.
- GitHub main still represents **older V169 code**. Do not overwrite the V214 standalone or deploy main claiming V214. Reconcile complete V213/V214 into a reproducible source-tree build, retain all prior content and backups, run comprehensive regression (including offline and file:// persistence), then merge/deploy. No Vercel password gate.
- Prior branch draft PR: https://github.com/ijakesilverstein/study-table/pull/20; not merged.

## Next substantive work

Turn each authored example into more direct manipulation within its own lesson rather than always opening a separate lab. Grow authored lessons from 28 into complete subject ladders. Add beginner diagnostics that teach missing prerequisites, not extra graded quizzes. One source of progress truth across Spanish, calendar, core lessons and reviews.
