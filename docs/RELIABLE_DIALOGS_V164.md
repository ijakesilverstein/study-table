# V164 Reliable Learning — reproducible reconciliation checkpoint

This release builds on draft PR #12 (V163), which is generated from canonical V136 (main commit 4be2c616). The V164 branch adds the smallest possible change to the delivered standalone HTML while preserving the original production `index.html`, V136 87-unit curriculum, and V136 worked-example visuals.

## Root cause and repair

HTML `<dialog>` dispatches a `close` event on a later task. If the learner immediately reopens a backup or curiosity session, an old `close` event can arrive while the dialog is open again. Previously the backup callback cleared `pending`, hid a new preview, reset conflict choice, and incremented the `readingFile` generation even though the NEW session was open. The coaching callback could move focus back to a background trigger during a new session.

The optional `scripts/build-v164.py` adds an explicit guard `if(d.open)return;` to **both** close callbacks in the standalone V164 output. No underlying backup validation, import merge rules, stored data, lesson text, authored questions, or embedded archives are changed. The fix applies to V164; it is NOT a backport to the original V136 production bundle.

The older `qa/test-progress-backup.cjs` sometimes raced itself: it closed the backup dialog, and then used a legacy upload field without awaiting the queued `close` event. The test now synchronizes on that event before using the legacy field. This does not weaken the import assertions. The new `qa/test-dialog-race-v164.cjs` tests the **opposite** scenario deliberately by dispatching a stale close event while the dialog is OPEN, and asserting new restore preview/data and tutor focus are preserved. This reproduces a failure in V163 and passes in V164.

## Safe build

```sh
python3 scripts/build.py --check
python3 scripts/build-v163.py
python3 scripts/build-v164.py
python3 scripts/build-v164.py --check
node qa/test-dialog-race-v164.cjs
npm test
```

The optional V164 preview is generated at `public/study-table-v164.html` and `source/Study_Table_V164.html`. These generated files are intentionally not tracked in this PR. The dedicated V164 workflow uploads its HTML as an artifact; no deployment or replacement of `public/index.html` is authorized. Keep Codex review PR #8 and story PR #9 independent.

## Remaining gate

Full GitHub Actions and real learner testing are required before merging or publishing. A future canonical backport should fix the source `progress-backup-v124.js`, rebuild and commit canonical V136 generated output, and re-run the full suite, rather than changing the generated output alone.
