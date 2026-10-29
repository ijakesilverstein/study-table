from pathlib import Path
import json,gzip,base64,re,sys
r=Path(__file__).resolve().parents[1]
def unpack(p):return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',p.read_text(),re.S)[1])))
old=unpack(r/'public/study-table-v130.html');new=unpack(r/'public/index.html');C=json.loads((r/'source/full-courses-built.json').read_text());D=json.loads((r/'source/specific-teaching-v132.json').read_text());R={**json.loads((r/'source/lesson-revisions-v126.json').read_text()),**json.loads((r/'source/lesson-revisions-v127.json').read_text())};Q=json.loads((r/'source/step-coach-v132.json').read_text());paths={v['path'] for v in C.values()}
assert len(new)==215 and set(new)==set(old)
for path in old:
 if path not in paths:assert old[path]==new[path],path
for c in C.values():
 for archive in [old,new]:assert json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',archive[c['path']]['t'],re.S)[1])==c
 for const in ['V126_REVISIONS','V109_DEMOS']:
  before=json.loads(re.search(r'const '+const+r'=(.*?);\n',old[c['path']]['t'],re.S)[1]);after=json.loads(re.search(r'const '+const+r'=(.*?);\n',new[c['path']]['t'],re.S)[1])
  assert before==({key:after[key] for key in before} if const=='V126_REVISIONS' else after)
existing={'piano-5','rests-and-halves','noun-phrases','spanish-5','count-exchanges','castling','product-rule','physics-2'}
new={'homeostasis','test-interpretation','unit-economics','cash-cycle'}
assert set(D)==existing|new
assert sum(len(D[id]['first'])+len(D[id]['second']) for id in existing)==51
assert sum(len(D[id]['first'])+len(D[id]['second']) for id in new)==29
assert len(D)==12 and sum(len(d['first'])+len(d['second']) for d in D.values())==80
for id,d in D.items():
 u=next(u for u in C[d['subject']]['units'] if u['id']==id)
 for case in ['first','second']:
  authored=R.get(id,{}).get(case+'Steps',u[case]['steps']);assert [s['anchor'] for s in d[case]]==[s[0] for s in authored],id
  assert all(all(s[k] for k in ['prompt','hint','help']) for s in d[case])
 assert all(d['comparison'][k] for k in ['correct','tempting','why'])
assert set(Q)=={'rests-and-halves','spanish-5','castling'}
for id,d in Q.items():
 assert len(d['steps'])==3
 for s in d['steps']:
  assert len(s['stuck'])==2 and s['reference']
  if 'table' in s['reference']:
   t=s['reference']['table'];assert all(len(row)==len(t['headers']) for row in t['rows'])
# Preserve the actual five scenario records that were already distributed in V130.
def root_scenarios(p):
 script=re.search(r'<script id="step-coach-v128">(.*?)</script>',p.read_text(),re.S)[1];return json.loads(re.search(r'const scenarios=(.*?);\n',script,re.S)[1])
a=root_scenarios(r/'public/study-table-v130.html');b=root_scenarios(r/'public/index.html');assert len(a)==5 and len(b)==8
assert {k:b[k] for k in a}==a
# Match piano decisions to the independently inspected note schedule.
demos=json.loads((r/'source/full-course-demos.json').read_text())['rests-and-halves']['patterns'];assert [e['at'] for e in demos[0]['events']]==[0,2,3] and [e['at'] for e in demos[1]['events']]==[0,.5,1,3]
assert [float(s['answer']) for s in Q['rests-and-halves']['steps']]==[2,2,.5]
sys.path.insert(0,str(r/'qa/check-tools'));import chess
boards=[chess.Board(s['reference']['board']['fen']) for s in Q['castling']['steps']];assert all(b.is_valid() for b in boards)
move=chess.Move.from_uci('e1g1');assert move in boards[0].legal_moves;boards[0].push(move);assert boards[0].board_fen()==boards[1].board_fen()
assert chess.F1 in boards[2].attacks(chess.F8) and not boards[2].is_check() and move not in boards[2].legal_moves
print('SPECIFIC_TEACHING_SOURCE_PASS: all V130 base/display/demo records and 208 unrelated assets retained; 80 aligned teaching turns in 12 lessons (29 additional medicine/business turns); 24 checked decisions in original eight eligible lessons; independent rhythm times and legal/illegal castling positions.')
