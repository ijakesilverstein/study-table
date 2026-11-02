# Study Table V220 — Reliability, modular source, and browser-storage release gates

**Canonical user-delivered HTML:** `Study_Table_V220_Reliable_Learning.html`
**SHA-256:** `2658fb86f2cf1e4f7d0cb61b71ea946de52d5298f87ff844bfb0a312f8e4ce83`
**Full reproducible source:** `Study_Table_V220_Codex_Developer_Pack.zip`, delivered in the ChatGPT conversation. **Import the ZIP into the canonical repository before calling this branch buildable**; the branch currently contains the V220 additive JavaScript/CSS and this handoff, not all 151 legacy module files. No deployment or merge has been performed.

## Critical architecture improvement
- Exact V219 delivered standalone baseline was losslessly split into **151 ordered module bodies** (78 script tags including two non-executable data/text tags and 73 style tags), plus `index.template.html` and `modules.json`.
- Each module and the template has a SHA-256. `st220_source/build.py` checks them and verifies that reconstructing V219 gives **exactly the original SHA-256 `418fd73dafad08d390a3d3ebea3b13c359102068108565acdf4dfea1e94aec51`** before applying V220.
- V220 appends an isolated `source/st220-storage-safety.js` and `source/st220-storage-safety.css`, synchronizes existing title watchers, and produces a portable single-file HTML.
- This is **source modularization, not runtime architectural consolidation**. Original 78 scripts continue running and some legacy duplicate state/storage subsystems remain. Do not mistake it for the final unified datastore.

## Learner-facing addition
- **Storage & backups** entry in the *visible learning portal header*, plus legacy hub/path locations.
- Write/read/cleanup probe for browser localStorage, enumeration of Study Table-owned keys and approximate payload size, serialization check of the existing combined backup, actual user-triggered JSON download, launch existing validated restore+Undo.
- Important: the old combined backup covers the supported course, guided challenges, Spanish Studio, calendar, original teaching room, deep teaching and V219 coaching. **Some older state keys/preferences are NOT covered**. V220 checks and reports uncovered active keys rather than promising a perfect backup.
- Write success does *not* certify persistence across file renames, browser restarts, devices, or browser profiles. No auto-cloud backup or sync.

## Tests (all passed on final V220 HTML)
- Clean ZIP extraction rebuilds **identical V220 SHA-256**; ZIP CRC verified.
- `st220_source/audit.py`: all 151 module hashes and exact baseline restoration, **77 executable JS syntax checks**, no duplicate HTML IDs, no static external script/asset tags, consistent title observers.
- `test_st220_reliability.py`: full ~8.8 MB HTML in headless Chromium, user-visible button, storage write/cleanup, downloaded combined JSON artifact, simulated blocked browser storage, restore/undo entry, 390px responsive dialog, no uncaught page JS errors.
- `test_st220_regress_30_cases.py`: all 30 diagnostic exercises wrong → explanation → changed-situation retry, plus save/validation/mobility.
- `test_st220_regress_backup.py`: combined export/preview/restore/undo; old V218 import; malformed records; simulated failed storage write rollback.
- `test_st220_regress_path.py`: previously difficult chess concept linked from learner plan.
- `test_st220_regress_legacy.py`: earlier 28 lesson coaching cases, Spanish/calculus, calendar, backups, mobile.
- Tests used **injected HTML + controlled localStorage** because Playwright navigation to `file://`, localhost, `data:` and HTTPS is blocked by administrator in this environment. Therefore **true user-browser persistent file storage, Firefox, Safari and real device audio remain unverified**. See `st220_source/REAL_BROWSER_STORAGE_TEST.md` in ZIP. Do not claim these passed.

## Next Codex gate
1. Import the exact ZIP source into a new canonical branch, preserving newer V220 full app. Never merge old `main` into this source without a code/content diff and full regression.
2. Run automated tests in ZIP and manual file-origin persistence across Chrome, Safari and Firefox, same-path reload, renamed file, and export → second-browser restore → Undo.
3. Reduce 78 runtime scripts, consolidate duplicated progress and storage systems only with migration tests and backward-compatible, versioned backups. Avoid arbitrary legacy key import without schema validation.
4. Only then consider deployment (Vercel without password protection). Publishing under one stable HTTPS origin would make storage behavior easier to reason about than downloaded `file://` URLs.
