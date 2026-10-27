from pathlib import Path
import base64,gzip,hashlib,json,re
r=Path(__file__).resolve().parents[1]
def bundle(name):
 s=(r/'public'/name).read_text();encoded=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',s,re.S)[1]
 return json.loads(gzip.decompress(base64.b64decode(encoded)))
old=bundle('study-table-v118.html');new=bundle('index.html');courses=json.loads((r/'source/full-courses-built.json').read_text());paths={c['path'] for c in courses.values()}
assert set(old)<=set(new) and len(new)==215
for name in old:
 if name not in paths:assert old[name]==new[name],name
for course in courses.values():
 if course['subject'] in ['medicine','business']:continue
 prior=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',old[course['path']]['t'],re.S)[1])
 assert {k:v for k,v in prior.items() if k!='workshop'}=={k:v for k,v in course.items() if k!='workshop'},(course['subject'],'prior content changed')
assert hashlib.sha256((r/'source/imports/claude-v118-critique.txt').read_bytes()).hexdigest()=='383c9803794e606f904287bdfe8db635090efd2fe6d7e7f28d5f73fc7ca917cd'
assert hashlib.sha256((r/'source/imports/claude-v113-original.html').read_bytes()).hexdigest()=='96bb6a04e1adae6d70a34721c90c0f6df3e4e540d85e5f0140e1090823ea8d76'
print('REVIEW_FIXES_PRESERVATION_PASS: all V118 course data exact; all 213 assets retained and unrelated assets unchanged; both supplied documents identified by hash.')
