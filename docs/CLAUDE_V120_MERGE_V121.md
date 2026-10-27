# Actual Claude V120 merged as V121

The user supplied `Study_Table_V120.html`, 6,739,561 bytes, SHA256 `b197ad688aa40235a6441cc8b6fc6cf6121152e6620908258f525c9611bd7734`. It is archived unchanged at `source/imports/claude-v120-original.html`. This is the actual newer implementation, unlike the older V113 supplied with the previous critique.

## Complete accounting

| Incoming addition | Merged result |
| --- | --- |
| Medicine foundation course | All 11 units, 22 worked cases, three curriculum stages, four project parts and four workshop chapters. |
| Business foundation course | All 11 units, 22 worked cases, three curriculum stages, four project parts and four workshop chapters. |
| Calculus workshop | All four chapters comparing methods: average/instantaneous rate, expansion/product rule, chain rule and definite integrals. |
| Physics workshop | All four chapters: force/energy, collision conservation, graph features and circuit connections. |
| Per-unit reading and self-review implementation | Imported functions and styles provide opened markers, optional self-ratings, course-map summaries, a revisit list and confirmed reset. Its original storage key is retained. |
| Overlapping shell repairs | Keep our existing V119 course-key validation, unit-bearing slider values, custom-modal focus handling, native-dialog Escape handling, working local skip links and usable Learning tools launcher. Do not install a second competing focus observer. |

There are now **87 formal units, seven projects and seven workshops across seven courses**, with 215 embedded assets. All 65 earlier unit records are unchanged, as are their five projects and three earlier workshops. The 38 quick lessons, original practice studios and all unrelated bundled material remain. New medicine/business course links open their full readers; their original longer applications remain reachable through the practice-material links. Generic project/workshop API destinations resolve to the imported stable IDs, so both new and existing reading places work.

## Source and corrections

`source/claude-additions-v121.json` contains the extracted additions exactly as uploaded. `source/claude-corrections-v121.json` records each original value and its replacement at a precise course-data path. The original source remains recoverable; the build asserts the original value before applying a correction.

The corrections include:

- Working capital uses receivables at sales value, inventory at cost and payables at cost. Daily revenue multiplied by cash-cycle days is not the same calculation. The simple model states its cost-basis and timing assumptions.
- Sunrise Oats has $61,800 of initial modeled operating working capital and $123,600 at twice the volume. The increase is $61,800; the simplified profit-to-cash bridge is $16,200 − $61,800 = −$45,600. Extending supplier terms releases $46,800 under the stated model, rather than $72,000.
- Financing $61,800 today at 15% annual compounding for two years implies $81,730.50 repayment. Discounting an unchanged future amount does not raise that same amount today.
- One-year contribution is labeled as such rather than treated as lifetime value. Payback in orders is distinguished from elapsed payback time, and whole-unit pricing thresholds round upward where required.
- A respiratory quotient of 0.8 means carbon dioxide production is less than oxygen consumption. Normal pressure or saturation alone cannot establish adequate flow, content or delivery.
- Filtration retains blood cells and most proteins; reabsorption, secretion and changing filtration all matter. Glucose thresholds have a transition range. Fever can change the set point. Insulin pairs and gas measurements do not independently diagnose their underlying mechanism.
- Claims that quadratics are the only functions whose midpoint rate can equal an interval average, or that geometry/antiderivatives always supply a particular integration route, are qualified.

These are educational explanations with explicit model assumptions. Automated checks do not substitute for independent clinical or curriculum review.

## Reading is separate from assessed skill

The imported personal-review module uses `studytable:full-course:SUBJECT:progress`. Existing compatible records are read; malformed values and unknown unit IDs are ignored. It records an opened unit and the learner’s own “I had it” or “Needs another look” selection. Text explicitly identifies these as reading history and self-assessment. It does not write assessment success or mastery to `studytable_v102_learning`. Reset applies only to that course’s personal-review record; the reading place and existing notes remain.

The module is initialized safely before the shared reader; imported written projects/workshops do not try to start nonexistent demonstrations. Earlier interactive projects, piano playback, Spanish speech, chess boards and V118 diagrams continue to use their existing tested players.

## Verification

`qa/check-claude-v120.py` compares the archived upload with the extracted source, applies every recorded correction, and requires the complete resulting course data to equal the build. It independently checks the key corrected arithmetic and verifies preservation of all original assets, units, projects and workshops.

`qa/test-claude-v120.cjs` exercises personal-review controls and persistence/reset in all seven courses, the sixteen imported workshop chapters, eight new project parts, saved chapter resume, phone layout, both themes, blocked storage and unchanged assessment records. The full-course suite now visits and contrast-checks all 87 units. Historical preservation checks retain their original five-course comparisons; the new merge check covers the additions rather than weakening preservation requirements.

The full regression suite also retains the prior audio, chess, challenge, curriculum, theme, demonstration, focus, skip-link and browser HTML/ZIP delivery checks. Earlier downloadable releases remain available.
