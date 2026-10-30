#!/usr/bin/env python3
"""Build the tested V168 learning experience as the website homepage.

Keep V136 archived and downloadable; publish V168 only after the full
V136 -> V168 source chain and source-level consistency checks succeed.
"""
from pathlib import Path
import shutil
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
for name in ("build.py", "build-v163.py", "build-v164.py", "build-v165.py",
             "build-v166.py", "build-v167.py", "build-v168.py"):
    subprocess.run([sys.executable, str(root / "scripts" / name)], cwd=root, check=True)
subprocess.run([sys.executable, str(root / "qa" / "check-v168.py")],
               cwd=root, check=True)
candidate = root / "public" / "study-table-v168.html"
data = candidate.read_bytes()
if not all(term in data for term in (b"Study Table V168", b'full-bundle', b'st163-reconciled-script')):
    raise SystemExit("Refusing to publish an unverified or incomplete V168 HTML")
for destination in (root / "public" / "index.html", root / "public" / "study-table-latest.html"):
    shutil.copyfile(candidate, destination)
assert all((root / "public" / name).read_bytes() == data
           for name in ("index.html", "study-table-latest.html"))
print(f"Release V168 ready: {len(data):,} bytes, same verified HTML at / and /study-table-latest.html")
