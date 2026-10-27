# Portable progress in V124

Back up or restore is available on the home screen and in Learning tools. Save a JSON file, carry it to another browser or device, and restore it there. Downloading a new HTML edition by itself does not transfer browser storage. The app stays offline and requires no account.

The backup includes all seven full-course reading places, personal seen/revisit marks, project and workshop chapters, notebook notes/bookmarks/recent links, quick-lesson learning records and recognized earlier guided/practice data. It excludes unrelated browser-storage keys. Reading and personal confidence remain distinct from assessed results. All 215 embedded V123 assets, including 87 formal units and their projects, workshops and figures, remain unchanged.

## Restore behavior

Choosing a file validates it and shows a preview without saving anything. The filename and available export date help identify the copy. Keep this browser's item is the default for conflicts; Use the file's item is an explicit alternative. New list items are merged without duplicates. Main quick-lesson attempt records are selected as whole records; counters are never added. A preview becomes invalid if relevant saved or session work changes before Apply.

Restore verifies each write. If saving fails, it attempts to restore exactly the previous persisted values and retains unsaved session data. When recovery writes also fail, the message says so and offers a downloadable previous-data copy while this page remains open. Undo is available in the current page session, refuses to replace subsequent work, and preserves notes that previously existed only in session memory. Reload clears the session Undo/recovery copy and refreshes open exercises; save any needed recovery copy first.

The existing notebook and practice export/import controls now use the same export and preview flow. Older progress formats 56/57, notebook formats 1/2 and schema-1 quick-learning files are accepted when their records belong to this edition.

## Storage and validation

`source/progress-backup-v124.js` owns the format, validators, merge plan and UI; its CSS is shell-only. Envelope: `format: study-table-backup`, `schemaVersion: 1`, `appVersion: 124`, `exportedAt`, and `records` mapping known storage keys to raw strings. File inputs and downloads are limited to 16 MiB. Tree/list/text bounds, inherited-key rejection, typed records, known course/unit/chapter IDs and known notebook paths are validated before writes. Text is rendered as text. No executable lessons, passwords or arbitrary storage keys are imported.

Full-course keys are `studytable:full-course:SUBJECT:reading`, `:progress`, `:reading:project-part` and `:reading:workshop-part`; the chapter indices are 0–3. Resume uses `studytable:full-course:last`. The offline iframe facade stores recognized course data under `study-table-v19:course-store:PATH`; canonical reader records and their facade copies are synchronized in the backup/restore plan so records can move between normal and opaque iframe storage contexts. Shell session-cache hooks export notes even when their original storage write failed, invalidate only changed records after success and protect cache changes after preview.

## Verification

`qa/check-progress-backup.py` compares every embedded archive entry to V123 and checks matching compiled editions. `qa/test-progress-backup.cjs` exercises actual browser downloads and file inputs, all seven courses and both chapter positions, resume after reload, notebook text safety, conflict choices, repeat-import idempotence, stale previews, Undo protection, session-only notes, quota failures, incomplete rollback and recovery-file download. It covers legacy formats and visible notebook controls, storage-facade transfer, keyboard/Escape behavior, 320/360/390-pixel layouts and both themes with scoped axe checks. Both checks run in `npm test` with the existing regression suite.
