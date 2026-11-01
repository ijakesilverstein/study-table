# Study Table V209 — Complete GitHub source

The latest complete offline release is **V209: Learn, Apply & Review**, not the older V169 snapshot on `main`.

## Rebuild locally

```bash
python3 scripts/build-v209.py
# Writes: public/study-table-v209.html
```

Open `public/study-table-v209.html` in any modern browser. No account, API, backend, or internet service is required by the new V209 assessment module. To validate without writing output:

```bash
python3 scripts/build-v209.py --check
node --check source/st209-chapter-checks.js
node --check source/st209-review-backup.js
```

## Why the HTML is stored in 22 parts

The 8,493,961-byte standalone HTML exceeded the connected GitHub upload limit. The complete original, with all earlier subject content and Spanish V4, is stored **byte-for-byte** in `source/v209-html-parts/part-000.txt` through `part-021.txt`. The builder concatenates bytes in order and refuses to write a corrupted build.

- Exact uncompressed HTML size: **8,493,961 bytes**.
- SHA-256: `ae03425c213b187335b06a65f9d402cb72f3b57125917744ceab91689916b52c`.
- All 22 remote Git blob hashes were checked against independently calculated local originals.

## Editable assessment code

- `source/st209-chapter-checks.js` — 156 authored questions across 39 chapters, teaching notes, corrections, review cadence.
- `source/st209-review-backup.js` — chapter-review backup and restore.
- `source/st209-learning-style.css` — chapter lesson and review styles.

**Source-file edits will not automatically update the checked-in archive.** After modifying source files, integrate into a fresh standalone HTML, test in a real browser, and publish the next release as a new version. Avoid claiming edited overlay code is reflected in V209's archived HTML until it has been rebuilt.

## Release safeguards

- `main` remains the previous V169 project until reconciled and tested.
- This branch contains V209 as an **offline artifact**, not an automatically deployed website.
- Do not deploy the older `main` build over V209.
- Review accessibility, chapter grading, backup round trips, browser persistence, and mobile layout before moving the web app to production.
