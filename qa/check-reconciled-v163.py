#!/usr/bin/env python3
"""Source parity and preservation checks against the generated V136 baseline."""
from pathlib import Path
import re,gzip,base64,json,hashlib
repo=Path(__file__).resolve().parents[1]
base=(repo/'source'/'Study_Table_V136.html').read_text()
merged=(repo/'public'/'study-table-v163.html').read_text()
js=(repo/'source'/'focus-reconciled-v163.js').read_text()
css=(repo/'source'/'focus-reconciled-v163.css').read_text()
assert len(js)>35000 and len(css)>8000
end=base.rindex('</body>')
expected=base[:end]+'<style id="st163-reconciled-style">'+css+'</style>\n<script id="st163-reconciled-script">'+js.replace('</script','<\\/script')+'</script>\n'+base[end:]
expected=expected.replace('Study Table V136 — Full Courses','Study Table V163 — Reconciled Teaching')
assert merged==expected, 'V163 changed canonical HTML outside the two title strings and additive JS/CSS'
assert 'window.studyTableFocusV163' in js
assert "const V162_COACH=" in js and "const V162_CHOICENOTES=" in js
assert 'const allowed=Object.keys(BANK)' in js
assert "window.studyTableConnectionsV155?" in js, 'Do not offer absent experimental link'
pattern=r'<script id="full-bundle" type="text/plain">(.*?)</script>'
b1=re.search(pattern,base,re.S).group(1);b2=re.search(pattern,merged,re.S).group(1)
assert b1==b2, 'Canonical bundle modified'
bundle=json.loads(gzip.decompress(base64.b64decode(b1)))
assert len(bundle)>=210
courses=['spanish-for-someone','rockjam-piano-studio','chess-from-zero','curricula/calculus.html','curricula/physics.html','curricula/medicine.html','curricula/business.html']
for sub in courses:assert any(sub in p for p in bundle),sub
assert sum('V136_COMPANIONS' in str(v) for v in bundle.values())==7
assert sum('v136-companion' in str(v) for v in bundle.values())==7
assert merged.count('<script id="st163-reconciled-script">')==1
print('PASS: canonical',len(bundle),'archived pages, 7 V136 companion course pages, 11 authored focus subjects, no overwrite')
print('Canonical SHA256',hashlib.sha256(base.encode()).hexdigest())
print('Reconciled SHA256',hashlib.sha256(merged.encode()).hexdigest())
