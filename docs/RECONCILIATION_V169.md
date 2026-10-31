# V169: published work combined, teaching first

V169 combines the published V163–V168 course improvements with the parallel learning-journey branch. It preserves the V136 teaching foundation and all 87 units. The new standalone download is `public/study-table-v169.html`; this change does not replace `public/index.html` or publish a Vercel site.

## What the learner gets

- Seven course paths connect an authored story, practice on that same skill, and the full lesson. Older activities remain available under **More ways to explore**.
- **See the worked lesson first** opens the explanation directly from the learning home. It does not require answering the curiosity questions. **Home** returns to that learning home rather than the archive index.
- Six additional solved examples explain castling restrictions, kinetic energy and interpreting positive test results. Their 24 worked steps appear before optional practice; no answer field blocks the teaching.
- The inherited 52 checked problem variants cover 26 skills. All 87 units have an optional authored explanation prompt; arbitrary writing is not automatically graded.
- Spanish includes eight real-life scenes and 24 speaking turns, plus a conversation plan/journal. App rehearsal and self-reported real-person use remain distinct. If the device has no Spanish voice, the written model stays available and the audio button explains that audio is unavailable.
- The existing progress backup now includes optional review plans and the Spanish conversation journal. Old standalone Spanish journal files can also be previewed and restored there.

## Published source scope

These are repository snapshots inspected for this reconciliation, not access to private chat transcripts or unpublished changes:

| Published branch | Inspected commit | Treatment |
| --- | --- | --- |
| `feature/v163-reconciled-curiosity-coaching` | `f5124bf7306d4722b15d2379fb87cbdeed80deef` | Included through V168 ancestry |
| `feature/v164-reliable-dialogs` | `33dae2e52994168a91085489cad9c34735cf7943` | Included; queued dialog/file-read race fixes retained |
| `feature/v165-authored-stories-and-transfer` | `5b53b6ab11384407e20f23f54f7d13884a59dfaa` | Included; seven stories and original practice |
| `feature/v166-real-world-spanish` | `d7fc4d0ba206c83369e9801124cb0475cc36c1ae` | Included; eight scenes, plans and honest reports |
| `feature/v167-unified-learning-path` | `1743b789cfc9ffd9daa4584ecc4451312898b307` | Included; one main learning path per course |
| `feature/v168-story-matched-teachback` | `93b3e701e2fe170cb6c124405c295a69780e1b6d` | Main integration parent; exact story/practice matches and 87 prompts |
| `feature/v166-cohesive-journey-spanish-bridge` / `feature/v167-teachback-all-87` | `696ee4c5195c80acf2c752e9336d67de3214a6a6` | Second merge parent; sources and separate preview preserved; six extra cases adapted as solved teaching |

The two V166 branches independently added `scripts/build-v166.py`. The canonical file remains the real-world Spanish builder. The parallel original is preserved byte-for-byte in `source/imports/v166-journey-builder-original.py`; `scripts/build-v166-journey-preview.py` reproduces its separate preview without overwriting canonical V166. Keeping its alternate UI as a second main route would duplicate the newer V167 route, so V169 uses the newer route and brings its six extra cases into the lesson as fully worked examples. Both histories and both implementations are retained.

One explanation in the parallel physics distractors was corrected: numerical 40 comes from `10 × 4`, omitting both the square and one-half. Kinetic energy is `½ × 10 × 4² = 80 J`. The raw imported JSON remains unchanged; the displayed V169 explanation carries the correction.

## Data and preservation

The original 87 unit records, projects, workshops, earlier demonstration data, 128 precise authored help turns and visual companions remain. All 215 embedded paths remain, with the 208 non-course entries unchanged. V169 does not add its six cases to the inherited 52-question bank, so the story/practice alignment remains exact.

Optional review records merge per unit as whole `{due, level, tries}` records. Conflicts obey the preview's browser/file preference; tries are not added and levels are not promoted. A journal conflict chooses the whole browser journal or whole file journal, without synthesizing reports. Strict known-key schemas reject unknown unit/scene IDs, invalid dates and unrecognized report fields. The original restore transaction provides preview, stale-change protection, rollback, recovery and session Undo. Storage facades are synchronized with the same resolved records so an immediate Undo is valid.

`package.json`, `npm test`, the source foundation and `public/index.html` intentionally remain V136. `npm run build:latest` adds the V163–V169 layers to that foundation. The numbered V169 file has its own release/backup version and correct V169 self-download name. This distinction preserves the old reproducible baseline rather than relabeling it as the new product.

## Reproduce and check

```sh
npm ci
python3 -m pip install -r requirements-test.txt
npx playwright install chromium
npm test                 # full V136 foundation regression
npm run test:latest      # builds and checks the combined V169 download
python3 scripts/package-downloads.py --edition 169 --output /tmp/study-table-v169
```

The latest runner checks all intermediate model/preservation assertions, the parallel preview, all 87 unit prompts and 52 checked variants, story/lesson handoffs, Spanish scenes, dialog races, old progress-backup regressions, the V136 visual companions, and the new V169 interactions and backup integration. The V169-specific browser checks include six solved cases, 12 scoped phone/theme WCAG scans, direct teaching in all seven courses, no-Spanish-voice fallback, real downloaded HTML and progress files, cross-browser transfer, conflict choices, malformed imports, facade-only storage, quota rollback, stale previews, Undo and offline use after loading.

The full V136 foundation suite and the combined `npm run test:latest` runner both passed locally. A subsequent CSS-only adjustment moves the home tools launcher below the content and widens the teaching button so they do not overlap on phones; final model/parity and focused V169 browser checks cover that adjustment. The complete combined runner was run before this final layout adjustment, not again afterward. A Git push or local pass does not establish a hosted Actions result. Physical piano input, human pronunciation, real learning outcomes and every browser's file-URL storage behavior are outside this verification.

## Delivery and publication

Use the immutable tag `v169` to download the numbered HTML from GitHub. Earlier numbered releases remain available. The new **Check reconciled V169 download** workflow packages HTML/ZIP as an Actions artifact after its checks; the older **Check source and lessons** workflow still checks/packages the V136 foundation. No hosted run is claimed without inspecting it.

No Vercel deployment is authorized in this pass. Root `vercel.json` keeps `git.deploymentEnabled=false` and `buildCommand=null`; the root homepage remains byte-identical to V136. The standalone packaging script writes only a local output directory and does not deploy.


## Artifact integrity

- HTML: 7,488,800 bytes; SHA-256 `860e07bb5d5da6ca250334ff11ecaa70d6e645def8f2ebcbc67fcb9987ba3ec5`.
- ZIP: 4,527,759 bytes; SHA-256 `ab242515917773d6df55751c810a245f63724f86482d0b31fd07d6eb05b05820`.
- Source output, committed numbered HTML, local standalone copy, staged download and staged app have identical HTML bytes. The ZIP contains that exact file.
- The V136 root homepage and the archived parallel builder were compared directly with their original Git objects and match exactly.
