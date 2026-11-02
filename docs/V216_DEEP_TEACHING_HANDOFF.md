# Study Table V216 — Deep teaching integration handoff

**User-delivered standalone:** `Study_Table_V216_Deep_Teaching.html` (8,718,832 bytes, built 2026-11-01). This is a V215 *complete* app plus focused new overlays. It is **not** the current GitHub `main` or a deployed application.

## New source committed to this branch
- `source/st216-deep-teaching.js` — 12 fully authored teacher-led lessons, a live 18-verb Spanish conjugator (five time frames × six pronouns), two Spanish dialogue examples per Spanish module, a playable piano keyboard and tap pulse, calculus SVG graphing, and live physics models.
- `source/st216-deep-teaching.css` — responsive, keyboard-visible, light/dark-aware layout.
- `source/st216-combined-backup.js` — replaces the V213-path backup script in the integrated standalone so a validated `deepTeaching` record exports, previews, restores, and can be undone. Backups without the new field preserve existing V216 records.

The full reproducible build, authored-content JSON, test scripts, V215 baseline and exact finished HTML are in the `Study_Table_V216_Codex_Developer_Pack.zip` shared with the user. The GitHub overlays alone are **not** a runnable authoritative production build.

## Learning design
Three deeper modules per subject: Spanish (present habits; preterite vs imperfect narrative; natural future plans); Piano (keyboard landmarks; beat/rhythm; major/minor triads); Calculus (secant to tangent; derivative as rate; Riemann sums); Physics (speed vs acceleration; F=ma; gravitational potential energy). Each module: intuition, three staged demonstrations, a worked comparison, misconception, real interactive experiment, transfer problem, model explanation, optional personal note. An interaction and reviewed worked example precede self-reported completion. No automatic mastery scores.

New calendar link and teacher-room link launch deeper subject lessons. Calendar events are recorded once on actual self-reported completion. Legacy 10-subject teaching, Spanish V4, labs, review checks and older backup features remain intact.

## Validation / limitations
- Node syntax validation passed.
- Targeted Chromium/Playwright: full 8.7 MB standalone initializes older modules + new one; all 12 deeper lesson flows, controls, 19 representative Spanish conjugations, studio completion/calendar, mobile 390 px; no uncaught errors in these tested flows.
- Combined backup: save → restore → undo, legacy V214/V215 backups, malformed deep-teaching record rejection, still keeping existing original records.
- Separate V215 regression suite rerun against **V216** and passed.
- Calendar-to-studio and teacher-room-to-studio paths verified.
- Zip's build script reproduces exact standalone file SHA-256 `989ff54b0b163359c34d75830b85db5989c4a6539cb388297923d13512c20eb6`.
- **Not established:** exhaustive historical curriculum testing; storage persistence in `file://` or another browser; real-device piano audio, speech synthesis across browsers; independent educational outcomes. Testing loads full HTML under Playwright with a storage shim.

## Codex next actions
1. Reconcile the **complete** V215/V216 standalone into a single reproducible canonical GitHub source tree. Never override V216 with GitHub's older V169-era `main`.
2. Run true offline/file-origin and browser regression, including backup/restoration across 2 browsers and actual devices, especially keyboard and audio.
3. Deepen remaining subjects using the same instructional scaffold; avoid converting learning into more quizzes.
4. Improve Spanish conversation as a genuine natural back-and-forth exercise with transparent, non-AI limitations; improve dynamic diagnosis for Calculus/Physics.
5. Merge only when release gates pass, deploy with no password protection.
