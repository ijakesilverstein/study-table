# V224 — Schema-v2 compatibility migration and safe checkpoint ledger

## Canonical deliverables
- **Complete HTML:** `Study_Table_V224_Versioned_Progress.html`, 8,886,961 bytes, SHA-256 `6dd2fd96873d1f9bb792f52dc28afd7c74c6ed2324e4b4b11bc557430252a219`.
- **Source ZIP supplied to user:** `Study_Table_V224_Codex_Developer_Pack.zip`, 181 entries including the complete V223 baseline, complete V224 HTML, pinned builder, all new tests, a full historical V220 **151-module** source snapshot, manual browser release gate and README. Clean ZIP extraction was independently verified to rebuild **byte-identical V224**.
- **Committed overlays on this branch:** `source/st224-versioned-ledger.js`, `source/st224-versioned-ledger.css`. GitHub's older `main` is NOT V224, and the overlays alone are NOT independently deployable.

## Design: what migrated vs not
V224 introduces a version-2 **physical checkpoint ledger** in localStorage with:
- `studytable:v224:ledger:slot-a` and `slot-b`, plus a tiny head pointer at `studytable:v224:ledger:head`.
- Each checkpoint captures the **validated combined course backup** (modern supported records) and separately validated bounded V221 **raw archive** (preserves historical namespaced records that don't yet have safe import schemas). Unknown raw values are archived but never auto-restored.
- Manual migration through **Protect my progress → Migrate my saved progress**. The user must create new checkpoints after learning. Saving writes the **inactive** slot, reads back and validates content/checksum, and only then switches the head pointer. The old slot is retained for rollback. A damaged active slot or pointer can be repaired from a surviving validated slot.
- A guarded build-time patch excludes `studytable:v224:ledger:` keys from the older V221 archive collector, preventing recursive archive growth and quota exhaustion.
- **Checkpoint rollback changes only which snapshot is active.** It intentionally does NOT overwrite live study progress. To restore supported course state, download the validated combined JSON and use the preexisting user-confirmed Restore & Undo interface.
- **Crucial:** This is a **compatibility migration** to one versioned snapshot, not a cutover of the old runtime progress writers. Original curriculum/Spanish/calendar/teaching modules still use their own legacy keys. The new storage is not auto-synced. Further staged source refactoring and migration tests are required for a truly authoritative single write path.
- FNV checksum detects accidental damage, not malicious modifications. Notes can be in the backup; no cloud sync or API.

## Test evidence on the exact V224 HTML (all passed)
1. `st224_source/test_st224.py`: first and second checkpoints, schema validation, live legacy keys preserved, active slot rollback, injected quota failure, corrupted checkpoint refusal, supported and archive-only partial recovery, export actual JSON and validate it with old restore routines, 390px mobile, zero page errors.
2. `st224_source/test_st224_faults.py`: corrupted inactive slot, recover a valid earlier slot after active corruption, interrupted in-progress staging, collector recursion exclusion.
3. `st224_source/test_st224_reopen_simulated.py`: reinitialize full HTML in a **new Chromium page** with a controlled persisted storage shim; saved lesson state and ledger load. **This is NOT true file-origin persistence**.
4. V223 Progress Center, V222 validated archive conversion/restore, V219 all 30 diagnostic misconception→reteach→changed example exercises, V219 combined restore/Undo and V215 all 28 coached lessons + calendar/mobile regression tests.
5. `st224_source/audit_st224.py`: 81 executable JS syntax checks, 179 unique DOM IDs and no external boot assets.
6. Clean ZIP extraction and build produced the exact V224 SHA-256 above.

## Real-browser gate NOT passed in this environment
Chromium navigation to `file://`, `data:`, `http://` and `https://` is blocked here with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore neither actual Chrome local-file persistence nor Safari/Firefox, browser restart, renamed file or cross-device restore was observed. The release package includes `st224_source/REAL_BROWSER_RELEASE_GATE.md` with actionable steps on a real computer. Do not market V224 as cross-browser tested or fully unified.

## Codex integration priorities
1. Bring the **complete V224 ZIP** to a canonical branch rather than merging the older main. Reproduce pinned SHA and run all tests.
2. Execute Chrome, Safari and Firefox persistence and backup/Undo tests on a real device. Prefer a stable origin if local file path origin storage proves inconsistent.
3. Inventory the remaining writers and move each behind a shared validated storage adapter with explicit schema-version migrations and corruption rollback. Use A/B checkpoints to protect legacy progress during migration. Do not auto-import unknown raw archive keys.
4. Preserve teaching-first instruction, Spanish V4, learning calendar, original labs, 28 guided lessons, 30 deep workshops and 30 diagnostic exercises.
5. Deploy to Vercel only after passing those release gates, **without password protection**. There has been NO V224 deployment or merge.
