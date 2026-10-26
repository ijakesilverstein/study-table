"""Local delivery check for the static download package; no external requests."""
import http.server,json,sys,urllib.parse
from pathlib import Path
root=Path(sys.argv[1]);config=json.loads((root/'vercel.json').read_text())
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(root/'public'),**kw)
 def do_GET(self):
  self.original_path=urllib.parse.urlsplit(self.path).path
  for rule in config.get('rewrites',[]):
   if rule['source']==self.original_path:self.path=rule['destination'];break
  super().do_GET()
 def end_headers(self):
  source=getattr(self,'original_path',urllib.parse.urlsplit(self.path).path)
  for rule in config['headers']:
   if source==rule['source'] or rule['source']=='/app/(.*)' and source.startswith('/app/'):
    for h in rule['headers']:
     if h['key'].lower()!='content-type':self.send_header(h['key'],h['value'])
  super().end_headers()
 def log_message(self,*args):pass
http.server.ThreadingHTTPServer(('127.0.0.1',int(sys.argv[2])),Handler).serve_forever()
