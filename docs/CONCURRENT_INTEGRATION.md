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
