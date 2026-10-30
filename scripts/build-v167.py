#!/usr/bin/env python3
"""Optional V167 build: a guided path inside each of seven course readers.
Build on V166, not on the old V155 standalone; preserve archives and production home.
"""
from pathlib import Path
import json,re,base64,gzip,sys
repo=Path(__file__).resolve().parents[1]
root=repo/'source';previous=root/'Study_Table_V166.html'
assert previous.is_file(),'Run build-v166.py before this script.'
html=previous.read_text();original_html=html
book=json.loads((root/'learning-path-v167.json').read_text());reflections=book['practiceReflections']
subjects=('spanish','piano','chess','calculus','physics','medicine','business')
assert set(book)-{'practiceReflections'}==set(subjects) and len(reflections)==21
path_by_subject={'spanish':'v15/spanish-for-someone/complete-practice-v40/index.html',
 'piano':'v15/rockjam-piano-studio/index.html','chess':'v15/chess-from-zero/index.html',
 'calculus':'curricula/calculus.html','physics':'curricula/physics.html',
 'medicine':'curricula/medicine.html','business':'curricula/business.html'}
js=(root/'learning-path-v167.js').read_text().replace('__V167_DATA__',json.dumps(book,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
css=(root/'learning-path-v167.css').read_text()
archive=re.search(r'(<script id="full-bundle" type="text/plain">)(.*?)(</script>)',html,re.S);assert archive
bundle=json.loads(gzip.decompress(base64.b64decode(archive.group(2))))
assert len(bundle)==215
before={k:dict(v) for k,v in bundle.items()}
def once(p,old,new):
 assert p.count(old)==1,(old[:110],p.count(old));return p.replace(old,new,1)
for subject,path in path_by_subject.items():
 page=bundle[path]['t'];x=book[subject]
 course=json.loads(re.search(r'<script id="full-course-data" type="application/json">(.*?)</script>',page,re.S)[1]);ids={u['id'] for u in course['units']}
 assert course['subject']==subject and x['storyUnit'] in ids and x['practiceUnit'] in ids
 bank=json.JSONDecoder().raw_decode(page.split('const V133_BANK=')[1])[0]
 story=json.JSONDecoder().raw_decode(page.split('const V134_STORIES=')[1])[0]
 assert bank[x['practiceUnit']]['subject']==subject
 assert next(s for s in story if s['subject']==subject)['unit']==x['storyUnit']
 assert set(reflections).issuperset({k for k,v in bank.items() if v['subject']==subject})
 assert 'studyTablePathV167' not in page
 page=once(page,'</style>',css+'\n</style>')
 orig="+v119SummaryBlock()+projectCard()+v117WorkshopCard()+v130ChallengeMarkup()+v133MapMarkup()+'<details class=\"v165-story-discovery\"><summary>Play a three-decision story</summary>'+v134StoryMarkup()+'</details>"
 new="+v167PathMarkup()+v119SummaryBlock()+projectCard()+v117WorkshopCard()+'<details class=\"v167-more\" id=\"v167More\"><summary>More ways to explore</summary>'+v130ChallengeMarkup()+v133MapMarkup()+'<details class=\"v165-story-discovery\"><summary>Play the full story</summary>'+v134StoryMarkup()+'</details></details>"
 page=once(page,orig,new)
 if subject=='spanish':
  page=once(page,'+v133LessonMarkup(unit)+v166LessonBridge(unit)', '+v133LessonMarkup(unit)+v167ReflectMarkup(unit)+v167LessonBridge(unit)+v166LessonBridge(unit)')
 else:
  page=once(page,'+v133LessonMarkup(unit)+\'<footer class="course-footer">\'', '+v133LessonMarkup(unit)+v167ReflectMarkup(unit)+v167LessonBridge(unit)+\'<footer class="course-footer">\'')
 page=once(page,'<button type="button" data-v134-lesson>See the real lesson</button>',
  '<button type="button" data-v134-lesson>See the real lesson</button><button type="button" class="v167-story-button" data-v167="practice">Try a checked problem</button>')
 page=once(page,'window.studyTableFullCourse={subject:COURSE.subject',
  '\n// V167: turn the authored narrative, worked lesson, and transfer task into a clear path.\n'+js+'\nwindow.studyTableFullCourse={subject:COURSE.subject')
 assert page.count('window.studyTablePathV167=')==1
 bundle[path]={'t':page}
assert set(bundle)==set(before)
assert sum(bundle[k]!=before[k] for k in bundle)==7
assert all(bundle[k]==before[k] for k in set(bundle)-set(path_by_subject.values()))
encoded=base64.b64encode(gzip.compress(json.dumps(bundle,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
html=html[:archive.start(2)]+encoded+html[archive.end(2):]
assert html.count('V136_COMPANIONS')==original_html.count('V136_COMPANIONS')
assert html.count('<script id="st163-reconciled-script">')==1
# In the main shell's existing curiosity-tutor conclusion, offer a direct path
# to the real authored story/lesson/practice options without breaking its lesson CTA.
old="(window.studyTableFullCourses?.courses?.some(c=>c.subject===state.subject)?'Continue into a real lesson →':'Explore the subject library →')+'</button>'+(item.experiment"
new="(window.studyTableFullCourses?.courses?.some(c=>c.subject===state.subject)?'Continue into a real lesson →':'Explore the subject library →')+'</button>'+(window.studyTableFullCourses?.courses?.some(c=>c.subject===state.subject)?'<button type=\"button\" class=\"st160-secondary\" data-st160=\"path\">Choose a story, lesson or new problem</button>':'')+(item.experiment"
assert html.count(old)==1,('Missing curiosity conclusion anchor',html.count(old))
html=html.replace(old,new,1)
old="if(action==='lesson')lesson();if(action==='experiment')experiment();"
new="if(action==='lesson')lesson();if(action==='path'){const key=state.subject;close();window.studyTableFullCourses?.open(key)}if(action==='experiment')experiment();"
assert html.count(old)==1
html=html.replace(old,new,1)
html=html.replace('Study Table V166 — Real-World Spanish','Study Table V167 — One Learning Path')
assert html!=original_html
check='--check' in sys.argv
for out in [root/'Study_Table_V167.html',repo/'public'/'study-table-v167.html']:
 if check:
  if not out.is_file() or out.read_text()!=html:raise SystemExit('V167 output out of sync: '+str(out))
 else:
  out.parent.mkdir(parents=True,exist_ok=True);out.write_text(html)
print(('V167 source parity PASS' if check else 'V167 built')+f': {len(html.encode()):,} bytes, 215 archive pages (208 untouched), 7 linked story/lesson/practice routes, 21 explanation checks')