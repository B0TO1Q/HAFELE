"""Builds /404.html from the service-areas hub's header and footer.
GitHub Pages shows it for any address that doesn't exist."""
import os, re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(REPO, 'service-areas', 'index.html')).read()

head, rest = src.split('<main>', 1)
tail = rest.split('</main>', 1)[1]

head = re.sub(r'<title>.*?</title>', '<title>Page Not Found | Hafele Landscaping &amp; Snow Removal</title>', head)
head = re.sub(r'<meta name="description"[^>]*>\n', '', head)
head = re.sub(r'<link rel="canonical"[^>]*>\n', '<meta name="robots" content="noindex">\n', head)
head = re.sub(r'<meta property="og:[^>]*>\n', '', head)
head = re.sub(r'<meta name="twitter:card"[^>]*>\n', '', head)
head = re.sub(r'<script type="application/ld\+json">.*?</script>\n', '', head)

main = '''<main>

<section class="page-head">
  <div class="wrap page-head-in">
    <div>
      <p class="eyebrow eyebrow-light">Error 404</p>
      <h1 class="page-title"><span class="phr">This Page Wandered</span> <span class="phr">Off the Property.</span></h1>
    </div>
    <a class="btn btn-gold" href="/#book">Request an Estimate</a>
  </div>
</section>

<section class="section">
  <div class="wrap nf">
    <p class="nf-lead">The link may be old or mistyped. Here’s where most people are headed:</p>
    <ul class="town-svcs nf-links">
      <li><a href="/"><span class="ts-name">Home</span><span class="ts-desc">Request an estimate and see what we do.</span></a></li>
      <li><a href="/services.html"><span class="ts-name">Services</span><span class="ts-desc">Lawn care, cleanups, seeding, gutters and snow removal.</span></a></li>
      <li><a href="/service-areas/"><span class="ts-name">Service Areas</span><span class="ts-desc">The 15 towns we serve in Hartford and Litchfield counties.</span></a></li>
      <li><a href="/blog/"><span class="ts-name">Blog</span><span class="ts-desc">Lawn and snow advice for Connecticut homes.</span></a></li>
      <li><a href="/about.html"><span class="ts-name">About &amp; Contact</span><span class="ts-desc">Call or text (203) 560-6079.</span></a></li>
    </ul>
  </div>
</section>

</main>'''

page = head + main + tail
page = page.replace('<!-- Cloudflare Web Analytics -->', '<!-- Cloudflare Web Analytics -->', 1)
open(os.path.join(REPO, '404.html'), 'w').write(page)
print('built 404.html')
