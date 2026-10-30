#!/usr/bin/env python3
"""Optional canonical V163 build. Do not replace V136 index or deploy to Vercel.
Run after `python3 scripts/build.py` has generated source/Study_Table_V136.html.
"""
from pathlib import Path
import sys

repo=Path(__file__).resolve().parents[1]
source=repo/'source'
base=source/'Study_Table_V136.html'
assert base.is_file(), 'Run python3 scripts/build.py to build canonical V136 before this script.'
html=base.read_text()
js=(source/'focus-reconciled-v163.js').read_text()
css=(source/'focus-reconciled-v163.css').read_text()
assert '<script id="st163-reconciled-script">' not in html, 'V163 is already injected.'
end=html.rindex('</body>')
html=html[:end]+'<style id="st163-reconciled-style">'+css+'</style>\n<script id="st163-reconciled-script">'+js.replace('</script','<\\/script')+'</script>\n'+html[end:]
html=html.replace('Study Table V136 — Full Courses','Study Table V163 — Reconciled Teaching')
assert html.count('V136_COMPANIONS')==base.read_text().count('V136_COMPANIONS')
assert html.count('<script id="st163-reconciled-script">')==1
check='--check' in sys.argv
for target in [source/'Study_Table_V163.html',repo/'public'/'study-table-v163.html']:
    if check:
        if not target.exists() or target.read_text()!=html:raise SystemExit('V163 out of sync: '+str(target))
    else:
        target.parent.mkdir(parents=True,exist_ok=True);target.write_text(html)
print('V163 matches canonical V136 plus authored focus modules' if check else f'V163 built: {len(html.encode()):,} bytes; canonical V136 preserved')
