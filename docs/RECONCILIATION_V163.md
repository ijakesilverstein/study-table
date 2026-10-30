# V163: First source-backed reconciliation of authored coaching with canonical V136

The baseline is exact GitHub Actions artifact `study-table-downloads`, run 40926481429, commit `4be2c6160aac0c73ed8ba14ec53f908689946270`: 7,140,086 bytes, SHA-256 `26e79a555b74d24b61edb506e13cbddcde26b1e859b099fc5e47107721750cd0`. This is the actual V136 Codex output, **not** the earlier independent V162 shell.

`source/focus-reconciled-v163.js` and `.css` port the authored V162 curiosity and misconception-repair loop onto the real V136 home (`#v90Hero`). Eleven authored subject challenges include a choice-specific clarification, prerequisite mini-question, optional worked reasoning, a second attempt, and an authored transfer check. Subject selection is native to the card. Seven subjects link to their intact canonical course units; four additional curiosity topics link safely to the existing subject browser. Experiment buttons only appear when the corresponding engine exists (it does not in canonical V136). Self-explanation remains ungraded and ephemeral. No AI/API or microphone feature is claimed.

`scripts/build-v163.py` injects the two source modules after the last `</body>` and writes the optional `public/study-table-v163.html` alongside (rather than replacing) V136 `index.html`. Both historical title assignments update to V163. The canonical full-bundle script is byte-identical. Existing V136 manual lesson companions and their parent/child interaction code are entirely preserved. No Git branch or unmerged PR is overwritten.

To build and test from canonical source:

```
python3 scripts/build.py
python3 scripts/build-v163.py
python3 scripts/build-v163.py --check
python3 qa/check-reconciled-v163.py
node qa/test-reconciled-v163.cjs
npm test
```

**Validation boundary:** local Playwright checks verified 11 focus flows, five widths, no page exceptions, and separate source-parity checks verified all 215 archived pages and seven V136 visual-companion course pages. Full legacy `npm test` still belongs to the canonical repo and its GitHub Actions run; do not claim it passed until the V163 integration workflow reports success. The extra V137–V155 independent games and labs are not merged here. Separate PR #8 (review) and PR #9 (story) remain unmerged.

No Vercel deployment. Do not replace production `index.html` until the dedicated V163 build and legacy tests pass and a real learner has tried the new home.
