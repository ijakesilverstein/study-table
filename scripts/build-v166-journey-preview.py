#!/usr/bin/env python3
"""Optional V166 build from canonical-derived V165; no deployment or production mutation."""
from pathlib import Path
import base64,gzip,json,re,sys
repo=Path(__file__).resolve().parents[1]
root=repo/'source'
base_path=repo/'Study_Table_V165_Reconciled_Stories_And_Practice.html'
if not base_path.exists():
    base_path=root/'Study_Table_V165.html'
base=base_path.read_text()
extras=json.loads((root/'v166-extra-transfer.json').read_text())
assert set(extras)=={'castling','physics-2','test-interpretation'}
assert sum(len(row['variants']) for row in extras.values())==6
for unit,row in extras.items():
    assert len(row['variants'])==2
    for var in row['variants']:
        assert 'why' in var and 'hint' in var and var['kind'] in ('number','choice')
        if var['kind']=='choice':assert var['answer'] in var['options'] and len(var['options'])==3
reader_js=(root/'v166-journey.js').read_text()
reader_css=(root/'v166-journey.css').read_text()
archive=re.search(r'(<script id="full-bundle" type="text/plain">)(.*?)(</script>)',base,re.S)
assert archive, 'Expected compressed archived site bundle'
bundle=json.loads(gzip.decompress(base64.b64decode(archive.group(2))))
assert len(bundle)==215
previous={k:v for k,v in bundle.items()}
paths={'spanish':'v15/spanish-for-someone/complete-practice-v40/index.html','piano':'v15/rockjam-piano-studio/index.html','chess':'v15/chess-from-zero/index.html','calculus':'curricula/calculus.html','physics':'curricula/physics.html','medicine':'curricula/medicine.html','business':'curricula/business.html'}

def once(s,old,new):
    count=s.count(old)
    assert count==1,(old[:120],count)
    return s.replace(old,new,1)
for subject,path in paths.items():
    page=bundle[path]['t']
    page=once(page,'</style>',reader_css+'</style>')
    m=re.search(r'(const V133_BANK=)(.*?)(;\s*const V133_STORE=)',page,re.S)
    assert m,'authored bank missing from '+subject
    bank=json.loads(m.group(2))
    for unit,row in extras.items():
        if row['subject']==subject:
            assert unit not in bank,'Original authored bank must remain intact'
            bank[unit]=row
    page=page[:m.start(2)]+json.dumps(bank,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+page[m.end(2):]
    # Story map stays behind its existing optional disclosure.
    page=once(page,
        "+v134StoryMarkup()+'</details><ol id=\"courseOutline\">'",
        "+v134StoryMarkup()+v166SpanishRealMarkup()+'</details><ol id=\"courseOutline\">'")
    page=once(page,
        "+v133LessonMarkup(unit)+'<footer class=\"course-footer\">'",
        "+v133LessonMarkup(unit)+v166UnitNext(unit)+'<footer class=\"course-footer\">'")
    page=once(page,
        "'<div class=\"v134-nextrow\"><button type=\"button\" data-v134-replay>Play again</button><button type=\"button\" data-v134-lesson>See the real lesson</button></div></div></section>';",
        "'<div class=\"v134-nextrow\"><button type=\"button\" data-v134-replay>Play again</button><button type=\"button\" data-v134-lesson>See the real lesson</button><button type=\"button\" data-v166-try>Try a fresh problem</button>'+(COURSE.subject==='spanish'?'<button type=\"button\" data-v166-real>Try this with a real person</button>':'')+'</div></div></section>';")
    page=once(page,
        "const route=()=>{let id='';try{id=decodeURIComponent(location.hash.slice(1))}catch{}if(resolveUnit(id))showUnit(id);else showMap()};",
        "const route=()=>{let id='';try{id=decodeURIComponent(location.hash.slice(1))}catch{}if(id==='story')v166StoryOpen();else if(id==='practice')v166PracticeStart();else if(resolveUnit(id))showUnit(id);else showMap()};")
    page=once(page,'window.studyTableFullCourse={subject:COURSE.subject',reader_js+'\nwindow.studyTableFullCourse={subject:COURSE.subject')
    assert page.count('v166SpanishRealMarkup')==2
    assert page.count('window.studyTableJourneyV166=')==1
    bundle[path]={'t':page}
for path in bundle:
    if path not in paths.values():assert bundle[path]==previous[path],f'Unrelated archive changed: {path}'
assert len([p for p in bundle if bundle[p]!=previous[p]])==7
payload=json.dumps(bundle,ensure_ascii=False,separators=(',',':')).encode()
encoded=base64.b64encode(gzip.compress(payload,mtime=0)).decode('ascii')
html=base[:archive.start(2)]+encoded+base[archive.end(2):]
focus=re.search(r'(<script id="st163-reconciled-script">)(.*?)(</script>)',html,re.S)
assert focus
js=focus.group(2)
anchor="'<div class=\"st160-nav\"><button type=\"button\" class=\"st160-primary\" data-st160=\"lesson\">'"
new="'<div class=\"st160-nav\">'+(['spanish','piano','chess','calculus','physics','medicine','business'].includes(state.subject)?'<button type=\"button\" class=\"st160-primary\" data-st160=\"story\">Try a three-decision story →</button>':'')+'<button type=\"button\" class=\"st160-secondary\" data-st160=\"lesson\">'"
js=once(js,anchor,new)
js=once(js,'function experiment(){',
 '''function story(){
 const course=window.studyTableFullCourses?.courses?.find(c=>c.subject===state.subject);
 close();if(!course){lesson();return}
 window.studyTableStepCoach?.close();window.studyTableV97?.close();
 if(typeof v35Close==='function')v35Close();
 // Reuse the existing in-app offline router; no external page or remote API.
 if(typeof go==='function')go(course.path+'#story');else window.studyTableFullCourses.open(state.subject);
}
function experiment(){''')
js=once(js,"if(action==='lesson')lesson();","if(action==='story')story();if(action==='lesson')lesson();")
js=js.replace('Study Table V165 — Stories and Real Practice','Study Table V166 — One Learning Journey').replace('Study Table V163 — Reconciled Teaching','Study Table V166 — One Learning Journey')
html=html[:focus.start(2)]+js+html[focus.end(2):]
html=html.replace('Study Table V165 — Stories and Real Practice','Study Table V166 — One Learning Journey')
html=html.replace('Study Table V163 — Reconciled Teaching','Study Table V166 — One Learning Journey')
assert html.count('<script id="st163-reconciled-script">')==1
check='--check' in sys.argv
for target in [root/'Study_Table_V166_Journey.html',repo/'Study_Table_V166_Learning_Journey.html']:
    if check:
        if not target.is_file() or target.read_text()!=html:raise SystemExit('V166 generated output differs: '+str(target))
    else:target.write_text(html)
print(('V166 source parity checked' if check else 'V166 generated')+f': {len(html.encode()):,} bytes; 215 archive pages, 7 course changes, 48 checked problems')
