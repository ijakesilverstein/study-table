from pathlib import Path
import json,re,gzip,base64,sys,subprocess
r=Path(__file__).resolve().parents[1];sys.path.insert(0,str(r/'qa/check-tools'))
import chess
workshops=json.loads((r/'source/teacher-workshops-v117.json').read_text());demos=json.loads((r/'source/workshop-demos-v117.json').read_text());courses=json.loads((r/'source/full-courses-built.json').read_text())
encoded=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',(r/'public/study-table-v116.html').read_text(),re.S)[1];prior=json.loads(gzip.decompress(base64.b64decode(encoded)))
for subject,course in courses.items():
 old=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',prior[course['path']]['t'],re.S)[1])
 assert {k:v for k,v in course.items() if k!='workshop'}==old,(subject,'V116 teaching changed')
 if subject not in workshops:assert 'workshop' not in course;continue
 assert course['workshop']==workshops[subject] and len(course['workshop']['parts'])==4
 for part,demo in zip(course['workshop']['parts'],demos[subject]):
  assert len(part['steps'])==len(demo['stepTargets'])==3 and len(part['opening'])>=2
  assert all(id in [u['id'] for u in course['units']] for id in part['links'])
saved=(r/'source/workshop-demos-v117.json').read_bytes();subprocess.run([sys.executable,str(r/'qa/generate-workshop-demos.py')],check=True);assert saved==(r/'source/workshop-demos-v117.json').read_bytes(),'Regenerate workshop demos'
values={chess.PAWN:1,chess.KNIGHT:3,chess.BISHOP:3,chess.ROOK:5,chess.QUEEN:9}
def balance(b):return sum(values.get(p.piece_type,0)*(1 if p.color else -1) for p in b.piece_map().values())
for part in demos['chess']:
 for line in part['lines']:
  b=chess.Board(line['fen']);assert b.is_valid()
  for i,f in enumerate(line['frames']):
   if i:
    move=chess.Move.from_uci(line['moves'][i-1]);assert move in b.legal_moves
    assert f['san']==b.san(move);b.push(move)
   assert f['fen']==b.fen()
   assert f['pieces']=={chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in b.piece_map().items()}
 for t in part['stepTargets']:assert t['position']<len(part['lines'][t['line']]['frames'])
fork=demos['chess'][0]['lines'][0];b=chess.Board(fork['frames'][1]['fen']);assert b.is_check() and chess.A8 in b.attacks(chess.C7) and chess.E8 in b.attacks(chess.C7);assert not any(m.from_square==chess.A8 for m in b.legal_moves)
assert balance(chess.Board(fork['frames'][-1]['fen']))-balance(chess.Board(fork['fen']))==5
exchange=demos['chess'][1]['lines'][0];assert balance(chess.Board(exchange['frames'][-1]['fen']))-balance(chess.Board(exchange['fen']))==-2
pin=demos['chess'][2]['lines'][0];b=chess.Board(pin['fen']);assert b.is_pinned(chess.WHITE,chess.E2);assert not b.is_legal(chess.Move.from_uci('e2d2'));assert b.is_legal(chess.Move.from_uci('e2e8')) and b.is_legal(chess.Move.from_uci('e2e3'))
assert chess.Board(demos['chess'][3]['lines'][0]['frames'][-1]['fen']).is_checkmate()
assert chess.Board(demos['chess'][3]['lines'][1]['frames'][-1]['fen']).is_stalemate()
assert sum(len(p['patterns']) for p in demos['piano'])==10
for part in demos['piano']:
 assert part['countIn']==4 and part['tempos']==[40,50,60,70,80] and part['defaultTempo']==50
 for p in part['patterns']:
  assert p['beats'] in [8,16]
  for e in p['events']:assert e['note'] in part['keys'] and e['hand'] in ['left','right'] and 0<=e['at']<e['at']+e['beats']<=p['beats']
 for t in part['stepTargets']:assert t['pattern']<len(part['patterns'])
wrong,correct=demos['piano'][0]['patterns']
assert next(e['at'] for e in wrong['events'] if e['note']=='F4')==3
assert next(e['at'] for e in correct['events'] if e['note']=='F4')==4
assert next(e['beats'] for e in wrong['events'] if e['note']=='C4')==1
assert next(e['beats'] for e in correct['events'] if e['note']=='C4')==2
skeleton=demos['piano'][2]['patterns'][0];assert [(e['at'],e['beats']) for e in skeleton['events'] if e['hand']=='right']==[(0,1),(4,1)]
assert sum(len(p['cases']) for p in demos['spanish'])==13
for part in demos['spanish']:
 for c in part['cases']:assert 0<=c['focus']<len(c['lines']) and len(c['parts'])>=2 and all(len(line)==3 for line in c['lines'])
 for t in part['stepTargets']:assert t['case']<len(part['cases'])
print('WORKSHOP_DATA_PASS: all V116 records retained; twelve teaching chapters; eight independently legal chess lines; ten timed piano patterns; thirteen authored Spanish models.')
