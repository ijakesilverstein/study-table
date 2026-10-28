# Study Table V133 — verified new problems and optional revisit

V133 builds on integrated V132 main. It preserves all seven full courses (87 units), worked demonstrations, five-subject checked decision coach, the additional V132 teaching, interactive curiosity and existing progress.

## What is actually new

- 42 distinct, editor-authored practice problems covering 21 specific skills (three selected lesson units each in Spanish, piano, chess, calculus, physics, medicine and business). They are not copied from the worked examples and are not offered as if all 87 units already have a verified transfer bank.
- Exact or tightly normalized answers for numbers, short factual responses, note/square names and constrained multiple-choice questions.
- Authored, misconception-specific feedback for familiar wrong answers. Unrecognized open-ended wording returns *unverified*, not a false incorrect verdict. An unrecognized numerical answer gives no invented diagnosis.
- A genuine worked explanation and optional hint at any point. No gate, points or streaks.
- Only if requested, a browser-local revisit schedule: first independent correct answer in about three days, next independently correct attempt in seven days, later at wider intervals; wrong/unverified or revealed answers may be revisited tomorrow. The record is a practice reminder, **not** a mastery credential.
- Two independently authored variants per skill. Repeated practice rotates the variant; review can be started manually before the due date.
- Review can be removed, and no automatic server account, notifications, or remote AI scoring were introduced.

## Privacy and backup scope

Answers are processed locally. Opening a lesson, checking an answer or revealing a solution does not write to storage. Clicking **Add to gentle review** writes only the skill identifier, due time, level and number of scheduled attempts to localStorage under studytable:transfer-review:v133. This does not change the existing assessed learning record or legacy progress-backup content. The review queue stays in the browser and is not included in the existing portable backup. Removing a skill deletes its review record.

## Limitations and next phase

These 42 items are an initial high-quality verified corpus, not a complete adaptive teacher. The next extension should add independently verified problem banks to the remaining 66 units, better novelty, and content-valid evaluation of longer verbal explanations. The exercise checker deliberately does not claim to grade arbitrary verbal reasoning. Interval-based revisit is a practical reminder, not a scientifically established personalization system without longer-term outcome data.

## Checks

Static checks enumerate all 21 authored skills, 42 valid correct answers, short-answer alternatives and common wrong-turn diagnoses. Browser checks exercise each of the seven courses, voluntary saving, interval logic, removing a review item, mobile widths, accessibility and offline operation. Existing CI checks remain mandatory before merging to main or deploying.