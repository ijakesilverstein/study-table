from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root/'qa/check-tools'))
import chess

def line(title,fen,moves,captions):
 b=chess.Board(fen);assert b.is_valid(),fen;frames=[]
 for i,caption in enumerate(captions):
  move=None
  if i:
   move=b.parse_san(moves[i-1]);san=b.san(move);b.push(move)
  f=dict(pieces={chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in b.piece_map().items()},turn='White' if b.turn else 'Black',caption=caption,fen=b.fen())
  if move:f.update({'from':chess.square_name(move.from_square),'to':chess.square_name(move.to_square),'marks':[chess.square_name(move.from_square),chess.square_name(move.to_square)],'san':san})
  frames.append(f)
 assert len(captions)==len(moves)+1
 return dict(title=title,fen=fen,moves=[chess.Board(frames[i]['fen']).parse_san(s).uci() for i,s in enumerate(moves)],frames=frames)
fork='r3k3/pp3ppp/8/3N4/8/8/PP3PPP/R3K3 w Qq - 0 1'
exchange='6k1/8/4p3/3n4/8/8/8/3R2K1 w - - 0 1'
pin='4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1'
mate='k7/2Q5/2K5/8/8/8/8/8 w - - 0 1'
chess_parts=[
 {'kind':'chess','lines':[
  line('The forcing fork',fork,['Nc7+','Kd7','Nxa8'],['From d5, look at c7: a knight there would attack both e8 and a8.','Nc7+ checks the king on e8 and attacks Ra8. Black must answer the check.','Kd7 is the reply we show. Moving the rook alone would not answer the knight check.','Nxa8 captures the rook. This line wins that rook; later play is outside this short comparison.']),
  line('A quiet knight move',fork,['Ne3','Rc8'],['Compare from exactly the same starting position.','Ne3 is legal, but it does not check the king or create the c7 fork.','Rc8 is a legal rook move now: Black had time because its king was not in check.'])]},
 {'kind':'chess','lines':[
  line('Capture, then include the reply',exchange,['Rxd5','exd5'],['The e6 pawn defends the knight on d5. Follow both captures.','Rxd5 takes a knight, roughly +3 for White. The rook is now on d5.','...exd5 takes that rook, roughly −5 for White. The exchange changed White’s material balance by about −2.']),
  line('Decline this exchange',exchange,['Rd3'],['Reset. There is no requirement to capture a defended knight.','Rd3 retains the rook and avoids the shown rook-for-knight exchange. This is a comparison of that exchange, not a full best-move search.'])]},
 {'kind':'chess','lines':[
  line('Remove the pinning rook',pin,['Rxe8+','Kf7'],['Re2 blocks the black rook’s e-file attack on Ke1. It is absolutely pinned.','Rxe8+ is legal: the rook stays on the file and captures the attacker. It now checks the black king along the eighth rank.','Kf7 is a legal reply to that check. The black rook that created the pin is gone.']),
  line('Stay on the pin line',pin,['Re3'],['Use the same position to inspect an on-line move.','Re3 is legal: the white rook still stands between Re8 and Ke1. It remains pinned, and Black could capture it; legal is not a claim of best play.'])]},
 {'kind':'chess','lines':[
  line('Qb7 is checkmate',mate,['Qb7#'],['Black has only its king on a8. Compare giving check with merely removing legal moves.','Qb7# attacks a8. The queen covers a7 and b8, and Kc6 protects b7. Black has no legal reply.']),
  line('Qb6 is stalemate',mate,['Qb6'],['Reset to compare the neighboring queen square.','Qb6 does not attack a8. Black has no legal moves and is not in check: stalemate, so this line is a draw.'])]}
]
for idx,expected in [(0,'mate'),(1,'stalemate')]:
 b=chess.Board(chess_parts[3]['lines'][idx]['frames'][-1]['fen']);assert (b.is_checkmate() if expected=='mate' else b.is_stalemate())

def events(rows,hand):return [dict(note=n,at=a,beats=b,hand=hand) for n,a,b in rows]
right=events([('E4',0,1),('D4',1,1),('C4',2,2),('F4',4,1),('F4',5,1),('E4',6,1),('D4',7,1)],'right')
left=events([('C3',0,4),('F3',4,4)],'left')
wrong=events([('E4',0,1),('D4',1,1),('C4',2,1),('F4',3,1),('F4',4,1),('E4',5,1),('D4',6,1)],'right')
pairs=events([('E4',0,1),('F4',4,1)],'right')
partial=right[:3]+[right[3]]
context=json.loads((root/'source/project-demos-v115.json').read_text())['piano']['events']
context=[{k:v for k,v in e.items() if k!='bar'} for e in context if e['bar']<4]
keys=['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4']
def pattern(label,items,description,intent='model',beats=8):return dict(label=label,events=items,description=description,intent=intent,beats=beats,meter=4)
def piano(title,patterns,default=0):return dict(kind='piano',title=title,intro='Four quiet preparation clicks come first. The pulse continues while the model plays; count four beats in each bar.',keys=keys,tempos=[40,50,60,70,80],defaultTempo=50,countIn=4,metronome=True,defaultPattern=default,count='Ready. Choose the example you want to hear.',patterns=patterns)
piano_parts=[
 piano('Hear the early F, then the counted model',[
  pattern('Deliberate error: F enters early',left+wrong,'The first right-hand F entered on beat 4 of bar 2, a beat before the bass changed. The final beat had no right-hand note.','error'),
  pattern('Model: hold C through beat 4',left+right,'The held C filled beats 3 and 4. Both hands arrived on F at the next 1.')],1),
 piano('Give each hand its own turn',[
  pattern('Right hand alone',right,'E–D–C (hold), then F–F–E–D. The bar line follows the full two-beat C.'),
  pattern('Left hand alone',left,'C3 for four beats, then F3 for four beats.'),
  pattern('Only the arrival pairs',left+pairs,'The right hand played one quarter note at each bar’s start, then rested. The left held each bass for four beats.','reduction')]),
 piano('Restore one layer at a time',[
  pattern('Skeleton: two arrival pairs',left+pairs,'Only the first right-hand note in each bar sounded; the remaining right-hand beats were rests.','reduction'),
  pattern('Restore E–D–C in the first bar',left+partial,'The first bar had its full melody; the second still had only the first F.','reduction'),
  pattern('Restore the complete passage',left+right,'Both hands played the printed two-bar passage.')]),
 piano('Choose a tempo, then hear it in context',[
  pattern('Complete bars 2–3',left+right,'The repaired join used the full count and both hands.'),
  pattern('Context: bars 1–4',context,'The join between bars 2 and 3 was approached from the opening.',beats=16)])
]

def case(label,lines,focus,parts,why):return dict(label=label,lines=lines,focus=focus,parts=parts,why=why)
spanish=[dict(cases=[
 case('Say what I want', [['Friend','¿Qué quieres tomar?','What would you like to have?'],['You','Quiero tomar un café.','I want to have a coffee.']],1,[['Quiero','I want: the first verb identifies the speaker as I.'],['tomar','The base-form action: to have or drink.'],['un café','The thing you want to have: a coffee.']],'Quiero carries the person. Tomar remains in its base form after it.'),
 case('Invite one friend', [['You','¿Quieres tomar un café?','Do you want to have a coffee?'],['Friend','Sí, me gustaría.','Yes, I’d like to.']],0,[['¿Quieres','You want: addressed to one friend, with the sentence framed as a question.'],['tomar','The same base-form action.'],['un café?','The invitation is to have a coffee.']],'Changing quiero to quieres changes the person. You can leave the pronoun tú unsaid.'),
 case('Speak for us', [['Friend','¿Qué quieren tomar?','What would you like to have? (to the group)'],['You','Queremos tomar un café.','We want to have a coffee.']],1,[['Queremos','We want: this reply speaks for a group including the speaker.'],['tomar','The base action still does not change.'],['un café','A coffee; each person can be expressing the same order.']],'Queremos supplies we. The worker’s plural question uses quieren; our reply uses queremos because we speak about ourselves.')]),
 dict(cases=[
 case('I cannot on Saturday', [['Friend','¿Puedes tomar un café el sábado?','Can you have a coffee on Saturday?'],['You','El sábado no puedo, pero el domingo sí.','I can’t on Saturday, but I can on Sunday.']],1,[['El sábado','The day being discussed: on Saturday.'],['no puedo','I cannot. No comes before puedo.'],['pero','But: introduce the contrasting option.'],['el domingo sí','On Sunday, yes; puedo is understood from the earlier clause.']],'The refusal concerns Saturday. The second clause keeps the invitation possible on Sunday.'),
 case('We cannot on Saturday', [['Friend','¿El sábado?','Saturday?'],['You','El sábado no podemos, pero el domingo sí.','We can’t on Saturday, but we can on Sunday.']],1,[['El sábado','The Saturday option.'],['no podemos','We cannot: speak for the group, including yourself.'],['pero el domingo sí','But Sunday works for us; podemos is understood.']],'Only the person form changed from puedo to podemos. The day contrast is the same.'),
 case('Ask the friend about Sunday', [['You','¿Puedes el domingo?','Can you on Sunday?'],['Friend','Sí, el domingo puedo.','Yes, I can on Sunday.']],0,[['¿Puedes','Can you: one informal friend.'],['el domingo?','The proposed alternative day.']],'The activity can be omitted because both people already know they are arranging coffee.')]),
 dict(cases=[
 case('Missing place', [['You','¿Dónde nos vemos?','Where shall we meet?'],['Friend','En el café junto al parque.','At the café next to the park.']],0,[['¿Dónde','Where: ask for a location.'],['nos vemos?','We meet / we’ll see each other, in this planning context.']],'The reply gives a place and a nearby landmark, answering dónde.'),
 case('Missing day', [['You','¿Cuándo nos vemos?','When shall we meet?'],['Friend','El domingo.','On Sunday.']],0,[['¿Cuándo','When: ask about the occasion or time.'],['nos vemos?','The same meeting phrase.']],'Sunday supplies the day in this model. A real answer could be more specific if that is the detail being discussed.'),
 case('Missing clock time', [['You','¿A qué hora nos vemos?','At what time shall we meet?'],['Friend','A las once.','At eleven.']],0,[['¿A qué hora','At what time: specifically ask for the clock time.'],['nos vemos?','The meeting being arranged.']],'A las once answers the clock-time question. It does not supply a location.')]),
 dict(cases=[
 case('My plan for tomorrow', [['Friend','¿Qué vas a hacer mañana?','What are you going to do tomorrow?'],['You','Mañana voy a estudiar.','Tomorrow I’m going to study.']],1,[['Mañana','Tomorrow: when the plan will happen.'],['voy a','I am going to: the planning chunk for I.'],['estudiar','To study: the base-form activity.']],'The question’s hacer means to do. In the reply, voy changes for the speaker; estudiar remains in its base form.'),
 case('Our Sunday plan', [['Friend','¿El domingo?','Sunday?'],['You','El domingo vamos a tomar un café.','On Sunday we’re going to have a coffee.']],1,[['El domingo','On Sunday.'],['vamos a','We are going to: the planning chunk for our group.'],['tomar un café','The activity: to have a coffee.']],'Vamos a changes the people involved. The familiar activity chunk stays intact.'),
 case('Ask whether a friend is coming', [['You','¿Vas a venir?','Are you going to come?'],['Friend','Todavía no sé. Te confirmo mañana.','I don’t know yet. I’ll confirm tomorrow.']],0,[['¿Vas a','Are you going to: the planning question to one friend.'],['venir?','To come: the base-form activity.']],'The friend is not ready to commit, so the reply says that directly and offers a later confirmation.'),
 case('Keep a plan open', [['Friend','¿Vas a venir?','Are you going to come?'],['You','Todavía no sé. Te confirmo mañana.','I don’t know yet. I’ll confirm tomorrow.']],1,[['Todavía no sé.','I do not know yet: a complete uncertainty reply.'],['Te confirmo','I will confirm with you: a useful conversational chunk.'],['mañana.','Tomorrow: when you will confirm, not necessarily when the visit happens.']],'The reply gives a next step without pretending the plan is settled.')])]
for part,targets in zip(chess_parts,[[(0,1),(0,3),(1,2)],[(0,1),(0,2),(1,1)],[(0,0),(0,1),(1,1)],[(0,1),(1,1),(0,1)]]):part['stepTargets']=[dict(line=line,position=pos) for line,pos in targets]
for part,targets in zip(piano_parts,[[0,1,1],[0,1,2],[0,0,1],[0,0,1]]):part['stepTargets']=[dict(pattern=i,label=part['patterns'][i]['label']) for i in targets]
for part,targets in zip(spanish,[[0,1,2],[0,1,2],[0,1,2],[0,1,3]]):part['stepTargets']=[dict(case=i) for i in targets]
output=dict(chess=chess_parts,piano=piano_parts,spanish=spanish)
(root/'source/workshop-demos-v117.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print('Generated eight legal chess lines, ten piano patterns and thirteen Spanish models.')
