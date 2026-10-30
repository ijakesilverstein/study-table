#!/usr/bin/env python3
"""Optional source-backed V168: story-matched checked practice + 87-unit teachback.

Build after V167. Only seven course documents inside the embedded bundle may change;
production index.html and the other 208 archived pages are untouched.
"""
from pathlib import Path
import argparse
import base64
import gzip
import json
import re

parser=argparse.ArgumentParser()
parser.add_argument('--base',type=Path,help='Use an externally verified V167 HTML for local QA')
parser.add_argument('--out',type=Path,help='Write local test build instead of repo output')
parser.add_argument('--check',action='store_true')
a=parser.parse_args()
repo=Path(__file__).resolve().parents[1]
source=repo/'source'
base=a.base or source/'Study_Table_V167.html'
assert base.is_file(),f'V167 base missing: {base}'
html=base.read_text()
assert 'Study Table V167' in html,'Only build on the canonical V167 derived preview.'
original=html
added=json.loads((source/'story-matched-v168.json').read_text())
style=(source/'teachback-v168.css').read_text()
script=(source/'teachback-v168.js').read_text()
paths={'spanish':'v15/spanish-for-someone/complete-practice-v40/index.html',
       'piano':'v15/rockjam-piano-studio/index.html',
       'chess':'v15/chess-from-zero/index.html',
       'calculus':'curricula/calculus.html',
       'physics':'curricula/physics.html',
       'medicine':'curricula/medicine.html',
       'business':'curricula/business.html'}
story_units={'spanish':'spanish-5','piano':'rests-and-halves','chess':'castling',
             'calculus':'product-rule','physics':'physics-2',
             'medicine':'test-interpretation','business':'unit-economics'}
assert set(added)==set(story_units.values())-{'product-rule','unit-economics'}
for uid,bank in added.items():
 assert bank['subject'] in paths and story_units[bank['subject']]==uid
 assert len(bank['variants'])==2 and bank['skill']
 for problem in bank['variants']:
  assert problem['kind'] in {'number','choice','text'}
  assert problem.get('prompt') and problem.get('hint') and problem.get('why')
  assert isinstance(problem['wrong'],dict) and problem['wrong']
  if problem['kind']=='choice':assert problem['answer'] in problem['options'] and len(problem['options'])>=2
  if problem['kind']=='number':assert isinstance(problem['answer'],(int,float))

archive=re.search(r'(<script id="full-bundle" type="text/plain">)(.*?)(</script>)',html,re.S)
assert archive
bundle=json.loads(gzip.decompress(base64.b64decode(archive.group(2))))
assert len(bundle)==215
before={k:dict(v) for k,v in bundle.items()}

def replace_once(s,old,new):
 count=s.count(old)
 assert count==1,(old[:90],count)
 return s.replace(old,new,1)

def json_constant(page,name):
 tag=f'const {name}='
 assert page.count(tag)==1
 start=page.index(tag)+len(tag)
 data,end=json.JSONDecoder().raw_decode(page[start:])
 return data,start,start+end

units=0
for subject,path in paths.items():
 page=bundle[path]['t']
 match=re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',page,re.S)
 assert match,subject
 course=json.loads(match.group(1))
 assert course['subject']==subject
 unit_ids={unit['id'] for unit in course['units']}
 assert story_units[subject] in unit_ids
 for unit in course['units']:
  assert len(unit['exercise'])==2 and all(isinstance(s,str) and s.strip() for s in unit['exercise'])
  assert unit['mistake']['diagnosis']
 units+=len(course['units'])
 bank,start,end=json_constant(page,'V133_BANK')
 assert len(bank)==21 and all(len(v['variants'])==2 for v in bank.values())
 if subject in (x['subject'] for x in added.values()):
  uid=story_units[subject]
  assert uid not in bank
  bank[uid]=added[uid]
 page=page[:start]+json.dumps(bank,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+page[end:]
 route,start,end=json_constant(page,'V167_DATA')
 current=route[subject]
 assert current['storyUnit']==story_units[subject]
 if story_units[subject] in added:
  current['practiceUnit']=story_units[subject]
  current['practiceContext']='A new checked problem on the same idea as the story and worked lesson.'
 else:
  assert current['practiceUnit']==story_units[subject]
 page=page[:start]+json.dumps(route,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+page[end:]
 # Replace V167's post-assessment reflection with the optional whole-curriculum version.
 # Keep the original V167_REFLECTIONS data and use it to enrich the new comparison.
 anchor='+v133LessonMarkup(unit)+v167ReflectMarkup(unit)+v167LessonBridge(unit)'
 page=replace_once(page,anchor,'+v133LessonMarkup(unit)+v168InviteMarkup(unit)+v168TeachbackMarkup(unit)+v167LessonBridge(unit)')
 page=replace_once(page,'</style>',style+'\n</style>')
 page=replace_once(page,'window.studyTableFullCourse={subject:COURSE.subject',
  '// V168: no automatic scoring of open-ended reasoning.\n'+script+'\nwindow.studyTableFullCourse={subject:COURSE.subject')
 assert page.count('window.studyTableTeachbackV168=')==1
 bundle[path]={'t':page}
assert units==87
assert set(bundle)==set(before)
changed=[k for k in bundle if before[k]!=bundle[k]]
assert set(changed)==set(paths.values())
assert all(before[k]==bundle[k] for k in bundle if k not in paths.values())
encoded=base64.b64encode(gzip.compress(json.dumps(bundle,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
html=html[:archive.start(2)]+encoded+html[archive.end(2):]
html=html.replace('Study Table V167 — One Learning Path','Study Table V168 — One Idea, Three Ways')
assert html.count('V136_COMPANIONS')==original.count('V136_COMPANIONS')
assert html.count('<script id="st163-reconciled-script">')==1
outs=[a.out] if a.out else [source/'Study_Table_V168.html',repo/'public'/'study-table-v168.html']
for path in outs:
 assert path is not None
 if a.check:
  assert path.is_file() and path.read_text()==html,f'V168 parity mismatch: {path}'
 else:
  path.parent.mkdir(parents=True,exist_ok=True)
  path.write_text(html)
print(('V168 parity PASS' if a.check else 'V168 built')+f': {len(html.encode()):,} bytes, {units} authored teachbacks, {21+len(added)} total checked skills, seven matching story routes, 208 untouched archived pages')