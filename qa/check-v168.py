#!/usr/bin/env python3
"""Data, curriculum and archived-page invariants for optional source-generated V168."""
from pathlib import Path
import base64,gzip,json,re,sys
root=Path(__file__).resolve().parents[1]
source=root/'source'
base=Path(sys.argv[1]) if len(sys.argv)>1 else source/'Study_Table_V167.html'
out=Path(sys.argv[2]) if len(sys.argv)>2 else source/'Study_Table_V168.html'
extra=json.loads((source/'story-matched-v168.json').read_text())
paths={'spanish':'v15/spanish-for-someone/complete-practice-v40/index.html','piano':'v15/rockjam-piano-studio/index.html','chess':'v15/chess-from-zero/index.html','calculus':'curricula/calculus.html','physics':'curricula/physics.html','medicine':'curricula/medicine.html','business':'curricula/business.html'}

def unpack(path):
 html=path.read_text()
 z=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',html,re.S)
 assert z, path
 return html,json.loads(gzip.decompress(base64.b64decode(z.group(1))))

def constant(page,name):
 return json.JSONDecoder().raw_decode(page.split('const '+name+'=')[1])[0]

old,oldbook=unpack(base)
new,book=unpack(out)
assert len(book)==len(oldbook)==215
assert set(book)==set(oldbook)
assert sum(book[k]!=oldbook[k] for k in book)==7
assert all(book[k]==oldbook[k] for k in book if k not in paths.values())
assert 'V168' in new
assert new.count('V136_COMPANIONS')==old.count('V136_COMPANIONS')
assert new.count('<script id="st163-reconciled-script">')==1
assert oldbook['curricula/medicine.html']['t'].count('studyTableFullCourse')>0
allunits=0;allchecked={}
for subject,path in paths.items():
 prev=oldbook[path]['t'];page=book[path]['t'];
 def course(page):return json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',page,re.S).group(1))
 original=course(prev);current=course(page)
 assert current==original,subject
 allunits+=len(current['units'])
 bank=constant(page,'V133_BANK');oldbank=constant(prev,'V133_BANK')
 assert len(bank)==len(oldbank)+(subject in ['spanish','piano','chess','physics','medicine'])
 assert all(bank[k]==v for k,v in oldbank.items())
 assert page.count('window.studyTableTeachbackV168=')==1
 assert page.count('v168TeachbackMarkup(unit)')>=2
 assert page.count('+v167ReflectMarkup(unit)+v167LessonBridge(unit)')==0
 route=constant(page,'V167_DATA')[subject]
 assert route['storyUnit']==route['practiceUnit'],subject
 assert route['storyUnit'] in bank,subject
 assert route['storyUnit'] in {u['id'] for u in current['units']}
 allchecked.update({k:v for k,v in bank.items() if v['subject']==subject})
 for uid,item in bank.items():
  assert len(item['variants'])==2 and item['subject'] in paths
  for v in item['variants']:
   if v['kind']=='choice':assert v['answer'] in v['options']
   assert v['why'] and v['hint'] and v['prompt']
 print('PASS',subject,len(current['units']),'authored lessons',len([k for k,v in bank.items() if v['subject']==subject]),'verified skill banks')
assert allunits==87
assert len(allchecked)==26
assert sum(len(v['variants']) for v in allchecked.values())==52
for uid,item in extra.items():
 assert uid in allchecked and allchecked[uid]==item
 assert len(item['variants'])==2
print('PASS V168: 87 real lessons, 26 verified skills / 52 variants, seven matched story routes, 208 byte-identical archive pages, original assessment/progress intact')