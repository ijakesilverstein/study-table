#!/usr/bin/env python3
"""Rebuild the complete offline Study Table V209 from GitHub-tracked chunks.

Usage:
    python3 scripts/build-v209.py
    python3 scripts/build-v209.py --check
    python3 scripts/build-v209.py --output dist/study-table-v209.html
"""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTS = ROOT / "source" / "v209-html-parts"
DEST = ROOT / "public" / "study-table-v209.html"
EXPECTED_PARTS = 22
EXPECTED_BYTES = 8_493_961
EXPECTED_SHA256 = "ae03425c213b187335b06a65f9d402cb72f3b57125917744ceab91689916b52c"


def assemble() -> bytes:
    paths = [PARTS / f"part-{n:03d}.txt" for n in range(EXPECTED_PARTS)]
    missing = [str(path) for path in paths if not path.is_file()]
    if missing:
        raise SystemExit(f"Missing V209 source parts: {missing}")
    data = b"".join(path.read_bytes() for path in paths)
    digest = hashlib.sha256(data).hexdigest()
    if len(data) != EXPECTED_BYTES or digest != EXPECTED_SHA256:
        raise SystemExit(
            "V209 integrity verification failed. "
            f"Got {len(data)} bytes, SHA-256 {digest}; "
            f"expected {EXPECTED_BYTES} bytes, SHA-256 {EXPECTED_SHA256}. "
            "Make sure all 22 chunks are unchanged and checked out with LF line endings."
        )
    for token in (b"st209-chapter-checks", b"st209-review-backup", b"st209-learning-style"):
        if token not in data:
            raise SystemExit(f"V209 is missing required module: {token.decode()}")
    return data


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify source chunks without writing output")
    parser.add_argument("--output", type=Path, default=DEST)
    args = parser.parse_args()
    data = assemble()
    if args.check:
        print(f"V209 source integrity OK: {len(data):,} bytes; SHA-256 {EXPECTED_SHA256}")
        return
    target = args.output if args.output.is_absolute() else Path.cwd() / args.output
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print(f"Built {target}: {len(data):,} bytes; SHA-256 {EXPECTED_SHA256}")


if __name__ == "__main__":
    main()
