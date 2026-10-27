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
values={chess.PAWN:1,chess.KNIGHT:3,chess.BISHOP:3,chess.ROOK:5,chess.QUEEN:9}
def balance(board):
    return sum(values.get(p.piece_type,0)*(1 if p.color else -1) for p in board.piece_map().values())
for line,change in zip(saved['count-exchanges']['lines'],[0,-2]):
    board=chess.Board(line['fen']);before=balance(board)
    for uci in line['moves']:board.push_uci(uci)
    assert balance(board)-before==change
line=saved['read-moves']['lines'][1];board=chess.Board(line['fen'])
notation=[]
for uci in line['moves']:
    move=chess.Move.from_uci(uci);notation.append(board.san(move));board.push(move)
assert notation==['e4','d5','exd5','Qxd5','Nc3']
assert chess.D5 in board.attacks(chess.C3)
first,second=saved['pawn-race']['lines']
board=chess.Board(first['fen'])
for uci in first['moves']:board.push_uci(uci)
assert board.piece_at(chess.A8)==chess.Piece(chess.QUEEN,chess.WHITE)
assert chess.square_distance(board.king(chess.BLACK),chess.A8)>1
board=chess.Board(second['fen'])
for uci in second['moves']:board.push_uci(uci)
assert board.is_insufficient_material() and len(board.piece_map())==2
assert [e['note'] for e in saved['three-chord-song']['patterns'][2]['events']]==['C4','E4','G4','C4','F4','A4','B3','D4','G4','C4','E4','G4']
for index in [3,4]:
    line=saved['promotion']['lines'][index];board=chess.Board(line['fen'])
    board.push_uci(line['moves'][0]);capture=chess.Move.from_uci('e5d6')
    assert board.is_pseudo_legal(capture)
    if index==3:
        assert capture in board.legal_moves;board.push(capture)
        assert board.piece_at(chess.D6)==chess.Piece(chess.PAWN,chess.WHITE)
        assert board.piece_at(chess.D5) is None
    else:assert capture not in board.legal_moves and board.is_pinned(chess.WHITE,chess.E5)
for color,fen,source,clear,blocked in [
    (chess.WHITE,'7k/8/8/8/8/2n1n3/3P4/7K w - - 0 1',chess.D2,{'c3','d3','e3','d4'},{'c3','e3'}),
    (chess.BLACK,'7k/3p4/2N1N3/8/8/8/8/7K b - - 0 1',chess.D7,{'c6','d6','e6','d5'},{'c6','e6'})]:
    board=chess.Board(fen);assert board.is_valid()
    assert {chess.square_name(m.to_square) for m in board.legal_moves if m.from_square==source}==clear
    board.set_piece_at(chess.D3 if color else chess.D6,chess.Piece(chess.ROOK,not color))
    assert {chess.square_name(m.to_square) for m in board.legal_moves if m.from_square==source}==blocked
board=chess.Board.empty();board.set_piece_at(chess.D4,chess.Piece(chess.QUEEN,chess.WHITE));assert len(board.attacks(chess.D4))==27
courses=json.loads((root/'source/full-courses-built.json').read_text())
assert {s:len(c['units']) for s,c in courses.items()}=={'spanish':15,'piano':14,'chess':14,'calculus':11,'physics':11,'medicine':11,'business':11}
assert sum(len(c['units']) for c in courses.values())==87
for course in courses.values():
    ids=[u['id'] for u in course['units']];assert len(ids)==len(set(ids))
    for i,unit in enumerate(course['units']):
        assert unit['previous']==(ids[i-1] if i else None)
        assert unit['next']==(ids[i+1] if i+1<len(ids) else None)
    starts=[ids.index(stage['start']) for stage in course['stages']]
    assert starts==sorted(set(starts)) and starts[0]==0
    for alias,target in course['aliases'].items():assert alias not in ids and target in ids
print('FULL_COURSE_DATA_PASS: legal chess lines and stated outcomes, music timing, 87 unique units and their complete sequence.')
def archive(path):
    text=path.read_text();data=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',text,re.S)[1]
    return json.loads(gzip.decompress(base64.b64decode(data)))
old=archive(root/'source/Study_Table_V108.html');new=archive(root/'public/index.html')
replaced=[full_courses.COURSE_PATHS[s] for s in ['piano','spanish','chess']]
for path,value in old.items():
    if path in replaced:assert new[path.rsplit('/',1)[0]+'/practice-studio.html']==value
    else:assert new[path]==value,path+' unexpectedly changed'
print('ORIGINAL_ARCHIVE_PRESERVATION_PASS: original applications and all unrelated embedded assets match the baseline exactly.')
