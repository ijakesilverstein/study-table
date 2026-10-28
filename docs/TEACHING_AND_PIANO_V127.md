# V127: fuller explanations and practical piano support

This release combines the work from `feature/v127-guided-worked-examples` (through 6eccb65) with eight further authored lesson revisions. It retains the feature branch's commit history, optional step-by-step controls and regression test. Both worked solutions remain complete and visible until the learner chooses the walkthrough.

## Teaching changes

- **Piano: two hands.** Name the registers and fingers, rehearse just the first independent change, then hold the bass through the complete bar. A five-row table includes the final release.
- **Piano: rests and subdivisions.** Work in seconds before notation, distinguish a held note from a rest, and count all eight half-beat slots. The second worked solution and its complete finger-action table explain where silence belongs.
- **Spanish: noun groups.** Build a one-coffee request before changing the whole group to two coffees. Compare masculine/feminine and singular/plural phrases with pequeño and grande.
- **Spanish: yesterday.** Build the destination and purchase separately, explain a + el → al and comprar → compré, then join the events. The later habitual comparison remains.
- **Chess: exchanges.** Inspect the legal pawn recapture first, then account separately for the captured knight and the lost bishop or rook. Tables distinguish exchange changes from the position's earlier balance.
- **Chess: castling.** Follow both pieces, then check history, space and each square of the king's route. A table shows why an attacked crossing square invalidates the second example.
- **Calculus: product rule.** Start with the two strips of a concrete rectangle, distinguish sizes from rates and explain why the corner term vanishes in the limit. Check the instantaneous result by expansion and the finite-interval average numerically.
- **Physics: energy.** Put a 2 kg mass into the calculation, show the algebra and square root, substitute the result back, then explain why mass cancels and how a stated thermal transfer changes the answer.

There are 30 revised worked steps and nine new reference tables. The six V126 revisions remain intact. V122 prerequisite links are retained; in five overlapping units, the new explanation is shown first and the complete earlier introductory paragraphs, 18 step notes and piano table remain under **Another explanation of this example**. Other V122 notes remain in place. No course, project, workshop or practice studio was removed.

## Piano playback

Shared written-course and quick-lesson piano demonstrations now offer 40 BPM in addition to their existing tempos, an optional one-bar count-in and selectable beat clicks. **Lesson setting** retains each pattern's original behavior. Three-beat patterns count three beats into the music and accent each three-beat group; four-beat patterns use four. Individual playable keys sound immediately even when count-in and clicks are enabled.

A written timing guide uses the actual note schedule to say **Press**, **Keep**, **Release**, or **Silence** at each beat/subdivision. A row marker follows playback; it does not move focus or repeatedly announce the whole table. Four-beat patterns show the guide expanded initially; longer patterns keep it optional. Changing the part, tempo or playback options cancels active sound and pending playback. Missing Web Audio leaves the complete written timing available. This synthesizes examples; it does not listen to or grade a learner's performance.

The shared reader also constrains native selects to the available width: the castling example selector previously overflowed at 320px.

## Verification

`qa/check-teaching-v127.py` compares every V126 base unit, project and workshop record and all 208 unrelated archive assets; it independently recomputes rectangle/energy examples and uses python-chess to verify captures and castling legality. Updated revision and teacher-note browser tests verify displayed teaching, retained alternate notes, tables, source records, prerequisite navigation, optional practice, phone layouts and both themes. `qa/test-piano-coach.cjs` checks scheduled tones/clicks and durations, count-in lengths and accents, sustained bass, subdivisions, individual-key behavior, cancellation, missing-audio fallback and unchanged assessment data. The incoming guided-example test remains in the full runner.

These checks do not establish learner comprehension, provide a clinical review or replace manual screen-reader testing. Release/checkpoint records state which checks actually passed. GitHub push and Vercel deployment are separate outcomes.
