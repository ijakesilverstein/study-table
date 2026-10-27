"""Portable backups change the shell, preserving every V123 teaching asset."""
from pathlib import Path
import base64,gzip,json,re
root=Path(__file__).resolve().parents[1]
def unpack(path):
    return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',path.read_text(),re.S)[1])))
previous=unpack(root/'public/study-table-v123.html')
current=unpack(root/'public/study-table-v124.html')
assert len(current)==215 and current==previous,'V124 changed an embedded V123 asset'
html=(root/'public/index.html').read_text()
assert 'window.studyTableBackup={version:APP_VERSION' in html
assert '__QUICK_LESSONS__' not in html
assert 'Back up or restore' in html and 'v124BackupDialog' in html
edition=json.loads((root/'package.json').read_text())['version'].split('.')[0]
assert (root/'public/index.html').read_bytes()==(root/f'public/study-table-v{edition}.html').read_bytes()
assert '__APP_VERSION__' not in html
print('PORTABLE_BACKUP_SOURCE_PASS: V124 retains every V123 asset; current backup shell is included and current download matches.')
