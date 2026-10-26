# Study Table

An offline-capable learning app, published at https://study-table-v102.vercel.app.

V112 refines the five written courses into 65 teaching units: Spanish 15, piano 14, chess 14, calculus 11 and physics 11. Thirteen explanations were tightened, two overlapping units were combined, and five further units teach pronunciation, chord progressions, pawn races, integral substitution and circuit connections. Three named chapters organize each course. Each unit contains explanatory teaching and two complete worked cases; variations are optional. Main subject controls open these courses by default. **Full curriculums** shows the longer sequences, preserved original practice material, and **Quick worked lessons** links. The 38 short lessons remain available across 11 subjects. These are introductory foundations, not complete professional training.

## Edit and build

Python 3.10+ builds the standalone app without production dependencies:

```sh
python3 scripts/build.py
python3 -m http.server 8769 --directory public
```

Open http://127.0.0.1:8769. `public/index.html` and `public/study-table-v112.html` contain the same self-contained app. Keep the generated public files in the commit alongside source edits.

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

The test runner starts its own local server. `CHROME_BINARY` can select an installed Chromium binary. Browser checks cover taught lessons, all 65 full-course units, merged bookmarks, chapter maps, diagram calculations and drawn circuit connections, optional practice, saved work, media scheduling/cancellation and mobile layout. `python-chess` verifies the worked chess lines and stated outcomes. See docs/CURRICULUM_EDIT_V112.md for the editorial comparison. Subject accuracy still needs independent review; automated checks do not prove learning gains.

The contrast regression seeds conflicting legacy/current theme preferences, clicks both actual theme controls, reloads, and checks visible text contrast with axe-core across the taught lessons and main dialogs.

## Vercel and GitHub

This is a separate project from LaunchWell Labs. The intended GitHub repository is private `ijakesilverstein/study-table`. Remote creation and Vercel Git integration must be confirmed before describing GitHub as connected.

The existing Vercel project is `study-table-v102`, in the `jakesilverstein` scope. `vercel.json` builds the app and serves `public/`; versioned HTML links download as files. Once the GitHub integration is connected, pushes to the production branch can deploy this project. Credentials and the local `.vercel` project link stay outside Git history.

Progress is stored on the learner’s device. GitHub and Vercel deployment do not synchronize that progress between devices. Original course content is preserved in the baseline; its inclusion here does not grant permission to redistribute it publicly.
