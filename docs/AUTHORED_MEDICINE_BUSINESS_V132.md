# Study Table — medicine and business authored coaching extension

This feature branch starts from the integrated V132 release including the verified product-rule mobile and legacy reading-position fixes, and extends the existing optional learning loop without adding a new overlay, score, streak or AI-grading claim.

Four additional full-course lessons now have individually written prompts, hints and explanations aligned to both worked cases' actual steps:

- **Medicine — homeostasis (7 turns):** distinguish measured core temperature from the set point; use signed error; choose cooling or warming effectors; explain why corrective drive eases. The optional misconception highlights the difference between negative feedback and amplifying the deviation.
- **Medicine — interpreting test results (7 turns):** explicitly apply prevalence, sensitivity and specificity to two groups of 10,000 people, separate false from true positives, and calculate approximately 16.7% versus 89.5% positive predictive value. This is a simplified educational model, not individual medical advice.
- **Business — unit economics (8 turns):** separate contribution from profit, calculate $26 variable cost and $14/$10 unit contribution, check the 35% margin denominator and explain the percentage sensitivity to a $4 shipping increase.
- **Business — cash conversion cycle (7 turns):** follow purchase, inventory, receivable and supplier payment timing; calculate 55- and 25-day cycles; distinguish sales-based receivables from cost-based inventory and payables; calculate a $13,000 working-capital release in the worked example.

The work raises authored `prompt / hint / help` step coverage **from 51 turns in 8 lessons to 80 turns in 12 lessons**, while preserving the original five V128 and three V132 checkable-answer coaching scenarios. No new deterministic graders are claimed for the four expanded lessons: learner writing is compared with authored reasoning by the learner, not marked right or wrong by an AI.

The production-generated single HTML and both themes/mobile layouts must be tested before merge. The canonical 87 base units, older exercises and all progress/backup formats remain unchanged. When reconciling concurrent Codex commits, integrate the added JSON entries and authoring tests rather than overwriting the established teaching data.
