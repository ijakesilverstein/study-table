# Study Table — five-sprint experience direction

Decision: October 29, 2026.

**Do not grow the feature list merely to grow it.** The product goal is an enjoyable, curiosity-led, easy-to-enter learning experience with precise feedback at the moment of confusion. The quality bar is voluntary repeat use and meaningful transfer of understanding; neither has been verified from real learner testing.

## Sprint sequence

1. **Magic first five minutes:** one subject-aware question; guess first, inspect evidence, then transition naturally into a real lesson.
2. **Grounded coaching:** let the learner choose a tiny explanation, causal explanation, common trap, or miniature worked example. Use a distinct transfer problem. Do not auto-grade free writing or misrepresent scripted coaching as AI.
3. **Simplification:** one primary call to action; preserve full curricula, resume, backups, lesson tools, Wonder Arcade, existing stories, experiments, and original practices behind legible navigation.
4. **Codex reconciliation:** work from canonical current `main`, not an old HTML. Preserve 87 full units, V135's 128 authored guidance turns and V136 manual companions. PR #8 and #9 remain independent until deliberately merged. Keep new code in independently testable modules and don't claim canonical integration without generated-source parity and full regression.
5. **Verify and trim:** browser test across subjects, keyboard, small screens, theme, local progress, prior activities and lesson handoff. Observe real learner enjoyment and confusion rather than inventing success metrics.

## Source distinction

The standalone V160 prototype developed in another chat is based on V155's offline HTML and provides a new focus experience in `study_focus_v160.js` and `study_focus_v160.css`. **This branch does not contain or claim a merge of that prototype into the V136 generator.** Future contributors should port the standalone, tested modules only through the canonical `source/` pipeline, with tests, then rebuild all generated artifacts.

## Non-negotiables

- No forced streaks, timers, quotas, fake mastery, or unsupported AI grading.
- Calm, enjoyable, curiosity-led teaching; attention to the exact point of confusion.
- Existing student progress, local backup and offline safety preserved.
- Preserve releases and source history; do not force-push over concurrent work.
- **No Vercel deployment** unless the user expressly reverses this instruction.

### Acceptance test

After actually using the app, can someone answer a surprise question, explain the underlying idea, handle a new scenario, and freely choose a next lesson without navigating a maze? Do they voluntarily come back? Product quality is not established by feature count.