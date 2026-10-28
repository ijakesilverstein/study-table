"""Preserve V126 and independently check the examples explained by V127."""
from pathlib import Path
from fractions import Fraction as F
import base64,gzip,json,re,sys
r=Path(__file__).resolve().parents[1]
def bundle(p):
 return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
old=bundle(r/'public/study-table-v126.html');new=bundle(r/'public/index.html')
courses=json.loads((r/'source/full-courses-built.json').read_text())
paths={c['path'] for c in courses.values()}
assert set(old)==set(new) and len(new)==215
for path in old:
 if path not in paths:assert old[path]==new[path],path
for c in courses.values():
 before=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',old[c['path']]['t'],re.S)[1])
 after=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',new[c['path']]['t'],re.S)[1])
 assert before==after==c,c['subject']
D=json.loads((r/'source/lesson-revisions-v127.json').read_text())
assert set(D)=={'piano-5','rests-and-halves','noun-phrases','spanish-2','count-exchanges','castling','product-rule','physics-2'}
assert not set(D)&set(json.loads((r/'source/lesson-revisions-v126.json').read_text()))
for id,d in D.items():
 u=next(u for u in courses[d['subject']]['units'] if u['id']==id)
 assert len(d['opening'])==2 and len(d['teaching'])==3 and len(d['firstSteps'])==len(u['first']['steps'])
 assert len(d.get('secondSteps',u['second']['steps']))==len(u['second']['steps'])
 assert all(len(s)==3 and all(isinstance(t,str) and t.strip() for t in s) for s in d['firstSteps']+d.get('secondSteps',[]))
 for table in d['tables'].values():assert all(len(row)==len(table['headers']) for row in table['rows'])
assert sum(len(x['firstSteps'])+len(x.get('secondSteps',[])) for x in D.values())==30
assert sum(len(x['tables']) for x in D.values())==9
# Derive the rectangle's exact interval averages from its two dimension functions.
for h,expected in [(F(1,2),F(79,4)),(F(1,10),F(1671,100)),(F(1,100),F(160701,10000))]:
 assert (((2+h)+1)*(2+h)**2-12)/h==expected
assert (3*2**2+2*2)==16
assert F(1,2)*2*10**2==2*10*5==100
assert F(1,2)*2*8**2+36==100
# Replay legal moves; inspect actual pieces lost rather than trusting the captions.
sys.path.insert(0,str(r/'qa/check-tools'));import chess
models=json.loads((r/'source/full-course-demos.json').read_text())
value={chess.PAWN:1,chess.KNIGHT:3,chess.BISHOP:3,chess.ROOK:5,chess.QUEEN:9,chess.KING:0}
for line,expected in zip(models['count-exchanges']['lines'],[[3,-3],[3,-5]]):
 b=chess.Board(line['fen']);ledger=[]
 for uci in line['moves']:
  move=chess.Move.from_uci(uci);assert move in b.legal_moves
  captured=b.piece_at(move.to_square);ledger.append(value[captured.piece_type]*(1 if b.turn==chess.WHITE else -1));b.push(move)
 assert ledger==expected
assert 'f1' in D['castling']['tables']['second']['rows'][1][0]
for fen,legal in [('4k3/8/8/8/8/8/8/4K2R w K - 0 1',True),('4kr2/8/8/8/8/8/8/4K2R w K - 0 1',False)]:
 b=chess.Board(fen);assert b.is_valid();assert (chess.Move.from_uci('e1g1') in b.legal_moves)==legal
print('TEACHING_V127_SOURCE_PASS: 87 V126 base units/projects/workshops and 208 other archive assets exact; eight authored revisions, 30 worked steps, nine tables; independent area/energy arithmetic, capture ledgers and castling legality.')
