# V230 — Teaching First release candidate and shipping gate

## Canonical artifacts, user delivered
- `Study_Table_V230_Ship_Candidate.html`: **9,011,732 bytes**, SHA-256 `8c4b3086c88cc35fa6c455500a79faa6e0f2eb3012c86b2f222fca75b99abdb0`.
- `Study_Table_V230_Customer_Pack.zip`: standalone HTML + customer quick start.
- `Study_Table_V230_Developer_Pack.zip`: V229 pinned complete baseline, final V230, reproducible builder, CSS/JS, full targeted tests, static deployment folder, release checklist and seller expectation notes.
- `Study_Table_V230_Deploy_Static.zip`: optional `index.html` + `vercel.json` and hosting guide; NOT deployed.

**IMPORTANT: V230 is a release candidate, NOT yet cleared for charging consumers.** Do not describe customer-installed persistence, real-device audio or browser compatibility as established.

## What materially improved
- Replaced an overwhelming 12+ item dashboard row with **Start here / Learn with a teacher / All subjects / Calendar / My progress / More tools**; original buttons and handlers remain available through More tools.
- Added 10-subject first-run teaching paths and a clear Explain → Watch → Explore → Apply route.
- Added user-initiated **complete portable progress bundle download**, in-app read/write health and combined + legacy archive validation; no fake claims of cloud sync.
- **Fail-closed fix** for both V228 teaching studio and V229 reasoning tutor: previously unreadable/malformed `studytable_v54_teachback` would be silently converted to an empty object and could overwrite notes. New `readStrictNotes` throws on corrupt stored data BEFORE writing, preserving all original bytes. User receives NOT saved warning.
- Commercial offline edition includes `<meta http-equiv=Content-Security-Policy content="connect-src 'none'">`: old online tutoring API calls are blocked; legacy online settings are disabled and described as unavailable. Interactive authored teaching still works without an account/API.
- No new progress database, no removal of older live-save/recovery mechanisms.

## Tests passed on final V230 exact HTML
- `st230_source/test_st230.py`: menu and 10 subject links, downloadable full portable bundle validated by canonical validator, storage health and simulated blocked storage, wrong-shaped/malformed note data NOT overwritten by either teacher, 390px mobile, no uncaught JS errors.
- V229 12 reasoned sessions, 24 situations and 12 saved reflections, missing-concept feedback, transfer, existing store, calendar credit, conflict and reconcile, controlled reopen simulation.
- V228 all 12 interactive teaching sessions: Spanish tense choices, piano notes, calculus graphs, physics models, saved teachback, calendar and backup.
- V219 all 30 diagnostic misconception/reteach/retry cases over ten subjects.
- V215 original 28 guided cases; calendar and old validated backup import/Restore/Undo/malformed-file rejection.
- V223 Progress Center and portable full/partial bundle integrity.
- `st230_source/audit_st230.py`: **86 inline executable JS blocks** parsed in Node, **188 unique static IDs**, no external startup JS/CSS, presence of offline connect restriction and synchronized V230 title.
- Developer ZIP CRC passed and **independently extracted clean-room rebuild produced identical final V230 SHA**.

The tests used **Chromium with injected complete HTML and controlled localStorage**; controlled reopen is NOT a true browser origin test.

## Unresolved, mandatory release blockers
1. Real Chrome, Firefox and Safari local-file origin test: actual save/reload/restart/move/rename and cross-browser validated Restore/Undo. The sandbox Chromium driver returns **`net::ERR_BLOCKED_BY_ADMINISTRATOR` on file://** here, so this was NOT tested.
2. Real keyboard/screen-reader and piano audio/voice checks on representative devices, especially mobile Safari and Firefox.
3. Heavy-data/quota testing with prior v224–v227 redundant checkpoints, notes and old legacy keys.
4. Terms/license/refund/customer support and clear truthful digital listing reviewed before sale; three real-user first-run usability trials.
5. Static hosted release may improve origin persistence; if used, deploy to **one stable URL** (no password protection) then repeat persistence/backup tests. Not published as of this handoff.

## Codex instructions
1. Import the COMPLETE user-delivered V230 developer ZIP to a new canonical branch. GitHub `main` remains old; **do not merge over newer standalone**. The staged files `source/st229-reasoning-tutor.compiled.js`, `source/st229-reasoning-tutor.css`, `source/st230-customer-launch.js`, `source/st230-customer-launch.css` are **additive source only**, not a complete runtime build.
2. Rebuild pinned V229 baseline SHA-256 `4fef0363995b1ef9b69113938e19427c0fca39640a6789ad8af50b0261b7aba0` to V230. The builder deliberately fails on changed source signatures. Preserve the two strict-save patches and the CSP.
3. Run the full ZIP regression suite and real browser release gates in `st230_source/RELEASE_GATE.md`. Do not mark PASS without evidence.
4. Only when release gates pass, ship buyer ZIP and optionally deploy stable-site build on Vercel **without password protection**. Keep consumer expectations truthful: offline authored lessons, not arbitrary AI tutoring or accredited results.
