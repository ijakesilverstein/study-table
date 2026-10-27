from pathlib import Path
import json,re
from demos_v109 import build_demos

ROOT=Path(__file__).resolve().parent
COURSE_PATHS={'spanish':'v15/spanish-for-someone/complete-practice-v40/index.html','piano':'v15/rockjam-piano-studio/index.html','chess':'v15/chess-from-zero/index.html','calculus':'curricula/calculus.html','physics':'curricula/physics.html'}
ORDERS={
 'spanish':['spanish-0','spanish-sounds','spanish-1','noun-phrases','questions','spanish-5','spanish-6','spanish-7','question-words','habits','descriptions','spanish-2','spanish-3','spanish-4','cafe-project'],
 'piano':['piano-1','comfortable-hands','piano-0','staff','piano-2','piano-3','piano-4','piano-5','piano-6','three-chord-song','three-beats','rests-and-halves','phrasing','read-melody'],
 'chess':['chess-0','read-moves','chess-4','chess-1','chess-2','count-exchanges','chess-5','castling','chess-3','pins','promotion','pawn-race','queen-net','annotated-game'],
 'calculus':['functions','algebra-for-rates','calculus-1','calculus-2','derivative-rules','product-rule','calculus-3','calculus-5','calculus-4','definite-integrals','integral-substitution'],
 'physics':['units-and-directions','physics-4','velocity-graphs','physics-1','force-diagrams','physics-2','physics-5','physics-3','circuit-paths','waves','pressure']}
ALIASES={'piano':{'performance':'read-melody'},'chess':{'threats':'chess-1'}}
META={
 'spanish':('Spanish for conversation','Build useful exchanges, understand what the other person asks, and tell a short story about your week.'),
 'piano':('Piano, from the first note','Find the keys, keep a pulse, read a short melody, and make a small performance you can return to.'),
 'chess':('Chess, from moves to plans','Learn the legal moves, inspect threats, and follow complete tactical and game examples on the board.'),
 'calculus':('Calculus foundations','Connect functions, rates and accumulation through worked numerical and graphical examples.'),
 'physics':('Physics foundations','Keep the quantities and units attached to what is happening: motion, forces, energy, circuits, waves and pressure.')}

def read_maps(teacher):
    result={}
    for key in ['DATA','V102_TASKS','V105_EXAMPLES','V106_DEPTH','V107_TEACHING','V108_CLARITY']:
        start=teacher.index('const '+key+'=')+len('const '+key+'=');result[key],_=json.JSONDecoder().raw_decode(teacher[start:])
    return result

def build_courses(teacher):
    maps=read_maps(teacher);units={};extra=[]
    for file in ['curriculum-new-spanish.json','curriculum-new-piano.json','curriculum-new-chess.json']:
        extra+=json.loads((ROOT/file).read_text())
    quantitative=json.loads((ROOT/'curriculum-new-quantitative.json').read_text())
    for entries in quantitative.values():extra+=entries
    for subject in ORDERS:
        extra+=json.loads((ROOT/('curriculum-bridges-'+subject+'.json')).read_text())
    extra+=json.loads((ROOT/'curriculum-expansion-v112.json').read_text())
    assert len(extra)==36
    for l in maps['DATA']:
        if l['subject'] not in ORDERS:continue
        id=l['id'];d=maps['V106_DEPTH'][id];t=maps['V107_TEACHING'][id];o=maps['V108_CLARITY'][id];first=dict(maps['V105_EXAMPLES'][id]);first['notice']=first.pop('check')
        units[id]={'id':id,'title':l['title'],'goal':maps['V102_TASKS'][id][0],'opening':o['opening'],'heading':o.get('reasoningTitle',t['title']),'teaching':t['explanation']+[t['decision']],'terms':d['terms'],'first':first,'second':d['second'],'exercise':maps['V102_TASKS'][id][1:],'mistake':t['mistake']}
    for x in extra:
        assert x['id'] not in units,x['id'];units[x['id']]=x
    for id,changes in json.loads((ROOT/'editorial-v112.json').read_text()).items():
        assert id in units,id
        units[id].update(changes)
    for id,changes in json.loads((ROOT/'teaching-v113.json').read_text()).items():
        assert id in units,id
        units[id].update(changes)
    units['chess-0']['first']['steps'][2][2]='A bishop occupying e3 can interrupt this rook line, as the worked check lesson will show.'
    units['chess-1']['second']=units['threats']['first']
    units['promotion']['supplement']={'title':'En passant: a one-turn opportunity','paragraphs':['If Black advances a pawn from d7 to d5 beside White’s pawn on e5, White may immediately play e5–d6 and remove the pawn from d5. The diagonal destination is empty in this special capture. If White chooses a different move first, the opportunity is gone. Black has the matching rule from its fourth rank after a neighboring white pawn advances two squares.','The capture still has to keep your king safe. In the second board example, moving the e5 pawn away would uncover a rook’s attack on White’s king. En passant is therefore illegal there, even though the pawn arrangement matches the special rule.'],'examples':[{'label':'Show the legal capture','line':3},{'label':'Show why the pinned pawn cannot capture','line':4}]}
    additions=json.loads((ROOT/'claude-additions-v114.json').read_text())
    for id,fields in additions.items():
        assert id in units,id
        for key,value in fields.items():
            assert key not in units[id],(id,key,'would overwrite current teaching')
            units[id][key]=value
    for id,fields in json.loads((ROOT/'claude-corrections-v114.json').read_text()).items():
        for key,value in fields.items():
            if isinstance(value,dict):units[id][key].update(value)
            else:units[id][key]=value
    demos=course_demos()
    stages=json.loads((ROOT/'course-stages.json').read_text())
    projects=json.loads((ROOT/'course-projects-v115.json').read_text())
    workshops=json.loads((ROOT/'teacher-workshops-v117.json').read_text())
    courses={}
    for subject,order in ORDERS.items():
        title,intro=META[subject];course={'subject':subject,'title':title,'intro':intro,'path':COURSE_PATHS[subject],'units':[],'stages':stages[subject],'aliases':ALIASES.get(subject,{}),'practice':subject if subject in ['calculus','physics'] else './practice-studio.html'}
        assert [s['start'] for s in course['stages']]==sorted([s['start'] for s in course['stages']],key=order.index)
        assert course['stages'][0]['start']==order[0]
        for i,id in enumerate(order):
            unit=dict(units[id]);unit['previous']=order[i-1] if i else None;unit['next']=order[i+1] if i+1<len(order) else None
            assert len(unit['opening'])>=2 and len(unit['teaching'])>=2
            assert unit['takeaway'] and all(unit['mistake'].get(k) for k in ['attempt','diagnosis','repair','check'])
            assert unit['recall']['ask'] and unit['recall']['answer']
            if unit['recall']['from']:assert order.index(unit['recall']['from'])<i,(id,'review must refer to earlier teaching')
            for name in ['first','second']:assert len(unit[name]['steps'])>=3,(id,name)
            unit['demo']=id if id in demos else None;course['units'].append(unit)
        course['project']=projects[subject]
        assert len(course['project']['parts'])==4
        for part in course['project']['parts']:
            assert all(id in order for id in part['links']),(subject,part['links'])
        if subject in workshops:
            course['workshop']=workshops[subject]
            assert len(course['workshop']['parts'])==4
            assert all(id in order for p in course['workshop']['parts'] for id in p['links'])
        courses[subject]=course
    assert sum(len(c['units']) for c in courses.values())==65
    return courses,demos

def course_demos():
    return json.loads((ROOT/'full-course-demos.json').read_text())

def generate_course_demos():
    d=build_demos()
    # Use the verified demo implementations with course-specific scripts and complete exchanges.
    lines={
     'spanish-1':[['Café worker','¿Quiere comer algo?','Would you like something to eat?'],['You','Quiero comer. Tengo hambre.','I want to eat. I’m hungry.'],['You','¿Puedo pagar con tarjeta?','Can I pay by card?']],
     'spanish-2':[['Friend','¿Qué hiciste ayer?','What did you do yesterday?'],['You','Ayer fui al mercado y compré pan.','Yesterday I went to the market and bought bread.']],
     'spanish-3':[['Friend','¿Qué hacías cuando llamó Ana?','What were you doing when Ana called?'],['You','Comía cuando Ana llamó.','I was eating when Ana called.'],['You, another version','Estaba comiendo cuando Ana llamó.','I was eating when Ana called.']],
     'spanish-4':[['Friend','¿Qué hiciste el sábado? ¿Y qué vas a hacer mañana?','What did you do on Saturday? And what are you going to do tomorrow?'],['You','El sábado estaba cansado. Después fui al parque.','I was tired on Saturday. Afterward I went to the park.'],['You','Mañana voy a descansar.','Tomorrow I’m going to rest.']],
     'questions':[['You','¿Puede ayudarme, por favor?','Can you help me, please?'],['Staff member','Sí. ¿Puede pagar en efectivo?','Yes. Can you pay in cash?'],['You','No puedo pagar en efectivo. ¿Puedo pagar con tarjeta?','I can’t pay in cash. Can I pay by card?']],
     'habits':[['You','Trabajo por la mañana y estudio por la noche.','I work in the morning and study at night.'],['You','¿Estudias en casa?','Do you study at home?'],['Friend','Sí, estudio en casa.','Yes, I study at home.']],
     'descriptions':[['You','Soy estudiante. Estoy en casa.','I’m a student. I’m at home.'],['You','Estoy aburrido.','I’m bored.'],['Contrast','Soy aburrido.','I’m boring.']],
     'cafe-project':[['You','Hola. Quiero un café, por favor.','Hello. I want a coffee, please.'],['Café worker','¿Para aquí o para llevar?','For here or to go?'],['You','¿Puede repetirlo más despacio, por favor?','Can you repeat it more slowly, please?'],['Café worker','¿Para aquí o para llevar?','For here or to go?'],['You','Para llevar, por favor. ¿Puedo pagar con tarjeta?','To go, please. Can I pay by card?'],['Café worker','Sí, con tarjeta. ¿Algo más?','Yes, by card. Anything else?'],['You','Nada más, gracias.','Nothing else, thank you.']]}
    for id,rows in lines.items():d[id]={'kind':'spanish','lines':rows}
    d['spanish-sounds']={'kind':'spanish','lines':[
        ['Vowels','a, e, i, o, u.','The five vowel sounds.'],
        ['First syllable','casa','House: CA-sa.'],
        ['Middle syllable','amigo','Friend: a-MI-go.'],
        ['Final syllable','café','Coffee: ca-FÉ.'],
        ['Written accent','médico','Doctor: MÉ-di-co.'],
        ['Silent h','Hola.','Hello.'],
        ['Present','Hablo español.','I speak Spanish.'],
        ['Past','Habló español.','He or she spoke Spanish.']]}
    d['spanish-sounds'].update({'title':'Hear the vowels and word stress','intro':'Hear one word at a time, then compare hablo and habló. The English stress cues are written underneath.','playLabel':'Hear all the lines'})
    panel_data=json.loads((ROOT/'teaching-panels-v113.json').read_text())
    d['spanish-3']={'kind':'spanish','title':'Build a past sentence','intro':'Choose a view, read how the sentence is built, then hear it. The sketch shows the viewpoint rather than a measured duration.','playLabel':'Hear all four versions','views':panel_data['pastViews'],'lines':[[view['label'],view['sentence'],view['translation']] for view in panel_data['pastViews']]}
    d['chess-0']['complete']=True
    d['noun-phrases']={'kind':'spanish','lines':[
        ['You','Quiero un café pequeño, por favor.','I want a small coffee, please.'],
        ['You, changing the order','Quiero dos cafés pequeños, por favor.','I want two small coffees, please.'],
        ['You','¿Hay una mesa pequeña?','Is there a small table?'],
        ['Café worker','Sí, junto a la ventana.','Yes, next to the window.']]}
    d['question-words']={'kind':'spanish','lines':[
        ['Friend','Nos vemos mañana.','See you tomorrow.'],
        ['You','¿A qué hora?','At what time?'],
        ['Friend','A las dos de la tarde.','At two in the afternoon.'],
        ['You','¿Dónde nos vemos?','Where shall we meet?'],
        ['Friend','En el café.','At the café.'],
        ['You','Mañana, a las dos de la tarde, en el café.','Tomorrow, at two in the afternoon, at the café.']]}
    keys=d['piano-4']['keys']
    def pattern(label,beats,events,description):return {'label':label,'beats':beats,'events':[{'note':note,'at':at,'beats':length} for note,at,length in events],'description':description}
    def piano(id,title,patterns,notation=None):
        d[id]={'kind':'piano','title':title,'intro':'Hear the complete example, then use the separate pattern buttons to examine it.','keys':keys,'count':'Keep the count steady and follow the highlighted notes.','patterns':patterns}
        if notation:d[id]['notation']=notation
    piano('comfortable-hands','Hear the same route in each hand',[
        pattern('Right: 1–2–3–2–1',5,[(n,i,1) for i,n in enumerate(['C4','D4','E4','D4','C4'])],'C4–D4–E4–D4–C4; right-hand fingers 1–2–3–2–1.'),
        pattern('Left: 5–4–3–4–5',5,[(n,i,1) for i,n in enumerate(['C3','D3','E3','D3','C3'])],'C3–D3–E3–D3–C3; left-hand fingers 5–4–3–4–5.')])
    d['comfortable-hands']['keys']=d['piano-5']['keys']
    piano('rests-and-halves','Hear the space inside the count',[
        pattern('C · rest · D · E',4,[('C4',0,1),('D4',2,1),('E4',3,1)],'C on 1, silence on 2, D on 3, E on 4.'),
        pattern('C–D on 1-and; E on 2',4,[('C4',0,.5),('D4',.5,.5),('E4',1,1),('C4',3,1)],'C on 1, D on the and, E on 2, silence on 3, C on 4.')])
    d['rests-and-halves']['patterns'][1]['subdivide']=2
    piano('piano-1','Hear C, D and E',[pattern('C–D–E',3,[('C4',0,1),('D4',1,1),('E4',2,1)],'C4–D4–E4.'),pattern('Compare two Cs',2,[('C4',0,1),('C5',1,1)],'C4 and the C one octave higher.')])
    tune=['E4','D4','C4','D4','E4','E4','E4']
    piano('piano-2','Hear the phrase and its held ending',[pattern('The whole phrase',8,[(n,i,2 if i==6 else 1) for i,n in enumerate(tune)],'seven attacks over eight beats; final E held for two.'),pattern('First four notes',4,[(n,i,1) for i,n in enumerate(tune[:4])],'E–D–C–D.')])
    piano('piano-3','Compare a step and a skip',[pattern('C–D–C',3,[('C4',0,1),('D4',1,1),('C4',2,1)],'a step up and back.'),pattern('C–E–C',3,[('C4',0,1),('E4',1,1),('C4',2,1)],'a wider rise and return.')])
    d['piano-3']['patterns'] += [pattern('E–F–E',3,[('E4',0,1),('F4',1,1),('E4',2,1)],'a one-semitone rise and return.'),pattern('D–F–D',3,[('D4',0,1),('F4',1,1),('D4',2,1)],'a three-semitone rise and return.')]
    piano('staff','Hear the notes on the staff',[pattern('C–E–G',3,[('C4',0,1),('E4',1,1),('G4',2,1)],'C4 on its ledger line, E4 on the bottom line, G4 on the next line.'),pattern('C–D–E',3,[('C4',0,1),('D4',1,1),('E4',2,1)],'C4–D4–E4 uses neighboring positions.')],[['C4',1],['E4',1],['G4',1]])
    piano('three-beats','Hear two groups of three',[pattern('Two held Cs',6,[('C4',0,3),('C4',3,3)],'two attacks over six beats.'),pattern('C–D–E twice',6,[('C4',0,1),('D4',1,1),('E4',2,1),('C4',3,1),('D4',4,1),('E4',5,1)],'two three-beat groups without an added pause.')])
    for p in d['three-beats']['patterns']:p['meter']=3
    melody=[('C4',0,1),('D4',1,1),('E4',2,1),('G4',3,1),('E4',4,1),('D4',5,1),('C4',6,2)]
    for id in ['phrasing','read-melody','performance']:
        piano(id,'Hear the two-measure melody',[pattern('Melody alone',8,melody,'C–D–E–G | E–D–C, with a two-beat ending.'),pattern('The G-to-E join',4,[('E4',0,1),('G4',1,1),('E4',2,1),('D4',3,1)],'E–G | E–D.')],[[n,length] for n,at,length in melody])
    shaped=pattern('A slight rise and a settled ending',8,melody,'the same notes with a small rise toward G and a gentler return.')
    for event,level in zip(shaped['events'],[.045,.052,.06,.075,.06,.05,.04]):event['level']=level
    d['phrasing']['patterns'].insert(1,shaped)
    d['read-melody']['keys']=d['piano-5']['keys']+['F4','F#4','G4']
    d['read-melody']['patterns'].append(pattern('Melody over a held low C',8,[('C3',0,8)]+melody,'one low C held under the complete melody.'))
    roots=[['C4','E4','G4'],['F4','A4','C5'],['G3','B3','D4'],['C4','E4','G4']]
    close=[['C4','E4','G4'],['C4','F4','A4'],['B3','D4','G4'],['C4','E4','G4']]
    def progression(chords):return [(note,i*4,4) for i,chord in enumerate(chords) for note in chord]
    piano('three-chord-song','Hear C–F–G–C in two arrangements',[
        pattern('Hear G major alone',4,[(n,0,4) for n in roots[2]],'G3–B3–D4: G major.'),
        pattern('Root-position shapes',16,progression(roots),'C, F, G, C; four beats on each chord.'),
        pattern('Nearby chord shapes',16,progression(close),'C–E–G, C–F–A, B–D–G, then C–E–G; the same progression.')])
    d['three-chord-song']['keys']=['G3','G#3','A3','A#3','B3']+keys
    for p in d['three-chord-song']['patterns'][1:]:p['meter']=4
    # Chess lines are generated and independently validated by python-chess at build time.
    import sys
    sys.path.insert(0,str(ROOT.parent/'qa/check-tools'))
    import chess
    def line(title,fen,moves,captions):
        assert len(captions)==len(moves)+1
        board=chess.Board(fen);assert board.is_valid(),title
        def frame(caption,move=None):
            result={'pieces':{chess.square_name(s):('w' if p.color else 'b')+p.symbol().upper() for s,p in board.piece_map().items()},'turn':'White' if board.turn else 'Black','caption':caption}
            if move:result.update({'from':chess.square_name(move.from_square),'to':chess.square_name(move.to_square),'marks':[chess.square_name(move.from_square),chess.square_name(move.to_square)]})
            return result
        frames=[frame(captions[0])]
        for uci,caption in zip(moves,captions[1:]):
            move=chess.Move.from_uci(uci);assert move in board.legal_moves,(title,uci,board.fen());board.push(move);frames.append(frame(caption,move))
        return {'title':title,'fen':fen,'moves':moves,'frames':frames}
    def board(id,lines):d[id]={'kind':'chess','lines':lines}
    check='k3r3/8/8/8/8/8/8/2B1K3 w - - 0 1'
    board('chess-1',[line('Block the checking line',check,['c1e3'],['White is in check along the e-file.','Be3 blocks the rook’s line to the king.']),line('Move the king instead',check,['e1f1'],['The same checking position.','Kf1 leaves the attacked file; f1 is safe in this four-piece position.'])])
    board('chess-2',[line('The bishop can save the king','r7/1B6/8/8/8/8/2k5/K7 w - - 0 1',['b7a8'],['The king has no safe move, but its side has another reply.','Bxa8 removes the checking rook, so this was not mate.'])])
    board('castling',[line('A legal castle','4k3/8/8/8/8/8/8/4K2R w K - 0 1',['e1g1'],['Rights are available and the king’s route is safe.','O-O moves the king to g1 and rook to f1.']),line('The crossing square is attacked','4kr2/8/8/8/8/8/8/4K2R w K - 0 1',[],['Rf8 attacks f1. Castling through f1 is illegal even if g1 is safe.'])])
    board('pins',[line('A king behind the knight','8/6k1/5n2/8/8/2B5/8/6K1 b - - 0 1',[],['Moving the knight off f6 would uncover the bishop’s attack on Kg7.']),line('A queen behind the knight','k2q4/3n4/8/8/8/8/8/3R2K1 b - - 0 1',['d7f6','d1d8'],['The knight shields a queen, not the king.','...Nf6 is legal, but it clears the d-file.','Rxd8+ captures the queen. Legal did not mean wise.'])])
    board('threats',[line('An attacked rook','7k/8/8/8/3b4/8/8/R6K w - - 0 1',['a1a2'],['Bd4 attacks Ra1, but White’s king on h1 is not checked.','Ra2 is one legal way to move the rook out of attack.'])])
    d['chess-1']['lines'].append(d['threats']['lines'][0])
    board('promotion',[line('Promote with check','8/k7/2K1P3/8/8/8/8/8 w - - 0 1',['e6e7','a7b8','e7e8q'],['White can advance the e-pawn.','e7 approaches the promotion rank.','...Kb8 is one legal reply.','e8=Q+ creates a queen and checks immediately.']),line('Queen promotion stalemates','8/k1P5/2K5/8/8/8/8/8 w - - 0 1',['c7c8q'],['Inspect the black king’s replies before choosing a piece.','c8=Q leaves Black un-checked with no legal move: stalemate.']),line('Rook promotion leaves a reply','8/k1P5/2K5/8/8/8/8/8 w - - 0 1',['c7c8r'],['Use the same position but choose a rook.','c8=R leaves a6 available to Black’s king.'])])
    board('queen-net',[line('Give the actual mate','k7/8/1QK5/8/8/8/8/8 w - - 0 1',['b6b7'],['White to move can put the queen on b7.','Qb7# checks a8 and covers the escapes; Kc6 protects the queen.']),line('The nearby stalemate','k7/8/1QK5/8/8/8/8/8 b - - 0 1',[],['Black to move has no legal move, but Ka8 is not checked: stalemate.'])])
    d['promotion']['lines'] += [
        line('The immediate en passant capture','4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1',['d7d5','e5d6'],['Black to move; White’s pawn is on e5.','...d5 has just advanced two squares beside the white pawn.','exd6 en passant moves to d6 and removes the black pawn from d5.']),
        line('King safety still applies','k3r3/3p4/8/4P3/8/8/8/4K3 b - - 0 1',['d7d5'],['White’s e5 pawn is blocking Re8’s line to Ke1.','After ...d5, exd6 would uncover the rook’s check. That en passant capture is illegal.'])]
    race='8/5k2/8/8/P7/8/8/7K w - - 0 1'
    board('pawn-race',[
        line('The pawn starts',race,['a4a5','f7e7','a5a6','e7d7','a6a7','d7c7','a7a8q'],['White moves first from a4; Black’s king is on f7.','a5 shrinks the pawn’s square.','...Ke7 is still outside that square.','a6 needs two more pawn moves to promote.','...Kd7 approaches, but cannot reach the pawn.','a7 needs one more advance.','...Kc7 leaves the king two files from a8.','a8=Q survives; Kc7 cannot capture a8.']),
        line('The king starts',race.replace(' w ',' b '),['f7e6','a4a5','e6d6','a5a6','d6c7','a6a7','c7b7','a7a8q','b7a8'],['Black gets the first turn from the same arrangement.','...Ke6 enters the original pawn square.','a5.','...Kd6.','a6.','...Kc7.','a7.','...Kb7 reaches the promotion square’s neighborhood.','a8=Q+ gives check, but the queen is unprotected.','...Kxa8 removes the queen. Bare kings remain: a draw.'])])
    d['pawn-race']['intro']='Outlined squares trace the pawn’s counting square. Follow each turn with Show next move, or select the named piece and its destination. Notice how the outline shrinks after a pawn advance.'
    for example in d['pawn-race']['lines']:
        for frame in example['frames']:
            pawn=next((square for square,piece in frame['pieces'].items() if piece=='wP'),None)
            if not pawn:continue
            rank=int(pawn[1]);width=8-rank
            outline=[chess.square_name(chess.square(file,r-1)) for file in range(width+1) for r in range(rank,9) if file in [0,width] or r in [rank,8]]
            frame['marks']=list(dict.fromkeys(frame.get('marks',[])+outline))
    start=chess.STARTING_FEN
    board('read-moves',[
        line('Two numbered pairs',start,['e2e4','e7e5','g1f3','b8c6'],['Read 1 e4 e5 2 Nf3 Nc6 one turn at a time.','1 e4: the e2 pawn reaches e4.','...e5: Black’s e7 pawn reaches e5.','2 Nf3: N means knight; this one starts on g1.','...Nc6: Black’s b8 knight reaches c6. Two pairs contain four turns.']),
        line('Capture symbols and a new attack',start,['e2e4','d7d5','e4d5','d8d5','b1c3'],['Read 1 e4 d5 2 exd5 Qxd5 3 Nc3.','1 e4.','...d5 puts a pawn diagonally ahead of e4.','2 exd5: the e-file pawn captures on d5.','...Qxd5: the queen captures the pawn on d5.','3 Nc3 develops the knight with an attack on Qd5.'])])
    board('count-exchanges',[
        line('Bishop for knight','6k1/8/4p3/3n4/2B5/8/8/6K1 w - - 0 1',['c4d5','e6d5'],['The knight is defended by the pawn on e6.','Bxd5 takes a knight worth roughly 3.','...exd5 takes the bishop worth roughly 3. The exchange changes material by about zero.']),
        line('Rook for knight','6k1/8/4p3/3n4/8/8/8/3R2K1 w - - 0 1',['d1d5','e6d5'],['The rook has a clear route to d5, but inspect the reply.','Rxd5 takes a knight worth roughly 3.','...exd5 takes a rook worth roughly 5. White lost about 2 in this exchange.'])])
    board('annotated-game',[line('The missed mating threat',start,['e2e4','e7e5','f1c4','b8c6','d1h5','g8f6','h5f7'],['Watch both sides of the game.','e4 opens the bishop.','...e5 occupies the center.','Bc4 points toward f7.','...Nc6 develops.','Qh5 adds a second attack on f7.','...Nf6 attacks the queen but leaves the mating reply available.','Qxf7# is mate; the bishop protects the queen.']),line('A defensive response',start,['e2e4','e7e5','f1c4','b8c6','d1h5','g7g6','h5f3','g8f6'],['Start again.','e4.','...e5.','Bc4.','...Nc6.','Qh5 creates the threat.','...g6 interrupts the diagonal and attacks the queen.','Qf3 retreats along the diagonal.','...Nf6 develops and blocks the queen’s f-file line.'])])
    return d

def render_course(course,demos):
    data=json.dumps(course,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
    selected={unit['demo']:demos[unit['demo']] for unit in course['units'] if unit['demo']}
    demo_source=(ROOT/'demos-v109.js').read_text().replace('__DEMOS__',json.dumps(selected,ensure_ascii=False,separators=(',',':')))
    project_data=json.loads((ROOT/'project-demos-v115.json').read_text())
    project_source=(ROOT/'course-projects-v115.js').read_text().replace('__PROJECT_DEMOS__',json.dumps(project_data.get(course['subject'],{}),ensure_ascii=False,separators=(',',':')))
    clarity_source=(ROOT/'clarity-v116.js').read_text().replace('__MATH_DESK__',(ROOT/'math-desk-v116.json').read_text()).replace('__WALKTHROUGH_MAP__',(ROOT/'project-walkthrough-v116.json').read_text())
    workshop_source=(ROOT/'teacher-workshops-v117.js').read_text().replace('__WORKSHOP_DEMOS__',json.dumps(json.loads((ROOT/'workshop-demos-v117.json').read_text()).get(course['subject'],[]),ensure_ascii=False,separators=(',',':')))
    slow_source=(ROOT/'slow-teaching-v118.js').read_text().replace('__SLOW_TEACHING__',(ROOT/'slow-teaching-v118.json').read_text())
    math_button='<button id="courseMath" type="button">Maths help</button>' if course['subject'] in ['calculus','physics'] else ''
    helpers="const $=id=>document.getElementById(id);const escape=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));"
    import html
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+html.escape(course['title'])+' — Full course</title><style>'+(ROOT/'theme-v109.css').read_text()+'\n'+(ROOT/'course-reader.css').read_text()+'\n'+(ROOT/'claude-additions-v114.css').read_text()+'\n'+(ROOT/'course-projects-v115.css').read_text()+'\n'+(ROOT/'clarity-v116.css').read_text()+'\n'+(ROOT/'teacher-workshops-v117.css').read_text()+'\n'+(ROOT/'slow-teaching-v118.css').read_text()+'</style><script>'+(ROOT/'theme-state.js').read_text()+'</script></head><body><header class="course-top"><strong id="courseSubject"></strong><div><button id="courseAll" type="button">All curriculums</button>'+math_button+'<button id="courseTheme" type="button" data-study-theme-toggle>Dark mode</button></div></header><div class="reader-layout"><aside class="contents"><details id="courseContents" open><summary>Course contents</summary><ol id="courseContentsList"></ol></details></aside><main id="courseArticle" class="reader-article" tabindex="-1"></main></div><script id="full-course-data" type="application/json">'+data+'</script><script>(()=>{\'use strict\';'+helpers+'\n'+demo_source+'\n'+(ROOT/'course-figures.js').read_text()+'\n'+(ROOT/'teaching-panels.js').read_text().replace('__PANEL_DATA__',(ROOT/'teaching-panels-v113.json').read_text())+'\n'+(ROOT/'claude-figures-v114.js').read_text()+'\n'+project_source+'\n'+clarity_source+'\n'+workshop_source+'\n'+slow_source+'\n'+(ROOT/'course-reader.js').read_text()+'\n})();</script></body></html>'
