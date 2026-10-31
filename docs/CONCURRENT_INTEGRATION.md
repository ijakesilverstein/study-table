# Shared development checkpoint

The canonical repository is `ijakesilverstein/study-table`, branch `main`. Development branches from concurrent chats are reconciled through real Git merges, preserving their histories and the generated HTML editions already delivered.

V132 integrates `feature/v131-unified-tutor` through **36937ba9b624ecb026af6bbbc2738095e720fc68** and `feature/v132-curiosity-grounded` through **67fc6d803e9636d571d71088fd2badf1dd679ca7**. These include the original unified-tutor snapshot 37758ca8dfdc5dbc2de322be81d790c5ca90379a, curiosity branch through 5afe8bad05d1cdad188a6e393381383553af674b and V129 test update through 168a9dfebf91a7080186ba3d9aaff522a1f74e50. The preceding V130 integration is recorded separately. Unpublished changes in other chats are outside these snapshots.

The main contribution in this pass is content that complements the concurrent tutor/navigation changes:

- `source/specific-teaching-v132.json`: 51 authored prompt/hint/help records aligned to the displayed worked-step headings in eight lessons, plus concise comparison pairs. `v132Guidance` supplies them to the existing optional learning flow.
- `source/step-coach-v132.json`: three additive coaching scenarios for rests/subdivisions, café repair and castling. The five earlier scenario records stay untouched. The parent dialog reads the union; course metadata exposes the same eight eligible units.
- The checked coach is directly visible. The optional written-comparison route remains available with lower emphasis; existing note retention and local microphone safeguards are preserved.
- Timing tables, dialogue tables and described board diagrams appear before answers are required. The concurrent single-claim thought experiment is folded after the teaching and can show the full explanation before a choice. Claims include 39 valid approaches and 48 needing correction across the 87 units; always rejecting a claim cannot solve the activity.

`qa/check-specific-teaching.py` protects V130's actual course/display/demo records, old five-scenario data and unrelated archive assets. Focused browser checks exercise the new content and all 24 checked decisions; the full regression runner also retains the earlier suites. A source branch alone does not establish that its build or hosted deployment passed.

Generated app files accompany source commits. GitHub delivery, hosted Actions and Vercel publication have separate verification records. Credentials, learner browser data and local deployment links are excluded from Git history.

Before continuing in another chat, fetch `origin/main` and create the next development branch from that shared commit. Read this checkpoint and `SPECIFIC_TEACHING_V132.md` first: the combined implementation deliberately keeps the optional explanation comparison, adds three checked scenarios, and uses both valid and mistaken claims. Preserve those behaviors when reconciling an older feature branch. Use a new release number for a later delivered artifact; retain the earlier HTML files and tags.

## V135 teaching pass

The next teaching pass starts from shared main `0332b94662f66ad60d3c0af0794c742401360ce0`, fast-forwarding the already merged phone/navigation repairs and medicine/business guidance through `4609cefd002ab65b981ab18dcefed3a6b1658178`. Its 80 prior authored turns remain exact. Six further revisions and 48 additional help turns live in separate V135 data files; they do not replace the earlier files. Details and verification scope are in `TEACHER_DEMONSTRATIONS_V135.md`.

Concurrent branches observed at the start were `feature/v133-authored-transfer-and-review` through `c42f497ce3bb92d91f074610d21768bfc3d48619` and `feature/v134-playful-story-mode` through `2531d5ed0218a1c2d6c325901860f810b62e7fb6`. They were inspected for scope, not merged into this teaching pass. Their review/game work remains on those branches. Do not describe V135 as containing every unmerged feature or unseen chat edit. Reconcile later work from the updated canonical source and keep all lesson records and delivered artifacts.

The current user instruction is **do not push to Vercel**. No Vercel publication is part of this pass. Git-triggered Vercel deployment is explicitly disabled in the repository configuration.

## V136 visual worked examples

V136 starts from main `dfd5ffe36610ff72ce2dc12f9346e9351d908f37`. It adds a manual piano count/keyboard companion, Spanish meaning/phrase builder and touch/keyboard stalemate diagram to three existing worked cases. New data, script and styles live in `lesson-companions-v136.*`; all older display, guidance and demonstration records remain exact. Guided retrieval hides the companions with the answers. Manual inspection stops old playback and dictation while retaining typed working. See `VISUAL_COMPANIONS_V136.md` for scope and validation.

The initial fetch still showed the authored-review and story branches at the same snapshots recorded above; neither was merged into this pass. Future work should fetch canonical main, preserve these teaching companions and never force-push over a concurrent update. Keep delivered HTML files and tags. The explicit **do not publish to Vercel** instruction remains active.


## V169 published snapshots reconciled (2026-10-31)

The V168 chain at `93b3e701e2fe170cb6c124405c295a69780e1b6d` and the parallel journey at `696ee4c5195c80acf2c752e9336d67de3214a6a6` are both retained in the V169 merge history. The canonical seven-course path, story-matched practice and all 87 explanation prompts remain; six parallel practice variants become fully solved examples, without adding competing course menus. The original parallel builder is archived exactly and its separate preview remains reproducible. See [the full branch table, preservation and test scope](RECONCILIATION_V169.md). Unpublished chat work was not accessible. Root V136 homepage and disabled Vercel Git deployments remain unchanged.
