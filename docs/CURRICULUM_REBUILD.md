# Full-course rebuild

User priority: improve the actual longer curricula, with substantially more teaching, natural explanations and worked demonstrations. Keep the earlier piano/Spanish/chess priorities; also improve calculus and physics foundations. This is work on the full-course entry pages, not another set of short launchers.

Implemented in V110: 52 coherent teaching units across five course sequences. V111 adds ten prerequisite and bridge units for a total of 62. Thirty-one recently rewritten foundation lessons are integrated into the full courses so the teaching has one source, alongside 31 further units. Each unit has explanatory prose, two worked cases, an appropriate demonstration where useful, and an optional written variation with a worked answer. Reading is not gated behind questions, and visits do not count as mastery.

V112 edits thirteen explanations, combines two overlapping units and adds five applications, reaching 65 units. Current counts: Spanish 15, piano 14, chess 14, calculus 11, physics 11. Each map now groups the sequence into three named chapters. Older IDs for the combined units remain valid through aliases. See CURRICULUM_EDIT_V112.md for the content decisions and comparison.

## V110 sequences (extended by V111 below)

- Spanish, 12 units: soy/estoy/tengo; useful requests; questions and negation (new); listening repair; directions; plans; present habits (new); ser/estar with descriptions (new); completed past; past background; weekend story; complete café exchange (new).
- Piano, 12 units: keyboard; beat and duration; staff reading (new); first tune; steps/skips; C-major chord; two hands; C/F changes; three-beat groups (new); phrasing and dynamics (new); read a short melody (new); prepare a short performance (new).
- Chess, 12 units: board and pieces; captures/defenders; check; mate/stalemate; opening principles; castling (new); forks; pins (new); notice threats (new); pawn promotion (new); queen mating net (new); annotated short game and defense (new).
- Calculus, 8 units: functions/graphs (new); average rates; instantaneous rates; derivative rules (new); linked changes; accumulation; antiderivatives and definite integrals (new); optimization.
- Physics, 8 units: motion quantities; net force; force diagrams (new); energy; collisions; circuits; waves (new); pressure (new).

## Course integration

V111 inserts the missing steps into the order rather than appending an unrelated extra module. Spanish noun phrases follow requests; question words and clock times follow plans. Piano hand setup follows key landmarks; rests and equal subdivisions follow basic beat grouping. Chess notation precedes capture/check examples; exchange accounting follows legal replies. Calculus algebra comes before rates and the product rule follows the chain rule. Physics units precede motion, and velocity graphs precede forces. Current counts: Spanish/piano/chess 14 each, calculus/physics 10 each.

Adjustable full-course diagrams accompany instantaneous velocity, velocity graphs and force diagrams. They explain each selected case in text and do not create assessment scores. They must remain readable with keyboard controls, narrow screens and either theme.

Replace the embedded full-course entry HTML at the existing Spanish V40, piano studio and chess course paths with a teaching-first course reader. Preserve each original application at a sibling practice-studio.html path with an obvious return link. Their data, assets, games, and saved progress remain available. Add calculus and physics course-reader paths under curricula/ and expose these as the primary foundation entries in the Full curriculums map; preserve original foundation/continuation routes as additional options.

Use a shared offline course renderer with a readable chapter map, meaningful headings, complete solutions, separate reading position, and no required quiz. Reuse the verified demo renderer for current examples and extend it for new legal chess lines, music notation/timing, and complete translated conversations. All archive navigation must use the existing virtual-file bridge.

The home focus cards, subject chooser and main subject controls open these full courses by default. The catalogue keeps the short material under an explicit Quick worked lessons button. Main Continue restores the last full-course unit; an older foundation bookmark opens the matching unit in the full course. Deliberately choosing a quick lesson still saves and resumes that quick lesson.

## Verification

- Validate all course/unit links, prerequisites and the intended order.
- Verify new chess positions and complete move sequences with python-chess; include illegal-castling and stalemate counterexamples as explained diagrams rather than playable illegal moves.
- Check piano pitches, durations, simultaneous voices and staff placement independently.
- Exercise the actual full-course map links, every new unit, previous/next, reload, optional answers, and preserved practice-studio returns.
- Run light-mode color-contrast checks inside the course frames, including conflicting saved theme preferences. The shared theme fix must continue to work.
- Preserve existing assessment stores and distinguish reading position from learning evidence.
- Publish only after source/build/browser checks pass. Report introductory scope accurately; 12 units is not professional expertise, and independent subject/learner review remains outstanding.
