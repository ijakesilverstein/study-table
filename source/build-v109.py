from pathlib import Path
import json,re
from demos_v109 import build_demos

root=Path(__file__).resolve().parent
html=(root/'Study_Table_V108.html').read_text()
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
teacher=once(teacher,"escape(x.description)+'</p><div>'+", "escape(x.description)+'</p>'+(['piano','spanish','chess'].includes(x.subject)?'<button type=\"button\" class=\"v109-taught-path\" data-teaching-path=\"'+x.subject+'\">Start the '+DATA.filter(l=>l.subject===x.subject).length+'-lesson taught sequence</button>':'')+'<div>'+" )
teacher=once(teacher,'STUDY TABLE · FIRST STEPS','STUDY TABLE · LESSONS')
html=html[:match.start(2)]+teacher+html[match.end(2):]
html=html.replace('Study Table V108 — Taught Lessons','Study Table V109 — Learn at Your Pace')
html=html.replace('study-table-v108.html','study-table-v109.html').replace('Study_Table_V108.html','Study_Table_V109.html')
# Append after the historical layers so this palette has a single clear point of ownership.
end=html.rindex('</body>')
html=html[:end]+'\n<style id="v109-theme">'+(root/'theme-v109.css').read_text()+'\nhtml #v97Study .v105-board .dark{background:#99a9c0}html #v97Study .v105-board .light{background:#f1ece1}</style>\n'+html[end:]
(root/'Study_Table_V109.html').write_text(html)
(root/'teacher-v109.js').write_text(teacher)
(root/'demos-v109.json').write_text(json.dumps(demos,ensure_ascii=False,indent=2))
(root/'lessons-built-v109.json').write_text(json.dumps(lessons,ensure_ascii=False,indent=2))
print('V109 built:',len(html.encode()),'bytes; 38 lessons; Spanish 8, piano 7, chess 6; 76 worked cases;',len(prose),'existing explanations rewritten; 12 new demonstrations.')
