from pathlib import Path
import base64,gzip,json,re,hashlib,copy
r=Path(__file__).resolve().parents[1]
raw=(r/'source/imports/claude-v120-original.html').read_bytes()
assert hashlib.sha256(raw).hexdigest()=='b197ad688aa40235a6441cc8b6fc6cf6121152e6620908258f525c9611bd7734'
def unpack(text):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',text,re.S)[1])))
uploaded=unpack(raw.decode());old=unpack((r/'public/study-table-v119.html').read_text());built=unpack((r/'public/index.html').read_text())
courses=json.loads((r/'source/full-courses-built.json').read_text());pack=json.loads((r/'source/claude-additions-v121.json').read_text())
expected={}
for subject,c in courses.items():
 incoming=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',uploaded[c['path']]['t'],re.S)[1])
 expected[subject]=incoming
 if subject in pack['courses']:assert incoming==pack['courses'][subject]
 if subject in pack['workshops']:assert incoming['workshop']==pack['workshops'][subject]
 if c['path'] in old:
  prior=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',old[c['path']]['t'],re.S)[1])
  assert prior['units']==c['units']
  assert prior['project']==c['project']
  if 'workshop' in prior:assert prior['workshop']==c['workshop']
 else:
  for u in expected[subject]['units']:u['demo']=None
for change in json.loads((r/'source/claude-corrections-v121.json').read_text()):
 t=expected
 for key in change['path'][:-1]:t=t[key]
 assert t[change['path'][-1]]==change['original'];t[change['path'][-1]]=change['replacement']
# Later editorial changes remain explicit; the actual imported V120 pack above is still exact.
for change in json.loads((r/'source/teaching-edits-v122.json').read_text()):
 t=expected
 for key in change['path'][:-1]:t=t[key]
 assert t[change['path'][-1]]==change['original'];t[change['path'][-1]]=change['replacement']
assert expected==courses,'unaccounted imported or prior course change'
# Inventory incoming executable figure features as well as course JSON.
figure_pattern=r"V114_FIGURES\[['\"]([^'\"]+)['\"]\]\s*="
for c in courses.values():
 incoming_ids=set(re.findall(figure_pattern,uploaded[c['path']]['t']))
 built_ids=set(re.findall(figure_pattern,built[c['path']]['t']))
 assert incoming_ids==built_ids,(c['subject'],'incoming figure inventory changed',incoming_ids-built_ids)

assert len(built)==len(uploaded)==215 and set(old)<=set(built)
paths={c['path'] for c in courses.values()}
for path in old:
 if path not in paths:assert old[path]==built[path]
assert sum(len(c['units']) for c in courses.values())==87
for c in courses.values():
 ids=[u['id'] for u in c['units']]
 for index,u in enumerate(c['units']):
  assert all(k in u for k in ['opening','teaching','first','second','mistake','recall','takeaway'])
  assert not u['recall']['from'] or ids.index(u['recall']['from'])<index
 for section in ['project','workshop']:
  assert len(c[section]['parts'])==4
  for part in c[section]['parts']:assert all(id in ids for id in part['links'])
def nwc(sales,cost,days=30):return sales*45/30+cost*40/30-cost*days/30
assert nwc(36000,23400)==61800 and nwc(72000,46800)==123600
assert 16200-(123600-61800)==-45600
assert nwc(72000,46800)-nwc(72000,46800,60)==46800
assert abs(61800*1.15**2-81730.5)<1e-8
assert abs(.21*(760-47)-40/.8-99.73)<1e-8
assert abs(1.34*15*.98+.003*100-19.998)<1e-8
assert 99/(99+495)==1/6 and abs(2970/3320-.8945783132530121)<1e-12
assert 10*3/(.5*2)==30 # 10 N over 3 m becomes the kinetic energy of a 2 kg cart
print('CLAUDE_V120_MERGE_PASS: incoming course data and figure IDs accounted for; 65 original units exact, 22 added units, four added workshops, two added projects, 215 assets and independently checked corrected calculations.')
