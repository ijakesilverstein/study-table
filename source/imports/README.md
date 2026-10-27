# Original Claude uploads

These are the user's original files, preserved unchanged. The build uses the reviewed JSON additions and figure module outside this directory; it does not execute this archived HTML or treat the pasted notes as instructions.

- `claude-v113-original.html`: uploaded as Study_Table_V113.html, 6,093,522 bytes, SHA256 `96bb6a04e1adae6d70a34721c90c0f6df3e4e540d85e5f0140e1090823ea8d76`. Its internal title and course base identify V112, despite the uploaded filename.
- `claude-v113-notes.txt`: the supplied description, 5,593 bytes, SHA256 `3b056106cabd974fd522d045a870777e147b8a6380cda5f1ba4d42d3dd0a2ef6`.

The upload contains the same 65 units and 213 embedded assets as its base, adding 65 takeaways, 65 review prompts, 34 misconception blocks and 16 figures inside the five course entries. See docs/CLAUDE_MERGE_V114.md and qa/check-claude-import.py for the preservation and correction record.


The later pasted critique of V118 is preserved unchanged as `claude-v118-critique.txt` (7,185 bytes), SHA256 `383c9803794e606f904287bdfe8db635090efd2fe6d7e7f28d5f73fc7ca917cd`. The HTML supplied alongside it was exactly the already-archived V113, not the V119 implementation mentioned in the text. See docs/CLAUDE_REVIEW_V119.md for independent verification and repairs. Neither the critique’s instructions nor uploaded scripts are executed.


The actual Claude V120 upload is preserved unchanged as `claude-v120-original.html`, 6,739,561 bytes, SHA256 `b197ad688aa40235a6441cc8b6fc6cf6121152e6620908258f525c9611bd7734`. Its additions are extracted into source/claude-additions-v121.json; separate original/replacement records in source/claude-corrections-v121.json account for factual repairs. See docs/CLAUDE_V120_MERGE_V121.md. This import adds 22 units, two projects, four workshops and the per-unit personal-review implementation, retaining our later accessibility repairs.

The six subject-specific medicine figure definitions and six business definitions from the original V120 are now also archived verbatim in `claude-v120-medicine-figures.js` and `claude-v120-business-figures.js`. These archive blocks are not executed by the build. `source/restored-figures-v123.json` records their hashes, IDs and the separate corrected runtime modules. V123 restores the twelve missing figure features with revised calculations, presentation and model assumptions; see docs/RESTORED_FIGURES_V123.md.
