from pathlib import Path
import re,gzip,base64,json,hashlib
base=Path(__file__).resolve().parents[1]
old_path=base/'Study_Table_V165_Reconciled_Stories_And_Practice.html'
if not old_path.exists():old_path=base/'source'/'Study_Table_V165.html'
a=old_path.read_text()
b=Path(base/'Study_Table_V166_Learning_Journey.html').read_text()
def extract(s):
 m=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',s,re.S)
 assert m
 return json.loads(gzip.decompress(base64.b64decode(m.group(1))))
old,new=extract(a),extract(b)
assert len(new)==215 and old.keys()==new.keys()
changed=[p for p in old if old[p]!=new[p]]
assert len(changed)==7,changed
assert set(changed)=={'v15/spanish-for-someone/complete-practice-v40/index.html','v15/rockjam-piano-studio/index.html','v15/chess-from-zero/index.html','curricula/calculus.html','curricula/physics.html','curricula/medicine.html','curricula/business.html'}
total_old=total_new=0
for p in changed:
 x=old[p]['t'];y=new[p]['t'];assert 'V136_COMPANIONS' in x and 'V136_COMPANIONS' in y
 assert x.count('const V133_BANK=')==y.count('const V133_BANK=')==1
 assert x.count('const V134_STORIES=')==y.count('const V134_STORIES=')==1
 assert x.count('window.studyTableJourneyV166=')==0 and y.count('window.studyTableJourneyV166=')==1
 before=json.loads(re.search(r'const V133_BANK=(.*?);\s*const V133_STORE',x,re.S).group(1))
 after=json.loads(re.search(r'const V133_BANK=(.*?);\s*const V133_STORE',y,re.S).group(1))
 for k,v in before.items():assert after[k]==v,(p,k)
 total_old+=sum(len(z['variants']) for z in before.values())
 total_new+=sum(len(z['variants']) for z in after.values())
 assert 'v166SpanishRealMarkup' in y
assert total_old==42*7 and total_new==42*7+6,(total_old,total_new)
assert 'studyTableFocusV163' in b
assert 'Study Table V166 — One Learning Journey' in b
assert b.count('<script id="st163-reconciled-script">')==1
assert len(b)<8_000_000
print('V166_ARCHIVE_AND_BANK_PRESERVATION_PASS: 208 archived assets exact, 42 old checked problems exact, 6 new checked variants; 7 stories retained')
