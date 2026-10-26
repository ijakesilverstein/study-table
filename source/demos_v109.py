def build_demos():
    demos={}
    conversations={
      'spanish-0':[
        ['You','Soy estudiante.','I’m a student.'],['You','Estoy en la biblioteca.','I’m in the library.'],['You','Tengo una pregunta.','I have a question.']],
      'spanish-5':[
        ['Café worker','¿Para aquí o para llevar?','For here or to go?'],['You','¿Puede repetirlo más despacio, por favor?','Can you repeat it more slowly, please?'],['Café worker','¿Para aquí o para llevar?','For here or to go?'],['You','Para llevar, por favor.','To go, please.'],['Café worker','¿Para llevar?','To go?'],['You','Sí, para llevar.','Yes, to go.']],
      'spanish-6':[
        ['You','¿Dónde está la farmacia?','Where is the pharmacy?'],['Local person','Siga recto y gire a la derecha.','Keep going straight and turn right.'],['You','¿A la derecha?','To the right?'],['Local person','Sí. Está al lado del banco.','Yes. It’s next to the bank.'],['You','Gracias.','Thank you.']],
      'spanish-7':[
        ['Friend','¿Quieres tomar un café el sábado?','Do you want to have a coffee on Saturday?'],['You','Me gustaría, pero no puedo el sábado.','I’d like to, but I can’t on Saturday.'],['Friend','¿Y el domingo?','And Sunday?'],['You','El domingo sí. ¿A las once?','Sunday works. At eleven?'],['Friend','Perfecto.','Perfect.']]
    }
    for id,lines in conversations.items():demos[id]={'kind':'spanish','lines':lines}
    chromatic=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
    def keys(low,high):
        all_notes=[n+str(o) for o in range(3,6) for n in chromatic]
        return all_notes[all_notes.index(low):all_notes.index(high)+1]
    def pattern(label,beats,events,description):
        return {'label':label,'beats':beats,'events':[{'note':n,'at':at,'beats':length} for n,at,length in events],'description':description}
    def chord(notes,at,length):return [(n,at,length) for n in notes]
    demos['piano-0']={'kind':'piano','title':'Hear the same four beats two ways','intro':'Stay on C. Compare the number of new attacks while the four-beat count stays the same.','keys':keys('C4','C5'),'count':'Count 1, 2, 3, 4. Hold through a beat rather than pressing again.','patterns':[
      pattern('Four one-beat notes',4,[('C4',i,1) for i in range(4)],'four attacks over four beats.'),
      pattern('Two two-beat notes',4,[('C4',0,2),('C4',2,2)],'two attacks over four beats; each C lasted two beats.')]}
    demos['piano-4']={'kind':'piano','title':'Hear the notes, then the chord','intro':'The first two buttons use exactly the same pitches. Compare separate beginnings with one shared beginning.','keys':keys('C4','C5'),'count':'C4–E4–G4: listen separately, then together.','patterns':[
      pattern('C, E, G separately',3,[('C4',0,1),('E4',1,1),('G4',2,1)],'C4, then E4, then G4.'),
      pattern('C major together',3,chord(['C4','E4','G4'],0,3),'C4, E4 and G4 started together.'),
      pattern('Hear E–G–C: same chord, new bass',3,chord(['E4','G4','C5'],0,3),'E4, G4 and C5: C major in first inversion.')]}
    melody=[('E4',0,1),('D4',1,1),('C4',2,1),('D4',3,1)]
    demos['piano-5']={'kind':'piano','title':'Hear the two hands alone and together','intro':'The low C lasts all four beats. Watch it stay highlighted while the higher notes change.','keys':keys('C3','E4'),'count':'Left: hold C3. Right: E4–D4–C4–D4.','patterns':[
      pattern('Left hand only',4,[('C3',0,4)],'one low C held for four beats.'),
      pattern('Right hand only',4,melody,'E4–D4–C4–D4, one note per beat.'),
      pattern('Both hands together',4,[('C3',0,4)]+melody,'C3 held beneath E4–D4–C4–D4.')]}
    c=['C4','E4','G4'];f=['F4','A4','C5']
    demos['piano-6']={'kind':'piano','title':'Listen for each chord arriving on 1','intro':'First hear the shapes alone. Then count four beats on each chord while the hand changes position.','keys':keys('C4','C5'),'count':'C: 1–2–3–4. F: 1–2–3–4. C: 1–2–3–4.','patterns':[
      pattern('Hear C major',4,chord(c,0,4),'C4–E4–G4.'),
      pattern('Hear F major',4,chord(f,0,4),'F4–A4–C5.'),
      pattern('C → F → C',12,chord(c,0,4)+chord(f,4,4)+chord(c,8,4),'C major, F major, C major; four beats each.')]}
    demos['chess-0']={'kind':'movement'}
    def position(fen):
        pieces={}
        for rank,row in zip(range(8,0,-1),fen.split()[0].split('/')):
            file=0
            for char in row:
                if char.isdigit():file+=int(char)
                else:pieces['abcdefgh'[file]+str(rank)]=('w' if char.isupper() else 'b')+char.upper();file+=1
        return pieces
    def line(title,fen,moves,captions):
        assert len(captions)==len(moves)+1
        pieces=position(fen);white=fen.split()[1]=='w'
        frames=[{'pieces':dict(pieces),'turn':'White' if white else 'Black','caption':captions[0]}]
        for i,move in enumerate(moves):
            source,target=move[:2],move[2:4];pieces[target]=pieces.pop(source);white=not white
            frames.append({'pieces':dict(pieces),'turn':'White' if white else 'Black','caption':captions[i+1],'from':source,'to':target,'marks':[source,target]})
        return {'title':title,'fen':fen,'moves':moves,'frames':frames}
    demos['chess-3']={'kind':'chess','lines':[line('The checking fork','3r3k/8/8/4N3/8/8/8/6K1 w - - 0 1',['e5f7','h8g8','f7d8'],[
      'White to move. The knight on e5 can reach f7.',
      'Nf7+: from f7 the knight attacks the king on h8 and rook on d8. Black must answer check.',
      '…Kg8 is one legal reply. The king is safe, but the rook on d8 is still attacked.',
      'Nxd8 captures the rook. The black king on g8 is too far away to capture this knight.'])]}
    demos['chess-4']={'kind':'chess','lines':[
      line('Undefended knight','k7/5n2/8/8/2B5/8/8/6K1 w - - 0 1',['c4f7'],['The bishop has a clear path c4–d5–e6–f7. Black’s king is far away on a8.','Bxf7 wins the knight. The king on a8 cannot recapture on f7.']),
      line('With a defender','6k1/5n2/8/8/2B5/8/8/6K1 w - - 0 1',['c4f7','g8f7'],['The knight is on the same square, but the king on g8 now protects f7.','Bxf7+ gives check. Before calling this free material, inspect Black’s reply.','…Kxf7 recaptures the bishop. This was a bishop-for-knight exchange, not a free knight.'])]}
    start='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    demos['chess-5']={'kind':'chess','lines':[
      line('Open the center and develop',start,['e2e4','e7e5','g1f3','b8c6','f1c4','f8c5'],[
       'The starting position. White can move the e-pawn to open a path for the bishop.',
       '1 e4: the pawn occupies the center and clears e2 for the f1 bishop.',
       '…e5: Black also puts a pawn in the center and opens the f8 bishop’s diagonal.',
       '2 Nf3: the knight develops and attacks the black pawn on e5.',
       '…Nc6: Black develops a knight that protects the e5 pawn.',
       '3 Bc4: the bishop uses f1–e2–d3–c4, the path opened by e4.',
       '…Bc5: Black develops the bishop too. This is one legal opening, not a forced sequence.']),
      line('Black chooses …d5 instead',start,['e2e4','d7d5','e4d5','d8d5','b1c3'],[
       'Start again and watch a different reply to e4.',
       '1 e4: White opens the center.',
       '…d5: Black’s pawn now attacks e4. The position has changed.',
       '2 exd5: White’s e-pawn captures diagonally on d5.',
       '…Qxd5: Black’s queen recaptures along the cleared d-file.',
       '3 Nc3: the knight develops and attacks the queen on d5.'])]}
    return demos
