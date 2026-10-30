# Study Table V165 — Authored Stories + Real Practice

**Purpose:** consolidate the best educational experiences without continuing to inflate the home screen.

## What is integrated

- Baseline: canonical Codex V136 (main commit `4be2c616`) plus source-backed V163 curiosity and V164 reliability improvements.
- 42 independently authored transfer questions spanning 21 skills, three per course, drawn unchanged from Codex PR #8. Numeric answers receive exact or bounded comparisons; short responses have constrained accepted forms. Wrong-turn feedback is authored; unrecognized wording is *unverified*, not incorrectly marked wrong.
- 7 optional branching three-decision stories, 63 authored choice consequences, drawn unchanged from Codex PR #9.
- They are now inside the *real course reader*. A practice item appears in its exact lesson; an optional review list and a collapsed story entry appear on the course map. The main landing page stays simple.
- Reading, progress, course notes, visual examples and prior offline content are retained. Reviews are **opt-in**, stored in the browser and not part of the legacy progress backup; stories themselves do not save results.

## Why this is a reconciliation rather than yet another unrelated standalone fork

`scripts/build-v165.py` takes the optional V164 build produced from canonical V136 and modifies precisely **7 pages of its 215-page compressed archive**. The other **208 entries stay identical**. It injects the original authored bank, story data and JavaScript into the original course runtime, preserving its lesson IDs, goals, examples, progress record formats and export. `qa/check-v165-archive.py` explicitly proves what changed and what did not. There are no remote AI calls or invented assessments.

These features were **ported from** Codex PRs #8 and #9; those branches remain open/unmerged and are not automatically reconciled by Git. Merge plans should account for file overlap (especially source course-reader and backup handling) and not duplicate these features. Never delete or force-push their histories.

## Reproduce

```sh
python3 scripts/build.py --check
python3 scripts/build-v163.py
python3 scripts/build-v164.py
python3 scripts/build-v165.py
python3 scripts/build-v165.py --check
python3 qa/check-v165-archive.py
node qa/test-v165-interactions.cjs
```

Output: `public/study-table-v165.html`. The dedicated workflow generates an artifact; no change is made to the production `index.html` and nothing is deployed to Vercel.

## Remaining validation gates

Run full inherited `npm test` against the existing production source and review CI results for this branch, not merely an earlier green commit. Check real learning experience with a human, specifically whether stories are discovered without crowding the interface and whether transfers improve understanding. Improve backup inclusion of optional review records in a later, carefully tested portability pass rather than risk a regression to existing data.