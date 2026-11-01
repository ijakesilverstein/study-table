# Study Table V222 — Recovery bridge and Undo repair

**Canonical standalone HTML:** `Study_Table_V222_Archive_Recovery.html`, SHA256 `cdbb64a91fadfb833c51456a548cc345118e81c94598658d677fa27b0f41c86e`. **Delivered developer ZIP:** `Study_Table_V222_Codex_Developer_Pack.zip` (178 entries, extracted and verified to rebuild identical 8,850,134-byte HTML).

## New additive files
- `source/st222-recovery.js` — read-only converter for V221 `study-table-local-archive` files. Strictly validates modern course/Spanish/teacher/calendar/coaching records through existing canonical validators; tests older curriculum records via `window.studyTableBackup.prepare` without applying changes. Unknown, unsafe or invalid data is omitted and explained in the preview. Downloads converted `study-table-complete` JSON; users MUST separately open validated Restore and explicitly confirm, with Undo.
- `source/st222-recovery.css` — responsive modal and archive inventory.

The full ZIP additionally contains the exact V221 HTML and its 151-module modular source tree, deterministic V222 builder, integrated HTML, all regression tests and the manual browser release gate. The staged overlay files are NOT an independently runnable V222 app on older `main`.

## Required backward-compatibility patches (applied in ZIP builder)
1. In the existing V213 combined restore, move the saved `undo.after` snapshot from *before* to *after* the app's own `StudyTableChapterChecks.reload()`, `StudyTableCalendar.reload()`, `StudyTableTeacher.reload()`, `StudyTableDeepLessons.reload()` and `StudyTableCoaching.reload()` callbacks. Reloads may normalize the just-written records; comparing the pre-normalization snapshot incorrectly rejects immediate Undo. Do not remove the existing guard against later user changes.
2. In V213 combined `preview`, allow a backup with **no original core records and no guided progress** when at least one independently validated newer section exists: `spanishStudio`, `calendar`, `teaching`, `deepTeaching` or `coaching`. Keep all subsequent strict per-section validation and the confirmation gate.

The ZIP builder applies *exact* source-string patches and fails if an expected block has changed. It pins the SHA256 of V221 baseline `415a00c3c8571e20d6e5fef0dcb73a61b5e14baa61f632cb86f98cf45b86fa83`.

## Data safety
- No browser storage writes during archive inspection/conversion.
- Recovery file carries compatible archive records plus already-valid current records. **Conflicting records may be overwritten on confirmed restore.** Warn the user to save a new combined backup first.
- Corrupt current core backup is not copied blindly. Converter salvages other individually validated modern records before adding archive sections, so an unrelated corrupt legacy record does not erase existing guided progress during Spanish-only recovery.
- Unsupported legacy records remain in the original V221 emergency archive. Conversion is not 100% restoration and is not a unified storage model.
- Entire app remains offline/no-API.

## Test evidence
- `test_st222.py`: full standalone in Chromium; 7-field mixed archive with safe, invalid and unknown keys; no changes during conversion; UI preview of inclusions/exclusions; actual recovery JSON download; original + modern progress applied and Undo restored previous keys; prohibited archive rejection; corrupted original core fallback; new advanced-only restore preview; 390px mobile; zero uncaught page errors.
- Re-ran all 30 diagnostic cases, older 28 taught lessons, calendar, subject recovery navigation, V219 combined backup/undo, blocked-storage rollback, and V221 archival/sentinel checks; all passed in injected Chromium.
- ZIP CRC passed, independent ZIP extraction rebuild produced exact 8,850,134-byte artifact and SHA above.
- **Not verified:** actual browser `file://` persistence/restart/rename, Safari/Firefox, all historical lesson routes, real-device piano audio, independent usability or commercial readiness. In this execution environment, direct file and localhost navigation are blocked by administrator; browser tests inject HTML and a storage shim. See `st221_source/REAL_BROWSER_RELEASE_GATE.md`.

## Codex integration gates
Import the complete 151-module source and current V222 into a canonical repository branch before merging or deploying. The old GitHub main is NOT V222. Verify this entire regression suite and real browser origin persistence. Then consolidate overlapping progress writers into a schema-versioned store with explicit migrations. Do not password-protect any eventual Vercel deployment.
