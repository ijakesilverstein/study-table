# Study Table V213 — One Learning Path / combined backup

## Canonical downloadable artifact
`Study_Table_V213_One_Learning_Path.html` (November 1, 2026). Built from the complete V212 standalone plus the **new** overlays staged as:
- `source/st213-study-path.js`
- `source/st213-study-path.css`

The full HTML, V212 baseline, `build_st213.py`, `test_st213.py`, `test_st213_restore.py`, and `test_st213_lesson.py` are in the user-delivered V213 Codex developer ZIP.

## Product changes
- **My next 10 minutes:** one beginner-friendly path sequencing lesson, subject-specific guided lab, and chapter check; due chapter reviews take first priority. Links are in the main V35/V36 portal and course hub.
- **Lesson-to-lab:** real full-course reading toolbar has a contextual one-click lab for Physics, Calculus, Piano, Chess, Medicine, and Business. The older viewer event handler swallows normal click in some paths, so the overlay includes keyboard and pointerdown handling, tested in Chromium.
- **Combined progress:** single downloadable JSON includes the existing V124 backup payload (legacy courses, notebook, checks, supported practice), V212 guided progress, **Spanish Verb Studio V4** saved at `spanish-verb-studio-v1`, and the last chosen subject.
- **Preview/restore/undo:** schema validation, bounded guided counts, Spanish V4 safeguards, file-size limit, explicit confirmation, storage-write verification, two-part rollback, same-session Undo. Do not reload until the user has decided whether to Undo.
- Older backup interfaces and original curriculum remain intact. V213 does not pretend to merge every undocumented browser key.

## Test evidence
Node `--check` passed. Full 8.5MB app loaded in Chromium and targeted Playwright scripts passed:
1. New portal path, 3 steps, guided lab launch, JSON download, guided restore/undo, malformed file rejection; 390px layout.
2. Core chapter-check record plus Spanish Studio record roundtrip; undo restores BOTH previous records; invalid Spanish index is rejected.
3. Actual full-course Physics navigation and pointer-opening its contextual lab.
No uncaught JS errors in those flows.

**Testing caveat:** This tool environment blocks `file://` and localhost navigation. Tests load the full HTML under about:blank with a standards-shaped localStorage shim. They do not establish persistent file-origin storage behavior on a consumer browser. End-user offline/file smoke test and exhaustive older lesson regression remain required.

## Mandatory Codex handoff
GitHub `main` is still older than the standalone V213. Do not merge/deploy `main` and call it V213; do not override the newer Spanish Studio. Integrate complete V212 baseline and V213 overlays into a canonical reproducible build. Run cross-subject browser, offline, backup and mobile coverage, then merge and deploy **without password protection**.
