#!/usr/bin/env python3
"""Reconcile published V168 and the parallel worked examples; no homepage mutation/deploy."""
from pathlib import Path
import argparse,base64,gzip,json,re,subprocess,sys
repo=Path(__file__).resolve().parents[1];source=repo/'source'
p=argparse.ArgumentParser();p.add_argument('--all',action='store_true');p.add_argument('--check',action='store_true');args=p.parse_args()
if args.all:
 for name in ['build.py','build-v163.py','build-v164.py','build-v165.py','build-v166.py','build-v167.py','build-v168.py']:
  subprocess.run([sys.executable,str(repo/'scripts'/name)],cwd=repo,check=True)
html=(source/'Study_Table_V168.html').read_text();original=html
match=re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',html,re.S);assert match
bundle=json.loads(gzip.decompress(base64.b64decode(match[1])));before=dict(bundle)
extras=json.loads((source/'v166-extra-transfer.json').read_text());teaching=json.loads((source/'extra-worked-v169.json').read_text())
assert set(extras)==set(teaching)=={'castling','physics-2','test-interpretation'}
def constant(page,name):return json.JSONDecoder().raw_decode(page.split('const '+name+'=')[1])[0]
def once(text,old,new):assert text.count(old)==1,(old[:90],text.count(old));return text.replace(old,new,1)
paths=json.loads((source/'full-courses-built.json').read_text());bank={}
for subject,c in paths.items():
 path=c['path'];page=bundle[path]['t'];bank.update({id:b for id,b in constant(page,'V133_BANK').items() if b['subject']==subject})
 selected={}
 for id,row in extras.items():
  if row['subject']!=subject:continue
  assert len(row['variants'])==len(teaching[id])==2
  selected[id]=[]
  for variant,guide in zip(row['variants'],teaching[id]):
   assert len(guide['steps'])==4
   selected[id].append({**variant,'title':guide['title'],'steps':guide['steps'],'wrong':{**variant['wrong'],**guide.get('corrections',{})}})
 module=(source/'extra-worked-v169.js').read_text().replace('__V169_WORKED__',json.dumps(selected,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
 page=once(page,'</style>',(source/'extra-worked-v169.css').read_text()+'\n</style>')
 page=once(page,'+practiceBlock(unit)+v133LessonMarkup(unit)','+v169WorkedMarkup(unit)+practiceBlock(unit)+v133LessonMarkup(unit)')
 page=once(page,'window.studyTableFullCourse={subject:COURSE.subject',module+'\nwindow.studyTableFullCourse={subject:COURSE.subject')
 page=page.replace('Review choices are saved only in this browser. They are separate from your course progress and are not included in the existing progress-backup export.','Review choices stay separate from assessed course progress. Use Back up your learning on the home screen to include optional review plans in your progress file.')
 page=page.replace('Your plan and report are saved in this browser only. They are not in Study Table’s existing progress backup. You can export your Spanish conversation journal below.','Your plan and report are saved in this browser. Back up your learning on the home screen includes this journal; you can also export the Spanish journal separately below. Reports remain self-reported.')
 if subject=='spanish':page=once(page,'if(spanish)u.voice=spanish;','if(!spanish)return false;u.voice=spanish;')
 bundle[path]={'t':page}
assert len(bank)==26 and sum(len(row['variants']) for row in bank.values())==52
assert set(bundle)==set(before) and sum(bundle[key]!=before[key] for key in bundle)==7
assert all(bundle[key]==before[key] for key in bundle if key not in {c['path'] for c in paths.values()})
encoded=base64.b64encode(gzip.compress(json.dumps(bundle,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode();html=html[:match.start(1)]+encoded+html[match.end(1):]
# Extend the existing preview/apply/rollback/Undo mechanism, not a second restore implementation.
backup_match=re.search(r'(<script id="progress-backup-v124">)(.*?)(</script>)',html,re.S);assert backup_match
backup=backup_match[2]
helpers=(source/'backup-extras-v169.js').read_text().replace('__V169_REVIEW_UNITS__',json.dumps(sorted(bank))).replace('__V169_SPANISH_SCENES__',json.dumps([s['id'] for s in json.loads((source/'spanish-real-v166.json').read_text())]))
backup=once(backup,' function kind(key){',helpers+'\n function kind(key){\n  if(V169_EXTRA_KEYS.includes(key))return {part:key===V169_EXTRA_KEYS[0]?"optional-review":"spanish-journal"};')
backup=once(backup,"  if(k.part==='progress'){","  if(V169_EXTRA_KEYS.includes(key))return v169ValidateExtra(key,v);\n  if(k.part==='progress'){")
backup=once(backup,"if(courseList().some(c=>['progress','reading','project-part','workshop-part'].some(p=>courseKey(c.subject,p)===childKey)))decode(childKey,value);","if(V169_EXTRA_KEYS.includes(childKey)||courseList().some(c=>['progress','reading','project-part','workshop-part'].some(p=>courseKey(c.subject,p)===childKey)))decode(childKey,value);")
backup=once(backup,' function combine(key,a,b,fileWins){\n  const k=kind(key);',' function combine(key,a,b,fileWins){\n  if(V169_EXTRA_KEYS.includes(key))return v169CombineExtra(key,a,b,fileWins);\n  const k=kind(key);')
backup=once(backup,'const out=Object.assign(Object.create(null),records);','const out=Object.assign(Object.create(null),records);v169GatherExtras(out);')
backup=once(backup,'  return out;\n }\n function keys(){','  return v169MirrorExtras(out);\n }\n function keys(){')
backup=once(backup,"const set=new Set([...legacyKeys,...notebook,'studytable:full-course:last'","const set=new Set([...legacyKeys,...notebook,...V169_EXTRA_KEYS,'studytable:full-course:last'")
backup=once(backup,'groups={courses:0,notebook:0,earlier:0}','groups={courses:0,notebook:0,earlier:0,extras:0}')
category="k.c||k.part==='course-last'?'courses':k.notebook?'notebook':'earlier'"
assert backup.count(category)==2;backup=backup.replace(category,"V169_EXTRA_KEYS.includes(key)?'extras':("+category+")")
backup=once(backup,'for(const name of Object.keys(groups))groups[name]=0;','v169ResolveExtraPlan(updates,before,logicalBefore,currentRecords,incoming);for(const name of Object.keys(groups))groups[name]=0;')
backup=once(backup,"['earlier','Practice records and offline course records']","['earlier','Practice records and offline course records'],['extras','Optional review plans and Spanish conversation journal']")
backup=once(backup,'Save your course places, review marks, notebook and practice records in a progress file.','Save course places, review marks, notes, optional review plans and your Spanish conversation journal in one progress file.')
backup=once(backup,'Practice counters are never added together.','Practice counters are never added together. Optional review records stay whole; when journals differ, the conflict choice keeps either this browser’s journal or the file’s journal.')
backup=once(backup,"if(object(payload)&&payload.format==='study-table-backup'","if(object(payload)&&payload.kind==='studytable-spanish-conversation-journal'&&payload.version===1&&Array.isArray(payload.entries))records={\"studytable:spanish:real-life:v166\":JSON.stringify({version:1,entries:payload.entries})};\n  else if(object(payload)&&payload.format==='study-table-backup'")
backup=once(backup,'Choose a progress or notebook backup','Choose a progress, notebook or Spanish journal backup')
backup=once(backup,'const APP_VERSION=136,MAX=','const APP_VERSION=169,MAX=')
html=html[:backup_match.start(2)]+backup+html[backup_match.end(2):]
html=html.replace('Study Table V163 — Reconciled Teaching','Study Table V169 — Reconciled Learning')
html=html.replace('Study Table V168 — One Idea, Three Ways','Study Table V169 — Reconciled Learning').replace('Study_Table_V136.html','Study_Table_V169.html').replace('study-table-v136.html','study-table-v169.html')
html=once(html,'Explore this question</button><span class="st160-small">','Explore this question</button><button type="button" class="st169-teach-first" id="st169-lesson">See the worked lesson first</button><span class="st160-small">')
end=html.rindex('</body>')
html=html[:end]+'<style>'+(source/'teach-first-v169.css').read_text()+'</style><script id="teach-first-v169">'+(source/'teach-first-v169.js').read_text()+'</script>'+html[end:]
end=html.rindex('</body>');html=html[:end]+'<script id="study-release-v169">window.studyTableRelease={version:169,foundation:136,checkedVariants:52,extraWorkedExamples:6};</script>\n'+html[end:]
for path in [source/'Study_Table_V169.html',repo/'public/study-table-v169.html']:
 if args.check:assert path.is_file() and path.read_text()==html,'V169 parity mismatch: '+str(path)
 else:path.write_text(html)
assert (repo/'public/index.html').read_bytes()==(repo/'public/study-table-v136.html').read_bytes(),'The foundation homepage must remain unchanged; no deployment is authorized.'
print(('V169 parity PASS' if args.check else 'V169 built')+f': {len(html.encode()):,} bytes; latest seven-course experience, 52 checked problems, six more fully worked examples, unified progress backup. No homepage publication.')
