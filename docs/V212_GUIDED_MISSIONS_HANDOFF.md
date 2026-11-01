# Study Table V212 — guided-mission integration handoff

**Canonical downloadable standalone:** Study_Table_V212_Guided_Learning_Missions.html (Nov 1, 2026); built on the **complete** V211 standalone, not the older GitHub `main`.

## New code staged on this branch
- `source/st212-guided-missions.js` — 18 progressively unlocked, subject-specific guided challenges (3 each for Physics, Calculus, Piano, Chess, Medicine, and Business).
- `source/st212-guided-missions.css` — mobile responsive light/dark panels and contextual feedback.
- Prior overlays: `source/st210-adaptive-practice.js`, `source/st211-interactive-labs.js` and `.css`.

## What learners actually do
- **Physics/Calculus/Medicine/Business:** answer a numerical prediction *before* running the model, then set the sliders to the target scenario and verify. Errors get specific reasoning and, on repeated mistakes, worked calculations.
- **Piano:** play real sequences on the V211 keyboard; exact key presses and order are checked.
- **Chess:** choose the correct piece and destination on the real V211 board.
- Challenges unlock sequentially and save locally. Guided missions are formative, not fake certified mastery.
- Free Explore remains available.
- Guided progress exports/imports separately in `study-table-guided-progress.json`; the existing review backup is **not** represented as containing it. Import validates shape and counts and asks before overwrite.
- Existing V210 review history, Spanish V4 and base lessons stay in the full downloadable HTML.

## Validation performed
- `node --check` on guided source; succeeded.
- Headless Chromium isolated tests: full Physics, Piano and Chess guided paths; Calculus step 1; persistence; export; Free Explore; mobile viewport; zero uncaught errors.
- Backup test: valid import and reject malformed count without clobber, zero uncaught errors.
- Chromium loaded **complete V212 HTML (~8.5 MB)**, confirmed V210/V211/V212 initialized, completed a Medicine challenge, closed and reopened with saved progress, zero uncaught errors.
- Browser-tab edition confirmed V212 despite legacy V199 runtime title overrides.
- Not yet an exhaustive cross-subject, browser, security, keyboard or all-Spanish regression suite.

## Reproducible source and deployment block
The downloadable V212 developer package includes `build_st212.py`, overlays, V211 baseline, and Chromium tests. GitHub main remains **V169** and must not be deployed as though it contained V212. Reconcile full newer base and all overlays in a canonical reproducible repository build; verify the nine-subject course structure, Spanish V4, backups, import/export, offline and mobile before merge or deployment. Do not overwrite the newer downloadable HTML from an older branch.

## Next priority
Integrate guided challenges into the individual lessons, not just lab modals; strengthen conceptual understanding checks and diversified scenarios; unify progress exports without silently breaking older backups.
