# V132 — small questions that make you think

Integration note: the concurrent grounded-curiosity branch through 67fc6d803e9636d571d71088fd2badf1dd679ca7 is merged into canonical V132. The final version shows both valid and mistaken claims (39 and 48 units), offers the full explanation before a choice, and expands the checked coach to eight scenarios with 24 decisions. See [the combined V132 changes](SPECIFIC_TEACHING_V132.md). The five-scenario and CI statements below record the source branch's earlier scope, not a verified hosted deployment.

This release starts from the current Codex-integrated V130 main branch, including its 87-unit guided lesson coach, five checkable tutor scenarios, safe local-only dictation, corrected step selection, progress backup, piano support, and cross-course regression coverage.

The new features are deliberately small:

**Surprise me.** An optional, one-minute question on every course map, using a real authored exercise and answer. New learners see questions from the opening three units. Returning learners see nearby material: the previous two units, their saved unit, or one step ahead. They may reveal the reasoning, try a different question, or enter the matching full lesson.

**Would this actually work?** One short thought experiment in each lesson uses a plausible, authored mistake. The student predicts whether the claim works, then sees why it fails, what to do instead, and another reasoning check. Only one claim is shown before the judgment, preventing an easy giveaway caused by comparing a brief mistaken answer with a longer polished repair.

**Physical reading comfort.** Detailed mathematics reference tables are contained within a local horizontal scroll region on narrow mobile screens, rather than widening the entire lesson.

## What is unchanged

The checked coach remains precisely bounded to the five authored scenarios. It does not grade arbitrary explanations or claim that microphone input has been semantically understood. Additional guided modes remain optional. No new service, user account, automatic streak, artificial score, or data collection has been added. The earlier lesson text and examples are preserved.

## What still needs improvement

Independent transfer and delayed recall need a growing bank of *verified alternative problems*, not just prompts asking the student to recognize what was in the lesson. Personalization should be driven by explicit learner choices or validated performance, never a false confidence score.

GitHub Actions generate a standalone HTML and run the focused curiosity checks followed by the complete inherited regression suite before any production release.
