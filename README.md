# Study Table

An offline-capable learning app. Current downloads and online access are published separately at https://study-table-downloads.vercel.app. The earlier app project is not modified by this delivery workflow.

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

Open http://127.0.0.1:8769. `public/index.html` and `public/study-table-v121.html` contain the same self-contained app. Keep the generated public files in the commit alongside source edits.

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

The test runner starts its own local server. `CHROME_BINARY` can select an installed Chromium binary. Browser checks cover taught lessons, all 65 full-course units, merged bookmarks, chapter maps, diagram calculations and drawn circuit connections, optional practice, saved work, media scheduling/cancellation and mobile layout. `python-chess` verifies the worked chess lines, pawn blockers and stated outcomes. See docs/CURRICULUM_EDIT_V112.md for the earlier editorial comparison and docs/TEACHING_V113.md for the richer demonstrations. Subject accuracy still needs independent review; automated checks do not prove learning gains.

Local delivery checks also exercise `/app/`, actual browser HTML/ZIP downloads, the app’s download button, source hashes and earlier-edition preservation. Public Vercel requests are blocked by this workspace’s network policy; deployment readiness/settings and uploaded hashes are verified through its API.

The contrast regression seeds conflicting legacy/current theme preferences, clicks both actual theme controls, reloads, and checks visible text contrast with axe-core across the taught lessons and main dialogs.

V114 also verifies the unchanged original uploads, every extracted Claude addition, all prior V113 lesson fields, all 16 imported explorations, the corrected numerical states and the optional two-answer interface. The complete accounting is in docs/CLAUDE_MERGE_V114.md.

## Vercel and GitHub

After the workspace download link failed, the user explicitly authorized Vercel publication. Use the separate study-table-downloads project for the online app and actual HTML/ZIP downloads. The earlier study-table-v102 project is not changed. Keep previous versioned downloads available. The new project has public access so the downloads do not require a Vercel login.

This is a separate project from LaunchWell Labs. The intended GitHub repository is private `ijakesilverstein/study-table`. Remote creation and Vercel Git integration must be confirmed before describing GitHub as connected.

The canonical `.vercel` link is historical (`study-table-v102`); that project was unavailable through the current connection. Publish through the separate `study-table-downloads` staging project in the `jakesilverstein` scope. `vercel.json` builds the app and serves `public/`; the previously deployed versioned HTML links download as files. The download project is packaged separately; its online app and latest downloadable HTML are identical. Do not enable automatic Git deployments without a separate request. Credentials and the local `.vercel` project link stay outside Git history.

Progress is stored on the learner’s device. GitHub and Vercel deployment do not synchronize that progress between devices. Original course content is preserved in the baseline; its inclusion here does not grant permission to redistribute it publicly.
