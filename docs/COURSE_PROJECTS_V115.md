# V115 — complete performances and problems

The learner repeatedly asked to watch a teacher solve things, with less testing and more explanation. V115 adds five substantial projects, split into four readable parts each. Each part shows the setup, a complete worked sequence, why the steps fit, and links back to the lessons it uses. There is no graded task or quiz gate.

All 65 V114 units and their 130 worked cases are retained unchanged, including the Claude additions. The original 38 quick lessons, their assessment records, all unrelated archive pages and the piano/Spanish/chess practice studios are preserved. Projects are separate course records, not inflated unit counts.

| Course | Project | Teaching and demonstration |
|---|---|---|
| Piano | An original eight-bar piece | Right-hand melody; bass-staff landmarks and whole notes; coordination; phrasing and a complete performance. Two-staff score, optional note names, 40–120 BPM playback, four-beat count-in, right/left/both hands, passage selection, optional metronome and looping with a fresh count-in. |
| Spanish | Make plans, meet a friend and order | Yesterday’s events; invitation and changed day; asking for a repeat; order/follow-up/payment. Sixteen translated turns, whole/part listening, line replay, slow playback, optional English hiding and fully authored day/drink/location/payment variations. |
| Chess | Morphy’s 1858 Opera Game | Development, actual capture accounting, blocked queen lines, relative pins, castling, the open d-file and the final mating net. All 33 plies with 34 positions, original move annotations, position selection and board stepping. |
| Calculus | A changing-rate tank | Units and initial conditions, definite integration, differentiation checks, solving the capacity equation, overflow, a corner in actual volume, and signed net flow with an interior maximum plus endpoint checks. Interactive time, setup and capacity controls. |
| Physics | Hill → sticking carts → spring | Energy on the hill, signed momentum in the collision, kinetic energy transferred into other forms, triangular spring work, compression/force, external spring impulse and a complete energy table. Two exact-friendly starting heights, snapshots, bars and written calculations. |

## Accuracy details

The music is an original C-major practice melody. Every bar totals four beats in each hand; bass notes are held for a whole bar. Synthesized playback demonstrates timing and pitch, not the learner’s technique or expression. Loops include a new four-beat count-in. All scheduled audio and timers are stopped on navigation. An asynchronous audio resume cannot start sound after a project part has closed.

The Spanish script distinguishes the informal friend exchange from the worker’s usted question. All new vocabulary is explained before use. Water is ordered as `Quiero agua` to avoid generating a questionable article/adjective combination. Audio requires a Spanish device voice; missing voices leave the complete written script usable. Playback does not assess pronunciation.

The historical chess moves are independently replayed with python-chess. The final position is checkmate. The queen on b3 does not directly attack f7 through its own bishop on c4. Bg5 pins the knight to the queen, not to the king. The final Rd8 is protected by the g5 bishop. The page follows the recorded game and makes no unverified best-move/forced-line claims about unplayed alternatives.

The filling model uses W = 3 + t² + t, with incoming flow 2t + 1 for 0 ≤ t ≤ 4 min. With capacity 20 L, filling occurs at (−1 + √69)/2 min, actual volume then remains 20 L, and overflow at four minutes is 3 L. Incoming flow then differs from the rate of change of water inside. At the ideal filling corner the ordinary derivative does not exist. The second setup has V = 10 + 6t − t², a 19 L maximum at t = 3, and a final 18 L with a negative current net rate.

For the 0.45 m hill, the first cart has 9 J and reaches 3 m/s. Sticking gives 2 m/s for the combined 3 kg, 6 J kinetic and 3 J in other forms. The 48 N/m spring compresses 0.5 m with a 24 N maximum force. For 0.8 m: 16 J, 4 m/s, shared speed 8/3 m/s, spring energy 32/3 J, other energy 16/3 J, compression 2/3 m and 32 N. The model names which system and stage allow each conservation law. The sketch is explicitly not to scale.

## Navigation and preservation

Every course map has a project card above the unit outline. The sidebar and final unit also link to the project. Four-part navigation is keyboard accessible. The existing per-course reading key can now contain `project`; the part index is stored separately. Main Continue, course Continue and a direct project hash all restore it. Unit IDs and merged-unit aliases remain intact. Reading never writes assessment success.

`qa/check-projects.py` compares every current unit with the V114 checkpoint, verifies all 20 project records, and independently validates music timing and game legality. `qa/test-projects.cjs` covers all parts, saved reading and unchanged assessment records, model outputs and energy sums, all 34 game positions, adapted Spanish/voice fallback/cancellation, piano audio timing and the resume race, mobile page overflow and both-theme text contrast. The existing full regression suite remains required.

V115 is delivered as a standalone HTML file. The Vercel site remains at V113, following the user’s preference. No deployment or GitHub push is part of this release. Automated checks verify the stated calculations and behavior; no learner study or independent subject review has been claimed.

Saved reading places use the browser's local storage. A different device, web origin or separately opened local-file origin does not automatically inherit them. The existing learning-progress export/restore can move assessment records; it currently does not export the new full-course/project reading keys. Source/content preservation is independently verified and does not imply cross-device progress synchronization.
