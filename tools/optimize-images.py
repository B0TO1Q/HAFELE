"""Makes WebP versions of the site photos and points every <img> at them.

  python3 tools/optimize-images.py

- assets/img/NAME.jpg  ->  assets/img/w/NAME-800.webp, -1200.webp, -1800.webp
  (only sizes up to the original's width). The .jpg originals stay, for
  share previews, schema and email.
- Every <img src="(/)assets/img/NAME.jpg"> in the site's .html files gets a
  WebP src + srcset + sizes, so phones download a small file.
Safe to run again: images already done are skipped, tags already done too.
"""
import glob, os, re
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(REPO, 'assets', 'img')
OUT = os.path.join(IMG, 'w')
WIDTHS = [800, 1200]          # cards and figures
HERO_WIDTHS = [800, 1200, 1800]  # the full-width homepage photo
HERO = {'hero'}
SKIP = {'og.jpg'}
os.makedirs(OUT, exist_ok=True)

variants = {}
for path in sorted(glob.glob(os.path.join(IMG, '*.jpg'))):
    name = os.path.basename(path)
    if name in SKIP:
        continue
    stem = name[:-4]
    im = Image.open(path).convert('RGB')
    W, H = im.size
    ws = [w for w in (HERO_WIDTHS if stem in HERO else WIDTHS) if w <= W] or [W]
    done = []
    for w in ws:
        out = os.path.join(OUT, f'{stem}-{w}.webp')
        if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(path):
            im.resize((w, round(H * w / W)), Image.LANCZOS).save(out, 'WEBP', quality=60, method=6)
        done.append(w)
    variants[stem] = (done, W, H)

BIG = re.compile(r'class="(?:post-figure|town-figure|svc-row-media|about-media)')
TAG = re.compile(r'<img\b([^>]*?)\bsrc="(/?)assets/img/([a-z0-9-]+)\.jpg(?:\?v=\d+)?"([^>]*)>')

def sizes_for(before, attrs):
    if 'hero-img' in attrs:
        return '100vw'
    if BIG.search(before[-160:]):
        return '(max-width: 1000px) 100vw, 900px'
    return '(max-width: 720px) 100vw, (max-width: 1000px) 50vw, 420px'

def rewrite(html):
    out, last = [], 0
    for m in TAG.finditer(html):
        a1, pre, stem, a2 = m.groups()
        if stem not in variants or 'srcset=' in m.group(0):
            continue
        ws, W, H = variants[stem]
        base = f'{pre}assets/img/w/{stem}'
        srcset = ', '.join(f'{base}-{w}.webp {w}w' for w in ws)
        mid = 1200 if 1200 in ws else ws[-1]
        attrs = (a1 + a2).strip()
        extra = ' decoding="async"' if 'decoding=' not in attrs else ''
        dims = f' width="{W}" height="{H}"' if 'width=' not in attrs else ''
        tag = f'<img {a1.strip()} src="{base}-{mid}.webp" srcset="{srcset}" sizes="{sizes_for(html[:m.start()], attrs)}"{dims}{extra} {a2.strip()}>'
        tag = re.sub(r'\s+>', '>', re.sub(r' {2,}', ' ', tag)).replace('<img  ', '<img ')
        out.append(html[last:m.start()]); out.append(tag); last = m.end()
    out.append(html[last:])
    return ''.join(out)

count = 0
for f in glob.glob(os.path.join(REPO, '**', '*.html'), recursive=True):
    if '/.git/' in f or '/tools/' in f:
        continue
    s = open(f).read()
    t = rewrite(s)
    if t != s:
        open(f, 'w').write(t); count += 1
print(f'{len(variants)} photos, {count} pages updated')

# keep script.js's WebP size map (used by the homepage service cards) in step
import json
sj = os.path.join(REPO, 'script.js')
s = open(sj).read()
m = json.dumps({k: v[0] for k, v in sorted(variants.items())}, separators=(',', ':'))
s2 = re.sub(r'/\* WEBP-SIZES \*/.*?/\* /WEBP-SIZES \*/', '/* WEBP-SIZES */ var WEBP = ' + m + '; /* /WEBP-SIZES */', s, flags=re.S)
if s2 != s:
    open(sj, 'w').write(s2)
