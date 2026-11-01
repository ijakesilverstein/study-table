# Study Table V221 — Progress Protection / reliable local archives

**Canonical downloadable HTML:** `Study_Table_V221_Progress_Protection.html` (8,834,797 bytes).
**SHA-256:** `415a00c3c8571e20d6e5fef0dcb73a61b5e14baa61f632cb86f98cf45b86fa83`.
**Source ZIP:** `Study_Table_V221_Codex_Developer_Pack.zip` delivered alongside the HTML in ChatGPT (172 files, ~15.98 MB, independently extracted and rebuilt).

**Staged files:**
- `source/st221-continuity.js`: additive full legacy archive export, in-browser persistence probe, coverage inventory.
- `source/st221-continuity.css`: accessible responsive panel inside V220 Storage & backups.
- This handoff; **do not assume the GitHub branch is a complete V221 build** until the full source ZIP (V220's 151 modules, template and deterministic builder, plus V221 source and hashes) is imported into the repository.

## Design and safety
The V220 *validated combined backup* remains the **only supported restoration route**. V221 separately exports `study-table-full-local-archive-v221.json`: raw namespaced localStorage values including older keys which the combined backup does not cover. **Raw archives are intentionally NOT importable automatically** because legacy schemas and unsafe files have not been adequately validated for writes.

Archive rules: max 500 app-namespaced keys, 8 MiB/key, 24 MiB aggregated, excludes unrelated keys, temporary probe keys, and names containing token/password/secret/auth/cookie/credential/session/api_key. Includes private study notes, so keep it confidential. It can **still export raw app records if the combined backup fails**, e.g. malformed legacy progress. An archive preserves evidence for schema-specific recovery; it does not grant automatic migration.

The user-triggered **Verify by reloading this page** check writes a random localStorage sentinel and a sessionStorage pending record, requests a reload, compares them on the next boot and cleans both records. A success verifies only same-tab reload, **not** browser restart, renamed file, fresh device/profile, or actual note integrity. Blocked session/local storage must report failure or unavailable. No background or cloud sync.

## Test evidence
- Full 8.83 MB HTML loaded in headless Chromium via browser content injection, all new V221 UI and download controls, actual native archive JSON download, reserved key exclusions, archive validation, emergency archiving on simulated combined-backup failure, simulated sentinel success/failure/blocked storage, and mobile 390px layout. No uncaught JS errors in these flows.
- Re-ran old suites on V221: all 30 diagnostic wrong→reteach→changed-example scenarios; combined backup export/preview/restore/undo including hostile and failed-storage cases; prior difficult-concept plan navigation; 28 original guided cases and Spanish/Calculus/calendar mobile flows. All passed.
- The lossless **151-module V220 baseline audit** passed: 77 executable JS syntax checks, no duplicate HTML IDs, no remote startup assets. V221 adds one JS and one CSS module; `node --check` passed for V221.
- Developer ZIP CRC clean; extracted into a new directory; running its `st221_source/build.py` produced exactly the SHA-256 above and the Playwright test passed. The build is hash-pinned via `st221_source/release-manifest.json`.
- **Real `file://` navigation is blocked by the test environment**, so no real browser-restart/file-rename persistence tests were completed. Do not describe simulated reload checks as true reload verification. Manual release gate in `st221_source/REAL_BROWSER_RELEASE_GATE.md`.

## Next gates for Codex
1. Import and commit the **full** ZIP modular source to a canonical branch; reconcile the newer standalone carefully rather than merging old GitHub `main` over it.
2. Run real `file://` persistence and full offline tests in current Chrome, Safari and Firefox, across restart, rename and second browser; validate combined backup restore+undo on a real device.
3. Design a schema-validated migration path for currently uncovered legacy keys. Until then, preserve both JSON exports and old browser profiles, and **do not call V221 a fully portable backup**.
4. Continue reducing old overlapping runtime scripts and consolidating progress into one schema with explicit migrations, respecting Spanish V4, teaching calendar, labs, and all 30 diagnostic scenarios.
5. Deploy only after release gate (no password protection on Vercel).
