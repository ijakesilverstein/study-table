# V118: follow the calculation

The existing quantitative lessons sometimes moved from the situation to a formula faster than the beginner could follow. This release deepens their actual worked steps. It does not add a quiz gate or another curriculum branch.

## What changes

Six units have two enhanced worked cases each. All original problems, calculations and explanations remain. Thirty-nine additional teacher notes (1,693 words, plus introductions and diagram captions) explain what to attend to and why the step follows. A button at each step brings that case’s existing diagram beside its reasoning; returning it restores the original position. The whole written solution is always available.

| Unit | First case | Second case |
| --- | --- | --- |
| Average velocity | Pair the cyclist’s observations, subtract positions and times, read the slope triangle | Separate displacement from distance on an out-and-back walk |
| Instantaneous velocity | Shrink a nonzero interval for s=t² at t=3; distinguish the quotient from its limit | Compare equal positions with different slopes for t² and 3t |
| Definite integrals | Connect F(3)−F(1) to an eight-metre trapezoid under velocity | Split at the sign change to distinguish zero displacement from two metres of travel |
| Newton’s second law | Add opposing forces before dividing by mass; separate acceleration from current motion | Keep a supplied nonzero velocity when net force is zero |
| Force diagrams | Choose the book; distinguish weight, support and third-law partners | Add a hand’s push and solve for a larger normal force |
| Circuit connections | Follow one current through series resistors and account for both voltage drops | Keep the common branch voltage, calculate branch currents and add at the junction |

## Boundaries that matter

- The cyclist diagram joins two observations. It does not invent a constant-velocity journey between them. Adding 100 m to both position labels leaves the rate unchanged.
- The out-and-back graph explicitly illustrates five seconds per leg. The original problem supplies ten seconds total, not a specified turning time.
- Derivative controls allow positive and negative nonzero h. The separate limit view draws a tangent and does not divide by h=0. The close-up position axis starts at 3 m and is labeled accordingly.
- A velocity graph’s signed area measures displacement. Distance adds the magnitudes of the pieces split at the turn.
- Net-force arrows summarize interactions; they are not extra forces to add. Motion arrows are labeled separately. An unknown support-force arrow is schematic until solved.
- Circuit arrows show conventional current; the ideal-source, ideal-wire, steady-state and ohmic-resistor assumptions are stated. Wire topology is checked independently of the written answers.

Desktop and phone drawings have separate arrangements. On a phone, each graph, force diagram and circuit is fully visible with readable labels. The compact series circuit turns the single path vertically; the parallel circuit keeps both branches visible. The hidden alternate drawing is excluded from the accessibility tree by CSS, and all SVG definition IDs remain unique.

Earlier adjustable explorers, including the imported Claude figures, remain under **More ways to explore this lesson**. The source and course data are preserved; the optional section avoids displaying several large diagrams in succession.

## Preservation and checks

`qa/check-slow-teaching.py` compares every compiled course record against V117 exactly, including all 65 units, projects and workshops. It matches each note to an existing worked step and independently verifies rates, areas, forces and circuit arithmetic using exact fractions where appropriate.

`qa/test-slow-teaching.cjs` follows every one of the 39 steps, checks the original calculations and visible notes, model placement/return, origin invariance, both sides of the derivative limit, and the distinct zero-denominator limit view. It reconstructs actual desktop and phone circuit connections to detect a wire bypass or a shorted battery. It checks phone fit, label bounds and rendered label size, both-theme contrast, accessible labels, keyboard/focus, main Continue, and unchanged assessment records.

The earlier explorer tests now open their optional section before using its controls. Their numerical and geometry assertions remain. `npm test` includes the new checks alongside the existing complete regression suite and browser HTML/ZIP delivery checks.

Reading state and assessment keys are unchanged. Selecting a diagram writes no mastery result. Original uploaded files, practice studios and versioned releases remain intact.
