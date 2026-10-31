# Study Table V166 — One Learning Journey

October 30, 2026. A source-backed optional HTML preview built from canonical-derived V165 (Codex V136 → reconciled V163/V164/V165). **Not deployed** and not a production index replacement.

## What's better

1. From the first curiosity question, choose a short three-decision story; optional direct entry into the full lesson remains. This is not a forced sequence.
2. Stories lead to the exact relevant full lesson, or to a fresh authored practice problem. The story lesson includes a single next-step prompt, not an additional homepage menu.
3. Three important coverage gaps are closed with 6 *new* authored, checked variants: chess castling rights/attacked crossing squares; physics kinetic energy/speed; medicine base-rate positive predictive value. These augment the original **42** Codex transfer variants (original records preserved exact), totaling **48** variants across **24** skills. No arbitrary natural-language grading.
4. The optional Spanish real-person practice bridge follows the VERIFIED design intent of the separately developed Spanish for Someone **V53**: plan a small conversation, distinguish actual speaking from only preparing or missing the chance, preserve uncertainty, never invent completed conversations. This local bridge is not a claim that the complete V53 app or its source was merged. The 12 business scenarios, 24 turns, 116 verbs and other V53 additions remain in that separate app until its source ZIP can be accessed and reviewed. No simulated real conversation, no grading or saving of this bridge.
5. The learner can still open each course, original 87 units, V136 visual companions, original backups, and authored stories independently.

## Preservation and tests

- Builds from the 7,387,695-byte V165 standalone package; only **7 of 215** archived pages are changed. The other **208** embedded paths are byte-identical.
- All existing 42 authored transfer records are verified unchanged; the six new variant answers and misconceptions are explicit.
- Focus and previous diagnostic question APIs remain available.
- Python Playwright/browser tests: 7 subject journeys + story choices, real course handoff, lesson-to-practice handoff, 320/360/390/768/1280px widths, mistake-specific feedback and two medically grounded numeric examples; zero JS page errors.
- Generator asserts exact insertion anchors; `--check` verifies output parity.
- `source/v166-journey.js` adds no localStorage writes and no external API calls; the separately developed V53 source has not been inspected in this chat.

## Build commands

In a checkout of the canonical GitHub feature branch:

```sh
python3 scripts/build.py --check
python3 scripts/build-v163.py
python3 scripts/build-v164.py
python3 scripts/build-v165.py
python3 scripts/build-v166.py
python3 scripts/build-v166.py --check
python3 qa/check-v166-preservation.py
node qa/test-v166-journey.cjs
```

The current conversation also includes Python Playwright validation scripts for independent local testing. No Vercel deployment should occur without an explicit instruction. Branching PRs #8/#9 and newer reconciled PRs should not be merged blindly due to overlapping source changes.
