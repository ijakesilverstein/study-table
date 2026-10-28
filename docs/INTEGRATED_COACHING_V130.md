# V130: one integrated teaching and coaching version

V130 merges the observed GitHub branches `feature/v127-guided-worked-examples` through 9114d46, `feature/v128-socratic-coach` through c9b050a, and `feature/v129-learn-by-doing` through 6c76d52 with the V127–V128 work already pushed to main. The real merge retains their commit history. Exact source snapshots, function inventories and deliberate runtime adaptations are recorded in `source/imports/concurrent-coaching-v130.json`.

## What is available

Both worked examples in all 87 units offer **Talk through this example**. The complete teaching remains visible by default. A learner can choose a worked step, type or dictate a thought, request a smaller prompt, compare with the actual authored working, and see a worked explanation. The optional flow continues into the existing independent exercise and an earlier-skill recall question. No correct answer is required to read the reasoning or move on. Other specific help remains available under a disclosure.

Five lessons also include **Get feedback on this decision** inside the first example's coaching disclosure. This opens the V128 coach with fifteen checked decisions and thirty authored explanations of sticking points in piano, Spanish, chess, calculus and physics. It detects the supported numerical, unit, pitch and phrase errors described in [the V128 notes](STEP_COACH_V128.md). Its freeform working notes are kept separately from the checked answer.

These modes complement each other: every unit has a worked comparison, while the five authored scenarios can check particular answers. Neither mode claims to understand or grade arbitrary reasoning. The subject-wide prompts are templates attached to actual lesson content; they are not newly authored individual questions for every step or a model-backed tutor. Narration from the superseded V128 inline panel is retained in source; V129 deliberately replaces that duplicate panel with its more complete flow.

The eight deeper V127 lesson revisions, piano count-ins/pulse/timing guides, V126 revisions, all original course/project/workshop records, earlier figures, practice studios and portable backups remain.

## Integration repairs

- Switching the selected step updates the learning flow, rather than leaving two conflicting step indices. Typed attempts return when revisiting that part of the open example.
- Microphone results from an earlier step, a closed example or an earlier unit cannot enter the new working. Switching to the targeted coach stops the reader microphone first.
- Both active coaching dictation routes require an already available on-device browser model and explicitly set local processing. Unsupported browsers retain typing. No cloud recognition fallback or automatic model download was added. Real speech/microphone hardware has not been verified here; tests use controlled API mocks.
- Course audio stops before reader dictation or a spoken coaching reply begins. Hiding worked steps keeps keyboard focus in the coaching flow.
- The older broad help action stays available under the additional-help disclosure. The targeted checked-answer dialog uses distinct IDs and explicit neutral-theme styles, preventing older coach rules from changing its colors.

Working text in the inline flow is temporary to the open example; the targeted dialog keeps its drafts while the tab stays open. Neither adds to saved assessment, mastery or progress, and these scratch notes are not in portable backups. Existing saved learner notes and progress remain untouched.

## Verification

The preservation test compares V130 with the actual V128 HTML, including display-revision data and demonstration models, rather than only course counts. It checks every incoming coaching function ID is embedded in each reader. Browser tests exercise both examples in all seven subjects, correct step selection, notes, fresh/recall questions, input safety and saved-state preservation. Open inline coaching gets 56 scoped mobile/both-theme WCAG checks; targeted feedback gets 60 checks across themes, phone widths and answer states. Existing full-course, audio, chess, backup and delivery regressions remain in `npm test`.

Release checkpoints state actual local results. GitHub upload, hosted Actions and Vercel deployment are separate outcomes; an imported source branch alone is not evidence of a functioning release or a live website.
