from pathlib import Path
import json,re,base64,gzip
r=Path(__file__).resolve().parents[1]
math=json.loads((r/'source/math-desk-v116.json').read_text());links=json.loads((r/'source/project-walkthrough-v116.json').read_text());demos=json.loads((r/'source/project-demos-v115.json').read_text());courses=json.loads((r/'source/full-courses-built.json').read_text())
assert len(math)==7 and all(len(t['examples'])==2 for t in math.values())
encoded=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',(r/'public/study-table-v115.html').read_text(),re.S)[1];old=json.loads(gzip.decompress(base64.b64decode(encoded)))
for subject,course in courses.items():
 if subject in ['medicine','business']:continue
 previous=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',old[course['path']]['t'],re.S)[1])
 assert previous=={k:v for k,v in course.items() if k!='workshop'},(subject,'prior teaching changed')
 assert len(links[subject])==4
 for part_index,part in enumerate(links[subject]):
  assert len(part)==3
  for target in part:
   assert target['label']
   if 'help' in target:assert target['help'] in math
   if subject=='piano':assert target['hand'] in ['right','left','both'] and 0<=target['bars'][0]<target['bars'][1]<=8
   elif subject=='chess':assert 0<=target['position']<len(demos['chess']['lines'][0]['frames'])
   elif subject=='spanish':assert course['project']['parts'][part_index]['dialogue'][0]<=target['turn']<course['project']['parts'][part_index]['dialogue'][1]
   elif subject=='physics':assert target['height'] in [.45,.8] and target['phase'] in ['hill','collision','spring','account']
   else:assert target['capacity'] in [20,24] and target['preset'] in ['fill','drain'] and (target['time']=='full' or 0<=target['time']<=4)
print('CLARITY_DATA_PASS: all V115 course and project records retained exactly; seven maths topics, fourteen worked examples, sixty valid demonstration targets.')
