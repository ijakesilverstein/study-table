from pathlib import Path
import sys,json
root=Path(__file__).resolve().parent
sys.path.insert(0,str(root/'check-tools'))
import chess
demos=json.loads((root.parent/'source/demos-v109.json').read_text())
for id,d in demos.items():
    if d['kind']!='chess':continue
    for line in d['lines']:
        board=chess.Board(line['fen']);assert board.is_valid(),(id,line['title'])
        for i,frame in enumerate(line['frames']):
            if i:
                move=chess.Move.from_uci(line['moves'][i-1]);assert move in board.legal_moves,(id,move,board.fen());board.push(move)
            expected={chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in board.piece_map().items()}
            assert frame['pieces']==expected,(id,i)
            assert frame['turn']==('White' if board.turn else 'Black')
board=chess.Board(demos['chess-3']['lines'][0]['fen']);board.push_uci('e5f7');assert board.is_check()
assert {chess.H8,chess.D8}<=set(board.attacks(chess.F7))
assert all(board.piece_at(m.from_square).piece_type==chess.KING for m in board.legal_moves)
board=chess.Board(demos['chess-3']['lines'][0]['fen']);board.push_uci('e5g6');assert board.is_check();assert chess.D8 not in board.attacks(chess.G6)
board=chess.Board(demos['chess-4']['lines'][1]['fen']);board.push_uci('c4f7');assert board.is_check();assert chess.Move.from_uci('g8f7') in board.legal_moves
print('CHESS_PASS: every frame and move independently verified; fork targets, forcing check, alternate checking move and legal recapture verified.')
