"""Check exact V120 provenance, incoming code inventory and V122 preservation."""
from pathlib import Path
import base64,gzip,hashlib,json,re
r=Path(__file__).resolve().parents[1]
def bundle(p):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
incoming=bundle(r/'source/imports/claude-v120-original.html');prior=bundle(r/'public/study-table-v122.html');built=bundle(r/'public/index.html')
courses=json.loads((r/'source/full-courses-built.json').read_text());manifest=json.loads((r/'source/restored-figures-v123.json').read_text())
pattern=r"V114_FIGURES\[['\"]([^'\"]+)['\"]\]\s*="
assert set(manifest)=={'medicine','business'} and sum(len(x['ids']) for x in manifest.values())==12
assert set(prior)==set(built) and len(built)==215
changed={c['path'] for c in courses.values()}
for path in prior:
    if path not in changed:assert prior[path]==built[path],path
for subject,c in courses.items():
    path=c['path']
    old_data=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',prior[path]['t'],re.S)[1])
    assert old_data==c,(subject,'V122 course data changed')
    assert set(re.findall(pattern,incoming[path]['t']))==set(re.findall(pattern,built[path]['t']))
    if subject not in manifest:continue
    record=manifest[subject];original=(r/'source'/record['original']).read_bytes()
    assert hashlib.sha256(original).hexdigest()==record['sha256']
    text=incoming[path]['t'];start=text.index('/* V120 explorable figures');end=text.index('const v114N=',start)
    assert original.decode()==text[start:end]
    assert set(re.findall(pattern,original.decode()))==set(record['ids'])
    corrected=(r/'source'/record['corrected']).read_text()
    assert set(re.findall(pattern,corrected))==set(record['ids'])
    assert set(record['ids'])<=set(u['id'] for u in c['units'])
    assert set(re.findall(pattern,incoming[path]['t']))-set(re.findall(pattern,prior[path]['t']))==set(record['ids'])
print('RESTORED_FIGURE_PROVENANCE_PASS: all twelve incoming code features recovered; exact archived originals; all V122 course data and all unrelated assets unchanged.')
