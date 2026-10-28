# Study Table V129 — Learn by Doing

The learning loop now starts with a learner attempt, not a model answer.

## The path through a complete worked example

1. **Try:** The learner describes the next move. The optional “Try without seeing the solution” control hides each worked step.
2. **Nudge:** A small hint names the exact *authored step heading* without showing its calculation or explanation.
3. **Compare:** After typing or dictating an attempt, the learner can compare it with the complete authored working and reasoning. Inputs are displayed only as text.
4. **Repair:** “I’m stuck” uses the specific attempted error, diagnosis and repair authored for the current unit, rather than a generic suggestion.
5. **Transfer:** After the final worked step, the learner gets that unit’s existing independent exercise.
6. **Recall:** The last prompt reuses the unit’s written recall question, including references back to earlier units when the curriculum includes one.
7. **Decide:** The learner can repeat the worked example or continue. No artificial streak, answer score or enforced completion gate.

This flow works for all seven full courses, both worked examples per unit. It is optional; ordinary reading still works.

## Capabilities and limits

This is a standalone offline HTML build. It relies on the browser’s optional speech recognition and speech synthesis, and the existing edited lesson text. It **does not** send responses to an AI model, judge arbitrary speech or grade unconstrained reasoning. The side-by-side comparison is deliberate: a false automated 'correct' label would be worse than an explicit authored standard. Typed/speech attempts are not written into Study Table progress records.

The original V127 help routes remain available under **Other ways to ask for help**, while redundant V128 action buttons are removed. The core learning path is intended to be easier to follow on phones.

## Regression coverage

`qa/test-mastery-loop-v129.cjs` verifies the complete sequence for both worked examples in every subject, covering obscured answers, hints without full calculations, comparison with written explanations, user-text escaping, misconception repairs, transfer questions, recall answers, repetition, 320/390px width and unchanged assessment data. The full regression runner also checks the rest of the app.

## Further work

Validate whether learners can transfer skills to *unseen* problems, not merely repeat an explanation. A real AI tutor could ask targeted follow-up questions and evaluate verbal reasoning with domain-specific correctness checks, but this must be designed with evidence, privacy/consent and correct calibration. Avoid relabeling a keyword router as a reasoning model.
