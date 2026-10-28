# V127 — Try each worked example step by step

## Learner-facing change

Every first and second worked example in the seven full-course readers now has an optional **Try the steps one at a time** button. The complete solution remains visible by default. Opting into a walkthrough hides the worked steps and conclusion until the learner chooses to reveal each next step, then reveals the conclusion separately.

The prompt asks the learner to say what they would try and why before clicking. This is self-explanation, not an AI tutor or a scored assessment. There is no claim to understand or grade arbitrary learner reasoning.

**Show full solution** exits at any point, restoring every step and conclusion. The walkthrough's state is temporary within the currently displayed case, not saved as progress, practice or mastery. Existing project demonstrations, teacher notes, worked tables, revisit controls, original practice studios and portable backups remain.

The feature is deliberately modest: it encourages an active pause without withholding access, adding more quiz gates or duplicating written teaching.

## Testable requirements

- Every existing full-course unit has both worked cases and an opt-in walkthrough.
- On entry, all steps and the final case conclusion are hidden; worked problem and demonstration remain.
- Reveal shows one additional step at a time, in order, without grading.
- The conclusion is a separate final reveal. Exiting early always restores the complete case.
- Navigation between units resets only the transient walkthrough.
- The same controls fit a narrow mobile reader and support keyboard activation.
- No localStorage keys, prior responses, reading bookmarks or assessed-success counts are changed by walkthrough controls.
- The complete V126 source, including original editions and authorship provenance, remains intact.

`qa/test-guided-steps.cjs` exercises both cases in all seven readers, phone width, recovery and assessment preservation, and is part of `npm test`. CI rebuilds the standalone HTML from source before testing. Release status requires a green CI run and checking the actual downloadable artifact, not merely a successful source commit.

## Known limitations

This is a guided self-explanation, not a conversational voice coach, and its prompts are not individually authored for each case. Native text-to-speech, adaptive diagnosis and actual learner comprehension measurement are not implemented in this change. Evaluate comprehension with humans before calling the feature educationally effective.
