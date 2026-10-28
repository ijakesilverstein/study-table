# Story Mode — seven tiny course adventures

This additive, optional feature is based on the verified 80-turn integrated V132 main. It is not an assessment or a replacement curriculum.

## What you can play
One three-moment scenario per full course, displayed near the top of the course map: a fast café exchange (Spanish), playing with a drummer (piano), kingside castling under attack (chess), calculating a growing festival banner (calculus), estimating a sled's energy and speed (physics), interpreting a screening test at low prevalence (medicine), and reacting to an unexpected shipping-cost increase at a pop-up shop (business).

Each of the 21 moments has three distinctly authored responses (63 consequences plus 63 explanations). The learner can try every possible response to see what would happen, revisit a scene, or jump to its full lesson. Outcomes are specific to the demonstrated facts, units, and math. No timers or points; no ads, external APIs, or prompts to create an account.

## Experience rules
- Display one moment and three choices, then reveal the authored consequence and why; advancing requires a choice.
- The consequence changes when a different option is selected. The final conclusion reflects the selected route, but is **not** a mastery score.
- All interactions are in-memory and ephemeral. No `localStorage`, grading, course-assessment writes or third-party calls.
- Existing authored teaching, progress backup, 87 full units, guided coaching, and legacy practice remain.
- The actual lesson is one click away after the story; the learner can also leave without finishing.
- Built offline into each subject's standalone course reader; keyboard semantics, focus movement, reduced motion, phone widths and both themes are explicit tests.

## Independence and Codex coexistence
V133 authored transfer/delayed review is under separate development in PR #8. Story Mode does **not** alter its transfer bank, review schedule, storage, scoring or checked-answer logic. When merging across branches, include both the story data and renderer and V133's latest source and tests; do not overwrite 80-turn medicine/business coaching with the earlier 51-turn branch.

## Release gates
Validate model-level invariants (seven real lesson IDs, 21 decisions, 63 outcomes, one best grounded option per moment). Run actual browser tests of all choices, replay, no saved state, offline navigation, 320px/390px and both themes including WCAG axe checks. Require the **complete** inherited GitHub Actions suite plus package files and source parity to pass before merging or deploying.
