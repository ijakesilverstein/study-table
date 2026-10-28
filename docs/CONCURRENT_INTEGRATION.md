# Shared development checkpoint

The canonical repository is `ijakesilverstein/study-table`, branch `main`. Development branches from concurrent chats are reconciled through real Git merges, preserving their histories and the generated HTML editions already delivered.

V132 integrates `feature/v131-unified-tutor` through **37758ca8dfdc5dbc2de322be81d790c5ca90379a**, including the curiosity branch through 5afe8bad05d1cdad188a6e393381383553af674b and the V129 test update through 168a9dfebf91a7080186ba3d9aaff522a1f74e50. The preceding V130 integration is recorded separately. Unpublished changes in other chats are outside these snapshots.

The main contribution in this pass is content that complements the concurrent tutor/navigation changes:

- `source/specific-teaching-v132.json`: 51 authored prompt/hint/help records aligned to the displayed worked-step headings in eight lessons, plus concise comparison pairs. `v132Guidance` supplies them to the existing optional learning flow.
- `source/step-coach-v132.json`: three additive coaching scenarios for rests/subdivisions, café repair and castling. The five earlier scenario records stay untouched. The parent dialog reads the union; course metadata exposes the same eight eligible units.
- The checked coach is directly visible. The optional written-comparison route remains available with lower emphasis; existing note retention and local microphone safeguards are preserved.
- Timing tables, dialogue tables and described board diagrams appear before answers are required. Comparison games are folded after the teaching and can show the full correction before a choice.

`qa/check-specific-teaching.py` protects V130's actual course/display/demo records, old five-scenario data and unrelated archive assets. Focused browser checks exercise the new content and all 24 checked decisions; the full regression runner also retains the earlier suites. A source branch alone does not establish that its build or hosted deployment passed.

Generated app files accompany source commits. GitHub delivery, hosted Actions and Vercel publication have separate verification records. Credentials, learner browser data and local deployment links are excluded from Git history.
