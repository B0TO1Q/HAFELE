"""Builds /service-areas/ (hub + one page per featured town).
Run: python3 tools/build-towns.py  (from the repo root)"""
import html, json, os, re, markdown

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://hafelelandscaping.com'
VER = re.search(r'styles\.css\?v=([0-9a-z]+)', open(os.path.join(REPO, 'index.html')).read()).group(1)
ALL_TOWNS = ["Avon", "Bristol", "Burlington", "Canton", "Collinsville", "Farmington", "Harwinton", "Litchfield",
             "New Hartford", "Northfield", "Plymouth", "Terryville", "Thomaston", "Torrington", "Unionville"]
e = html.escape

TOWNS = [
dict(
 name='Burlington', slug='burlington-ct', county='Hartford County', img='hero.jpg',
 alt='Freshly striped front lawn at a home in the Burlington area',
 near=['Canton', 'Farmington', 'Harwinton', 'Bristol'],
 areas='Whigville, the Lake Garda area, the roads around Nassahegon State Forest and Session Woods, and neighborhoods along Routes 4 and 69',
 intro='Burlington is home. Hafele Landscaping & Snow Removal is based here, so Burlington properties are the heart of our route, not an add-on at the edge of it.',
 local='''## Burlington properties take real care

Burlington is hilly and wooded, with a lot of homes set back on long driveways and big lots carved out of the forest. That shapes the work:

- **Shade and leaf drop.** Tall oaks and maples mean thinner grass under the canopy and heavy leaf loads every fall. Cleanups here are bigger jobs than in a cleared suburb.
- **Slopes.** Many yards roll downhill toward the road or the woods. Mowing them evenly, and seeding them without washout, takes the right equipment. Hydroseeding holds on these grades far better than dry seed.
- **Long, steep driveways.** Winter is the real test in Burlington. A driveway that climbs from the road needs to be cleared early and cleared fully, or nobody gets out.''',
 seasons='Snow comes early and stays late at Burlington\u2019s elevation, so whole-season plowing is the plan most of our Burlington customers choose. In fall, leaf cleanup and gutter cleaning go hand in hand: the same trees that shade the lawn fill the gutters.',
 faq=[
  ('Is Hafele really based in Burlington?', 'Yes. Hafele Landscaping & Snow Removal is a Burlington company, and Burlington driveways and lawns are at the center of our route.'),
  ('Can you plow a long or steep driveway in Burlington?', 'Yes. Long, climbing driveways are common in Burlington and they’re a normal part of our winter route. Send a photo with your estimate request so we can see the length and grade.'),
  ('Do you seed shady or sloped lawns?', 'Yes. We seed and hydroseed lawns on slopes and in shade. Hydroseeding is usually the better choice on a grade because the mulch holds the seed in place.'),
 ]),
dict(
 name='Avon', slug='avon-ct', county='Hartford County', img='work-01.jpg',
 alt='Well-kept lawn and landscaping at a home in the Avon area',
 near=['Farmington', 'Canton', 'Burlington', 'Unionville'],
 areas='West Avon, the neighborhoods off Route 44 and Route 10, the homes climbing toward Avon Mountain and Talcott Mountain, and the area around Avon Old Farms',
 intro='Avon homeowners expect a property that looks finished every single week. That’s exactly the standard Hafele is built around: precise mowing, crisp edges and a crew that shows up without being chased.',
 local='''## What Avon lawns and landscapes need

Avon runs from the Farmington River valley up the slopes of Avon and Talcott mountains, so properties vary a lot from one street to the next:

- **Showpiece front lawns.** Many Avon homes have large, open front yards where every stripe and edge is on display. Weekly mowing with clean striping keeps them looking sharp all season.
- **Landscaped beds.** Mature plantings and long bed lines need regular edging and upkeep to keep their shape.
- **Hillside properties.** Homes up the mountain slopes deal with grades, runoff and more snow than the valley floor.''',
 seasons='Spring cleanups in Avon focus on getting beds and edges sharp before the season starts. In winter, our route covers both the valley neighborhoods and the hillside homes, where a clear driveway matters most.',
 faq=[
  ('Do you offer weekly mowing in Avon?', 'Yes. We offer weekly and every-two-week mowing in Avon, finished with trimmed edges and clean stripes. There’s no day to pick: your property joins our standing route.'),
  ('Do you plow driveways on Avon Mountain?', 'Yes. Hillside driveways are part of our winter route. Request an estimate with a photo of your driveway and we’ll confirm.'),
  ('Do you handle landscape bed maintenance?', 'Yes. Grounds maintenance includes bed care, edging and clearing leaves, branches and storm debris, so the whole property looks kept, not just the lawn.'),
 ]),
dict(
 name='Farmington', slug='farmington-ct', county='Hartford County', img='work-06.jpg',
 alt='Striped lawn framed by fall trees',
 near=['Avon', 'Unionville', 'Burlington', 'Bristol'],
 areas='Farmington village, Unionville, the neighborhoods along Route 4 and Route 10, and the homes along the Farmington River and up toward Rattlesnake and Talcott mountains',
 intro='From historic homes in Farmington village to newer neighborhoods in Unionville, Farmington properties deserve care that matches the town’s character. Hafele brings the same precision to every one.',
 local='''## Caring for Farmington properties

Farmington mixes old and new in a way few towns do, and each kind of property asks for something different:

- **Historic village homes.** Older properties in Farmington village often have mature trees, stone walls and established beds. Careful trimming and edging around them matters as much as the mowing.
- **River-valley lawns.** Low ground near the Farmington River tends to stay wet longer in spring. We wait until the ground can take equipment, so the lawn doesn’t get rutted.
- **Newer subdivisions.** Lawns built on compacted construction soil often come in thin. Aeration and overseeding in late summer is usually the fix.''',
 seasons='Fall is big in Farmington: leaf cleanups, gutter cleaning, and aeration and overseeding between mid-August and mid-September. In winter, we plow driveways from the village out to the hills.',
 faq=[
  ('Do you serve Unionville as well as Farmington village?', 'Yes. We serve all of Farmington, including Unionville and Farmington village.'),
  ('My lawn in a newer Farmington neighborhood is thin. What helps?', 'Lawns built on compacted construction soil usually do best with aeration and overseeding in late summer, when UConn recommends seeding in Connecticut. Send photos with your estimate request.'),
  ('Do you clean gutters in Farmington?', 'Yes. Gutter clearing is one of our services, and it’s worth doing after the leaves are down each fall.'),
 ]),
dict(
 name='Canton', slug='canton-ct', county='Hartford County', img='backyard-hillside.jpg',
 alt='Long striped backyard lawn climbing toward a house',
 near=['Collinsville', 'Burlington', 'Avon', 'New Hartford'],
 areas='Collinsville, Canton Center, North Canton, and the neighborhoods along Routes 44, 179 and 202',
 intro='Canton sits right next door to our Burlington base, from the village of Collinsville to the quieter roads of Canton Center and North Canton. Hafele keeps Canton lawns sharp all season and Canton driveways clear all winter.',
 local='''## Canton yards, from the river to the ridges

Canton runs from the Farmington River in Collinsville up into wooded hills, so properties vary a lot:

- **Village lots in Collinsville.** Smaller, closer yards where tidy edges and clean beds make the biggest difference.
- **Large country lots.** Out toward Canton Center and North Canton, bigger lawns and wooded edges mean longer mowing days and heavy fall leaf cleanup.
- **Rolling ground.** Sloped yards benefit from hydroseeding over dry seed when it’s time to renovate.''',
 seasons='Because Canton borders Burlington, Canton driveways sit right on our winter route. Whole-season plowing means we arrive when it snows, with no call needed.',
 faq=[
  ('Do you serve Collinsville?', 'Yes. Collinsville is part of Canton and part of our regular route for mowing, cleanups and snow removal.'),
  ('Do you offer whole-season snow plowing in Canton?', 'Yes. We offer both whole-season and per-storm snow removal in Canton. Seasonal customers don’t need to call when it snows.'),
  ('Can you handle a large property out in North Canton?', 'Yes. Larger lots are a regular part of our work. Send a few photos with your estimate request so we can see the size and layout.'),
 ]),
dict(
 name='Torrington', slug='torrington-ct', county='Litchfield County', img='snow-plowing.jpg',
 alt='Hafele plow truck clearing a snowy driveway',
 near=['Harwinton', 'Litchfield', 'New Hartford', 'Thomaston'],
 areas='Torringford, Burrville and Drakeville, the neighborhoods around downtown, and the homes on the hills on both sides of the Naugatuck River valley',
 intro='Torrington is the largest community in our Litchfield County service area, and its hills and winters ask a lot of a lawn and a driveway. Hafele serves homeowners across Torrington from spring cleanup through the last storm of winter.',
 local='''## What Torrington properties need

Torrington’s downtown sits in the Naugatuck River valley, with neighborhoods climbing the hills on both sides. That terrain shapes everything:

- **Hillside driveways.** Getting up and down a Torrington hill in a storm depends on a driveway that’s cleared early and fully.
- **Sloped lawns.** Many yards are on a grade. Even mowing and seeding that holds take experience on hills.
- **Litchfield Hills winters.** Higher ground in northwest Connecticut tends to see more snow and ice than towns closer to Hartford, so a reliable plow plan matters here more than most places.''',
 seasons='Winter is where we earn our keep in Torrington. Whole-season plowing keeps you on the route automatically. In spring, cleanups clear out plow damage, sand and matted leaves before the first mow.',
 faq=[
  ('Do you plow driveways in Torrington?', 'Yes. We offer whole-season and per-storm snow removal in Torrington, including hillside driveways. Seasonal customers are plowed automatically when it snows.'),
  ('Do you serve Torringford and Burrville?', 'Yes. We serve neighborhoods across Torrington, including Torringford, Burrville and Drakeville.'),
  ('Can you repair plow damage to my lawn in spring?', 'Yes. Spring cleanups include clearing sand and gravel from the lawn edge, leveling ruts and seeding spots damaged over the winter.'),
 ]),
]

SVCS = [('Lawn & Turf Care', 'mow', 'mowing', 'Weekly or every-two-week mowing, trimming and edging, finished with crisp stripes.'),
        ('Grounds Maintenance', 'maint', 'maintenance', 'Bed care, edging, and leaves, branches and storm debris cleared.'),
        ('Spring & Fall Cleanups', 'maint', 'maintenance', 'Seasonal cleanups that get the property ready for what’s next.'),
        ('Lawn Renovation', 'seed', 'seeding', 'Aeration, overseeding, seeding and hydroseeding.'),
        ('Gutter & Exterior Care', 'gutter', 'gutters', 'Gutters cleared and siding washed to protect your home.'),
        ('Snow Removal', 'snow', 'snow', 'Whole-season or per-storm. On our route, we arrive when it snows.'),
        ('Four-Season Care', 'care', 'care', 'One annual agreement covering the property all year.')]

def head(title, desc, url, ld, current='areas'):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Hafele Landscaping &amp; Snow Removal">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/img/og.jpg?v=1">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v={VER}">
<link rel="icon" type="image/png" href="/assets/logo/favicon.png">
<meta name="theme-color" content="#1D3326">
{''.join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False) + '</script>' + chr(10) for x in ld)}</head>
<body>

<header class="topbar">
  <div class="wrap topbar-in">
    <a href="/" class="brand" aria-label="Hafele Landscaping &amp; Snow Removal LLC — home">
      <img class="brand-emblem" src="/assets/logo/emblem-green.png" alt="">
      <img class="brand-word" src="/assets/logo/wordmark-green.png" alt="">
    </a>
    <nav aria-label="Main" class="nav">
      <a class="dnav dnav-sec" href="/">Home</a>
      <a class="dnav dnav-sec" href="/services.html">Services</a>
      <a class="dnav dnav-sec" href="/about.html">About</a>
      <a class="dnav dnav-sec" href="/blog/">Blog</a>
      <a class="dnav dnav-phone" href="tel:+12035606079">(203) 560-6079</a>
      <details class="mnav">
        <summary aria-label="Menu">Menu</summary>
        <div class="mnav-panel">
          <a href="/">Home</a>
          <a href="/services.html">Services</a>
          <a href="/about.html">About &amp; Contact</a>
          <a href="/blog/">Blog</a>
          <a href="/#book">Request an Estimate</a>
        </div>
      </details>
      <a class="btn btn-solid nav-quote" href="/#book">Request an Estimate</a>
    </nav>
  </div>
</header>

<main>
'''

def foot(title='Your Property, in Good Hands.'):
    return f'''
<section class="cta">
  <div class="wrap cta-in">
    <h2 class="cta-title">{e(title)}</h2>
    <div class="cta-actions">
      <a class="btn btn-gold" href="/#book">Request an Estimate</a>
      <a class="btn btn-line-light" href="sms:+12035606079">Text (203) 560-6079</a>
    </div>
  </div>
</section>

</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <img class="footer-logo" src="/assets/logo/lockup-gold.png" alt="Hafele Landscaping &amp; Snow Removal LLC">
      <div class="fcol">
        <span class="fh">Contact</span>
        <a href="tel:+12035606079">(203) 560-6079</a>
        <a href="mailto:hafelelandscapingllc@gmail.com">hafelelandscapingllc@gmail.com</a>
        <span>Calls &amp; texts, 24 hours</span>
      </div>
      <div class="fcol">
        <span class="fh">Payment</span>
        <span>Check, Apple Pay, PayPal, Venmo, Cash App, Jobber or cash</span>
      </div>
    </div>
    <div class="footer-base">
      <span>© 2026 Hafele Landscaping &amp; Snow Removal LLC</span>
      <span><a href="/service-areas/">Service Areas</a> · <a href="/blog/">Blog</a> · Licensed &amp; Insured · BBB Accredited</span>
    </div>
  </div>
</footer>

<div class="mbar">
  <a href="tel:+12035606079">Call</a>
  <a href="sms:+12035606079">Text</a>
  <a class="mbar-book" href="/#book">Get an Estimate</a>
</div>

<script src="/script.js?v={VER}"></script>
<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{{"token": "6eabc4d03504421d9767bbcb174fd07f"}}'></script><!-- End Cloudflare Web Analytics -->
</body>
</html>
'''

BUSINESS = {"@type": "LandscapingBusiness", "@id": SITE + "/#business", "name": "Hafele Landscaping & Snow Removal LLC",
            "url": SITE + "/", "telephone": "+1-203-560-6079", "image": SITE + "/assets/img/hero.jpg"}
bySlug = {t['name']: t for t in TOWNS}
base = os.path.join(REPO, 'service-areas'); os.makedirs(base, exist_ok=True)

for t in TOWNS:
    url = f'{SITE}/service-areas/{t["slug"]}/'
    n = t['name']
    title = f'Lawn Care & Snow Removal in {n}, CT | Hafele'
    desc = f'Licensed, insured lawn care, cleanups, seeding and snow removal in {n}, CT. Weekly mowing and whole-season plowing. A personal reply within 24 hours.'
    ld = [
      {"@context": "https://schema.org", "@type": "Service", "name": f"Lawn care and snow removal in {n}, CT",
       "serviceType": ["Lawn care", "Landscape maintenance", "Snow removal", "Hydroseeding", "Gutter cleaning"],
       "provider": BUSINESS, "areaServed": {"@type": "City", "name": f"{n}, CT", "containedInPlace": {"@type": "AdministrativeArea", "name": f"{t['county']}, Connecticut"}}, "url": url},
      {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in t['faq']]},
      {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "Service Areas", "item": SITE + "/service-areas/"},
        {"@type": "ListItem", "position": 3, "name": f"{n}, CT", "item": url}]}]
    svc = ''.join(f'<li><a href="/?service={k}#book"><span class="ts-name">{e(s)}</span><span class="ts-desc">{e(d)}</span></a></li>' for s, k, a, d in SVCS)
    near = ', '.join(f'<a href="/service-areas/{bySlug[x]["slug"]}/">{e(x)}</a>' if x in bySlug else f'<span>{e(x)}</span>' for x in t['near'])
    faq = ''.join(f'<details class="faq-item"><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in t['faq'])
    page = head(title, desc, url, ld) + f'''
<section class="page-head">
  <div class="wrap page-head-in">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/service-areas/">Service Areas</a><span aria-hidden="true">/</span><span>{e(t["county"])}</span></nav>
      <h1 class="page-title"><span class="phr">Lawn Care &amp; Snow Removal</span> <span class="phr">in {e(n)}, CT.</span></h1>
      <p class="hero-trust town-trust"><span>Licensed &amp; Insured</span><span>BBB Accredited</span><span>5.0 on Google</span></p>
    </div>
    <a class="btn btn-gold" href="/#book">Request an Estimate</a>
  </div>
</section>

<section class="section town">
  <div class="wrap town-grid">
    <div class="prose town-prose">
      <p class="town-intro">{e(t["intro"])}</p>
      <figure class="town-figure"><img src="/assets/img/{t["img"]}" alt="{e(t["alt"])}"></figure>
{markdown.markdown(t["local"])}
      <h2>Through the seasons in {e(n)}</h2>
      <p>{e(t["seasons"])}</p>
      <h2>Where we work in {e(n)}</h2>
      <p>We serve homes across {e(n)}, including {e(t["areas"])}.</p>
    </div>
    <aside class="town-side">
      <p class="eyebrow">Services in {e(n)}</p>
      <ul class="town-svcs">{svc}</ul>
      <p class="town-side-note">Tap a service to start an estimate. Send a few photos and we’ll reply within 24 hours.</p>
    </aside>
  </div>
</section>

<section class="section section-rule">
  <div class="wrap grid12">
    <div class="faq-intro">
      <p class="eyebrow">{e(n)} FAQ</p>
      <h2 class="sec-title">Common Questions.</h2>
    </div>
    <div class="faq-list">{faq}</div>
  </div>
</section>

<section class="section section-rule">
  <div class="wrap">
    <p class="eyebrow">Nearby</p>
    <p class="town-near">We also serve {e(n)}’s neighbors: {near}. <a href="/service-areas/">See all 15 towns</a>.</p>
  </div>
</section>
''' + foot(f'Ready When You Are, {n}.')
    d = os.path.join(base, t['slug']); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w').write(page)

# hub
url = SITE + '/service-areas/'
ld = [{"@context": "https://schema.org", **BUSINESS, "areaServed": [{"@type": "City", "name": f"{x}, CT"} for x in ALL_TOWNS]}]
cards = ''.join(f'''
      <a class="post-card" href="/service-areas/{t["slug"]}/">
        <span class="post-card-media"><img src="/assets/img/{t["img"]}" alt="" loading="lazy"></span>
        <span class="post-tag">{e(t["county"])}</span>
        <span class="post-card-title">{e(t["name"])}, CT</span>
        <span class="post-card-more">Lawn care &amp; snow removal in {e(t["name"])}</span>
      </a>''' for t in TOWNS)
towns = ''.join((f'<li><a href="/service-areas/{bySlug[x]["slug"]}/">{e(x)}</a></li>' if x in bySlug else f'<li>{e(x)}</li>') for x in ALL_TOWNS)
hub = head('Service Areas: Lawn Care & Snow Removal in 15 CT Towns | Hafele',
           'Hafele serves 15 towns in Hartford and Litchfield counties, including Burlington, Avon, Farmington, Canton and Torrington. Lawn care, cleanups and snow removal.',
           url, ld) + f'''
<section class="page-head">
  <div class="wrap page-head-in">
    <div>
      <p class="eyebrow eyebrow-light">Service Areas</p>
      <h1 class="page-title"><span class="phr">15 Towns,</span> <span class="phr">One Dedicated Crew.</span></h1>
    </div>
    <a class="btn btn-gold" href="/#book">Request an Estimate</a>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="post-grid">{cards}
    </div>
  </div>
</section>

<section class="section section-rule">
  <div class="wrap">
    <p class="eyebrow">Every Town We Serve</p>
    <ul class="hub-towns">{towns}</ul>
    <p class="town-side-note">Across Hartford and Litchfield counties. Not sure if you’re on the route? Request an estimate and ask.</p>
  </div>
</section>
''' + foot()
open(os.path.join(base, 'index.html'), 'w').write(hub)
print('built', len(TOWNS), 'towns')
