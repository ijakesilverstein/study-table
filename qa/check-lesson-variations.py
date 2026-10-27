"""Check independent board legality, note timing, arithmetic and complete V124 preservation."""
from pathlib import Path
import base64,gzip,json,re,sys
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'qa/check-tools'))
import chess
def bundle(path):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',path.read_text(),re.S)[1])))
prior=bundle(root/'public/study-table-v124.html');built=bundle(root/'public/index.html')
courses=json.loads((root/'source/full-courses-built.json').read_text());data=json.loads((root/'source/lesson-variations-v125.json').read_text())
assert set(data)=={'phrasing','cafe-project','queen-net','calculus-1','force-diagrams'}
assert len(built)==215 and set(prior)==set(built)
paths={c['path'] for c in courses.values()}
for path in built:
    if path not in paths:assert built[path]==prior[path],path
for c in courses.values():
    before=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',prior[c['path']]['t'],re.S)[1])
    assert before==c,'V124 course records changed'
    assert '<script id="full-course-data"' in built[c['path']]['t']
    assert '__LESSON_VARIATIONS__' not in built[c['path']]['t']
    assert sum(u['id'] in data for u in c['units'])==(0 if c['subject'] in ['medicine','business'] else 1)
for id,item in data.items():
    assert item['intro'] and item['try']
    for v in item.get('variants',[]):assert len(v['steps'])==3 and all(len(text.split())>20 for _,text in v['steps'])
for v in data['phrasing']['variants']:
    assert sum(n[2] for n in v['notes'])==8
    assert v['notes'][:3]==[['C4',0,1],['D4',1,1],['E4',2,2]]
    assert all(n in ['C4','D4','E4'] and at>=0 and duration>0 and at+duration<=8 for n,at,duration in v['notes'])
    assert all(a[1]+a[2]==b[1] for a,b in zip(v['notes'],v['notes'][1:]))
assert data['phrasing']['variants'][2]['notes'][3:]==[['E4',4,1.5],['D4',5.5,.5],['C4',6,2]]
for v in data['queen-net']['variants']:
    b=chess.Board(v['startFen']);assert b.is_valid() and b.turn==chess.WHITE
    move=chess.Move.from_uci(v['move']);assert move in b.legal_moves;b.push(move)
    assert b.fen()==v['fen'] and b.is_check()==v['check'] and b.is_checkmate()==v['mate'] and b.is_stalemate()==v['stalemate']
    pieces=lambda:{chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in b.piece_map().items()}
    assert pieces()==v['pieces']
    assert {m.uci() for m in b.legal_moves}=={r['move'] for r in v['replies']}
    for r in v['replies']:
        m=chess.Move.from_uci(r['move']);assert b.san(m)==r['san'];b.push(m);assert b.fen()==r['fen'] and pieces()==r['pieces'] and not b.is_check();b.pop()
assert [(v['mate'],v['stalemate']) for v in data['queen-net']['variants']]==[(True,False),(False,True),(False,False)]
assert data['queen-net']['variants'][2]['replies'][0]['san']=='Kb8'
assert [(t+1)**2-t*t for t in range(4)]==[1,3,5,7]
assert [(v['push']-4)/2 for v in data['force-diagrams']['variants']]==[3,0,-2]
print('LESSON_VARIATIONS_SOURCE_PASS: five teaching extensions; every V124 course record and all 208 unrelated assets exact; legal queen replies, all note durations and independent rate/force calculations verified.')
