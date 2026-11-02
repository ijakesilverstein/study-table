# Study Table V227 — Original Course and Notes live-store migration

**Canonical complete HTML (user-delivered):** `Study_Table_V227_Curriculum_And_Notes.html`, 8,916,354 bytes, SHA-256 `c93a9a44fe191ee2157c11f39e5ccbdb01872d54c67e7c88421d8ed78adb88d4`.
**Developer package (user-delivered):** `Study_Table_V227_Codex_Developer_Pack.zip`; 177 entries, 16,063,231 bytes; clean ZIP extraction and `python st227_source/build_st227.py` reproduced the exact output SHA/bytes. Includes full pinned V226 HTML, V227 HTML, builder, tests, README, and 151 historical V220 modules.

**On this staging branch:** `source/st227-live-store.js`, `source/st227-live-ui.js`, `source/st227-live.css`. The branch **does not yet include** the complete latest canonical standalone and pinned build. Do not merge old `main` or deploy the overlays alone.

## Migrated live sections: 10 total
Previous 7: chapter checks; learning calendar; 28 guided lessons; 30 deep workshops; diagnostic coaching; embedded Spanish Studio V4; guided lab missions.

**New three, from actual source writer callsites:**
- `studytable_v35_progress`: original course lesson seen/completion flags, book notes and written book recall. Three direct writer calls plus one read are replaced in the canonical built HTML.
- `studytable_v51_notes`: economics reflections. Actual economics Save button is wired to the v5 adapter.
- `studytable_v54_teachback`: teach-back writing. Actual legacy note editor's save handler writes through the v5 adapter.

Legacy records are validated for bounded object depth, key names, specific accepted fields and note sizes. Unrecognized legacy keys stay outside the adapter and are preserved through existing safe backup/archive mechanisms.

## Upgrade / rollback
- V227 schemaVersion 5 uses a **new** `studytable:v227:live:{head,slot-a,slot-b}` prefix. Existing V226 schema-4 checkpoint remains untouched and is validated before opt-in upgrade; disagreement with old mirror requires explicit adoption of current browser records.
- Inactive slot staging+verification → original key compatibility mirror write+verification → head pointer switch. Simulated quota and mirror failures retain old checkpoint and original record. Corrupt head repair uses surviving validated version without overwriting live lessons.
- Restore/Undo and other older writers can modify legacy mirrors; adapter detects external conflict and requires explicit reconciliation before further shared writes.
- V227 checkpoint keys excluded from V221 raw archive and V220 uncovered-key warning to prevent recursive exports.
- The original course completion writers previously swallowed write errors; they now show an explicit visible **NOT saved** warning. Book notes also no longer claim “Saved” after an unsuccessful storage write. Economics and teach-back existing UI error messages remain.
- These are **10 specific migrated systems**, NOT a full replacement for all other historical state keys. Old modules still write elsewhere. Large v224-v227 snapshots could exceed browser quotas; audit on real devices.

## Automated evidence (final V227 standalone)
- `test_st227.py`: activation, 10 supported validators, actual original course lesson completion, notes, portable-bundle coverage, strict malformed-data refusal, external conflict and reconciliation, injected storage failure rollback, visible warning, excluded self-archives, v226→v227 upgrade and simulated new-page reopen, 390px mobile.
- `test_st227_notes_ui.py`: actual economics reflection Save button; actual teach-back Save event handler; resulting v5 checkpoint mirrors; no page errors.
- Re-ran all **30** diagnostic cases and changed-example retries, all **28** earlier guided lessons and calendar, combined backup/Restore/Undo, and 10-subject Progress Center bundle/tamper check against exact V227 HTML; all passed.
- `audit_st227.py`: 83 executable inline JS blocks parse; embedded Spanish iframe JS parses; 182 unique **static** DOM IDs; no external boot script/style tags.
- All tests run Chromium by injecting the full HTML into a page with controlled localStorage; **none proves real `file://` persistence**. Local navigation is blocked in this environment. No Safari/Firefox/device persistence, browser restart, renamed-file retention, piano audio or educational efficacy verified.

## Next release gates
1. Import **complete** V227 developer package to the canonical source branch, not old main; verify build pin/SHAs and test in CI.
2. Run actual local-file and hosted stable-origin tests in Chrome, Safari, Firefox, with browser restart, renamed-file, iframe Spanish, combined backup on a second browser, Restore and Undo. The ZIP contains `st227_source/REAL_BROWSER_RELEASE_GATE.md`.
3. Measure localStorage quota with old v224-v227 slots; consolidate only with migrations and recoverable snapshots.
4. Gradually migrate lesser-used course/notes writers, and return focus to teaching quality/user testing (Spanish conversation, piano, calculus, physics). Avoid adding superficial quiz counts.
5. Deploy only when evidence supports it, without password protection. **V227 has not been deployed.**
