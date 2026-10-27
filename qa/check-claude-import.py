from pathlib import Path
import json,re,gzip,base64,hashlib
root=Path(__file__).resolve().parents[1]
raw=root/'source/imports/claude-v113-original.html'
assert hashlib.sha256(raw.read_bytes()).hexdigest()=='96bb6a04e1adae6d70a34721c90c0f6df3e4e540d85e5f0140e1090823ea8d76'
assert hashlib.sha256((root/'source/imports/claude-v113-notes.txt').read_bytes()).hexdigest()=='3b056106cabd974fd522d045a870777e147b8a6380cda5f1ba4d42d3dd0a2ef6'
def archive(path):
    encoded=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',path.read_text(),re.S)[1]
    return json.loads(gzip.decompress(base64.b64decode(encoded)))
def course(entry):return json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',entry['t'],re.S)[1])
original=archive(raw);prior=archive(root/'public/study-table-v113.html')
assert len(original)==len(prior)==213
base=archive(root/'public/study-table-v112.html')
pack=json.loads((root/'source/claude-additions-v114.json').read_text())
fixes=json.loads((root/'source/claude-corrections-v114.json').read_text())
current=json.loads((root/'source/full-courses-built.json').read_text())
assert len(pack)==65 and sum('mistake' in u for u in pack.values())==34
for subject,data in current.items():
    if subject in ['medicine','business']:continue
    path=data['path'];uploaded=course(original[path]);previous=course(prior[path]);baseline=course(base[path])
    assert [u['id'] for u in data['units']]==[u['id'] for u in uploaded['units']]==[u['id'] for u in previous['units']]
    for now,their,old,b in zip(data['units'],uploaded['units'],previous['units'],baseline['units']):
        id=now['id']
        extracted={k:their[k] for k in ['takeaway','recall','mistake'] if k in their and their[k]!=b.get(k)}
        assert pack[id]==extracted,(id,'unaccounted imported material')
        expected=json.loads(json.dumps(extracted))
        for key,value in fixes.get(id,{}).items():
            if isinstance(value,dict):expected[key].update(value)
            else:expected[key]=value
        for key,value in expected.items():assert now[key]==value,(id,key)
        for key,value in old.items():assert now[key]==value,(id,key,'prior teaching regressed')
        assert all(now['mistake'][k] for k in ['attempt','diagnosis','repair','check'])
        assert now['takeaway'] and now['recall']['ask'] and now['recall']['answer']
figures=re.findall(r"V114_FIGURES\['([^']+)'\]\s*=",(root/'source/claude-figures-v114.js').read_text())
assert len(figures)==len(set(figures))==16
print('CLAUDE_IMPORT_PRESERVATION_PASS: exact originals archived; all 65 additions, 34 new misconceptions and 16 figures accounted for; all prior V113 teaching retained.')
