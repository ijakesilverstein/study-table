# V168 — One Idea, Three Ways

**Goal:** An enjoyable, continuous path through Story → Worked lesson → A new problem on *that same concept* → Explain the reasoning. Reconcile the parallel standalone 87-unit Teach It Back prototype with GitHub's real canonical-derived V167 learning-path release.

## Canonical baseline and coverage

V168 starts from the actual **V167 GitHub build** on branch `feature/v167-unified-learning-path` (commit `1743b789cfc9ffd9daa4584ecc4451312898b307`), which includes V136's 87 units, V163 coaching, V164 dialog reliability, V165 Codex stories and verified transfer bank, and V166's *separately developed* real-person Spanish practice. It does **not** use or overwrite the older offline V167 Teach It Back fork. The authored teaching pattern from that parallel work is now ported into the canonical source chain.

Precisely seven of the 215 embedded archive pages change. All **208** other pages and all 87 original unit JSON records remain byte-for-byte unchanged. The top-level curiosity tutor, legacy backup, and canonical production `public/index.html` remain untouched. No Vercel deployment.

## Story-to-practice repairs

The V167 UI sent five stories to a different skill (sometimes disclosed as such), breaking the learning loop. V168 adds **two independently authored, verifiable variants** in each corresponding actual lesson:

- Spanish `spanish-5` — request a slower repeat or ask what `para llevar` means.
- Piano `rests-and-halves` — count the actual duration of a rest and a half-beat at specified tempos.
- Chess `castling` — test crossing-square attacks and prior loss of castling rights.
- Physics `physics-2` — convert gravitational potential energy to speed; retain the square root and units.
- Medicine `test-interpretation` — calculate positive predictive value from prevalence, sensitivity and specificity, with stated population counts.

Existing matching calculus `product-rule` and business `unit-economics` banks remain intact. This yields **26 skill banks, 52 fully authored checked problems**: 42 original Codex variants plus 10 matched variants. Input checking continues to say **unverified** for unrecognized free-form text rather than wrongly claim a verdict. Optional revisit scheduling stays local and is not part of the legacy backup.

## Explain in your own words

All **87 full-course units** gain one initially collapsed Teach it back section after the lesson's actual existing practice. For the original 21 practice-bank units, the author-written V167 reflection is used; for the five new story-matched units, the author-written story explanation is used; for remaining units, the real course exercise question and worked answer are used. A common-mistake panel is sourced directly from that lesson's documented mistake. Previous V167 post-practice reflection panels are replaced, **not duplicated**. A completed checked answer exposes an optional one-click invitation to explain the reasoning. The typed draft lives in the current lesson's DOM only and disappears when you change units. No storage, timers, speech capture, AI claims, scores or mastery judgment.

## Reproduction

```bash
python3 scripts/build.py --check
python3 scripts/build-v163.py
python3 scripts/build-v164.py
python3 scripts/build-v165.py
python3 scripts/build-v166.py
python3 scripts/build-v167.py
python3 scripts/build-v168.py
python3 scripts/build-v168.py --check
python3 qa/check-v168.py
node qa/test-v168-browser.cjs
```

Generated only into `source/Study_Table_V168.html` and `public/study-table-v168.html` for CI artifact collection; production `public/index.html` is not replaced. Preserve all existing PR branches and keep this PR draft until the targeted and inherited suites are green and a real learner has used the experience. Merge order remains deliberate, not blind cherry-picking across conflicting `course-reader.js` patches.

### Still unfinished

This is **not** a conversational AI tutor and cannot reliably assess arbitrary spoken or written explanations. The separate Spanish for Someone V53 source ZIP was not accessible and has **not** been code-merged; V166 reflects verified real-person-practice principles. The right next milestone is real learning-usability sessions and pruning redundant controls based on observed friction, not more simulated mastery features.