from pathlib import Path
import json,re
from demos_v109 import build_demos
from full_courses import build_courses,render_course,COURSE_PATHS

root=Path(__file__).resolve().parent
html=(root/'Study_Table_V108.html').read_text()
head_end=html.index('</head>')
html=html[:head_end]+'<script id="study-theme-state">'+(root/'theme-state.js').read_text()+'</script>'+html[head_end:]
match=re.search(r'(<script id="v97-teacher-script">)(.*?)(</script>)',html,re.S)
teacher=match[2]
def once(text,old,new):
    assert text.count(old)==1,(old[:100],text.count(old))
    return text.replace(old,new,1)
def get(name):
    start=teacher.index('const '+name+'=')+len('const '+name+'=')
    data,end=json.JSONDecoder().raw_decode(teacher[start:]);return data,start,start+end
def put(name,data):
    global teacher
    _,start,end=get(name);teacher=teacher[:start]+json.dumps(data,ensure_ascii=False,separators=(',',':'))+teacher[end:]
new=json.loads((root/'draft-foundation-lessons.json').read_text())+json.loads((root/'lessons-v109.json').read_text())
prose=json.loads((root/'teacher-prose-v109.json').read_text())
openings=json.loads((root/'openings-v109.json').read_text())
lessons,_,_=get('DATA');tasks,_,_=get('V102_TASKS');examples,_,_=get('V105_EXAMPLES');depth,_,_=get('V106_DEPTH');teaching,_,_=get('V107_TEACHING');clarity,_,_=get('V108_CLARITY')
assert len(new)==12 and len({x['id'] for x in new})==12
assert not {x['id'] for x in new}&{x['id'] for x in lessons}
for entry in new:
    id=entry['id'];first,second=entry['examples']
    lessons.append({'id':id,'subject':entry['subject'],'title':entry['title'],'scene':entry['scene'],'steps':[s[1]+' '+s[2] for s in first['steps']],'rule':entry['goal'],'trap':entry['mistake']['diagnosis'],'questions':entry['questions'],'why':' '.join(entry['explanation']),'lab':None,'faq':[],'teachingIntro':entry['needs']})
    tasks[id]=[entry['goal']]+entry['transfer']
    examples[id]={'title':first['title'],'problem':first['problem'],'steps':first['steps'],'check':first['notice']}
    depth[id]={'needs':entry['needs'],'prerequisites':entry['prerequisites'],'terms':entry['terms'],'second':second,'rescue':entry['rescue']}
    teaching[id]={'title':openings[id]['reasoningTitle'],'explanation':entry['explanation'],'decision':entry['decision'],'mistake':entry['mistake']}
    clarity[id]=openings[id]
for id,entry in prose.items():
    teaching[id].update({k:entry[k] for k in ['explanation','decision']})
    clarity[id].update({k:entry[k] for k in ['opening','introTitle','reasoningTitle']})
    next(l for l in lessons if l['id']==id)['why']=' '.join(entry['explanation'])
# Show foundations before material that relies on them. Existing lesson IDs and assessment stores stay stable.
paths={'spanish':['spanish-0','spanish-1','spanish-5','spanish-6','spanish-7','spanish-2','spanish-3','spanish-4'],
       'piano':['piano-1','piano-0','piano-2','piano-3','piano-4','piano-5','piano-6'],
       'chess':['chess-0','chess-1','chess-2','chess-3','chess-4','chess-5']}
depth['spanish-1']['prerequisites']=['spanish-0'];depth['piano-2']['prerequisites']=['piano-0'];depth['chess-1']['prerequisites']=['chess-0']
depth['chess-1']['needs']='Read the board and recognize rook, bishop and king movement. The preceding lesson demonstrates each shape.'
by_id={x['id']:x for x in lessons};subject_order=list(dict.fromkeys(x['subject'] for x in lessons[:26]))
lessons=[by_id[id] for sub in subject_order for id in paths.get(sub,[l['id'] for l in lessons if l['subject']==sub])]
assert len(lessons)==38
ids={x['id'] for x in lessons}
for name,data in [('tasks',tasks),('examples',examples),('depth',depth),('teaching',teaching),('clarity',clarity)]:assert set(data)==ids,name
def visit(id,path):
    assert id not in path,'Prerequisite cycle: '+id
    for p in depth[id]['prerequisites']:assert p in ids;visit(p,path+[id])
for l in lessons:
    visit(l['id'],[]);assert len(l['questions'])==2
    for q in l['questions']:assert 0<=q['correct']<len(q['choices'])==len(q['feedback'])
# Explain the algebra at the exact step where the learner needs it.
examples['calculus-2']['steps'][2][2]='Multiply (3+h) by (3+h): 9+3h+3h+h². Subtract the starting 9 to leave 6h+h². For nonzero h, divide each term by h to get 6+h.'
examples['physics-4']['steps'][2][2]='The three seconds contain 5 m, then 15 m, then 25 m of fall. Their sum is 45 m. Using the final 30 m/s for all three seconds would count speed the object did not yet have.'
for name,data in [('DATA',lessons),('V102_TASKS',tasks),('V105_EXAMPLES',examples),('V106_DEPTH',depth),('V107_TEACHING',teaching),('V108_CLARITY',clarity)]:put(name,data)
courses,course_demos=build_courses(teacher)
catalogue,_,_=get('V108_CURRICULA')
for entry in catalogue:
    subject=entry['subject']
    if subject not in courses:continue
    count=len(courses[subject]['units'])
    entry['description']=str(count)+' teaching units with full explanations, two worked cases per unit, and optional practice.'
    if subject in ['spanish','piano','chess']:
        entry['routes'][0]['label']='Open the '+str(count)+'-unit '+subject+' course'
        entry['routes'].insert(1,{'label':'Open the original practice studio','path':COURSE_PATHS[subject].rsplit('/',1)[0]+'/practice-studio.html'})
    else:entry['routes'].insert(0,{'label':'Open the '+str(count)+'-unit '+subject+' course','path':COURSE_PATHS[subject]})
put('V108_CURRICULA',catalogue)
demos=build_demos();assert set(demos)=={x['id'] for x in new}
extension=(root/'demos-v109.js').read_text().replace('__DEMOS__',json.dumps(demos,ensure_ascii=False,separators=(',',':')))+'\n'+(root/'expansion-v109.js').read_text()
teacher=once(teacher,'const V108_CURRICULA=',extension+'\nconst V108_CURRICULA=')
teacher=once(teacher,"function v105Demo(id){const host=$('v105Demo');if(!host)return;", "function v105Demo(id){const host=$('v105Demo');if(!host)return;if(V109_DEMOS[id]){v109Demo(id,host);return;}")
teacher=once(teacher,"function open(sub='spanish',id,review=false){v105AudioRun++;", "function open(sub='spanish',id,review=false){v109StopMedia();v105AudioRun++;")
teacher=once(teacher,'function close(){v105AudioRun++;','function close(){v109StopMedia();v105AudioRun++;')
teacher=once(teacher,"d.addEventListener('close',()=>{window.speechSynthesis?.cancel?.();", "d.addEventListener('close',()=>{v109StopMedia();window.speechSynthesis?.cancel?.();")
teacher=once(teacher,"intro.innerHTML='<h2>Start with this</h2>'+", "intro.innerHTML='<h2>'+escape(d.introTitle||'Start with this')+'</h2>'+" )
teacher=once(teacher,"reasoning.querySelector('h2').textContent='Why we did it that way';", "reasoning.querySelector('h2').textContent=d.reasoningTitle||'Why we did it that way';reasoning.querySelector('.v107-decision h3')?.remove();")
teacher=once(teacher,"first.querySelector('.v105-label').textContent='Watch me work through it';", "first.querySelector('.v105-label').textContent='Worked example';")
teacher=once(teacher,'v108MountCurricula();\n const hero=', 'v108MountCurricula();v109MountFocus();\n const hero=')
teacher=once(teacher,"escape(route.label)+'</button>').join('')+'</div></article>'", "escape(route.label)+'</button>').join('')+(['piano','spanish','chess'].includes(x.subject)?'<button type=\"button\" class=\"v109-taught-path\" data-teaching-path=\"'+x.subject+'\">Quick worked lessons ('+DATA.filter(l=>l.subject===x.subject).length+')</button>':'')+'</div></article>'")
teacher=once(teacher,'STUDY TABLE · FIRST STEPS','STUDY TABLE · LESSONS')
teacher=once(teacher,"function v108Continue(){const p=v108Place();", "function v108Continue(){if(window.studyTableFullCourses?.readingPlace()){window.studyTableFullCourses.resume();return}const legacy=v108Place();if(legacy&&legacy.mode!=='quick'&&window.studyTableFullCourses?.courses.some(c=>c.subject===legacy.subject)){window.studyTableFullCourses.open(legacy.subject,legacy.id);return}const p=v108Place();")
teacher=once(teacher,"function v108Remember(lesson){try{", "function v108Remember(lesson){window.studyTableFullCourses?.clearResume();try{")
teacher=once(teacher,"JSON.stringify({id:lesson.id,subject:lesson.subject})", "JSON.stringify({id:lesson.id,subject:lesson.subject,mode:'quick'})")
teacher=once(teacher,"const p=v108Place(),lesson=p&&DATA.find(l=>l.id===p.id);", "const p=v108Place(),lesson=p&&DATA.find(l=>l.id===p.id),full=window.studyTableFullCourses?.readingPlace()||(p&&p.mode!=='quick'&&window.studyTableFullCourses?.courses.find(c=>c.subject===p.subject));")
teacher=once(teacher,"set($('v90Continue'),lesson?'Continue: '+lesson.title:'Start a lesson');", "set($('v90Continue'),full?'Continue: '+full.title:lesson?'Continue: '+lesson.title:'Start a lesson');")
teacher=once(teacher,"set($('v90Saved'),lesson?'Saved your place in '+NAME[lesson.subject]+'.':'Choose any subject. You can read the whole lesson without answering a question.');", "set($('v90Saved'),full?'Saved your full-course reading place.':lesson?'Saved your place in '+NAME[lesson.subject]+'.':'Choose any subject. You can read the whole lesson without answering a question.');")
teacher=once(teacher,"b.onclick=()=>{d.close();open(b.dataset.teachSubject)}", "b.onclick=()=>{d.close();v110OpenSubject(b.dataset.teachSubject)}")
teacher=once(teacher,"<span>Start with: '+escape(DATA.find(x=>x.subject===s).title)", "<span>'+escape(v110SubjectBlurb(s))")
teacher=once(teacher,"event.stopImmediatePropagation();open(sub);return", "event.stopImmediatePropagation();v110OpenSubject(sub);return")
html=html[:match.start(2)]+teacher+html[match.end(2):]
html=once(html,"function subjectOpen(s){if(window.studyTableV97", "function subjectOpen(s){if(window.studyTableFullCourses?.courses.some(c=>c.subject===s)){window.studyTableFullCourses.open(s);return}if(window.studyTableV97")
import gzip,base64
archive=re.search(r'(<script id="full-bundle" type="text/plain">)(.*?)(</script>)',html,re.S)
bundle=json.loads(gzip.decompress(base64.b64decode(archive[2])))
full_meta={}
for subject,course in courses.items():
    path=COURSE_PATHS[subject];practice_path=None
    if subject in ['piano','spanish','chess']:
        practice_path=path.rsplit('/',1)[0]+'/practice-studio.html'
        assert practice_path not in bundle
        bundle[practice_path]=dict(bundle[path])
    bundle[path]={'t':render_course(course,course_demos)}
    full_meta[subject]={'subject':subject,'title':course['title'],'path':path,'units':len(course['units']),'unitIds':[u['id'] for u in course['units']],'practicePath':practice_path}
for entry in catalogue:
    for route in entry['routes']:
        if 'path' in route:assert route['path'].split('?')[0] in bundle,route['path']
encoded=base64.b64encode(gzip.compress(json.dumps(bundle,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
html=html[:archive.start(2)]+encoded+html[archive.end(2):]
html=once(html,"function apply(){\n  const portal=document.getElementById('v35Portal');if(!portal)return;", "function apply(){\n  if(window.studyTableTheme){window.studyTableTheme.sync();return}\n  const portal=document.getElementById('v35Portal');if(!portal)return;")
html=once(html,"btn.onclick=()=>{night=!night;try{localStorage.setItem(KEY,night?'1':'0')}catch{};apply()};", "btn.onclick=()=>{if(window.studyTableTheme){window.studyTableTheme.set(window.studyTableTheme.get()==='dark'?'light':'dark');return}night=!night;try{localStorage.setItem(KEY,night?'1':'0')}catch{};apply()};")
html=once(html,"function setTheme(v){\n document.documentElement.dataset.studyTheme=v;", "function setTheme(v){\n if(window.studyTableTheme){window.studyTableTheme.set(v);return}\n document.documentElement.dataset.studyTheme=v;")
html=html.replace('Study Table V108 — Taught Lessons','Study Table V110 — Full Courses')
html=html.replace('study-table-v108.html','study-table-v110.html').replace('Study_Table_V108.html','Study_Table_V110.html')
# Append after the historical layers so this palette has a single clear point of ownership.
end=html.rindex('</body>')
parent=(root/'full-course-parent.js').read_text().replace('__FULL_COURSES__',json.dumps(full_meta,separators=(',',':')))
html=html[:end]+'\n<style id="v109-theme">'+(root/'theme-v109.css').read_text()+'\n'+(root/'full-course-parent.css').read_text()+'</style><script>'+parent+'</script>\n'+html[end:]
(root/'Study_Table_V110.html').write_text(html)
(root/'teacher-v109.js').write_text(teacher)
(root/'demos-v109.json').write_text(json.dumps(demos,ensure_ascii=False,indent=2))
(root/'lessons-built-v109.json').write_text(json.dumps(lessons,ensure_ascii=False,indent=2))
(root/'full-courses-built.json').write_text(json.dumps(courses,ensure_ascii=False,indent=2))
(root/'course-map-built.json').write_text(json.dumps(catalogue,ensure_ascii=False,indent=2))
print('V110 built:',len(html.encode()),'bytes; 38 short lessons plus 52 full-course units in five courses; original practice studios preserved.')
