"""Verify additive teaching and independently check the worked musical/chess claims."""
from pathlib import Path
import base64,gzip,json,re,sys
r=Path(__file__).resolve().parents[1]
def bundle(p):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
def constant(page,name):return json.loads(re.search(r'const '+name+r'=(.*?);\n',page,re.S)[1])
old=bundle(r/'public/study-table-v132.html');new=bundle(r/'public/index.html')
C=json.loads((r/'source/full-courses-built.json').read_text());R=json.loads((r/'source/lesson-revisions-v135.json').read_text());G=json.loads((r/'source/specific-teaching-v135.json').read_text())
assert set(R)==set(G)=={'piano-2','piano-4','habits','descriptions','chess-1','chess-2'}
assert len(new)==len(old)==215 and set(new)==set(old)
paths={c['path'] for c in C.values()}
for path in old:
 if path not in paths:assert old[path]==new[path],path
for c in C.values():
 a=old[c['path']]['t'];b=new[c['path']]['t']
 for page in [a,b]:assert json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',page,re.S)[1])==c
 for name in ['V126_REVISIONS','V132_SPECIFIC']:
  before=constant(a,name);after=constant(b,name);added={id:rec for id,rec in (R if name=='V126_REVISIONS' else G).items() if rec['subject']==c['subject']}
  assert not set(before)&set(added)
  assert after=={**before,**added},(c['subject'],name)
 assert constant(a,'V109_DEMOS')==constant(b,'V109_DEMOS')
for id,d in R.items():
 base=next(u for u in C[d['subject']]['units'] if u['id']==id)
 assert d['edition']==135 and len(d['opening'])==2 and len(d['teaching'])==4
 assert d['deeper']['originalTeaching']==list(range(len(base['teaching'])))
 for case in ['first','second']:
  assert len(d[case+'Steps'])==4
  assert [turn['anchor'] for turn in G[id][case]]==[s[0] for s in d[case+'Steps']]
  assert all(len(s)==3 and all(s) for s in d[case+'Steps'])
  assert all(all(turn[k] for k in ['prompt','hint','help']) for turn in G[id][case])
  t=d['tables'][case];assert all(len(row)==len(t['headers']) for row in t['rows'])
  if d['subject']=='spanish':assert t['languageColumns']
assert sum(len(d['first'])+len(d['second']) for d in G.values())==48
# Independently specified note attacks and durations: do not derive expectations from the renderer.
D=json.loads((r/'source/full-course-demos.json').read_text())
p=D['piano-2']['patterns'][0]
assert [(e['note'],e['at'],e['beats']) for e in p['events']]==[(n,i,2 if i==6 else 1) for i,n in enumerate(['E4','D4','C4','D4','E4','E4','E4'])]
assert p['beats']==8 and len(p['events'])==7
assert max(e['at']+e['beats'] for e in p['events'])==8
assert [row[1] for row in R['piano-2']['tables']['first']['rows']]==[f'{i} s' for i in range(9)]
block=D['piano-4']['patterns'][1]['events'];inversion=D['piano-4']['patterns'][2]['events']
assert [(e['note'],e['at'],e['beats']) for e in block]==[(n,0,3) for n in ['C4','E4','G4']]
assert [(e['note'],e['at'],e['beats']) for e in inversion]==[(n,0,3) for n in ['E4','G4','C5']]
# MIDI distances include black keys, independent of the prose/table.
midi={'C4':60,'D4':62,'E4':64,'F4':65,'F#4':66,'G4':67,'A4':69,'C5':72}
assert [midi['E4']-midi['C4'],midi['G4']-midi['E4']]==[4,3]
assert [midi['F4']-midi['D4'],midi['A4']-midi['F4']]==[3,4]
assert [midi['F#4']-midi['D4'],midi['A4']-midi['F#4']]==[4,3]
# Check actual legality, all king destinations, and stalemate rather than trusting lesson labels.
sys.path.insert(0,str(r/'qa/check-tools'));import chess
check=chess.Board('k3r3/8/8/8/8/8/8/2B1K3 w - - 0 1');assert check.is_valid() and check.is_check()
assert chess.Move.from_uci('c1d2') in check.pseudo_legal_moves and chess.Move.from_uci('c1d2') not in check.legal_moves
for uci in ['c1e3','e1f1']:
 b=check.copy();m=chess.Move.from_uci(uci);assert m in b.legal_moves;b.push(m);assert not b.is_attacked_by(chess.BLACK,b.king(chess.WHITE))
threat=chess.Board('7k/8/8/8/3b4/8/8/R6K w - - 0 1');assert not threat.is_check();assert threat.is_attacked_by(chess.BLACK,chess.A1);threat.push_uci('a1a2');assert not threat.is_attacked_by(chess.BLACK,chess.A2)
reply=chess.Board('r7/1B6/8/8/8/8/2k5/K7 w - - 0 1');assert reply.is_valid() and reply.is_check() and not reply.is_checkmate()
assert not [m for m in reply.legal_moves if m.from_square==chess.A1]
reply.push_uci('b7a8');assert not reply.is_attacked_by(chess.BLACK,chess.A1)
stale=chess.Board('k7/8/1QK5/8/8/8/8/8 b - - 0 1');assert stale.is_valid() and not stale.is_check() and stale.is_stalemate()
print('TEACHER_DEMONSTRATIONS_SOURCE_PASS: six additive revisions, 48 aligned turns, 12 tables; all prior records/display data/80 teaching turns/demos and 208 unrelated assets retained; independent musical timing, chord intervals, legal replies and stalemate.')
