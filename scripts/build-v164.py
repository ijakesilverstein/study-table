#!/usr/bin/env python3
"""Build optional V164 from the canonical-source V163 preview; never touch V136/index."""
from pathlib import Path
import sys

repo=Path(__file__).resolve().parents[1]
base=repo/'source'/'Study_Table_V163.html'
assert base.is_file(), 'Run python3 scripts/build-v163.py first.'
html=base.read_text()

def once(old,new):
    global html
    count=html.count(old)
    assert count==1,(old,count)
    html=html.replace(old,new,1)

# close events are queued, so a previous session's event may arrive after reopen.
# It must not clear the new backup preview or steal focus from a new tutor session.
once("d.addEventListener('close',()=>{readingFile++;", "d.addEventListener('close',()=>{if(d.open)return;readingFile++;")
once("d.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true})})", "d.addEventListener('close',()=>{if(d.open)return;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true})})")
once('document.title="Study Table V163 — Reconciled Teaching"', 'document.title="Study Table V164 — Reliable Learning"')
once('<title>Study Table V163 — Reconciled Teaching</title>', '<title>Study Table V164 — Reliable Learning</title>')
assert html.count('V136_COMPANIONS')==base.read_text().count('V136_COMPANIONS')
assert html.count('<script id="st163-reconciled-script">')==1

for path in [repo/'source'/'Study_Table_V164.html',repo/'public'/'study-table-v164.html']:
    if '--check' in sys.argv:
        if not path.exists() or path.read_text()!=html:raise SystemExit('V164 out of sync: '+str(path))
    else:
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(html)
print('V164 verified' if '--check' in sys.argv else f'V164 built: {len(html.encode()):,} bytes')
