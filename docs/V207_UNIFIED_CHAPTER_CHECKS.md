# Study Table V207 — Unification pass

**Base:** latest normal-chat downloadable V205 (`Study_Table_V205_Unified_Learning_Studio.html`), not the older GitHub V169 homepage.

## New
- 78 individually authored, short-answer checks across **39 chapters**: Piano (7), Chess (8), Calculus (6), Physics (6), Medicine (6), and Business (6).
- Shared, honest first-attempt evidence: if a hint, correction, or shown answer was needed, the attempt is recorded as assisted, not independently correct.
- Cross-course chapter review: assisted or corrected chapters return after one day; 2/2 independent results after three days. A repeat is not a certification.
- A playable mini keyboard in Piano checks; no audio performance scoring claims.
- Books & Reading shortcut in My courses, plus a visible My courses launcher inside the older V35 full-screen home portal.
- Chapter-check records in the existing Study Table portable backup/restore, with schema validation and per-chapter merge according to the user's import conflict choice.
- Preserved the original 215-file content bundle, complete Spanish V4 iframe, original lessons and browser saves without migration or overwriting.

## Current GitHub caution
GitHub `main` remains V169, an older but useful separate workstream. It contains 87 teach-back lessons, 52 checked problems and reliable backup infrastructure. V207 is a downloadable build from V205, not a deploy of V169. **Do not replace the later V205/V207 HTML or deploy a V169 foundation as the new edition.** Reconcile original artifacts on a feature branch with provenance tests.

## How to open
Download the complete V207 HTML and open in a modern browser. Choose **My courses**, pick a non-Spanish subject, then **Check your understanding** under any chapter. The Spanish V4 course, including conjugation and conversation lessons, remains available under Spanish. Books and Reading uses its original reader.

## QA performed
- Full JS syntax verification for new assessment code and updated backup script.
- 78/78 authored correct answer checks, deliberate incorrect-answer, chord-notation, units and article edge cases.
- Headless Chromium functional test using a lean DOM fixture with the real V205 course hub + new V207 scripts: two Physics answers, independent scoring, persistence payload, review navigation and Books shortcut, zero script errors.
- Full 8.5 MB edition tested in headless Chromium: opened V36 home portal, used the new visible My Courses entry, opened Physics chapter 1 and checked an answer with zero page errors. Other archived pages, cross-browser retention and mobile performance still need release testing.

## Further work
- Add more than two novel transfer items to each chapter (especially Physics, Calculus and Chess); test delayed retention and diagnostic repair by misconception.
- Unify Spanish V4 progress into the same backup/review model only after validating its isolated state schema; current Spanish backup remains inside Spanish Studio.
- Test on Safari/iOS, narrow screens, and repeat/restore sessions. Avoid calling the product fully commercially ready based on a single pass.
## GitHub handoff
Draft PR #20: https://github.com/ijakesilverstein/study-table/pull/20. No main-branch mutation or Vercel deployment.
