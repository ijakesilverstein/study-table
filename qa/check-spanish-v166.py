#!/usr/bin/env python3
"""Source-backed V166 archive preservation and authored practice invariants."""
from pathlib import Path
import re,gzip,base64,json,hashlib
root=Path(__file__).resolve().parents[1]
base=(root/'source'/'Study_Table_V165.html').read_text()
new=(root/'source'/'Study_Table_V166.html').read_text()
pattern=r'(<script id="full-bundle" type="text/plain">)(.*?)(</script>)'
a=re.search(pattern,base,re.S);b=re.search(pattern,new,re.S)
assert a and b
older=json.loads(gzip.decompress(base64.b64decode(a[2])))
current=json.loads(gzip.decompress(base64.b64decode(b[2])))
path='v15/spanish-for-someone/complete-practice-v40/index.html'
assert len(older)==len(current)==215
assert set(older)==set(current)
changed=[k for k in older if older[k]!=current[k]]
assert changed==[path], changed
p=current[path]['t']
old=older[path]['t']
for marker in ['const V133_BANK=','const V134_STORIES=','V136_COMPANIONS','v133LessonMarkup(unit)','v134StoryMarkup()']:
 assert p.count(marker)>=old.count(marker)>=1,marker
assert p.count('const V166_SPANISH_SCENES =')==1
assert p.count('v166SpanishMarkup()')>=1
assert p.count('v166LessonBridge(unit)')==2
assert p.count('data-v166-open>Plan a real conversation')==1
assert p.count('studyTableSpanishV166')==1
assert base[:a.start(2)].replace('V165 — Stories and Real Practice','V166 — Real-World Spanish')==new[:b.start(2)]
assert base[a.end(2):].replace('V165 — Stories and Real Practice','V166 — Real-World Spanish')==new[b.end(2):]
data=json.loads((root/'source'/'spanish-real-v166.json').read_text())
assert len(data)==8
assert sum(len(x['turns']) for x in data)==24
assert sum(turn['best']==0 for scene in data for turn in scene['turns'])==12
assert sum(turn['best']==1 for scene in data for turn in scene['turns'])==12
assert len(set(x['id'] for x in data))==len(data)
for scene in data:
 assert scene['id'] and scene['title'] and scene['unit']
 for turn in scene['turns']:
  assert len(turn['options'])==len(turn['why'])==2
  assert len(set(turn['options']))==2
  assert all(turn[k] for k in ('heard','meaning','repair'))
assert 'SPANISH_FOR_SOMEONE_V53' not in p or 'Not a verbatim port' in p
print('PASS V166: canonical archive 215 entries; only Spanish reader changed; 8/24 authored conversation checks; V133/V134/V136 retained')