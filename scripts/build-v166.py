#!/usr/bin/env python3
"""Optional source-backed V166 built atop V165. Only Spanish archived course page changes.
V53 product decisions informed the interaction, but V53 code was not available to port.
"""
from pathlib import Path
import gzip,base64,json,re,sys
REPO=Path(__file__).resolve().parents[1]
SOURCE=REPO/'source'
PREV=SOURCE/'Study_Table_V165.html'
if not PREV.exists():
 raise SystemExit('Build source/Study_Table_V165.html first.')
html=PREV.read_text()
original_html=html
pagepath='v15/spanish-for-someone/complete-practice-v40/index.html'
scenes=json.loads((SOURCE/'spanish-real-v166.json').read_text())
assert len(scenes)==8 and len(set(s['id'] for s in scenes))==8
assert sum(len(s['turns']) for s in scenes)==24
assert all(len(t['options'])==len(t['why'])==2 and t['best'] in (0,1) and all(t[k] for k in ('heard','meaning','repair')) for s in scenes for t in s['turns'])
js=(SOURCE/'spanish-real-v166.js').read_text().replace('__V166_SCENES__',json.dumps(scenes,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
css=(SOURCE/'spanish-real-v166.css').read_text()
archive=re.search(r'(<script id="full-bundle" type="text/plain">)(.*?)(</script>)',html,re.S)
assert archive
bundle=json.loads(gzip.decompress(base64.b64decode(archive.group(2))))
assert len(bundle)==215
original_bundle={k:dict(v) for k,v in bundle.items()}
page=bundle[pagepath]['t']
def change(old,new):
 global page
 count=page.count(old)
 assert count==1,('expected one anchor',old[:95],count)
 page=page.replace(old,new,1)
assert 'V166_SPANISH_SCENES' not in page
change('</style>',css+'\n</style>')
change("+v134StoryMarkup()+'</details><ol id=\"courseOutline\">", "+v134StoryMarkup()+'</details>'+v166SpanishMarkup()+'<ol id=\"courseOutline\">" )
change("+practiceBlock(unit)+v133LessonMarkup(unit)+'<footer class=\"course-footer\">", "+practiceBlock(unit)+v133LessonMarkup(unit)+v166LessonBridge(unit)+'<footer class=\"course-footer\">" )
change('<button type="button" data-v134-lesson>See the real lesson</button>', '<button type="button" data-v134-lesson>See the real lesson</button><button type="button" data-v166-open>Plan a real conversation</button>')
change('window.studyTableFullCourse={subject:COURSE.subject', '\n// V166: offline conversation practice and explicitly self-reported real-world use.\n'+js+'\nwindow.studyTableFullCourse={subject:COURSE.subject')
assert 'const V166_SPANISH_SCENES =' in page and page.count('v166SpanishMarkup()')>=1
bundle[pagepath]['t']=page
assert set(bundle)==set(original_bundle)
assert sum(v!=original_bundle[k] for k,v in bundle.items())==1
assert all(v==original_bundle[k] for k,v in bundle.items() if k!=pagepath)
encoded=base64.b64encode(gzip.compress(json.dumps(bundle,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
html=html[:archive.start(2)]+encoded+html[archive.end(2):]
assert html.count('V136_COMPANIONS')==original_html.count('V136_COMPANIONS')
assert html.count('<script id="st163-reconciled-script">')==1
html=html.replace('Study Table V165 — Stories and Real Practice','Study Table V166 — Real-World Spanish')
check='--check' in sys.argv
for dest in (SOURCE/'Study_Table_V166.html',REPO/'public'/'study-table-v166.html'):
 if check:
  if not dest.exists() or dest.read_text()!=html:raise SystemExit('Out of sync: '+str(dest))
 else:
  dest.parent.mkdir(parents=True,exist_ok=True)
  dest.write_text(html)
print(('V166 source parity verified' if check else 'V166 built')+f': {len(html.encode()):,} bytes, 215 archived pages, only Spanish changed; 8 scenarios / 24 speaking turns')