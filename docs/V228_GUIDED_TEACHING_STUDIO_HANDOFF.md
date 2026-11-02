# V228 — Guided Teaching Studio / Codex handoff

**Canonical complete HTML**: `Study_Table_V228_Teaching_Studio.html`, 8,953,346 bytes, SHA-256 `df8b0b3898ff1fb051dd4e3c3c826728b18ad5ea7c4c12197839730e8bb4ce66`.

**Complete developer archive** delivered in ChatGPT: `Study_Table_V228_Codex_Developer_Pack.zip`, 178 entries, includes exact V227 baseline, V228 standalone, 12 authored lesson records in JSON, modular JS/CSS, hash-pinned builder, tests, 151-module historical V220 source and real-browser release checklist. ZIP CRC passes, independently extracted, rebuilt the final HTML **byte-for-byte**, and passed its syntax audit.

**Source staged in branch**:
- `source/st228-teaching-studio.js` — compiled inlined 12 authored teaching workshops, interaction logic, calendar and teach-back integration.
- `source/st228-teaching-studio.css` — responsive teaching studio, real one-octave piano keyboard and accessible controls.
- This handoff. **The branch is not yet a complete current runnable build**; old GitHub `main` is stale and must not be deployed as V228.

## Teaching changes

Twelve genuinely new worked-teaching sessions, three each:
- Spanish: present habits, completed past vs imperfect, natural future plan. Sentence choice and optional free writing, **not AI-graded conversation**.
- Piano: find C from two-black-key pattern; C-major triad; A-minor triad. Interactive 7-white/5-black note keyboard with WebAudio tones where browser supports it.
- Calculus: x² secant approaching derivative, linear constant slope, right-endpoint Riemann sums. Inline responsive SVG function graph and adjustable interval/rectangle sliders, numeric response.
- Physics: F=ma and net force, gravitational potential energy, constant deceleration braking distance. Adjustable real-number inputs and formula readouts.

Each walkthrough follows **understand → watched worked steps → explore interactive model → apply with hint and explanation → optional teach-back reflection**. No grades, generative AI or unsupported mastery claim. When a learner records their work, it is a self-reported learning activity.

The main portal places **Learn with a teacher** prominently, with alternate entry points in My Next 10 Minutes, calendar, deep lessons and home. Browser-side modal implementation uses safe text nodes for learner content, labels, focus restoration and a mobile responsive layout.

## Progress and portability
**No new progress key or store created.** A completed workshop saves a bounded `{text,savedAt}` entry under the existing `studytable_v54_teachback` key, which is already one of V227's ten validated shared-live managed sections. Calendar events use the existing calendar schema. A failed write shows **NOT saved**, and the calendar is not credited before a successful note save. Older validated combined-backup support and raw archive retention remain unchanged. This upgrade **does not** reduce duplicated v224–v227 snapshots; that requires a separate safe migration/space audit.

## Verified tests
- `st228_source/test_st228.py`: 12 completed four-stage learning sessions, Spanish verb choices, genuine piano keys, calculus SVG models and sliders, physics sliders/formulas; all 12 saved in existing teach-back; calendar contains 12 learning events; full portable raw archive includes reflection records; legacy V227 shared-live activation, conflict refusal, reconciliation; 390px mobile and controlled-storage second-page reopen; no uncaught JS errors.
- V228 versions of prior regressions: all **30** diagnostic coaching cases (wrong → explanation → changed-example success), **28** original coached teaching lessons, combined-backup export/Restore/Undo and bad-file rejection, Progress Center portable bundle with tamper rejection; passed against the full V228 standalone.
- `st228_source/audit_st228.py`: Node syntax for **84** executable JS script blocks, **184** distinct static DOM IDs, no external boot scripts or CSS, correct edition title watchers.
- Clean ZIP extraction + deterministic V228 build yielded identical output bytes and SHA. Real desktop/mobile screenshots were reviewed; piano keyboard was redesigned for mobile to avoid misleading multi-row keys.

## Limits / release gates
Full browser QA uses Chromium's injected HTML and **controlled localStorage**, because this environment blocks actual `file://` and localhost navigation. **Actual Chrome/Safari/Firefox local-file storage after browser restart, rename or moving file, cross-browser Restore/Undo, real-device audio, and learning efficacy are unverified.** The source package includes `st228_source/REAL_BROWSER_RELEASE_GATE.md`.

## Codex next actions
1. Import the **complete V228 ZIP** and exact full baseline into canonical repo; run pinned builder and regression suite. Do not merge older GitHub `main` over it.
2. Run real browser-origin persistence tests on file:// and a stable HTTPS origin; back up before upgrading; test Spanish iframe, notes and shared live save conflicts.
3. Inventory and reduce large duplicated historic checkpoints with a user-confirmed, tested archive-and-prune migration. Do NOT silently remove old slots or raw archives.
4. Continue deepening teaching feedback and conversation, not adding superficial quizzes. Test with actual learners before claiming paid-market readiness.
5. Deploy only after the gates pass; no password protection. **V228 is not deployed or merged**.
