# V218 Teaching Coach integration

Standalone V218 is based on the complete V217 HTML. Adds a **separate** lightweight coach overlay, not another assessment bank.

- In each of the 30 teacher-led workshops, after the three-step explanation, learners can choose one of three specific confusion prompts for their subject (30 total). Responses provide plain-language, rule-based help. There is no AI grading, mastery claim or API call.
- The existing workshop reflection text, optional worked answer, completion logic, calendar and backup remain unchanged.
- Source files are `st218-coach-overlay.js` and `build_st218_safe.py`; the build inserts the overlay at the **last** closing body tag, not a `</body>` literal embedded in legacy JavaScript. This matters: replacing the first occurrence broke the old app's `document.write` script.
- Targeted full-HTML Chromium smoke test: all ten subjects, three-step teaching flow, coach prompt visible and interactive, zero page errors. Tested at 390px viewport. Not an exhaustive regression.
- GitHub main remains older than the standalone; reconcile complete source before merging or deploying.
