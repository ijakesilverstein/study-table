# V128: Talk it through

The optional coach is available from **Talk through a decision with me** in five full-course units: piano hand coordination (`piano-5`), Spanish noun groups (`noun-phrases`), chess capture accounting (`count-exchanges`), the calculus product rule (`product-rule`), and sled energy (`physics-2`). All earlier V127 lessons, demonstrations and optional guided worked examples remain.

## What a learner can do

Choose the particular decision that is confusing. Write a short explanation in working notes, or dictate it when local browser recognition is ready. Enter the result or Spanish phrase separately and check that answer. Select a named sticking point to get an explanation of that particular difficulty. The teacher's complete reasoning is available before any attempt. Moving between parts requires no correct answer.

There are fifteen authored decisions and thirty confusion branches. Feedback distinguishes specific likely errors: counting the captured piece but omitting the recapture, treating the original bishop trade as the rook trade, getting the material sign backwards, keeping a singular noun/adjective after dos, forgetting a written accent, counting four bass attacks instead of one, keeping v² as the speed, using a frictionless speed after a stated thermal transfer, using a finite average for an instantaneous rate, or giving an energy with speed units.

The checks accept case/spacing variants, decomposed Unicode accents, optional quiero/por favor around the taught item groups, relevant unit suffixes, Unicode minus, and selected number-word/root formats. Unrecognized phrasing gets a comparison response, rather than a false claim that it is incorrect. Feedback applies to these authored answer patterns. **The coach does not understand or grade arbitrary working notes, diagnose every possible misconception, listen to a musical performance, or provide a general conversational AI tutor.** The interface distinguishes thinking notes from the checked answer.

## Dictation and notes

Typing always works offline. The microphone button only starts browser recognition if the API supports `processLocally`, its availability check confirms that the selected English or Spanish model is already available, and the dialog/part has not changed meanwhile. The recognizer is then explicitly set to `processLocally=true`. There is no fallback to cloud recognition, model download or remote AI call. An unavailable model, unsupported browser or microphone error leaves typed input available.

Closing, changing parts or changing dictation language cancels active/pending recording. Late transcripts cannot enter another question's notes. Dictation appends to thinking notes, not to the checked result. Speech behavior is verified with controlled API mocks; a real microphone and each user's browser/language pack have not been tested here.

Thinking notes and answers remain in memory while the tab stays open, including when the coach is closed and reopened. The interface states this retention limit. They are not written to localStorage or included in portable progress backups. Existing learner notes, reading progress, assessment results and backup formats are untouched. Coaching never awards success or mastery.

## Implementation and verification

The shared coach module and its authored data are embedded once in the parent HTML. Readers include only a list of eligible unit IDs and an entry button. Parent messages are accepted only from the active course frame and must match a valid course subject/unit. The existing unit map, course records, projects, workshops and original practice studios remain unchanged. The chess entry selects the actual second board line used in its coaching scenario.

`qa/check-step-coach.py` preserves all V127 base data and all 208 unrelated archived assets. `qa/check-step-coach.cjs` verifies all fifteen expected answers, known error paths, valid alternatives, unit/diacritic handling, unknown inputs and independent arithmetic. `qa/test-step-coach.cjs` exercises the actual lesson buttons, targeted feedback, help, complete reasoning before attempts, notes/reopen behavior, stale-feedback clearing, native-dialog keyboard/focus behavior, unchanged saved values, offline operation after load, phone layouts in both themes, and mocked local-only dictation including cancellation races. These run in `npm test` with the existing regression suites. The release checkpoint records actual results; hosted CI and Vercel publication are separate checks.
