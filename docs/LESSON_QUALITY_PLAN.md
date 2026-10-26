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
