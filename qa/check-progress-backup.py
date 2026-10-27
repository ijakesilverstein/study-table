"""Portable backups change the shell, preserving every V123 teaching asset."""
from pathlib import Path
import base64,gzip,json,re
root=Path(__file__).resolve().parents[1]
def unpack(path):
    return json.loads(gzip.decompress(base64.b64decode(re.search(r'<script id="full-bundle" type="text/plain">(.*?)</script>',path.read_text(),re.S)[1])))
previous=unpack(root/'public/study-table-v123.html')
current=unpack(root/'public/index.html')
assert len(current)==215 and current==previous,'V124 changed an embedded V123 asset'
html=(root/'public/index.html').read_text()
assert 'window.studyTableBackup={version:124' in html
assert '__QUICK_LESSONS__' not in html
assert 'Back up or restore' in html and 'v124BackupDialog' in html
assert (root/'public/index.html').read_bytes()==(root/'public/study-table-v124.html').read_bytes()
assert json.loads((root/'package.json').read_text())['version']=='124.0.0'
print('PORTABLE_BACKUP_SOURCE_PASS: every one of 215 V123 embedded assets is unchanged; V124 shell and download match.')
