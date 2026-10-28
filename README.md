# Study Table

An offline-capable learning app. [Open the V132 HTML on GitHub](https://github.com/ijakesilverstein/study-table/blob/main/public/study-table-v132.html) and choose **Download raw file** to save the complete app. The separately published site at https://study-table-downloads.vercel.app may show an earlier release until a new deployment is verified.

V132 merges the concurrent tutor and curiosity branches. Its latest integrated edition includes **80 individually authored prompts, hints and explanations across 12 lessons**, including new medicine (homeostasis, interpreting test results) and business (unit economics, cash conversion cycle) coaching. Eight lessons also offer deterministic checked-answer coaching with worked references for piano timing, Spanish conversation and chess castling; the other four offer step-specific written guidance without pretending to grade arbitrary answers. The 87-unit curriculum, older practice, offline files and saved progress remain intact. See [the original V132 checked-coaching changes](docs/SPECIFIC_TEACHING_V132.md) and [the medicine/business extension](docs/AUTHORED_MEDICINE_BUSINESS_V132.md).

V130 combines the concurrent V127–V129 coaching branches with the deeper lessons and checked-answer coach already saved here. Both worked cases in all 87 units now offer optional help for a specific step, a comparison with the authored reasoning, a fresh question and a recall prompt. Five lessons also offer targeted answer feedback. The complete teaching stays visible by default; microphone input uses on-device recognition when available. See [the integrated coaching notes](docs/INTEGRATED_COACHING_V130.md).

V128 adds an optional **Talk it through** coach to five lessons in piano, Spanish, chess, calculus and physics. Fifteen specific decisions have checked answers, targeted mistake feedback and thirty explanations of common sticking points. You can keep working notes, use local dictation where the browser supports it, and see the teacher’s full reasoning at any time. These are authored checks; arbitrary explanations are not graded. All V127 content remains. See [the coaching behavior and limits](docs/STEP_COACH_V128.md).

V127 adds an optional step-by-step walkthrough to both worked cases in every full-course unit across all seven subjects. Learners can try their next move before revealing a step, show the conclusion at the end, or return to the complete solution immediately. Reading still requires no quiz, no scoring or changes to saved progress. See [guided walkthrough behavior](docs/GUIDED_STEPS_V127.md).

V127 also rewrites eight further lessons in piano, Spanish, chess, calculus and physics, with 30 worked steps and nine reference tables. Shared piano demonstrations add slower playback, selectable count-ins and beat clicks, and a written timing guide that follows the music. Earlier teacher notes remain available as an alternative explanation. All 87 base unit records, projects, workshops and unrelated archived content are retained. See [the teaching and piano changes](docs/TEACHING_AND_PIANO_V127.md).

V126 rewrites the displayed teaching in six beginner lessons: piano hand routes and held notes, Spanish sentence building, pronunciation and questions, and chess capture accounting. Twenty-two primary worked steps and seven reference tables make each action explicit. The chess boards now explain that both sparse endings are drawn. Teaching keyboards retain playable touch sizes in a contained horizontal scroll area. All 87 base records, earlier demonstrations, V125 variations and progress backups remain. See [the revision notes](docs/LESSON_REVISIONS_V126.md).

V125 adds five visible teaching variations with 21 choices: compose a tiny piano reply, adapt a café exchange, compare mate/stalemate/a safe king reply, follow a toy car's one-second intervals and draw a sliding cart's force account. Each shows the complete reasoning; none adds a quiz gate or writes assessment successes. All V124 unit, project and workshop records remain exact. See [the lesson changes](docs/LESSON_VARIATIONS_V125.md).

V124 adds one portable progress backup for all seven courses, project/workshop chapters, notebook notes and practice records. Restore previews changes, offers a conflict choice and supports session Undo, with previous-data recovery when browser storage fails. All 215 V123 teaching assets remain unchanged. See [the backup behavior and verification](docs/PORTABLE_PROGRESS_V124.md).

V123 restores twelve interactive medicine/business figures from the original Claude V120. Their corrected models explain separate working-capital balances, price/volume changes, feedback, approximate mean pressure, water balance, first-order decay and predictive values. Responsive diagrams and numerical tables work with keyboard controls; all 87 V122 unit records and the other 213 embedded assets remain unchanged. Incoming figure IDs now have preservation checks alongside course data. See [the restoration accounting](docs/RESTORED_FIGURES_V123.md).

V122 adds slower teaching to fourteen difficult units across all seven courses: 51 additional step explanations and four tables make rhythm, denominators, cash timing and algebra explicit. All V121 lessons, projects, workshops, review state and accessibility repairs remain. See [the teaching changes](docs/TEACHER_NOTES_V122.md).

V121 merges the actual uploaded Claude V120 into our V119 source: 22 new medicine/business units, their two projects and workshops, calculus/physics workshops, and per-unit reading/self-review controls. All 65 earlier units, demonstrations and accessibility repairs remain. The original upload is archived unchanged, and factual corrections are recorded separately. See [the merge accounting](docs/CLAUDE_V120_MERGE_V121.md).

V119 checks Claude’s critique against the current app and independently repairs keyboard focus in the studio shell, native-dialog Escape handling, invalid course-name lookups and slider values with units. All five readers now have skip links that preserve the current lesson. The supplied HTML was the already-merged older V113; its claimed V119 code was not attached. All V118 teaching data remains unchanged. See [the verified findings](docs/CLAUDE_REVIEW_V119.md).

V118 deepens twelve existing worked cases across six maths and physics lessons. Thirty-nine additional teacher explanations connect each calculation to a selectable diagram. Phone layouts show the entire graph, force diagram or circuit without sideways scrolling. Earlier adjustable explorers remain in an optional section, and all V117 course records, workshops and projects are retained exactly. See [the teaching notes](docs/SLOW_TEACHING_V118.md).

V117 added three teacher workshops with twelve chapters: repairing a piano join with audible error/correct/reduced models, building Spanish replies with thirteen authored exchanges and phrase roles, and comparing four chess decisions through eight independently legal continuations. All earlier course and project records remain unchanged. Workshops have their own saved chapter and no quiz gates.

V116 connected sixty worked steps directly to their demonstrations and adds an optional maths help desk: seven explanations and fourteen worked examples covering fractions, equations, square roots, quadratics, graph reading, signs/units, and rates/accumulation. All V115 course and project records remain unchanged.

V115 added five complete, four-part teaching projects: an original two-hand piano piece; a full Spanish afternoon with adaptable plans and orders; Morphy’s complete Opera Game; a changing-rate tank with overflow; and a hill–collision–spring energy account. Project parts save their own reading place and appear on the course maps. There are no project quiz gates. See [the project notes](docs/COURSE_PROJECTS_V115.md).

V114 merged Claude's content expansion into the existing 65-unit courses: Spanish 15, piano 14, chess 14, calculus 11 and physics 11. Every unit now has a takeaway, complete misconception reasoning and two optional practice items. All 16 imported figures remain available alongside the newer V113 demonstrations. Three named chapters organize each course. Each unit contains explanatory teaching and two complete worked cases. **Full curriculums** shows the longer sequences, preserved original practice material, and **Quick worked lessons** links. The 38 short lessons remain available across 11 subjects. These are introductory foundations, not complete professional training.

## Edit and build

Python 3.10+ builds the standalone app without production dependencies:

```sh
python3 scripts/build.py
python3 -m http.server 8769 --directory public
```

Open http://127.0.0.1:8769. `public/index.html` and `public/study-table-v132.html` contain the same self-contained app. Keep the generated public files in the commit alongside source edits.

- `source/teacher-prose-v109.json`: rewritten explanations in existing lessons.
- `source/draft-foundation-lessons.json` and `source/lessons-v109.json`: the 12 new lessons. The historical `draft-` filename is retained for build compatibility; these records are now published.
- `source/openings-v109.json`: plain-language openings and takeaways for the new lessons.
- `source/demos_v109.py`: dialogue lines, piano events and chess frames.
- `source/demos-v109.js`: accessible playback and board controls.
- `source/theme-v109.css`: the current palette.
- `source/theme-state.js`: the shared light/dark preference; both theme controls and legacy saved preferences must stay synchronized.
- `source/full_courses.py`: course order, reuse of existing teaching, and full-course HTML assembly.
- `source/curriculum-new-*.json`: the 21 additional full-course units.
- `source/curriculum-bridges-*.json`: ten prerequisite and bridge units added in V111.
- `source/curriculum-expansion-v112.json`: five further applications.
- `source/editorial-v112.json`: thirteen edited explanations and the combined piano performance project.
- `source/teaching-v113.json`: seven explanation/goal revisions, including the first chess lesson’s ordinary pawn case.
- `source/teaching-panels-v113.json` and `source/teaching-panels.js`: interval choices and area, energy and collision demonstrations; sentence-view data also feeds the Spanish renderer.
- `source/claude-additions-v114.json`: all imported takeaways/reviews and 34 new misconception blocks, extracted without modification.
- `source/claude-corrections-v114.json`: targeted refinements applied separately from the original additions.
- `source/claude-figures-v114.js` and `source/claude-additions-v114.css`: all 16 reviewed imported figures and the optional practice UI.
- `source/modal-access-v119.js`: background isolation, custom-overlay keyboard/focus handling, and separation of native-dialog keys from legacy handlers.
- `source/slow-teaching-v118.json`: added teacher explanations and exact step targets for twelve existing maths and physics cases.
- `source/slow-teaching-v118.js` and `.css`: inline diagrams, compact phone drawings, origin/interval comparisons and optional earlier explorers.
- `source/teacher-workshops-v117.json`: twelve authored teaching chapters and prerequisite notes for piano, Spanish and chess.
- `source/workshop-demos-v117.json`: ten piano models, thirteen Spanish exchanges and eight legal chess lines; regenerate with qa/generate-workshop-demos.py.
- `source/teacher-workshops-v117.js` and `.css`: workshop navigation, sentence-part explanations, beat grids, model playback and saved chapters.
- `source/math-desk-v116.json`: seven authored maths explanations, with two complete worked examples each.
- `source/project-walkthrough-v116.json`: sixty exact demonstration targets tied to existing worked steps.
- `source/clarity-v116.js` and `.css`: inline demonstration placement, contextual maths help, focus return and responsive modal.
- `scripts/package-downloads.py`: prepares a separate online app and versioned HTML/ZIP downloads, retaining earlier editions and setting attachment headers; does not deploy.
- `source/course-projects-v115.json`: all 20 authored project parts, with complete worked teaching and links to prerequisite units.
- `source/course-projects-v115.js` and `.css`: project navigation, annotated board, two-hand score/playback, translated conversation and physical/mathematical models.
- `source/project-demos-v115.json`: original eight-bar music, 16 conversation turns and all 34 chess positions. Regenerate with `qa/generate-project-demos.py` during development; no chess dependency is needed for production.
- `source/imports/`: unchanged original uploads and provenance; these files are not executed by the build.
- `source/course-stages.json`: the three chapter boundaries and purposes in each course.
- `source/course-reader.js` and `.css`: course maps, written units, notation, optional worked variations, and reading position.
- `source/course-figures.js`: adjustable interval, motion, force and circuit diagrams, with written calculations and accessible descriptions.
- `source/full-course-demos.json`: committed demonstration data, independently checked against its generator and chess rules in tests. Production builds need no chess dependency.
- `source/full-course-parent.js` and `.css`: archive integration, practice returns, focused course layout, and main-screen full-course resume.
- `source/Study_Table_V108.html`: the preserved baseline, including the original compressed course archive and earlier lesson engine. New changes build on it; do not edit compiled V109 HTML directly.

Keep lesson IDs stable because existing browser progress refers to them. If a full-course unit is combined, preserve its ID through `ALIASES` and both parent/reader resolution; do not orphan old reading places. Reading position is separate from assessment records. Same-day retries must not become independent recall successes. Do not label visits or self-checks as expertise.

## Checks

```sh
npm ci
python3 -m pip install -r requirements-test.txt
npx playwright install chromium
npm test
python3 scripts/build.py --check
```

The test runner starts its own local server. `CHROME_BINARY` can select an installed Chromium binary. Browser checks cover taught lessons, all 87 full-course units, merged bookmarks, chapter maps, diagram calculations and drawn circuit connections, optional practice, saved work, media scheduling/cancellation and mobile layout. `python-chess` verifies the worked chess lines, pawn blockers and stated outcomes. See docs/CURRICULUM_EDIT_V112.md for the earlier editorial comparison and docs/TEACHING_V113.md for the richer demonstrations. Subject accuracy still needs independent review; automated checks do not prove learning gains.

Local delivery checks also exercise `/app/`, actual browser HTML/ZIP downloads, the app’s download button, source hashes and earlier-edition preservation. Public Vercel and API requests are currently blocked from this workspace. Earlier deployment receipts do not establish that V132 is live; GitHub upload, local delivery and hosted publication are verified separately.

The contrast regression seeds conflicting legacy/current theme preferences, clicks both actual theme controls, reloads, and checks visible text contrast with axe-core across the taught lessons and main dialogs.

V114 also verifies the unchanged original uploads, every extracted Claude addition, all prior V113 lesson fields, all 16 imported explorations, the corrected numerical states and the optional two-answer interface. The complete accounting is in docs/CLAUDE_MERGE_V114.md.

## Vercel and GitHub

After the workspace download link failed, the user explicitly authorized Vercel publication. Use the separate study-table-downloads project for the online app and actual HTML/ZIP downloads. The earlier study-table-v102 project is not changed. Keep previous versioned downloads available. The new project has public access so the downloads do not require a Vercel login.

This is a separate project from LaunchWell Labs. Source and release history are connected to [ijakesilverstein/study-table](https://github.com/ijakesilverstein/study-table): main and all 17 release tags through V126 were pushed and verified before the V127 work. The V127 release combines the concurrent guided-example branch with the teaching and piano improvements. The existing GitHub Actions checks also package the current HTML and ZIP as downloadable run artifacts. See [GitHub delivery](docs/GITHUB_DELIVERY.md). This artifact workflow does not deploy a website.

The canonical `.vercel` link is historical (`study-table-v102`); that project was unavailable through the current connection. Publish through the separate `study-table-downloads` staging project in the `jakesilverstein` scope. `vercel.json` serves the checked, committed files in `public/` without a deployment-time lesson build; the previously deployed versioned HTML links download as files. The download project is packaged separately; its online app and latest downloadable HTML are identical. Do not enable automatic Git deployments without a separate request. Credentials and the local `.vercel` project link stay outside Git history.

Progress is stored on the learner’s device. GitHub and Vercel deployment do not synchronize that progress between devices. Original course content is preserved in the baseline; its inclusion here does not grant permission to redistribute it publicly.
