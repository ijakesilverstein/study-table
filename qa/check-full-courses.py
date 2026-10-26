from pathlib import Path
import sys,json,re,gzip,base64
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'qa/check-tools'))
sys.path.insert(0,str(root/'source'))
import chess,full_courses
saved=json.loads((root/'source/full-course-demos.json').read_text())
assert saved==full_courses.generate_course_demos(),'Course demonstrations need regeneration'
for id,demo in saved.items():
    if demo['kind']!='chess':continue
    for line in demo['lines']:
        board=chess.Board(line['fen']);assert board.is_valid()
        for i,frame in enumerate(line['frames']):
            if i:
                move=chess.Move.from_uci(line['moves'][i-1]);assert move in board.legal_moves,(id,move);board.push(move)
            assert frame['pieces']=={chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in board.piece_map().items()}
            assert frame['turn']==('White' if board.turn else 'Black')
board=chess.Board(saved['castling']['lines'][1]['fen']);assert chess.Move.from_uci('e1g1') not in board.legal_moves
board=chess.Board(saved['pins']['lines'][0]['fen']);assert not any(m.from_square==chess.F6 for m in board.legal_moves)
for id,index,expected in [('promotion',1,'stalemate'),('promotion',2,'play'),('queen-net',0,'mate'),('queen-net',1,'stalemate'),('annotated-game',0,'mate')]:
    line=saved[id]['lines'][index];board=chess.Board(line['fen'])
    for uci in line['moves']:board.push_uci(uci)
    result='mate' if board.is_checkmate() else 'stalemate' if board.is_stalemate() else 'play'
    assert result==expected,(id,index,result)
assert [e['level'] for e in saved['phrasing']['patterns'][1]['events']]==[.045,.052,.06,.075,.06,.05,.04]
assert sum(b for n,b in saved['read-melody']['notation'])==8
assert saved['read-melody']['notation']==[['C4',1],['D4',1],['E4',1],['G4',1],['E4',1],['D4',1],['C4',2]]
courses=json.loads((root/'source/full-courses-built.json').read_text())
assert {s:len(c['units']) for s,c in courses.items()}=={'spanish':12,'piano':12,'chess':12,'calculus':8,'physics':8}
assert sum(len(c['units']) for c in courses.values())==52
for course in courses.values():
    ids=[u['id'] for u in course['units']];assert len(ids)==len(set(ids))
    for i,unit in enumerate(course['units']):
        assert unit['previous']==(ids[i-1] if i else None)
        assert unit['next']==(ids[i+1] if i+1<len(ids) else None)
print('FULL_COURSE_DATA_PASS: legal chess lines and stated outcomes, music timing, 52 unique units and their complete sequence.')
def archive(path):
    text=path.read_text();data=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',text,re.S)[1]
    return json.loads(gzip.decompress(base64.b64decode(data)))
old=archive(root/'source/Study_Table_V108.html');new=archive(root/'public/index.html')
replaced=[full_courses.COURSE_PATHS[s] for s in ['piano','spanish','chess']]
for path,value in old.items():
    if path in replaced:assert new[path.rsplit('/',1)[0]+'/practice-studio.html']==value
    else:assert new[path]==value,path+' unexpectedly changed'
print('ORIGINAL_ARCHIVE_PRESERVATION_PASS: original applications and all unrelated embedded assets match the baseline exactly.')
