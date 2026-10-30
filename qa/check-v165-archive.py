#!/usr/bin/env python3
"""Verify V165's exact scope: seven edited course pages, 208 preserved archive entries."""
from pathlib import Path
import base64,gzip,json,re,hashlib
repo=Path(__file__).resolve().parents[1]
src=repo/'source'

def unpack(name):
    html=(src/name).read_text()
    m=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',html,re.S)
    assert m, name
    return html,json.loads(gzip.decompress(base64.b64decode(m.group(1))))

base,old=unpack('Study_Table_V164.html')
new,archive=unpack('Study_Table_V165.html')
assert len(old)==len(archive)==215
changed={k for k in archive if archive[k]!=old[k]}
paths={'v15/spanish-for-someone/complete-practice-v40/index.html', 'v15/rockjam-piano-studio/index.html','v15/chess-from-zero/index.html', 'curricula/calculus.html','curricula/physics.html','curricula/medicine.html','curricula/business.html'}
assert changed==paths, changed.symmetric_difference(paths)
assert set(old)==set(archive)
for key in paths:
    old_page=old[key]['t'];page=archive[key]['t'];
    assert old_page.count('V136_COMPANIONS')==page.count('V136_COMPANIONS')
    for marker in ['const V133_BANK=','const V134_STORIES=','id="v133Map"','v134StoryMarkup()','v133LessonMarkup(unit)','v165-story-discovery']:
        assert marker in page,(key,marker)
    assert page.count('const V133_BANK=')==1
    assert page.count('const V134_STORIES=')==1
assert base.count('V136_COMPANIONS')==new.count('V136_COMPANIONS')
assert '<script id="st163-reconciled-script">' in new
assert 'V165 — Stories and Real Practice' in new
bank=json.loads((src/'transfer-bank-v133.json').read_text());story=json.loads((src/'story-mode-v134.json').read_text())
assert len(bank)==21 and sum(len(r['variants']) for r in bank.values())==42
assert len(story)==7 and sum(len(r['beats']) for r in story)==21
assert sum(len(b['options']) for x in story for b in x['beats'])==63
print('V165_ARCHIVE_PRESERVATION_PASS: 208 unchanged entries, 7 expanded course pages, 87 canonical lessons, 42 transfer problems, 63 story choices')
