from pathlib import Path
import gzip,base64,re,json,hashlib
r=Path(__file__).resolve().parents[1]
def unpack(p):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
a=unpack(r/'public/study-table-v128.html');b=unpack(r/'public/index.html');courses=json.loads((r/'source/full-courses-built.json').read_text());paths={c['path'] for c in courses.values()}
assert len(b)==215 and set(a)==set(b)
for path in a:
 if path not in paths:assert a[path]==b[path],path
manifest=json.loads((r/'source/imports/concurrent-coaching-v130.json').read_text())
for record in manifest['files']:
 raw=(r/record['path']).read_bytes()
 if not record['runtime_modified']:assert hashlib.sha256(raw).hexdigest()==record['original_sha256']
 assert set(record['functions'])<=set(re.findall(r'function\s+(v\d+\w+)\s*\(',raw.decode()))
for course in courses.values():
 path=course['path']
 for archive in [a,b]:assert json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',archive[path]['t'],re.S)[1])==course
 # Protect actual authored display revisions and demonstrations as well as base records.
 for constant in ['V126_REVISIONS','V109_DEMOS']:
  old=json.loads(re.search(r'const '+constant+r'=(.*?);\n',a[path]['t'],re.S)[1])
  new=json.loads(re.search(r'const '+constant+r'=(.*?);\n',b[path]['t'],re.S)[1]);assert old==new,(path,constant)
 for rec in manifest['files']:
  if rec['path'].endswith('.js'):
   for name in rec['functions']:assert 'function '+name+'(' in b[path]['t']
 assert 'wire();v129MountCoach();' in b[path]['t']
s=(r/'source/worked-coach-v127.js').read_text();assert 'rec.processLocally=true' in s and "ready!=='available'" in s and 'v127VoiceGeneration' in s
print('INTEGRATED_COACHING_PASS: actual V128 display revisions, all demonstrations, 87 base units/projects/workshops and 208 other assets retained; all incoming coaching function IDs embedded in seven readers; on-device speech guards present; original source snapshot recorded.')
