# Study Table V167 — One Learning Path, Seven Real Courses

**Purpose:** Replace disconnected discovery with an obvious, curiosity-first path through material already authored. This is the next step in the five-sprint experience plan (not a new content expansion).

## What is genuinely improved

- Each of the seven full courses starts with one **subject-authored, question-led card**. It offers three choices in plain language: **see what happens** (one of Codex's seven story scenarios), **understand why** (an existing full worked lesson), and **try a new problem** (one of Codex's verified V133 transfer variants).
- The old curiosity/transfer menus and full story remain accessible under **More ways to explore** rather than competing for top-of-screen attention.
- Every story ending offers a direct route to a checked exercise in the same course. When the topic is distinct (especially medicine and physics), the UI explicitly says it is **another skill**, not the identical tested concept.
- The selected story-linked lesson offers a natural next step. All 21 lessons with authored transfer tasks now include a **subject-specific self-explanation question and authored example explanation** shown only **after** an actual checkable submission. Text is **not automatically scored, stored, or counted as mastery**.
- The standalone shell's successful curiosity session can now send a learner to the new course path, in addition to its existing direct-lesson button.
- The latest **Spanish V166 real-conversation practice** remains in the Spanish map (8 scenes, 24 speaking turns, honest self-report journal). This is a new implementation influenced by Spanish for Someone V53 design, not a verbatim port of an inaccessible V53 source file.

## Preservation and scope

V167 is built from canonical-derived V166 (the V136 source plus the optional V163–V166 improvements). The 215 embedded offline pages are preserved; **exactly seven course pages change and 208 archived pages remain byte-for-byte identical**. The original V136 visual companions, legacy practice, V133 checked-answer logic and opt-in reminders, V134 story script, V166 journal rules, and prior backup dialogs remain. The production `public/index.html` is unchanged. No external AI scoring, audio recording, automatic streaks, or Vercel deployment.

## Verification

Run in sequence:

```bash
python3 scripts/build.py --check
python3 scripts/build-v163.py
python3 scripts/build-v164.py
python3 scripts/build-v165.py
python3 scripts/build-v166.py
python3 scripts/build-v167.py
python3 scripts/build-v167.py --check
python3 qa/check-v167.py
node qa/test-v167.cjs
```

`qa/test-v167.cjs` exercises story -> three consequences -> checked problem -> ungraded explanation -> linked lesson across all seven subjects; verifies the preserved Spanish V166 route and mobile widths. Local Playwright checks also exercised the curiosity-dialog handoff from home and showed no JavaScript exceptions. The dedicated preview workflow uploads the reproducible HTML artifact; full inherited `npm test` remains a separate merge gate.

## Honest limitations

- Only **21 of 87** full-course units have the special V133 checked transfer bank. Other units still have their own worked explanations and practice, but must not be presented as having verified V133 transfer.
- V166 keeps its own Spanish journal export; do not imply it is included in the existing general progress backup.
- Subject-specific explanation prompts invite reflection but **do not verify free-form understanding**.
- Real learner interviews and voluntary repeat use are still needed before calling the experience excellent.
- This integration branch is based on draft PRs #12 → #13 → #14 and V166; all must be reconciled into canonical source before replacing the public homepage. Don't merge duplicate Codex #8/#9 changes blindly.