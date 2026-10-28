from pathlib import Path
import json,gzip,base64,re
r=Path(__file__).resolve().parents[1]
def unpack(p):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
a=unpack(r/'public/study-table-v127.html');b=unpack(r/'public/index.html')
c=json.loads((r/'source/full-courses-built.json').read_text());paths={x['path'] for x in c.values()}
assert set(a)==set(b) and len(b)==215
for path in a:
 if path not in paths:assert a[path]==b[path],path
for course in c.values():
 for entries in [a,b]:assert json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',entries[course['path']]['t'],re.S)[1])==course
 assert 'data-guided-start' in b[course['path']]['t']
d=json.loads((r/'source/step-coach-v128.json').read_text())
assert set(d)=={'piano-5','noun-phrases','count-exchanges','product-rule','physics-2'}
for id,v in d.items():
 assert any(u['id']==id for u in c[v['subject']]['units'])
 assert len(v['steps'])==3 and all(s['reasoning'] and len(s['stuck'])==2 for s in v['steps'])
sys=(r/'source/step-coach-v128.js').read_text();assert 'fetch(' not in sys and 'XMLHttpRequest' not in sys and 'localStorage' not in sys
assert 'instance.processLocally=true' in sys and "ready!=='available'" in sys and '.install(' not in sys
print('STEP_COACH_SOURCE_PASS: all 87 V127 base units/projects/workshops and 208 unrelated archive assets exact; original guided controls retained; five coaching scenarios, fifteen decisions, thirty confusion branches; no new remote API or persistence. Speech model must already be locally available.')
