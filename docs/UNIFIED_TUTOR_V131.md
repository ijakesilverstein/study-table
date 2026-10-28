# Study Table V131 — one teaching experience, stronger checks

V131 merges two complementary tracks of work.

**Codex's authored coach** checks 15 concrete decisions across five lessons in piano, Spanish, chess, calculus and physics. It recognizes common mistakes in checked answers, offers two targeted explanations per decision, accepts constrained alternatives (numbers, notes or Spanish phrases), and distinguishes unknown wording from wrong wording. The learner can write or locally dictate reasoning, but arbitrary reasoning is *not* graded.

**Full-course teaching** remains available for all 87 units in seven subjects. Worked examples reveal steps gradually and progress through independent transfer and memory-recall prompts. In the five precisely checked lessons, the first worked example instead highlights **Work this out with feedback**, preventing a redundant freeform prompt. The second example retains general support.

**Curiosity on the map** offers an optional one-minute question. For a new learner it draws from the first three lessons; once a reading place is saved, it draws from the previous two, current, and next unit where available. Immediate repeats are avoided within that pool, with the authored answer and a link to the matching lesson.

**Misconception game** lets learners choose between two authored approaches and inspect the wrong turn's diagnosis, repair, and further check without artificial scores. V131 imports 14 additional Codex V127 edited lesson presentations, steps and reference tables.

## Limits

- No required quiz gate, timer, streak or leaderboard
- No arbitrary voice transcript scoring
- Local-only speech recognition if already available; typing works everywhere
- Notes and checked results stay in memory within the tab; assessed progress and backups unchanged
- No static client-side AI credentials, server-based chatbot or simulated understanding

## Quality controls

GitHub Actions generates a standalone HTML from source. Focused tests check guided cases, checkable decisions, offline/local speech, curiosity, mobile, and saved-progress safety. Comprehensive tests cover all 87 units, legacy routes, editorial revisions, independent practice, accessibility and backups. The Codex mobile overflow case is addressed with horizontally scrollable reference tables. Production and the main GitHub branch remain unchanged.

## First-principles next threshold

The missing capability is reliable adaptive retrieval: independently solving a new example after a delay, with verified answers and targeted misconceptions. A freeform text box that cannot assess the answer is not a genuine tutor.