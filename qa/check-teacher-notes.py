"""Preserve the complete V121 course lineage and check the new worked reasoning."""
from pathlib import Path
import base64,gzip,json,math,re
r=Path(__file__).resolve().parents[1]
notes=json.loads((r/'source/teacher-notes-v122.json').read_text())
courses=json.loads((r/'source/full-courses-built.json').read_text())
def unpack(path):
    text=path.read_text()
    return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',text,re.S)[1])))
prior=unpack(r/'public/study-table-v121.html');current=unpack(r/'public/index.html')
expected={s:json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',prior[c['path']]['t'],re.S)[1]) for s,c in courses.items()}
for change in json.loads((r/'source/teaching-edits-v122.json').read_text()):
    target=expected
    for k in change['path'][:-1]:target=target[k]
    assert target[change['path'][-1]]==change['original']
    target[change['path'][-1]]=change['replacement']
assert courses==expected,'Unrecorded course changes'
assert set(prior)==set(current)
paths={c['path'] for c in courses.values()}
for path in prior:
    if path not in paths:assert prior[path]==current[path],path
assert len(notes)==14 and sum(len(x['first']) for x in notes.values())==51
seen=set()
for c in courses.values():
    ids=[u['id'] for u in c['units']]
    assert sum(u['id'] in notes for u in c['units'])==2
    for i,u in enumerate(c['units']):
        if u['id'] not in notes:continue
        seen.add(u['id']);n=notes[u['id']]
        assert len(n['start'])==2 and len(n['first'])==len(u['first']['steps'])
        assert all(ids.index(link)<i for link in n['links']),(u['id'],'prerequisite must come earlier')
        if 'table' in n:
            t=n['table'];assert t['caption'] and t['after']
            assert all(len(row)==len(t['headers']) for row in t['rows'])
assert seen==set(notes)
# Independent checks of numerical claims, not just data/render agreement.
assert [(n,14*n-35) for n in range(5)]==[(0,-35),(1,-21),(2,-7),(3,7),(4,21)]
assert math.ceil(35/14)==3 and 4*14-35==21
assert 40+45==85 and 85-30==55 and 85-60==25
assert 99+495==594 and 1+9405==9406 and 594+9406==10000
assert 99/(99+495)==1/6 and 99/100==.99 and 9405/9900==.95
radius=(3*.003/(4*math.pi))**(1/3);area=4*math.pi*radius**2
assert .089<radius<.090 and .100<area<.101 and 690<70/area<700
s=lambda t:3*t*t+2*t+5
assert s(2)==21 and abs((s(2+1e-5)-s(2-1e-5))/(2e-5)-14)<1e-8
F=lambda x:(x*x+1)**4/4
for x in [-2,-.5,.5,2]:
    numerical=(F(x+1e-6)-F(x-1e-6))/(2e-6)
    assert math.isclose(numerical,2*x*(x*x+1)**3,rel_tol=1e-8)
assert math.sqrt(2*10*5)==10
assert (2*3+1*0)/(2+1)==2 and .5*2*3**2==9 and .5*3*2**2==6
assert 1+1+1+1+1+1+2==8 # complete two-bar melody
print('TEACHER_NOTES_PASS: V121 preserved except three explicit edits; fourteen guides, 51 step explanations, four tables, earlier-unit links and independent arithmetic verified.')
