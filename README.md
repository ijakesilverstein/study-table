# Study Table

An offline-capable learning app, published at https://study-table-v102.vercel.app.

The V109 taught layer has 38 lessons across 11 subjects. Piano, Spanish and chess have expanded sequences with demonstrations; questions are optional. The original longer courses and readers remain available through **Full curriculums**. The short sequences are introductory teaching, not complete professional training.

## Edit and build

Python 3.10+ builds the standalone app without production dependencies:

```sh
python3 scripts/build.py
python3 -m http.server 8769 --directory public
```

Open http://127.0.0.1:8769. `public/index.html` and `public/study-table-v109.html` contain the same self-contained app. Keep the generated public files in the commit alongside source edits.

- `source/teacher-prose-v109.json`: rewritten explanations in existing lessons.
- `source/draft-foundation-lessons.json` and `source/lessons-v109.json`: the 12 new lessons. The historical `draft-` filename is retained for build compatibility; these records are now published.
- `source/openings-v109.json`: plain-language openings and takeaways for the new lessons.
- `source/demos_v109.py`: dialogue lines, piano events and chess frames.
- `source/demos-v109.js`: accessible playback and board controls.
- `source/theme-v109.css`: the current palette.
- `source/theme-state.js`: the shared light/dark preference; both theme controls and legacy saved preferences must stay synchronized.
- `source/Study_Table_V108.html`: the preserved baseline, including the original compressed course archive and earlier lesson engine. New changes build on it; do not edit compiled V109 HTML directly.

Keep lesson IDs stable because existing browser progress refers to them. Reading position is separate from assessment records. Same-day retries must not become independent recall successes. Do not label visits or self-checks as expertise.

## Checks

```sh
npm ci
python3 -m pip install -r requirements-test.txt
npx playwright install chromium
npm test
python3 scripts/build.py --check
```

The test runner starts its own local server. `CHROME_BINARY` can select an installed Chromium binary. Browser checks cover taught lessons, optional practice, saved work, curriculum access, media scheduling/cancellation and mobile layout. `python-chess` independently verifies every new worked line. Subject accuracy still needs independent review; automated checks do not prove learning gains.

The contrast regression seeds conflicting legacy/current theme preferences, clicks both actual theme controls, reloads, and checks visible text contrast with axe-core across the taught lessons and main dialogs.

## Vercel and GitHub

This is a separate project from LaunchWell Labs. The intended GitHub repository is private `ijakesilverstein/study-table`. Remote creation and Vercel Git integration must be confirmed before describing GitHub as connected.

The existing Vercel project is `study-table-v102`, in the `jakesilverstein` scope. `vercel.json` builds the app and serves `public/`; versioned HTML links download as files. Once the GitHub integration is connected, pushes to the production branch can deploy this project. Credentials and the local `.vercel` project link stay outside Git history.

Progress is stored on the learner’s device. GitHub and Vercel deployment do not synchronize that progress between devices. Original course content is preserved in the baseline; its inclusion here does not grant permission to redistribute it publicly.
