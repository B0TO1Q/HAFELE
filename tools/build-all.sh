#!/bin/sh
# Rebuild generated pages, then point every photo at its WebP versions.
cd "$(dirname "$0")/.." || exit 1
python3 tools/build-blog.py && python3 tools/build-towns.py && python3 tools/build-404.py && python3 tools/optimize-images.py
