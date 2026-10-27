"""Prepare an online app plus downloadable HTML/ZIP editions; does not deploy."""
from pathlib import Path
import argparse,json,zipfile,shutil,hashlib,re,html
repo=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);args=parser.parse_args()
release=int(json.loads((repo/'package.json').read_text())['version'].split('.')[0])
root=Path(args.output).resolve();public=root/'public';public.mkdir(parents=True,exist_ok=True)
source=repo/'public'/f'study-table-v{release}.html';target=public/f'Study_Table_V{release}.html'
shutil.copyfile(source,target)
with zipfile.ZipFile(public/f'Study_Table_V{release}.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:archive.write(source,target.name)
app=public/'app';app.mkdir(exist_ok=True);shutil.copyfile(source,app/'index.html')
versions=sorted([int(re.fullmatch(r'Study_Table_V(\d+)\.html',p.name)[1]) for p in public.glob('Study_Table_V*.html')],reverse=True)
headers=[];rewrites=[]
for version in versions:
 for ext,kind in [('html','text/html; charset=utf-8'),('zip','application/zip')]:
  name=f'Study_Table_V{version}.{ext}'
  if not (public/name).exists():continue
  headers.append({'source':'/'+name,'headers':[{'key':'Content-Disposition','value':f'attachment; filename="{name}"'},{'key':'Content-Type','value':kind},{'key':'Cache-Control','value':'public, max-age=31536000, immutable'}]})
  if ext=='html':
   alias=f'/study-table-v{version}.html';rewrites.append({'source':alias,'destination':'/'+name});headers.append({'source':alias,'headers':[{'key':'Content-Disposition','value':f'attachment; filename="{name}"'},{'key':'Content-Type','value':kind}]})
headers.append({'source':'/app/(.*)','headers':[{'key':'Cache-Control','value':'public, max-age=0, must-revalidate'}]})
config={'version':2,'framework':None,'buildCommand':None,'installCommand':'','outputDirectory':'public','headers':headers,'rewrites':rewrites}
(root/'vercel.json').write_text(json.dumps(config,indent=2)+'\n')
previous=''.join(f'<li><a href="/Study_Table_V{v}.html" download>V{v} HTML</a></li>' for v in versions if v!=release)
(public/'index.html').write_text(f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Study Table — learn or download</title><style>*{{box-sizing:border-box}}body{{margin:55px auto;padding:0 24px 50px;max-width:720px;font:18px/1.8 system-ui;color:#242428;background:#f5f5f7}}h1{{font:400 42px/1.2 Georgia,serif}}p{{color:#53535d}}a{{color:inherit;text-underline-offset:4px}}.actions{{display:grid;gap:14px;margin:28px 0}}.actions a{{display:block;padding:16px 20px;border:1px solid #84848e;border-radius:9px;background:white;text-decoration:none;color:#242428}}.actions a:first-child{{background:#29292f;color:white;border-color:#29292f}}a:focus-visible{{outline:3px solid #7657bf;outline-offset:4px}}small{{font-size:15px}}</style><small>V{release} · latest edition</small><h1>Study Table</h1><p>Open the lessons here, or save the complete HTML for use in your browser. Maths and physics worked examples now connect each calculation step to a diagram. Teacher workshops show how to repair a piano passage, build Spanish replies and compare chess moves. The full courses, worked projects and maths help are included.</p><div class="actions"><a href="/app/">Open Study Table</a><a href="/Study_Table_V{release}.html" download="Study_Table_V{release}.html">Download the HTML · {target.stat().st_size/1024/1024:.1f} MB</a><a href="/Study_Table_V{release}.zip" download="Study_Table_V{release}.zip">Download a ZIP instead</a></div><p>For the HTML, save the file and open it in a browser. For the ZIP, extract the HTML first. Your saved learning stays in the browser where you used it; it does not automatically move between devices or downloaded editions.</p>{('<details><summary>Earlier editions</summary><ul>'+previous+'</ul></details>') if previous else ''}</html>''')
(root/'.vercelignore').write_text('*\n!public\n!public/**\n!vercel.json\n')
manifest={'version':release,'html_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'app_matches_html':(app/'index.html').read_bytes()==source.read_bytes(),'versions':versions,'html_bytes':target.stat().st_size,'zip_bytes':(public/f'Study_Table_V{release}.zip').stat().st_size}
with zipfile.ZipFile(public/f'Study_Table_V{release}.zip') as archive:assert archive.read(target.name)==source.read_bytes()
(root/'release-info.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest))
