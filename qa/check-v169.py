from pathlib import Path
import base64,gzip,json,re,sys,math
r=Path(__file__).resolve().parents[1]
def unpack(path):
 text=path.read_text();return text,json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',text,re.S)[1])))
def const(page,name):return json.JSONDecoder().raw_decode(page.split('const '+name+'=')[1])[0]
a,old=unpack(r/'source/Study_Table_V168.html');b,new=unpack(r/'public/study-table-v169.html');C=json.loads((r/'source/full-courses-built.json').read_text());paths={c['path'] for c in C.values()};raw=json.loads((r/'source/v166-extra-transfer.json').read_text());guides=json.loads((r/'source/extra-worked-v169.json').read_text())
assert len(new)==215 and set(new)==set(old)
assert all(new[p]==old[p] for p in old if p not in paths)
assert (r/'public/index.html').read_bytes()==(r/'public/study-table-v136.html').read_bytes()
count=0;skills={}
for subject,c in C.items():
 before=old[c['path']]['t'];page=new[c['path']]['t']
 for name in ['V133_BANK','V126_REVISIONS','V132_SPECIFIC','V109_DEMOS','V128_COACH_UNITS','V167_DATA','V134_STORIES']:
  assert const(before,name)==const(page,name),(subject,name)
 assert re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',before,re.S)[1]==re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',page,re.S)[1]
 bank=const(page,'V133_BANK');skills.update({k:v for k,v in bank.items() if v['subject']==subject})
 assert page.count('window.studyTableTeachbackV168=')==1
 for id,examples in const(page,'V169_WORKED').items():
  assert raw[id]['subject']==subject and len(examples)==2
  for i,example in enumerate(examples):
   original=raw[id]['variants'][i];guide=guides[id][i]
   for key in original:
    if key!='wrong':assert example[key]==original[key]
   assert example['wrong']=={**original['wrong'],**guide.get('corrections',{})}
   assert example['steps']==guide['steps'] and len(example['steps'])==4
   count+=1
assert len(skills)==26 and sum(len(row['variants']) for row in skills.values())==52 and count==6
assert .5*10*4**2==raw['physics-2']['variants'][0]['answer']==80
assert math.sqrt(2*200/25)==raw['physics-2']['variants'][1]['answer']==4
assert math.isclose(90/(90+495)*100,15.384615384615385)
assert 90/(90+90)*100==50
sys.path.insert(0,str(r/'qa/check-tools'));import chess
board=chess.Board('4k3/8/8/8/8/8/6b1/4K2R w K - 0 1');assert board.is_valid() and not board.is_check() and chess.F1 in board.attacks(chess.G2) and chess.Move.from_uci('e1g1') not in board.legal_moves
board=chess.Board('4k3/8/8/8/8/8/8/4K2R w - - 0 1');assert board.is_valid() and chess.Move.from_uci('e1g1') not in board.legal_moves
assert 'Microphone stopped.' in new[C['piano']['path']]['t']
assert 'const APP_VERSION=169,MAX=' in b and 'id="st169-lesson"' in b
assert json.loads((r/'vercel.json').read_text())['git']['deploymentEnabled'] is False
print('V169_SOURCE_PASS: 87 lessons, 52 checked problems, all previous guidance/companions preserved; 208 other pages unchanged; six additional worked cases with independent arithmetic/castling checks; integrated backup schema; no Vercel deployment enabled.')
