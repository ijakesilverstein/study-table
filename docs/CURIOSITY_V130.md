# V130 — a more inviting way into a difficult subject

## Why this change

A good learning app should make it easy to begin, give the learner something worth figuring out, and explain a wrong turn without shaming or pretending to evaluate arbitrary speech. V129 had a serious step-by-step coach, but the course map could still feel like an assignment list.

## What's new

**Surprise me.** Each of the seven full-course maps now contains a tiny, optional challenge. It selects a real authored independent exercise from that subject's 87-unit curriculum, lets the learner think first and reveal the written answer, offers another question without repeating the same unit immediately, and routes directly into the relevant lesson. No timer, scores, streaks or new backend are involved.

**Spot the almost-right idea.** Each full-course unit now uses its *own edited misconception* as a two-choice reasoning game. The learner chooses between the original incorrect attempt and the author's repair. The choices swap sides deterministically by unit to avoid teaching that the first answer is always right. Either choice reveals the reason the tempting approach fails, the stronger replacement and an authored follow-up question.

**Less duplicate teaching.** The new misconception activity replaces the old passive mistake-details section. The existing demonstrations, explanations, quizzes, backup, reading place and progress records remain available. The game does not mark attempted, correct or independent work.

## Guardrails

Every problem, answer, wrong turn, repair and follow-up comes from the lesson's existing source data, including V126 editorial revisions. Learners' choices are ephemeral and are not written into assessment history. Every user-facing text insertion uses textContent or HTML escaping.

## Checks

`qa/test-curiosity-v130.cjs` exercises random question, answer reveal/hide, retry without immediate repeat, direct lesson routing, choosing both explanations, resetting, mobile 390/320 px and unchanged assessment across all seven subjects. The older focused and full regression suites also run in CI.

This is about generating worthwhile curiosity, not replacing a teacher with a weak imitation of an AI grading system.
