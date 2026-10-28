from pathlib import Path
import sys,subprocess,re,html

repo=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(repo/'source/build-v109.py')],check=True)
app=(repo/'source/Study_Table_V127.html').read_bytes()
plan=(repo/'docs/LESSON_QUALITY_PLAN.md').read_text()
blocks=[]
for block in plan.split('\n\n'):
    if not block.strip():continue
    match=re.match(r'^(#{1,3}) (.+)$',block)
    if match:blocks.append(f'<h{len(match[1])}>{html.escape(match[2])}</h{len(match[1])}>')
    else:blocks.append('<p>'+html.escape(block).replace('\n','<br>')+'</p>')
page='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Study Table — Lesson quality plan</title><style>body{background:#f5f5f7;color:#242428;font:17px/1.8 system-ui}main{max-width:850px;margin:auto;padding:35px 22px 80px}h1,h2,h3{font-family:Georgia,serif;line-height:1.3}h2{margin-top:40px}a{color:#242428}</style><main><a href="/">← Study Table</a><p>Current release: V127. Optional step-by-step walkthroughs accompany the complete solutions in all seven courses. Eight further lessons explain hand coordination, rests, Spanish phrases and past events, chess exchanges and castling, the product rule and energy accounting. Nine reference tables and selectable piano count-ins, beat clicks, slower playback and written timing support the teaching. All earlier content and portable progress backups remain.</p>'+''.join(blocks)+'</main></html>'
files={'index.html':app,'study-table-v127.html':app,'quality-plan.html':page.encode()}
check='--check' in sys.argv
for name,data in files.items():
    path=repo/'public'/name
    if check:
        if not path.exists() or path.read_bytes()!=data:raise SystemExit('Rebuild and commit generated file: public/'+name)
    else:path.parent.mkdir(exist_ok=True);path.write_bytes(data)
print('Generated files match source.' if check else 'Built public site and downloadable HTML.')
