# Study Table V223 — Unified Progress Center

**Canonical user deliverable:** `Study_Table_V223_Unified_Progress_Center.html` (8,868,755 bytes; SHA-256 `c48150e42a285bf352245ce1ab941ce46a1c3e231c91e205e493296eb3bb36bf`).
**Developer ZIP supplied to user:** `Study_Table_V223_Codex_Developer_Pack.zip`.

## Branch source
- `source/st223-progress-center.js`: read-only façade showing 10 subject progress summaries; exports one portable JSON bundling both validated combined and V221 legacy archives; checks file integrity for accidental changes; validates each section through existing app validators; extracts supported and raw components **without writing any stored progress**. Export failures explicitly label partial bundles.
- `source/st223-progress-center.css`: responsive accessible dialog, desktop/mobile contrast fix.
- The developer ZIP includes V222 full standalone baseline, V223 full standalone, the exact new JS/CSS, SHA-pinned `build_st223.py`, tests, authored diagnostic cases, manifest, and README.
- To build: run `python st223_source/build_st223.py` from the extracted ZIP, with V222 HTML at ZIP root. The script asserts V222 base SHA `cdbb64a91fadfb833c51456a548cc345118e81c94598658d677fa27b0f41c86e`, checks its 9 legacy title watchers, then inserts the V223 JS/CSS. The independently extracted ZIP was verified to rebuild byte-for-byte identical V223 HTML.

## True scope
**V223 consolidates the learner-facing progress *read and export interface***. It does NOT merge all older underlying localStorage keys into a single key, and does NOT import unvalidated legacy records. That unsafe migration is deferred until schema migration and multi-browser tests are ready. The portable JSON contains:
- `payload.combined`: validated existing `study-table-complete` record, restorable via V213 preview + explicit Apply + Undo.
- `payload.archive`: V221 legacy archive, preserving older unrecognized keys. Extraction allows V222's read-only recovery converter; raw archive is never directly written to progress stores.
- `checksum`: **noncryptographic FNV** file-corruption check, NOT authentication.
- `checks`: tells the learner when one export source failed and the bundle is partial.

## QA and caveats
- Targeted headless Chromium: ten-subject progress view, 28 intro+30 deeper lessons totals, exported full/partial JSON, damaged checksum rejected, extract both sections, validate extracted combined through real existing Restore preview, no writes during inspection, 390px responsive layout, no uncaught JS errors.
- Regression headless Chromium on final V223: all 30 diagnostic mistakes→reteach→changed-example; older 28 guided lessons and calendar; combined backup export/restore/Undo including malformed records and blocked-storage rollback.
- Visual inspection caught dark inherited generic `header` styling; corrected to readable, non-wrapping mobile header.
- Clean independent ZIP extraction + rebuild SHA matched V223 byte-for-byte.
- **Still unverified:** real consumer `file://` localStorage across browser restart/file rename/different browser, exhaustive older 8.8MB-app pathways, real learner outcomes. In this environment, local file and localhost navigation are blocked; test suites use Chromium HTML injection with storage shims.

## Codex next steps
1. Import complete **latest** developer ZIP and full V223 source to canonical repository branch, not old `main`; do not merge older main over the new build.
2. Run tests included in package, then **actual** Chrome/Safari/Firefox file-origin persistence test and cross-browser restored-backup test on a real computer.
3. Inventory older active storage writers and implement one versioned progress datastore **incrementally** with explicit migration, rollback, backups, and tests. Preserve Spanish Verb Studio V4, learning calendar, the 30 diagnostic cases, all 58 teacher-led modules, and older combined Restore/Undo.
4. Only after release gates pass, publish the current source to Vercel with no password protection. No deployment has been made.
