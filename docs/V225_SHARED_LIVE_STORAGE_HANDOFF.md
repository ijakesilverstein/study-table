# Study Table V225 — Shared Live Progress Migration / Codex handoff

## Verified canonical outputs
- **Complete user-downloadable app:** `Study_Table_V225_Unified_Live_Progress.html`; 8,907,773 bytes; SHA-256 **`eaf277dbb5a27ee2c3ff05c0d6f5e1b762349e6fd7e834e44cedb4185d4e8855`**.
- **Reproducible package:** `Study_Table_V225_Codex_Developer_Pack.zip`, delivered in ChatGPT. Its full V224 HTML, exact V225 standalone, build script, source files, tests, historical 151-module source, manifest and real-browser release checklist were extracted to a clean directory and rebuilt **byte-identically** with all source hashes checked.
- **Source staged in this branch:** `source/st225-live-store.js`, `source/st225-live-ui.js`, `source/st225-live.css`. **These are only incremental source modules, not a complete deployable GitHub build.** GitHub main is older and must not be called V225.

## Real migration, not just a checkpoint viewer
V224's dual-slot version-2 ledger required **manual** checkpoints. V225 introduces an **opt-in live schema-v3 write adapter** for **five actual existing lesson modules**, replacing their `localStorage.getItem(KEY)` and `localStorage.setItem(KEY,...)` calls with `window.StudyTableLiveStore.read/write`:
1. `st210-chapter-checks` → `studytable:v207:chapter-checks`
2. `st214-learning-calendar` → `studytable:v214:learning-calendar` (also its generic `json(key)` loader)
3. `st214-teaching-room` → `studytable:v214:teaching-room`
4. `st216-deep-teaching` → `studytable:v216:deep-lessons`
5. `st219-coached-feedback` → `studytable:v219:coaching`

The `st225-live-store` script **must be loaded before** the earliest existing targeted module, `st210-chapter-checks`. The UI and CSS append at the end. The ZIP's pinned `st225_source/build_st225.py` handles exact transformation and refuses unexpected V224 baseline or changed source signatures. Set all 11 older title watchers to V225; do not append competing title watchers.

### Atomic save / rollback
- Persistent `studytable:v225:live:head`, `slot-a`, `slot-b` store strictly validated records. Every successful save updates the inactive slot, reads back and validates it, writes the original legacy key as a compatibility mirror, then flips the active head pointer. Before a successful commit, quota, mirror or head errors restore the old mirror and staging slot. Previous revision remains available for export.
- Validates each managed record against the existing module's validator. Rejects unknown keys, oversized records, damaged JSON/checksums.
- **Explicit activation** (via **Unified live saves**). Before activation, each module still uses legacy keys. Migration captures only already-validated data. No automatic data overwrite.
- If an old Restore, another module, or a manual storage edit changes any mirror, the adapter detects a conflict, uses the current legacy record for reading, and blocks further shared writes until the user explicitly reconciles. After successful Undo, the conflict can disappear naturally. Reconciliation validates all five current values and creates a new revision; old revision remains in the alternate slot.
- A damaged active pointer can recover from a valid staged checkpoint, **without automatically changing live lesson values**.
- Previous V221 raw archive collector excludes new `studytable:v225:live:` internal keys **and** V224 checkpoint keys, preventing nested archive growth. The old backup coverage diagnostic also excludes these internal snapshots to avoid mistaking them for missing user study data. Legacy mirror keys still go into validated combined backup.

### Still intentionally not migrated
Spanish Verb Studio V4, guided mission labs, old curriculum, old notebook/preferences and many legacy writers still use their original keys and original backup routes. The v3 live-store snapshot is **not directly importable** by old Restore; use the current validated combined JSON + Restore/Undo for portability. Checkpoints are not cryptographically authenticated; browser quota and origin problems remain possible. This is a staged **five-module live write cutover**, not a full single-key app rewrite.

## Tests completed against final V225 HTML
- `st225_source/test_st225_live.py`: actual teaching-room completion + calendar event through live write adapter; automatic chapter/calendar/teaching records; explicit activation; conflict on direct legacy change; explicit reconciliation; failed staged write, failed legacy mirror; retained active slot; actual snapshot download; pointer recovery; mobile 390px; no uncaught page errors.
- `st225_source/test_st225_restore.py`: active schema-v3 store + existing validated Restore → conflict → Undo → healthy store; no uncaught errors.
- `st225_source/test_st225_reopen_simulated.py`: second Chromium page receiving controlled persisted localStorage map; state loads, subsequent deletion detected as conflict. **Not actual file-origin persistence.**
- `st225_source/regress225_*`: all 30 diagnostic misconception/reteach/changed-example flows; old 28 coached lessons; calendar; archive recovery; combined backup/Undo; progress-center export and tamper rejection. Passed against V225 during the build. A later combined rerun hit execution time limit on the final progress-center batch; do not count that incomplete run as independent evidence.
- `st225_source/audit_st225.py`: **83** executable JavaScript blocks syntax checked, **182** unique static HTML IDs, five actual module writer rewrites, no external startup script/style assets, exact reproducible build.
- Clean extracted ZIP rebuilt identical SHA-256 V225 HTML and verified its manifest.

## NOT verified / release gate
Direct browser navigation to `file://`, `http://` and `https://` in the execution environment returns `ERR_BLOCKED_BY_ADMINISTRATOR`, even with Playwright response interception. True local-file persistence across restart/rename, Safari/Firefox, and full real-device audio/accessibility are **not tested**. See `st225_source/REAL_BROWSER_RELEASE_GATE.md` in the ZIP; record actual results before selling or deploying.

## Next Codex actions
1. Import the exact complete V225 ZIP into a **canonical source branch**. Do not merge old GitHub `main` over V225. Run builder + all tests.
2. Complete real Chrome/Safari/Firefox `file://` test, along with HTTPS-origin persistence and backup → restore → Undo.
3. Migrate **Spanish V4, guided missions and remaining legacy progress** gradually using the same validated adapter plus versioned migration tests. Do not patch all 78 legacy scripts in one untested rewrite.
4. Audit localStorage quota for the redundant v2 and v3 snapshots; consolidate only after migration fidelity and rollback are confirmed.
5. Deploy to Vercel after release gates, with **no password protection**. No V225 deployment/merge has occurred.
