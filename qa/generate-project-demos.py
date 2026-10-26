"""Development-only generation. The application reads the committed JSON."""
from pathlib import Path
import sys,json
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'qa/check-tools'))
import chess
melody=[ [('C4',1),('D4',1),('E4',1),('G4',1)], [('E4',1),('D4',1),('C4',2)], [('F4',1),('F4',1),('E4',1),('D4',1)], [('C4',1),('E4',1),('G4',2)], [('G4',1),('E4',1),('D4',1),('C4',1)], [('F4',1),('E4',1),('D4',1),('C4',1)], [('D4',1),('G4',1),('F4',1),('D4',1)], [('E4',1),('D4',1),('C4',2)] ]
roots=['C3','C3','F3','C3','G3','F3','G3','C3']
piano=[]
for bar,(notes,bass) in enumerate(zip(melody,roots)):
    at=bar*4
    piano.append(dict(note=bass,at=at,beats=4,hand='left',bar=bar))
    for note,beats in notes:
        piano.append(dict(note=note,at=at,beats=beats,hand='right',bar=bar));at+=beats
    assert at==(bar+1)*4
lines=[
['Friend','¿Qué hiciste ayer?','What did you do yesterday?'],
['You','Ayer fui al mercado y compré pan.','Yesterday I went to the market and bought bread.'],
['Friend','¿Quieres tomar un café el sábado?','Do you want to have a coffee on Saturday?'],
['You','Me gustaría, pero no puedo el sábado. ¿El domingo?','I’d like to, but I can’t on Saturday. Sunday?'],
['Friend','El domingo sí. ¿A las once?','Sunday works. At eleven?'],
['You','Sí, a las once. ¿Dónde nos vemos?','Yes, at eleven. Where shall we meet?'],
['Friend','En el café junto al parque.','At the café next to the park.'],
['You','¿Puedes repetirlo más despacio?','Can you repeat it more slowly?'],
['Friend','En el café junto al parque.','At the café next to the park.'],
['You','Perfecto, gracias.','Perfect, thank you.'],
['Worker','¿Qué quiere tomar?','What would you like to have?'],
['You','Quiero un café pequeño, por favor.','I’d like a small coffee, please.'],
['Worker','¿Para aquí o para llevar?','For here or to go?'],
['You','Para aquí. ¿Puedo pagar con tarjeta?','For here. Can I pay by card?'],
['Worker','Sí. ¿Algo más?','Yes. Anything else?'],
['You','Nada más, gracias.','Nothing else, thank you.']]
san='e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8 Rd8#'.split()
notes=[
'White opens the e-pawn, takes central space and clears a diagonal for the f1 bishop.',
'Black matches the central pawn and opens the f8 bishop’s diagonal.',
'The g1 knight develops to f3 and attacks the pawn on e5.',
'The d7 pawn goes to d6 and protects e5; it also clears a diagonal for the c8 bishop.',
'White’s d-pawn challenges e5 and opens the c1 bishop’s diagonal.',
'Black’s c8 bishop pins the f3 knight toward the queen on d1. This is a relative pin; it does not itself make a knight move illegal.',
'The d4 pawn captures the pawn on e5. Follow the pawn: it is now on e5.',
'The bishop from g4 captures the knight on f3.',
'The queen from d1 recaptures that bishop on f3. The e2 square is clear because White moved the e-pawn.',
'Black’s d6 pawn captures the white pawn on e5. Both d-files are now clear: White’s d-pawn was captured, and Black’s d-pawn moved to the e-file.',
'The bishop from f1 develops to c4, aiming at f7 along c4–d5–e6–f7.',
'Black develops the g8 knight to f6, attacking White’s e4 pawn.',
'The queen goes to b3, where it attacks b7. It sits behind its own c4 bishop on a diagonal toward f7; the bishop currently blocks the queen’s direct line.',
'Black’s queen goes to e7 and defends f7 along e7–f7. It also occupies a development square for the f8 bishop.',
'White develops the b1 knight to c3. Both knights have now come off the back rank, although the first was exchanged.',
'Black’s c7 pawn moves to c6, controlling d5 and supporting the b5 advance.',
'The c1 bishop comes to g5. The knight on f6 is now pinned toward the queen on e7, not toward the king.',
'Black pushes b7–b5, attacking the bishop on c4. White chooses a capture with the knight rather than a bishop retreat.',
'The knight from c3 captures the b5 pawn. This offers the knight to the c6 pawn.',
'Black’s c6 pawn takes that knight on b5.',
'The bishop from c4 captures the pawn on b5 with check along b5–c6–d7–e8.',
'The b8 knight blocks on d7. The notation Nbd7 distinguishes it from the f6 knight, which could also reach d7.',
'White castles queenside: king e1–c1 and rook a1–d1. The king is moved to safety and the rook joins the open file in one move.',
'Black’s a8 rook moves to d8. Its path through b8 and c8 is clear.',
'The rook from d1 captures the knight on d7, removing the bishop’s diagonal blocker.',
'Black’s rook on d8 recaptures the white rook on d7.',
'White’s remaining rook travels from h1 to d1 along g1, f1 and e1, all now empty.',
'Black’s queen moves from e7 to e6. The g5 bishop’s diagonal beyond the f6 knight now points toward the empty e7 square.',
'The bishop from b5 captures Black’s rook on d7 with check.',
'The f6 knight recaptures that bishop on d7, blocking the d-file. White’s queen and rook will now force it away.',
'White’s queen travels from b3 to b8 with check along the eighth rank. The d7 knight is offered a queen.',
'The knight captures the queen on b8. It has left d7, so White’s rook now has a clear path up the d-file.',
'Rd8 is checkmate. The rook checks the king on e8; the bishop on g5 protects d8 through f6 and e7. The king cannot capture the rook, block the adjacent check or move to a safe square.'
]
b=chess.Board();frames=[];moves=[]
def frame(caption,move=None,san=None):
    f=dict(pieces={chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in b.piece_map().items()},turn='White' if b.turn else 'Black',caption=caption,fen=b.fen())
    if move:f.update({'from':chess.square_name(move.from_square),'to':chess.square_name(move.to_square),'marks':[chess.square_name(move.from_square),chess.square_name(move.to_square)],'san':san})
    return f
frames.append(frame('Initial position. White moves first. Follow the e-pawn, knight and d-pawn into the center.'))
labels=['Start']
for i,(s,n) in enumerate(zip(san,notes)):
    m=b.parse_san(s);moves.append(m.uci());label=f'{i//2+1}'+('. ' if i%2==0 else '... ')+s
    b.push(m);frames.append(frame(label+' — '+n,m,s));labels.append(label)
assert len(notes)==len(san)==33 and b.is_checkmate()
result=dict(piano=dict(title='An afternoon at the keys',meter=4,bars=8,events=piano),spanish=lines,chess=dict(kind='chess',intro='Replay the game, or choose a position by move. Every move is supplied and explained.',lines=[dict(title='Morphy, Opera Game (1858)',fen=chess.STARTING_FEN,moves=moves,frames=frames)],labels=labels))
(root/'source/project-demos-v115.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Generated original eight-bar score, 16 conversation turns and 33 legal game moves ending in checkmate.')
