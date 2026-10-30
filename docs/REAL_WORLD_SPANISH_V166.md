# Study Table V166 — connect Spanish practice to a real person

**Source baseline:** canonical V136 + draft PR #12 (reconciled coaching) + draft PR #13 (dialog stability) + draft PR #14 (authored stories and transfer) through `5b53b6ab11384407e20f23f54f7d13884a59dfaa`. No production URL is changed.

## Why this change

The concurrent **Spanish for Someone V53** project advanced a real-person loop: prepare what to say, attempt an actual conversation, report the outcome honestly, and return with a specific next improvement. It also strengthened handling of same-day timing, corrections, uncertain results and after-the-fact accounts. **The actual V53 source artifact was not accessible here, so this is a new, separately authored implementation using those product principles, not an import of V53's binary, 116-verb curriculum, business-practice HTML or its full tests.**

## What is implemented

- **Eight authored situations / 24 turns**: café order, introduction, market purchase, directions, appointment, neighbor conversation, restaurant correction, and making plans. Each turn has an actual Spanish line, optional browser text-to-speech, a revealable meaning, two natural options with specific reasons, a useful repair and an ungraded scratchpad. Correct-looking options are distributed evenly across both button positions, avoiding the "always click first" shortcut.
- **One real-person plan:** after three turns, the learner chooses later today, tomorrow, or uncertain timing. Saving only saves preparation; it does not imply an actual conversation occurred. It does not trigger notifications.
- **Self-report and correction:** learners report actual real Spanish use, trying but struggling, or no opportunity; with the calendar day, whether practice preceded the attempt, and an optional short reflection. The app stores the reported absolute calendar day, so a "today" report does not drift to another date after reload. A correction updates the record rather than inventing a second attempt.
- **Evidence boundaries:** an uncertain date, unknown ordering, unexpected day, or after-the-fact report is not counted as prepared use. Even a correctly ordered account is displayed only as **self-reported, not independently verified**. No live speech is recorded, transcribed, or scored.
- **Local journal and real export:** the last 25 planned/reported moments are stored only on the current device. A real JSON download exports them; the current Study Table backup does **not** include this separate record. The app says so. A user can clear the journal.
- **A coherent route:** the Spanish branching story ends with "Plan a real conversation"; the café lesson offers a bridge back to the plan. The original Spanish course's 15 authored teaching units, V133 verified transfer practice, V134 story, and V136 interactive worked examples remain present.

## Source and preservation

- `source/spanish-real-v166.json` — 8 original authored situations / 24 turns
- `source/spanish-real-v166.js` and `.css` — isolated offline reader component
- `scripts/build-v166.py` — optional deterministic build from `source/Study_Table_V165.html`
- `qa/check-spanish-v166.py` — verifies that **214 of 215** archive entries are exactly unchanged (the Spanish full-course reader is the only changed entry) and verifies authored data invariants
- `qa/test-spanish-v166.cjs` — browser checks every turn and both option paths, reported timing/correction, after-the-fact exclusion, export, story-to-plan route, existing transfer practice, V136 visual worked example, and 320/360/390/768/1280px overflow

```sh
python3 scripts/build.py --check
python3 scripts/build-v163.py
python3 scripts/build-v164.py
python3 scripts/build-v165.py
python3 scripts/build-v166.py
python3 scripts/build-v166.py --check
python3 qa/check-spanish-v166.py
node qa/test-spanish-v166.cjs
```

## Known limits and release gates

Browser text-to-speech depends on the user's installed speech voices; physical-device pronunciation and microphone recognition are not verified. No external conversation, speech, or timeline is independently verified. The external V53 app itself and the separate Spanish business-practice file remain independent; V166 does not claim parity with their full features. Review the language corpus with a fluent Spanish tutor, run the full inherited GitHub regression suite, and run a small real-person pilot before merge.

This is an **optional standalone preview** in `public/study-table-v166.html`; the production `public/index.html` stays unchanged. **No Vercel deployment** and no forced streaks, fictional AI grading, automatic success or cross-device storage.