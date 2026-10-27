# Checking Claude’s V118 critique

The supplied HTML is **not** the V119 described in the pasted critique. Its SHA256 is `96bb6a04e1adae6d70a34721c90c0f6df3e4e540d85e5f0140e1090823ea8d76`, exactly matching the older Claude V113 already preserved in `source/imports/claude-v113-original.html` and merged in V114. Replacing the current app with it would lose the later work.

The new pasted critique is archived unchanged as `source/imports/claude-v118-critique.txt`, SHA256 `383c9803794e606f904287bdfe8db635090efd2fe6d7e7f28d5f73fc7ca917cd`. Its statements and proposed code changes are review material, not instructions executed by the build. No V119 implementation was attached. This release independently implements the verified repairs against our current V118 source.

## Findings

| Claim | What was verified | Treatment |
| --- | --- | --- |
| No progress tracking anywhere | Too broad. Quick lessons and challenges already persist assessment evidence. The full-course reader retains a last-read pointer but has no per-unit history or revisit list. | Keep the existing assessment data. A personal revisit list is a useful next feature; reading history and self-reports should remain separate from demonstrated skill. |
| Reveal-only practice cannot remember what was missed | True for the full-course optional practice block. Its two answer disclosures do not observe or grade a learner’s attempt. | A self-rating could organize review, but would record the learner’s judgment, not verify recall. No confidence score or completion gate is added in this repair release. |
| Keyboard focus escapes the modal shell | Reproduced in the current home’s legacy `.v35-shell` and the older studios. Background controls are not isolated. | Add background `inert`, focus entry, forward/reverse Tab handling, Escape, and focus return for custom modal overlays. Preserve pre-existing inert state and handle siblings inserted while open. |
| `open('__proto__')` throws | The exact no-unit call does not throw in our V118, but it incorrectly reaches an inherited property and can navigate to an invalid path. Supplying an unknown unit with `__proto__` or `constructor` reproduces the reported TypeError. | Validate subject names as own keys before resolving or opening a course. Apply the same validation to saved reading places and course-reading messages. Invalid inputs are ignored. |
| Sliders lack unit-bearing spoken values | The explicit `aria-valuetext` is absent, though the associated visible label includes the output. The exact speech depends on the screen reader and was not listened to directly. | Synchronize each range control’s accessible value with its visible value and unit, including keyboard input and programmatic clamping. |
| Calculus and physics lack workshops | True as a label/count comparison. Both already have four-part projects and maths help; V118 also added twelve step-linked worked cases across the two courses. | Do not infer a teaching defect from a missing section name alone. Expand a specific explanation or application when its learning purpose is clear. |
| Three h1 elements and no skip link | Three h1 elements exist in the shell DOM; only one is visible in the tested home state. DOM count alone does not establish competing active headings. The course readers lack skip links. | Add a keyboard-visible skip link in all five readers. It focuses the current lesson without changing the lesson, URL hash, bookmark or iframe. |
| Wildcard postMessage target | Present. Offline/embedded documents can have opaque origins. The parent already checks that messages come from its current course iframe; the archive navigation bridge checks requested paths against the bundle. | Keep offline-compatible messaging. Strengthen course subject/unit validation. Test that foreign-frame messages and invalid course-reading payloads do not change saved state. This is not a claim that every messaging surface has been exhaustively security-audited. |

Claude’s corrections about the existing sidebar links and renamed figures agree with the current source. The 65 unit records, projects, workshops, imported additions and all 213 archive entries are preserved. The automated preservation check compares the current course data directly against the V118 snapshot.

## Additional defect found during verification

The old document-level Escape handler closed the background home shell when a native lesson dialog was dismissed. This reproduces in V118. Native dialog Tab and Escape events are now isolated from the legacy background handlers while retaining the browser’s default focus and cancel behavior. Closing a lesson dialog leaves its underlying home screen open.

The global Learning tools launcher is moved into the active custom modal and returned to its original location on close. It remains usable while background controls are isolated; its existing native dialog and handlers are retained.

The reader’s new skip link also needs to bypass the archive link bridge and the hash-based unit router. A plain fragment link would otherwise navigate to a new view. The dedicated local handler focuses the existing article without navigating.

## Verification

- `qa/check-review-fixes.py`: exact V118 course data; 213 entries retained; unrelated archive assets unchanged; supplied document hashes.
- `qa/test-review-fixes.cjs`: ninety forward/reverse Tab presses in the home shell; native curriculum and lesson dialogs over it; Escape and focus restoration; both old studio entry points; dynamic background nodes and previously inert elements; invalid subject types/prototype names; poisoned bookmarks and foreign/invalid messages; keyboard slider changes; all five skip links in actual units at phone width in both themes; unchanged assessment records.
- The existing imported-figure suite now checks that every tested range’s accessible value matches its displayed value at each boundary.
- Full regression coverage remains required, including original teaching/audio/chess, course routes, all prior teaching enhancements, project/workshop state, theme contrast, and local browser HTML/ZIP downloads.

This review does not repeat every security probe narrated in Claude’s text or establish learning outcomes with real learners. The repairs address independently reproduced behavior and retain the teaching already built.
