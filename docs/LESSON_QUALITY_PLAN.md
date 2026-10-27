# Lesson quality improvement plan

## Aim

Help a beginner follow the reasoning, see where it applies, and continue to a deeper lesson. The user's requirements are teaching before testing, natural language, and demonstrations in Spanish, piano and chess. Adding questions alone does not meet that aim.

## Baseline audit

The deployed V105 short-course layer contains 26 lessons in 11 subjects, 26 worked examples and 110 solution steps. None of the lesson records declares prerequisites or a term-definition section. Worked solutions initially reveal only one step. The longer original courses remain available, but their presence does not establish that these short lessons form a complete curriculum.

The audit inspected the lesson records, worked-example records, shared renderer and demonstrations. It is a content/implementation audit, not a learner study or independent subject-matter review.

## Release 1 — execute now across all 26 short lessons

1. Make the teaching readable in full. Show the whole first solution; move the duplicated short outline into an optional summary.
2. State what the explanation assumes. Link actual prerequisite lessons and define the few terms or symbols the worked solution needs. Allow direct access without a test gate.
3. Author a second solved case for every lesson. Change a condition or expose a boundary: a habit versus a completed event, area versus displacement, stalemate versus checkmate, a binding versus a slack budget. Explain why the method changes or still applies.
4. Add an authored alternative explanation to each lesson. Its wording must address that lesson's likely sticking point, rather than repeat generic encouragement or pretend to grade arbitrary reasoning.
5. Make continuation explicit. Link the next appropriate short lesson, prerequisite review and the existing full course. Describe completion as reading/studying, not expertise.
6. Preserve practical demonstrations and original progress. Verify chess positions, piano sequences, Spanish text/audio fallback and all existing learning stores.

### Acceptance checks for Release 1

- Every short lesson has a starting-knowledge note, definitions, a second worked case and an alternative explanation.
- Every prerequisite link points to an existing lesson; the dependency graph has no cycles.
- Both worked cases and their reasoning are visible on opening. No answer field or assessment is required to read them.
- Numeric solutions have checked results and stated assumptions; qualitative conclusions distinguish claims from evidence.
- Demonstrations remain usable, mobile layout fits, and no browser errors occur during lesson navigation.
- Saved progress survives reload and the update. No new reading-completion control manufactures a mastery score.

## Release 2 — validate with learners before expanding breadth

Have learners use one quantitative, one language and one practical lesson. Ask them to explain a step, solve a changed case and report where the explanation lost them. Observe requests for clarification and wrong turns; do not treat clicks, time spent or satisfaction alone as evidence of learning. Use the findings to revise the explanations and compare delayed performance on comparable problems. This needs real participants; automated checks cannot supply it.

## Release 3 — expand toward disciplinary depth

Audit each original full course against an explicit syllabus, prerequisite graph and subject references. Fill actual coverage gaps with individually reviewed teaching units and authentic tasks: conversations, performances, board positions, source analysis, experiments and business decisions. Track demonstrated skill separately from reading and self-reports. Seek independent review for subject accuracy, especially medicine. Do not label a short bank or a content count as expert training.

## Publication

Build V106, run Release 1 checks, deploy to the existing Vercel project, and keep the previous release recoverable. Report what was implemented and what still requires learner or independent review.

## V107 — more explicit teaching

Implemented an additional authored explanation and a worked correction in each of the 26 short lessons. These explain how to read the situation, select a method, locate an incorrect assumption and check the corrected reasoning. All teaching is visible without an assessment. The 52 solved cases remain available.

Piano demonstrations now include playable white keys, three playback tempos and an accurately held two-beat ending for the opening phrase of Mary Had a Little Lamb. The associated lesson prose and worked steps use the same rhythm. Closing or replacing a lesson stops active audio. Section navigation accounts for its wrapped height so it does not cover lesson headings on mobile.

Validation includes navigation and teaching access in all 26 lessons, saved-work preservation, mobile layout, independently expected piano pitches and note durations, cancellation, chess demonstrations, Spanish audio fallback and the existing 198 challenge flows. These are content and browser checks; participant studies and independent subject review in Releases 2 and 3 remain outstanding.

## V108 — correct the main learning route and teach before asking

User feedback identified confusing explanations and too much quizzing. A browser walkthrough found that the prominent Continue learning control still opened the older lesson flow. In its first Spanish lesson, a brief present-tense rule led into several response prompts. The newer worked teaching was on a separate route.

Primary start, continue and subject controls now open the taught lessons. Each of the 26 short lessons begins with two newly authored, plain-language paragraphs, then a complete worked example, then the detailed explanation. The second solved case, worked mistake correction and additional notes remain available through labeled expandable sections. Practice follows the teaching and is closed until requested. Explicit original full-course controls remain available; those older course bodies have not all been rewritten.

The main screen saves and resumes a reading place in a separate store without changing assessment records. Optional memory practice covers every teaching section and lets the learner restore it. Browser checks cover all 26 lessons, all 11 real home subject selections, original-course access, saved answers, demonstrations, mobile layout and existing challenge behavior.

Full curriculums are also exposed directly on the home screen, main navigation, archive toolbar and every short lesson. The new subject-filtered course map links the longer Spanish library, piano and chess courses, calculus and physics foundation/continuation sequences, Body School, the history reader, economics field guide, business course, Life topic atlas and Reading Room. Descriptions distinguish a topic atlas from finished chapters. Builds check every archived destination exists; browser checks open every listed course route. Closing the map from a short lesson returns to that lesson.

Six additional foundation/continuation lessons were drafted before the clarification. They are retained in draft-foundation-lessons.json and are not part of this release; the immediate priority became fixing the actual teaching path and explanation order. Learner comprehension and long-course coverage still need the validation described above.

## V109 — expanded practical subjects and rewritten explanations

The six prior drafts and six additional lessons are now integrated into the taught paths: Spanish grows from four to eight lessons, piano from three to seven, and chess from two to six. The whole taught layer contains 38 lessons and 76 solved cases. These counts describe introductory teaching coverage, not expert-level curricula.

New piano teaching covers pulse versus note duration, C-major chords and inversions, a sustained left-hand bass under a moving melody, and C–F–C chord changes. Demonstrations schedule simultaneous notes, held notes and separate-hand playback at selectable tempos. Spanish adds identity/location/possession sentences, listening repair, directions, and making plans, with complete translated exchanges and line replay. Chess adds movement diagrams, a checking fork, defended-versus-undefended captures, and two opening lines with reasons for each move. The worked boards support both direct piece/destination selection and forward/back controls.

The actual prose in 21 existing Spanish, piano, chess, calculus, physics and medicine lessons was rewritten around the concrete examples. For instance, the falling-object explanation adds the three one-second distances before giving the shortcut formula; the derivative explanation expands the four products in (3+h)(3+h). Repeated generic headings are replaced by subject-specific explanation headings.

Following color feedback, the light palette uses white, neutral gray and charcoal, with a single violet accent for focus and active notes. Dark mode uses neutral charcoal surfaces. Colored subject strips, tinted blue panels and the home gradient have been removed. The palette covers the shell, taught lessons, subject choices and course map. Older full-course pages keep their individual designs. Course-map links remain available beside the expanded taught sequences.

Validation uses an independent chess rules library for every scripted move and board state, independently expected piano pitches and timings, voice-unavailable fallback, media cancellation, complete access to teaching without required answers, saved progress, reading-place restoration, and mobile/dark presentation. Automated checks do not establish learner comprehension or replace the independent subject review described above.

### Light-mode contrast correction

The reading toolbar and Learning tools had separate theme preferences. A light root theme could coexist with the older portal night class, putting pale night text on white panels. An axe-core color-contrast check reproduced seven failing elements on the home view, including heading/body contrast of 1.15:1. A shared theme controller now migrates conflicting saved values, updates both controls, and keeps the portal class, root theme, native control scheme and storage values synchronized. Contrast validation uses actual controls and reloads rather than only setting the root attribute in tests.

## V110 — rebuild the actual full-course entries

The existing full Spanish, piano and chess entry pages now open structured written courses: 12 units each, with demonstrations and two complete worked cases per unit. The original interactive applications are preserved at sibling practice-studio.html paths, with an explicit return to the written course. The calculus and physics course-map entries now lead with eight-unit foundation readers, while original foundations, further lessons and interactive material remain additional choices.

The five sequences total 52 units and 104 worked cases. Thirty-one units integrate the recently rewritten teaching into the actual longer course paths; 21 further units add new substance. Piano adds staff reading, three-beat groups, phrase shaping, reading a complete melody and preparing a performance. Spanish adds questions/negation, daily routines, ser/estar descriptions and a complete café conversation. Chess adds castling, pins, threat inspection, promotion choices, a queen mating net and an annotated miniature with a defensive alternative. Calculus adds functions/graphs, derivative rules and definite integrals. Physics adds free-body diagrams, waves and pressure.

Course maps expose the complete order without assessment gates. Main-screen Continue returns to the last full-course unit after reload; a separate reading store is used, and original assessment records are not converted into reading scores. Full-course views use focused archive navigation rather than the old launcher/sidebar maze. Music notation and quantitative figures accompany the relevant worked examples. Reading and variations remain available even without audio voices.

Validation includes all 52 units, both worked cases, optional answer access, original practice returns, saved-reading resume, unchanged assessment records, staff placement and half-note notation, mobile layout, shared theme behavior and color-contrast scans. Chess validation covers every scripted move and the stated checkmate, stalemate, promotion and illegal-castling results. The sequences remain foundations; independent subject review and real-learner validation are still required before making stronger claims.

## V111 — teach the steps the foundation courses assumed

Ten further units fill specific gaps in the sequence. Spanish adds articles/noun phrases and question words with clock times. Piano adds comfortable hand placement/finger numbers and silent beats/equal subdivisions. Chess explains notation before using it and counts captures with their recaptures. Calculus teaches the algebra used in a difference quotient and explains the product rule through a growing rectangle. Physics teaches unit conversion/sign conventions before free fall and reads velocity graphs before force calculations.

The five written courses now have 62 units and 124 worked cases. Three adjustable diagrams let the reader examine an interval approaching zero from either side, the slope and area of a three-part velocity graph, and the changing normal force on a book when an extra downward push is applied. Each diagram keeps a complete written calculation visible. The new piano patterns play the rest and half-beat timing they explain; the new chess boards replay every turn in the notation and exchange examples. All previous lesson IDs, original studios, bookmarks and assessment stores remain compatible.

## V112 — refine the sequence and trim repetition

Thirteen explanation sections were rewritten, reducing those sections from 2,262 to 1,102 words while keeping worked calculations in their cases. The separate piano performance unit is now a project inside the melody unit. The separate chess threat unit is now the contrasting second case in the check lesson, with its board line preserved. Aliases keep older bookmarks and incoming unit links usable.

Five further units add Spanish pronunciation, a C–F–G–C piano progression with nearby voicings, a turn-sensitive pawn race, integral substitution and series/parallel circuits. Three named chapters organize each course; derivative applications now precede the integration chapter. The courses total 65 units and 130 worked cases. The circuit diagram compares the actual connections as well as the numerical results. Full scope and validation are documented in CURRICULUM_EDIT_V112.md.

## V113 — make the explanations visible

Keep the 65 units and 130 worked cases. Seven lesson records receive clearer explanations or goals. Add a Spanish past-viewpoint selector with sentence construction, semitone-gap comparisons with matching audio, an exact growing-rectangle demonstration for the product rule, energy-store bars and signed before/after collision views. The first chess diagram covers all six pieces and shows why a pawn cannot jump a forward blocker. Detailed en passant moves into an optional promotion supplement, with a legal line and a pinned-pawn counterexample. Existing reading places, aliases and original practice remain available. Scope and verification are described in TEACHING_V113.md.

## V114 — preserve and integrate Claude's additions

Import all 65 takeaways, 65 review prompts, 34 new misconception blocks and 16 figures from the user's upload without replacing the newer V113 lesson data. Every unit now displays the authored misconception check sentence. Practice remains optional, with one disclosure and a separate answer toggle for each item. Original uploads are preserved unchanged. Targeted content and figure corrections, retention of all prior V113 teaching, and complete preservation checks are documented in CLAUDE_MERGE_V114.md.


## V115 — teach complete performances and problems

Add five connected projects, each with four teaching parts. Preserve all 65 existing units, 130 formal cases, Claude additions and original studios. Piano teaches an original eight-bar melody and bass with notation, a count-in, hand isolation and loops. Spanish follows 16 conversational turns and lets the learner adapt already-taught choices. Chess replays every move of the 1858 Opera Game with original annotations. Calculus connects a flow rate, integral, initial condition, capacity and turning point. Physics follows the same carts through a hill, a sticking collision and a spring, choosing and checking each conservation law.

These projects explain the complete solution before an optional variation. Course maps and the final units link to them; per-course and main Continue restore the chosen project part. Reading a project never changes assessment records. Content preservation, legal game moves, music durations, model accounts, media cancellation, mobile layout and both themes are verified in the project checks. See COURSE_PROJECTS_V115.md.


## V116 — connect the reasoning to the demonstration

Preserve every V115 course/unit/project record. Link all sixty worked project steps to an exact board position, piano passage/hand, spoken reply or physical/mathematical model state. Move the existing demonstration beside the chosen explanation and offer a return-to-top control, keeping a single set of media controls. Add optional contextual maths help with seven explanations and fourteen worked cases; the original lessons gain help links without changing their authored records. The tank can show its exact filling corner instead of rounding to a nearby slider tick.

The learner can open the app online or download HTML/ZIP editions from the separate, explicitly authorized Vercel download project. Earlier downloads remain. Test data preservation, all sixty targets, modal focus/Escape, mathematics, audio state, mobile layout and both themes. Keep reading and assessment records separate.


## V117 — teach practice and decision-making

Preserve all earlier course/project records and add three four-chapter teacher workshops. Piano repairs a specific early entrance through an audible error, a full-count model, separate hands, a reduced skeleton and restored context. Spanish teaches person changes, negatives, information questions and future plans through thirteen authored models with phrase explanations. Chess compares a forcing fork, a defended capture, legal movement on a pin line and mate versus stalemate through eight legal continuations. Thirty-six new step links put each model beside its reasoning. Workshops save their own chapter without writing assessment successes.

The shared piano player gains optional count-ins and a quiet pulse for these practice models; older lessons retain their original tempo choices and schedules. Validate all chess moves/results, note timing and holds, voice cancellation/fallback, saved workshop places, mobile layout and both themes. Publish the tested update through the approved separate download site, retaining earlier editions.


## V118 — explain the calculation while showing it

Deepen twelve existing cases in six quantitative units: average velocity, instantaneous velocity, definite integrals, net force, force diagrams and series/parallel circuits. Preserve every V117 unit, project and workshop field. Add thirty-nine authored explanations to the existing steps rather than another quiz or another course branch. Each step moves one shared diagram for its case beside the reasoning. All solution text remains visible.

Separate compact phone drawings preserve the complete graph or circuit and readable labels. Optional comparisons demonstrate origin invariance and nonzero intervals from either side of a derivative. The h=0 view shows a tangent limit and never evaluates a zero-denominator quotient. Earlier explorers remain available in an optional section.

Check the arithmetic independently, reconstruct both desktop and phone circuit connections from their drawn wires, inspect phone screenshots, and verify both themes, keyboard focus, saved reading places and unchanged assessment records. This improves the teaching content; it is not evidence of accelerated expertise or a learner-study result.


## V119 — verify the critique and repair access

The new critique describes V118 and a proposed V119, but its accompanying HTML exactly matches the older Claude V113 already merged. Preserve the current teaching and review the claims against V118 instead of replacing the app.

Repair reproduced keyboard escape from the custom modal shell, prevent native-dialog Escape from also closing its background, reject inherited or invalid course keys, announce slider values with their units, and add local skip links in all five readers. Keep every V118 course record, all archive assets and independent assessment data. Do not treat reading, self-reported understanding or a confidence bar as demonstrated mastery. Record the full-course revisit-list idea separately from these repairs.

Validate keyboard entry/Tab/Escape/return, nested native dialogs, previous inert state, dynamic siblings, invalid and foreign messages, poisoned bookmarks, range keyboard changes and constraints, skip-link navigation stability, phone layouts, both themes and the complete prior regression suite. See docs/CLAUDE_REVIEW_V119.md for each critique claim and its verified status.


## V121 — merge the actual Claude V120

Preserve the supplied 6,739,561-byte HTML unchanged and extract its additions reproducibly. Merge all 22 medicine/business units, both projects and workshops, both quantitative workshops and per-unit reading/revisit controls while retaining the previous 65 units and all demonstrations. Keep the V119 accessibility fixes and local skip-link behavior.

Record factual corrections separately from the imported source, including the cost basis for inventory/payables, consistent working-capital and financing arithmetic, respiratory quotient direction and limits on inference from normal pressure or saturation. Reading history and self-reported recall remain separate from assessed mastery. Verify exact content accounting, all 87 units, new written project/workshop chapters, personal-review persistence/reset, mobile/both themes and all prior regression checks.


## V122 — explain the difficult steps

Fourteen existing lessons, two in each of the seven courses, now have visible introductions and 51 extra step explanations. They slow down two-hand coordination, reading a held ending, noun agreement, past narration, capture accounting, pin legality, derivative and substitution algebra, energy and collision equations, gas exchange, test denominators, cash-cycle timing and customer payback. Four semantic tables make the beats, people, dates and running cash balance inspectable. Earlier-unit links offer specific prerequisite teaching. No quizzes, unit-count inflation or self-reported mastery is added. All V121 course records remain unchanged apart from three explicitly recorded factual qualifications. See docs/TEACHER_NOTES_V122.md.


## V123 — recover twelve missing interactive figures

The brief investigation exposed six medicine and six business figures that were present in Claude V120 but omitted from the V121 merge. Recover every original figure ID, preserve the exact incoming blocks, and correct the calculations, labels and model assumptions separately. The restored figures provide responsive diagrams, keyboard-operable controls, live calculations and semantic numerical tables. Correct working-capital valuation, price-rise volume loss, zero contribution, MAP approximation, feedback, first-order decay and predictive-value edge cases. Preserve all 87 V122 unit records and the other 213 archive assets. Expand merge checks to enumerate incoming figure code and verify all twelve in the browser. See docs/RESTORED_FIGURES_V123.md.


## V124 — carry saved work between editions and devices

Add a portable JSON backup covering all seven courses, project/workshop places, personal revisit marks, notebook notes and recognized practice records. Preview and validate before saving; preserve local conflicts by default; never inflate attempt counters. Protect work saved after preview and after restore. Verify writes, roll back failed saves, expose an honest recovery-file option when rollback also fails, and retain unsaved session notes. Provide session Undo and unify earlier visible import/export controls. Preserve every V123 embedded teaching asset exactly. See docs/PORTABLE_PROGRESS_V124.md.


## V125 — make a choice and watch the reasoning change

Deepen five existing lessons with authored variations. Piano gives a three-note opening three different replies, including a half-beat rhythm change, with sound and a complete timing table. Spanish carries eight combinations of quantity, place and clarification through a complete translated café exchange. Chess compares a supported mate, stalemate and a legal king escape from the same three-piece position, with every legal reply independently checked. Calculus follows four one-second intervals on a toy car's track; physics compares three pushes on a sliding cart with signed force accounts and explicit model limits. Show the reasoning and outcome throughout, preserve all 87 units and projects/workshops, and keep practice optional. Test the arithmetic, note schedules, media cancellation, legal moves, mobile layout and both themes. See docs/LESSON_VARIATIONS_V125.md.


## V126 — teach the small steps before adding speed

Revise six existing beginner lessons in place: piano hand setup and held notes, Spanish first sentences, pronunciation and questions, and chess capture accounting. Replace dense or terse core explanations with visible actions across 22 primary worked steps. Add seven compact reference tables. Keep the original spelling/stress rule in an optional section. State the complete drawn outcome of both sparse chess capture examples, including the board captions. Give shared teaching keyboards large touch targets with local scrolling and sensible starting-note visibility. Retain the 87 base course records, later lessons, V125 variations and all progress formats; no extra unit count or assessment success is added. Verify exact displayed teaching, preserved source records, beat timing, finger routes, legal capture outcomes, phone layout and both themes. See docs/LESSON_REVISIONS_V126.md.
