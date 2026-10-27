"""Keep V125's base records/demonstrations while checking six explicit display revisions."""
from pathlib import Path
import base64,gzip,json,re,sys
r=Path(__file__).resolve().parents[1]
D=json.loads((r/'source/lesson-revisions-v126.json').read_text());C=json.loads((r/'source/full-courses-built.json').read_text())
def bundle(p):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
previous=bundle(r/'public/study-table-v125.html');current=bundle(r/'public/index.html');paths={c['path'] for c in C.values()}
assert len(current)==215 and set(previous)==set(current)
for path in previous:
    if path not in paths:assert previous[path]==current[path],path
for c in C.values():
    stored=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',previous[c['path']]['t'],re.S)[1])
    assert stored==c,'V125 base record was changed'
assert set(D)=={'comfortable-hands','piano-0','spanish-0','spanish-sounds','questions','chess-4'}
count=0;tables=0
for id,revision in D.items():
    c=C[revision['subject']];u=next(u for u in c['units'] if u['id']==id)
    assert len(revision['opening'])==2 and len(revision['teaching'])==len(u['teaching'])
    assert len(revision['firstSteps'])==len(u['first']['steps'])
    assert all(len(s)==3 and all(isinstance(t,str) and t for t in s) for s in revision['firstSteps'])
    count+=len(revision['firstSteps'])
    for name,table in revision['tables'].items():
        tables+=1;assert name in ['first','second'];assert table['caption']
        assert all(len(row)==len(table['headers']) for row in table['rows'])
        assert all(0<=i<len(table['headers']) for i in table.get('languageColumns',[]))
    if 'deeper' in revision:assert all(0<=i<len(u['teaching']) for i in revision['deeper']['originalTeaching'])
assert count==22 and tables==7
# Independently inspect the model that the new rhythm table explains.
demos=json.loads((r/'source/full-course-demos.json').read_text());p=demos['piano-0']['patterns'][1]
assert p['beats']==4 and [(e['at'],e['beats']) for e in p['events']]==[(0,2),(2,2)]
assert [60/bpm for bpm in [60,120]]==[1,.5]
assert [[str(i%4+1) if i<4 else 'Next 1',f'{i} s'] for i in range(5)]==[row[:2] for row in D['piano-0']['tables']['first']['rows']]
assert [e['note'] for e in demos['comfortable-hands']['patterns'][0]['events']]==[row[1] for row in D['comfortable-hands']['tables']['first']['rows']]
assert [e['note'] for e in demos['comfortable-hands']['patterns'][1]['events']]==[row[1] for row in D['comfortable-hands']['tables']['second']['rows']]
# The complete capture outcomes matter: material gain does not imply a won game.
sys.path.insert(0,str(r/'qa/check-tools'));import chess
for line in demos['chess-4']['lines']:
    b=chess.Board(line['fen']);assert b.is_valid()
    for uci in line['moves']:
        move=chess.Move.from_uci(uci);assert move in b.legal_moves;b.push(move)
    assert b.is_insufficient_material() and b.is_game_over()
assert 'drawn' in D['chess-4']['firstSteps'][-1][2] and 'drawn' in D['chess-4']['secondNotice']
assert D['spanish-sounds']['deeper']['originalTeaching']==[1]
print('LESSON_REVISIONS_SOURCE_PASS: six displayed lessons, 22 worked steps, seven tables; all V125 base records and unrelated assets exact; finger routes, beat times and both drawn chess endings independently verified.')
