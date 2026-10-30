#!/usr/bin/env python3
"""Optional, reproducible Study Table V165 build on canonical V164.

Run scripts/build.py -> scripts/build-v163.py -> scripts/build-v164.py first.
This changes exactly seven archived full-course pages inside their embedded bundle.
It never changes the V136 public index, assessment semantics, or Codex branches.
"""
from pathlib import Path
import base64
import gzip
import json
import re
import sys

repo = Path(__file__).resolve().parents[1]
root = repo / 'source'
old = root / 'Study_Table_V164.html'
if not old.is_file():
    raise SystemExit('First build canonical V164: scripts/build.py, build-v163.py, build-v164.py')
html = old.read_text()
original_html = html

story = json.loads((root / 'story-mode-v134.json').read_text())
transfer = json.loads((root / 'transfer-bank-v133.json').read_text())
assert len(story) == 7 and len({x['subject'] for x in story}) == 7
assert len(transfer) == 21 and sum(len(x['variants']) for x in transfer.values()) == 42
assert all(len(x['beats']) == 3 for x in story)
assert all(len(x['options']) == 3 for x in story for beat in x['beats'] for x in [beat])
assert all(sum(bool(o.get('works')) for o in b['options']) == 1 for x in story for b in x['beats'])

practice_js = (root / 'verified-practice-v133.js').read_text().replace('__TRANSFER_BANK__', json.dumps(transfer, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
story_js = (root / 'story-mode-v134.js').read_text().replace('__V134_STORIES__', json.dumps(story, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
assert '__TRANSFER_BANK__' not in practice_js and '__V134_STORIES__' not in story_js
css = (root / 'verified-practice-v133.css').read_text() + '\n' + (root / 'story-mode-v134.css').read_text() + '''
/* V165: separate optional curiosity choices from the main course reading path. */
.v165-story-discovery{margin:24px 0;padding:12px 17px;border:1px solid var(--study-line);border-radius:12px;background:var(--study-surface);color:var(--study-ink)}
.v165-story-discovery>summary{cursor:pointer;font:700 17px/1.55 system-ui;min-height:44px;display:list-item;padding:9px 4px}
.v165-story-discovery>summary:focus-visible{outline:3px solid var(--study-warm);outline-offset:3px}
.v165-story-discovery>.v134-story{margin:13px 0 4px}
@media(max-width:480px){.v165-story-discovery{padding:10px 13px}}
'''
paths = {
 'spanish': 'v15/spanish-for-someone/complete-practice-v40/index.html',
 'piano': 'v15/rockjam-piano-studio/index.html',
 'chess': 'v15/chess-from-zero/index.html',
 'calculus': 'curricula/calculus.html',
 'physics': 'curricula/physics.html',
 'medicine': 'curricula/medicine.html',
 'business': 'curricula/business.html',
}
archive = re.search(r'(<script id="full-bundle" type="text/plain">)(.*?)(</script>)', html, re.S)
assert archive is not None
bundle = json.loads(gzip.decompress(base64.b64decode(archive.group(2))))
assert len(bundle) == 215
original_bundle = dict(bundle)

def replace_one(page, old, new):
    count = page.count(old)
    assert count == 1, (old[:90], count)
    return page.replace(old, new, 1)

for subject, path in paths.items():
    page = bundle[path]['t']
    assert 'id="v133Map"' not in page and 'const V133_BANK=' not in page
    assert 'const V134_STORIES=' not in page and 'v165-story-discovery' not in page
    assert f'"subject":"{subject}"' in page
    page = replace_one(page, '</style>', '\n' + css + '\n</style>')
    page = replace_one(page,
        "+v130ChallengeMarkup()+'<ol id=\"courseOutline\"'",
        "+v130ChallengeMarkup()+v133MapMarkup()+'<details class=\"v165-story-discovery\"><summary>Play a three-decision story</summary>'+v134StoryMarkup()+'</details><ol id=\"courseOutline\"'")
    page = replace_one(page,
        "+practiceBlock(unit)+'<footer class=\"course-footer\"'",
        "+practiceBlock(unit)+v133LessonMarkup(unit)+'<footer class=\"course-footer\"'")
    page = replace_one(page,
        'window.studyTableFullCourse={subject:COURSE.subject',
        '\n// V165: exact authored Codex activities, mounted inside canonical seven-course reader.\n'+practice_js+'\n'+story_js+'\nwindow.studyTableFullCourse={subject:COURSE.subject')
    assert page.count('const V133_BANK=') == 1 and page.count('const V134_STORIES=') == 1
    bundle[path] = {'t': page}

assert set(bundle) == set(original_bundle)
for path in set(bundle) - set(paths.values()):
    assert bundle[path] == original_bundle[path], 'Non-course archive changed: ' + path
payload = json.dumps(bundle, ensure_ascii=False, separators=(',', ':')).encode()
encoded = base64.b64encode(gzip.compress(payload, mtime=0)).decode('ascii')
html = html[:archive.start(2)] + encoded + html[archive.end(2):]
assert html.count('<script id="st163-reconciled-script">') == 1
assert html.count('V136_COMPANIONS') == original_html.count('V136_COMPANIONS')
html = html.replace('Study Table V164 — Reliable Learning', 'Study Table V165 — Stories and Real Practice')
assert 'Study Table V165 — Stories and Real Practice' in html

check = '--check' in sys.argv
for target in [root / 'Study_Table_V165.html', repo / 'public' / 'study-table-v165.html']:
    if check:
        if not target.exists() or target.read_text() != html:
            raise SystemExit('V165 generated file out of sync: ' + str(target))
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html)
print(('V165 source parity verified' if check else 'V165 built') + f': {len(html.encode()):,} bytes, {len(bundle)} preserved archive paths, 42 authored transfer problems and 7 adventures')
