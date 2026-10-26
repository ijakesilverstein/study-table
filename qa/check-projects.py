from pathlib import Path
import json,re,gzip,base64,sys,subprocess
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'qa/check-tools'))
import chess
projects=json.loads((root/'source/course-projects-v115.json').read_text())
current=json.loads((root/'source/full-courses-built.json').read_text())
encoded=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',(root/'public/study-table-v114.html').read_text(),re.S)[1]
prior=json.loads(gzip.decompress(base64.b64decode(encoded)))
for subject,course in current.items():
    old=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',prior[course['path']]['t'],re.S)[1])
    assert course['units']==old['units'],subject+' lost or changed prior teaching'
    project=projects[subject];assert course['project']==project and len(project['parts'])==4
    for part in project['parts']:
        assert len(part['opening'])>=2 and len(part['steps'])>=3 and part['ending']
        assert all(set(s)=={'title','work','explanation'} for s in part['steps'])
        assert all(id in [u['id'] for u in course['units']] for id in part['links'])
print('PROJECT_CONTENT_PRESERVATION_PASS: five four-part projects; every V114 unit remains byte-equivalent as data.')
saved=(root/'source/project-demos-v115.json').read_bytes()
subprocess.run([sys.executable,str(root/'qa/generate-project-demos.py')],check=True)
assert saved==(root/'source/project-demos-v115.json').read_bytes(),'Regenerate project demos'
demos=json.loads(saved)
p=demos['piano'];assert p['bars']==8 and p['meter']==4
for bar in range(8):
    right=[e for e in p['events'] if e['bar']==bar and e['hand']=='right']
    assert sum(e['beats'] for e in right)==4
    assert right[0]['at']==bar*4
    assert all(a['at']+a['beats']==b['at'] for a,b in zip(right,right[1:]))
    bass=[e for e in p['events'] if e['bar']==bar and e['hand']=='left']
    assert len(bass)==1 and bass[0]['at']==bar*4 and bass[0]['beats']==4
assert [(e['note'],e['beats']) for e in p['events'] if e['bar']==7 and e['hand']=='right']==[('E4',1),('D4',1),('C4',2)]
line=demos['chess']['lines'][0];board=chess.Board(line['fen'])
assert len(line['moves'])==33 and len(line['frames'])==34
for i,f in enumerate(line['frames']):
    if i:
        move=chess.Move.from_uci(line['moves'][i-1]);assert move in board.legal_moves
        assert f['san']==board.san(move);board.push(move)
    assert f['fen']==board.fen()
    assert f['pieces']=={chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in board.piece_map().items()}
assert board.is_checkmate() and chess.D8 in board.attacks(chess.G5)
board=chess.Board(line['frames'][13]['fen'])
assert chess.F7 not in board.attacks(chess.B3) and chess.F7 in board.attacks(chess.C4)
assert len(demos['spanish'])==16 and all(len(turn)==3 and all(turn) for turn in demos['spanish'])
print('PROJECT_DEMONSTRATIONS_PASS: eight complete 4/4 bars for both hands, a 16-turn translated dialogue and 33 independently legal game moves ending in checkmate.')
