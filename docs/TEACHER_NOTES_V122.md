# V122: explain the steps people get stuck on

Fourteen existing units gain a short, visible lead-in and 51 explanations beside their first worked example. The new teaching contains about 3,200 words plus four tables without adding quiz gates, formal units or mastery claims. The new lead-in replaces the displayed opening in these fourteen units, avoiding consecutive introductions; the earlier opening remains preserved in the course source data and V121 edition. The second example remains available for comparison, and practice stays optional and closed initially.

| Course | Existing units | What the extra teaching explains |
| --- | --- | --- |
| Spanish | noun-phrases, spanish-2 | Change each word in an order; build and adapt a completed past account; explain contractions, endings and stress. |
| Piano | piano-5, read-melody | Separate each hand's job on every beat; prepare the simultaneous start; count the final held note through its entire duration. |
| Chess | count-exchanges, pins | Account for both captures and the surviving pawn; trace the entire pin line; distinguish an illegal exposure of the king from a costly exposure of the queen. |
| Calculus | derivative-rules, integral-substitution | Keep position and rate on separate lines; explain each power-rule operation; replace the inside expression together with its change; verify the antiderivative. |
| Physics | physics-2, physics-5 | Solve the energy equation with concrete amounts before letters; explain the square root and units; conserve signed system momentum using both masses. |
| Medicine | gas-exchange, test-interpretation | Separate ventilation, perfusion and diffusion; calculate the sphere comparison; distinguish the denominators in sensitivity, specificity and predictive value. |
| Business | cash-cycle, cac-ltv | Follow actual payment dates; distinguish cycle days from working-capital dollars; show cumulative contribution after CAC and whole-order payback. |

The tables show four piano beats, the complete 10,000-person test-result breakdown, one inventory batch's dated cash events, and acquisition payback after each order. They are semantic tables with captions, column headers and row headers, and fit at 320px. Text uses the existing tested palette in both themes.

Earlier-unit links appear only where helpful and always lead to an already-taught unit. These use the existing reader navigation, preserve course history and do not change assessment evidence. All new teaching is visible without answering a question or opening a disclosure. Unaffected units gain no empty sections.

`source/teacher-notes-v122.json` contains the additional authored teaching. Its renderer and style are `source/teacher-notes-v122.js/.css`; each course embeds only its own notes. Existing course records remain unchanged except for three explicit original/replacement edits in `source/teaching-edits-v122.json`: remove an unsupported claim that retention is usually easier to improve than acquisition cost, and qualify two statements that overgeneralized the alveolar area comparison. The Claude V120 raw upload, original extracted pack and earlier correction records remain unchanged.

`qa/check-teacher-notes.py` compares all V121 course records after the three documented edits, verifies that unrelated archive assets are unchanged, checks every new note's alignment and prerequisite order, and independently recomputes the numerical claims. `qa/test-teacher-notes.cjs` exercises every guide, step and table, real prerequisite navigation, repeated rendering, 320/390px widths, both themes, table accessibility and unchanged assessment evidence. The full existing regression suite remains required. Automated arithmetic and browser checks do not replace subject-expert review or learner testing.

The complete `npm test` suite passed for this release, including all 87 lesson readers, older audio and demonstrations, projects/workshops, keyboard access, review persistence and actual local browser HTML/ZIP downloads. The focused new teaching suite also passed. Phone screenshots were inspected at 390px and the medical table at 320px; its headings were shortened to keep words readable. Build/source checks and `git diff --check` passed. Public Vercel HTTP requests are blocked by the workspace proxy; deployment verification uses the Vercel API and uploaded file hashes.
