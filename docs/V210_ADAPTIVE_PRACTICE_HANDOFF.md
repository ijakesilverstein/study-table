# Study Table V210 — Adaptive Practice integration handoff

**Canonical downloadable HTML:** Study_Table_V210_Adaptive_Practice.html (Nov 1, 2026). The local source overlay is Study_Table_V210_Chapter_Checks.js, generated reproducibly by build_st210.py from V209. This document is a handoff, **not** a claim that V210 is on GitHub main or deployed.

## Changes after V209

- 39 new, authored, scenario-based transfer questions, one in every Piano, Chess, Calculus, Physics, Medicine, and Business chapter: now 195 question bank items.
- First assessment still uses four V209 questions. Starting with attempt two, the engine rotates four of five prompts per chapter to reduce repetition-based false mastery.
- Wrong answers show the student's typed response, a concrete step hint, and (on a second miss) the chapter's rule. Assisted vs independent is maintained.
- The Chapter Reviews page has a Start Next step, browse-all 39 chapters by subject, and last-subject continuity; due reviews remain prioritized across subjects.
- Preserves V205/209 core curriculum, Spanish V4, the standalone offline file, and the V209 progress JSON format.

## Test evidence

Chromium/Playwright exercised bank loading (195 items), chapter chooser, wrong answer guidance, first attempt 3/4, save, repeat with the new physics scenario, independent pass 4/4, review scheduling, backup compatibility, a mobile-sized viewport, and JS page errors. Result: **zero uncaught page errors** in those flows. Node syntax checks passed. This is a limited smoke test, not a full cross-subject audit.

## Next integration gate for Codex

GitHub main remains behind the downloadable V210. Don't merge the V207-only overlay over newer standalone features. Reconstruct the V205–V210 standalone in a reproducible source tree, then run end-to-end tests for Spanish, all six assessed subjects, Books, Physics/Calculus, import/export and offline mode. Address score validity (four questions are formative checks, not certification) and add more novel question variants.
