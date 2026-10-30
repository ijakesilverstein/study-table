#!/usr/bin/env python3
"""V167 source parity and preservation; no blind counting of labels as course units."""
from pathlib import Path
import base64,gzip,json,re,sys
root=Path(__file__).resolve().parents[1]
source=root/'source'
def bundle(path):
 html=path.read_text();m=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',html,re.S)
 assert m,'Missing archive'
 return html,json.loads(gzip.decompress(base64.b64decode(m.group(1))))
prev,old=bundle(source/'Study_Table_V166.html');final,new=bundle(source/'Study_Table_V167.html')
assert len(old)==len(new)==215
path_map={'spanish':'v15/spanish-for-someone/complete-practice-v40/index.html','piano':'v15/rockjam-piano-studio/index.html','chess':'v15/chess-from-zero/index.html','calculus':'curricula/calculus.html','physics':'curricula/physics.html','medicine':'curricula/medicine.html','business':'curricula/business.html'}
assert set(old)==set(new)
changed={p for p in old if old[p]!=new[p]}
assert changed==set(path_map.values()),('Unexpected archived changes',changed-set(path_map.values()))
for subject,path in path_map.items():
 content=new[path]['t'];assert content.count('window.studyTablePathV167=')==1
 course=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',content,re.S).group(1))
 assert len(course['units'])>=11 and course['subject']==subject
 assert 'V136_COMPANIONS' in content or 'v136-companion' in content
 for needle in ('v134StoryMarkup()','v133LessonMarkup(unit)','v167PathMarkup()','v167ReflectMarkup(unit)','v167LessonBridge(unit)'):
  assert needle in content,(subject,needle)
 assert content.count('const V167_DATA=')==1
 assert 'v166SpanishMarkup()' in content if subject=='spanish' else 'v166SpanishMarkup()' not in content
assert final.count('V136_COMPANIONS')==prev.count('V136_COMPANIONS')
assert final.count('<script id="st163-reconciled-script">')==1
assert 'data-st160=\\"path\\"' in final or 'data-st160="path"' in final
book=json.loads((source/'learning-path-v167.json').read_text())
assert len(book['practiceReflections'])==21
assert set(book)-{'practiceReflections'}==set(path_map)
print('PASS V167: 7 authentic course changes, 208 unchanged archive pages, 21 authored explanations, source parity and preserved canonical teachers')