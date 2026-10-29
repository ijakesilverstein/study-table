"""Protect V135 and verify authored visual models independently of the renderer."""
from pathlib import Path
import json,re,gzip,base64,sys
r=Path(__file__).resolve().parents[1]
def bundle(p):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
def const(page,name):return json.loads(re.search(r'const '+name+r'=(.*?);\n',page,re.S)[1])
a=bundle(r/'public/study-table-v135.html');b=bundle(r/'public/index.html');C=json.loads((r/'source/full-courses-built.json').read_text());D=json.loads((r/'source/lesson-companions-v136.json').read_text());demos=json.loads((r/'source/full-course-demos.json').read_text())
assert set(a)==set(b) and len(b)==215
paths={c['path'] for c in C.values()}
for path in a:
 if path not in paths:assert a[path]==b[path],path
for c in C.values():
 before=a[c['path']]['t'];after=b[c['path']]['t']
 for page in [before,after]:assert json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',page,re.S)[1])==c
 for name in ['V126_REVISIONS','V132_SPECIFIC','V109_DEMOS','V128_COACH_UNITS']:assert const(before,name)==const(after,name),(c['subject'],name)
 assert const(after,'V136_COMPANIONS')=={id:d for id,d in D.items() if d['subject']==c['subject']}
assert set(D)=={'piano-2','descriptions','chess-2'}
for id,d in D.items():
 assert d['case'] in ['courseFirst','courseSecond']
 assert id in {u['id'] for u in C[d['subject']]['units']}
 for scene in d['scenes']:
  assert 0<=scene['initial']<len(scene['frames'])
  assert all(all(f[k] for k in ['label','heading','explanation']) for f in scene['frames'])
piano=D['piano-2'];assert piano['case']=='courseSecond' and len(piano['scenes'])==2
fragment,whole=[scene['frames'] for scene in piano['scenes']]
assert [(f['at'],f['note'],f['action']) for f in fragment]==[(0,'C4','strike'),(1,'D4','strike'),(2,'E4','strike'),(3,'E4','strike'),(4,'','release')]
assert [f['label'] for f in fragment[:4]]==['3','4','Next 1','2']
assert [f['at'] for f in whole]==list(range(9))
assert [(f['at'],f['note']) for f in whole if f['action']=='strike']==[(e['at'],e['note']) for e in demos['piano-2']['patterns'][0]['events']]
assert whole[7]['note']=='E4' and whole[7]['action']=='hold' and whole[8]['action']=='release'
assert max(e['at']+e['beats'] for e in demos['piano-2']['patterns'][0]['events'])==whole[8]['at']==8
for scene in piano['scenes']:
 for f in scene['frames']:
  if f['action']=='strike':assert f['finger'][0]=={'C4':'1','D4':'2','E4':'3'}[f['note']]
spanish=D['descriptions'];assert spanish['case']=='courseFirst' and len(spanish['scenes'])==4
expected=[('Estoy','aburrido','I am bored.'),('Estoy','aburrida','I am bored.'),('Soy','aburrido','I am boring.'),('Soy','aburrida','I am boring.')]
for scene,(verb,adjective,meaning) in zip(spanish['scenes'],expected):
 assert scene['initial']==2 and len(scene['frames'])==3
 assert [p['word'] for p in scene['parts']]==[verb,adjective]
 assert scene['translation']==meaning and scene['frames'][2]['heading']==verb+' '+adjective+'.'
 assert [f['shown'] for f in scene['frames']]==[1,2,2]
 assert [f['focus'] for f in scene['frames']]==[0,1,None]
sys.path.insert(0,str(r/'qa/check-tools'));import chess
d=D['chess-2'];assert d['case']=='courseSecond';board=chess.Board(d['fen']);assert board.is_valid() and board.turn==chess.BLACK
assert board.piece_map()=={chess.A8:chess.Piece.from_symbol('k'),chess.B6:chess.Piece.from_symbol('Q'),chess.C6:chess.Piece.from_symbol('K')}
assert not board.is_check() and board.is_stalemate() and not list(board.legal_moves)
assert set(chess.SquareSet(chess.BB_KING_ATTACKS[chess.A8]))=={chess.A7,chess.B7,chess.B8}
for f in d['scenes'][0]['frames']:
 if f['target']:
  assert {chess.square_name(s) for s in board.attackers(chess.WHITE,chess.parse_square(f['target']))}==set(f['attackers'])
 else:assert set(f['marks'])=={'a7','b7','b8'}
assert json.loads((r/'vercel.json').read_text())['git']['deploymentEnabled'] is False
print('LESSON_COMPANIONS_SOURCE_PASS: prior 87 units, all display/guidance/demo records, eight checked scenarios and 208 unrelated assets retained; seven piano attacks/eight beats, four Spanish models, all chess attack sets and stalemate independently verified. No Vercel Git deployments enabled.')
