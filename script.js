(function () {
  'use strict';

  // Same treatment as the Dani Hamm site (DANIHAMM/js/main.js).
  // ---------- smooth wheel scrolling (mouse & trackpad only) ----------
  // Glides to each stop and travels a little less per notch, so the page
  // feels slower and more fluid. Touch scrolling stays native.
  function initSmoothScroll() {
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || calm) return;
    var SPEED = 0.8;   // distance per wheel notch (1 = normal)
    var EASE = 0.1;    // glide amount per frame (lower = smoother, slower)
    var target = window.scrollY, current = window.scrollY, running = false;
    function maxY() { return document.documentElement.scrollHeight - window.innerHeight; }
    function scrollsItself(el, dy) {
      for (; el && el !== document.body; el = el.parentElement) {
        var st = getComputedStyle(el), oy = st.overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) {
          if ((dy < 0 && el.scrollTop > 0) || (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight)) return true;
        }
      }
      return false;
    }
    function step() {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.5) { current = target; running = false; }
      window.scrollTo({ top: current, behavior: 'instant' });
      if (running) requestAnimationFrame(step);
    }
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || scrollsItself(e.target, e.deltaY)) return;
      e.preventDefault();
      if (!running) { current = window.scrollY; target = current; }
      var dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      target = Math.max(0, Math.min(maxY(), target + dy * SPEED));
      if (!running) { running = true; requestAnimationFrame(step); }
    }, { passive: false });
    // keyboard, scrollbar, anchor jumps: follow wherever the page actually is
    window.addEventListener('scroll', function () {
      // if something else moved the page (keys, scrollbar, links), stop gliding and follow it
      if (!running || Math.abs(window.scrollY - current) > 3) { running = false; current = target = window.scrollY; }
    }, { passive: true });
    window.addEventListener('resize', function () { target = Math.min(target, maxY()); });
  }
  initSmoothScroll();

  // Soft fade-up as content scrolls into view (all pages).
  // Skipped when the visitor prefers reduced motion or the browser lacks support.
  (function reveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sel = '.fact, .sec-head, .svc-card, .svc-row, .faq-intro, .faq-list, .about-copy, .about-media, .contact-card, .area-label, .area-towns, .cta-in, .footer-grid, .care-intro, .care-season';
    function arm() {
      var els = document.querySelectorAll(sel);
      if (!els.length) return;
      document.documentElement.classList.add('hf-reveal');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px 12% 0px', threshold: 0 });
      Array.prototype.forEach.call(els, function (el) {
        var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(sib, 4) * 90 + 'ms';
        el.classList.add('reveal');
        io.observe(el);
      });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm); else arm();
  })();

  var PHONE = '+12035606079';
  var EMAIL = 'hafelelandscapingllc@gmail.com';

  // media: a real Hafele job photo/video, or null for the logo panel (until photos are added)
  var SVCS = [
    { id: 'mow', label: 'Lawn & Turf Care', ask: 'I need my lawn mowed', freq: ['One-Time', 'Weekly', 'Every 2 Weeks'],
      media: { img: 'assets/img/lawn-stripes.jpg?v=2', alt: 'Lawn mowed in bold diagonal stripes below a sunlit rise' } },
    { id: 'maint', label: 'Grounds Maintenance', ask: 'I need landscape maintenance',
      media: { img: 'assets/img/work-05.jpg', alt: 'Cape-style home with trimmed shrubs and a freshly mowed lawn' } },
    { id: 'seed', label: 'Lawn Renovation', ask: 'I need seeding / hydroseeding',
      media: { img: 'assets/img/hydroseeding.jpg', alt: 'Fresh green hydroseed mulch spread over a lawn' } },
    { id: 'gutter', label: 'Gutter & Exterior Care', ask: 'I need my gutters or siding cleaned',
      media: { img: 'assets/img/gutters.jpg', alt: 'Leaf blower clearing a gutter along the roof edge' } },
    { id: 'snow', label: 'Snow Removal', ask: 'I need snow plowing', freq: ['Whole Season', 'Per Storm'],
      media: { img: 'assets/img/snow-plowing.jpg', alt: 'Hafele plow truck clearing a snowy driveway' } },
    { id: 'care', label: 'Four-Season Care', ask: 'I\u2019m interested in Four-Season Care for my property, all year', featured: true },
    { id: 'other', label: 'Special Requests', ask: 'I have a job I need help with',
      media: { img: 'assets/img/sign.jpg', alt: 'Hafele yard sign on a freshly cut client lawn' } }
  ];

  // Seasons (season.js): each season offers only the services that make sense then
  var SEA = window.HF_SEASON || { now: 'all', order: ['all'], all: { all: { label: 'All', picks: SVCS.map(function (x) { return { svc: x.id }; }) } } };
  function picks(season) { return SEA.all[season].picks; }
  function inSeason(season, id) { return picks(season).some(function (p) { return p.svc === id; }); }
  // the season to open for a service: now if offered now, otherwise the next season that offers it
  function seasonFor(id) {
    if (id === 'care' && SEA.all.care) return 'care';
    var i0 = SEA.order.indexOf(SEA.now);
    for (var k = 0; k < SEA.order.length; k++) {
      var sea = SEA.order[(i0 + k) % SEA.order.length];
      if (inSeason(sea, id)) return sea;
    }
    return SEA.now;
  }

  var st = { step: 1, season: SEA.now, svc: null, freq: null, name: '', phone: '', addr: '', notes: '' };
  var root = document.getElementById('book');
  var ANCHOR = { care: 'care', mow: 'mowing', maint: 'maintenance', seed: 'seeding', gutter: 'gutters', snow: 'snow', other: 'other' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function svc() {
    var base = SVCS.filter(function (s) { return s.id === st.svc; })[0];
    if (!base) return null;
    var p = picks(st.season).filter(function (x) { return x.svc === st.svc; })[0] || {};
    return { id: base.id, label: p.label || base.label, ask: p.ask || base.ask, freq: p.freq || base.freq, media: base.media };
  }
  function pick(id) { st.season = seasonFor(id); st.svc = id; st.freq = null; st.step = 1; document.documentElement.setAttribute('data-tone', st.season); }

  function okNow() {
    var s = svc();
    if (st.step === 1) return !!s && (!s.freq || !!st.freq);
    if (st.step === 2) return !!(st.name.trim() && st.phone.trim() && st.addr.trim());
    return false;
  }

  function summary() {
    var s = svc();
    if (!s) return '';
    return s.label + (s.freq && st.freq ? ' · ' + st.freq.toLowerCase() : '');
  }

  function messageBody() {
    var s = svc();
    var lines = [
      'Hi Hafele, ' + (s ? (/^I[\s\u2019']/.test(s.ask) ? s.ask : s.ask.charAt(0).toLowerCase() + s.ask.slice(1)) : 'I have a job') +
        (s && s.freq && st.freq ? ' (' + st.freq.toLowerCase() + ')' : '') +
        '. Could you give me an estimate? I\'m sending photos of the property (lawn / driveway) with this message.',
      '',
      'Name: ' + st.name.trim(),
      'Cell: ' + st.phone.trim(),
      'Address: ' + st.addr.trim()
    ];
    if (st.notes.trim()) lines.push('Notes: ' + st.notes.trim());
    lines.push('', '(Sent from the Hafele website)');
    return lines.join('\n');
  }

  function chip(attrs, label, pressed) {
    return '<button type="button" class="chip" ' + attrs + ' aria-pressed="' + (pressed ? 'true' : 'false') + '">' + label + '</button>';
  }

  function render() {
    var h = '';
    if (st.step !== 3) {
      h += '<div class="glass-head"><h2>Request an Estimate</h2><span class="count">0' + st.step + ' / 02</span></div>';
    }

    if (st.step === 1) {
      if (SEA.order.length > 1) {
        h += '<div class="seasons" role="tablist" aria-label="Season">' +
          SEA.order.map(function (sea) {
            return '<button type="button" role="tab" class="season-tab" data-season="' + sea + '" aria-selected="' + (st.season === sea) + '">' +
              esc(SEA.all[sea].label) + (sea === SEA.now ? '<span class="season-now" aria-label="(now)"></span>' : '') + '</button>';
          }).join('') +
          (SEA.all.care ? '<button type="button" role="tab" class="season-tab care-tab" data-season="care" aria-selected="' + (st.season === 'care') + '">Four-Season Care<span class="care-tab-sub">One Annual Agreement</span></button>' : '') +
          '</div>';
      }
      if (st.season === 'care') {
        h += '<p class="care-note">Your property looked after all year: cleanups, mowing and upkeep, and snow removal all winter. We walk the grounds with you first, then set the scope and price together.</p>';
      } else
      h += '<fieldset><legend>How Can We Help?</legend><div class="chips">' +
        picks(st.season).map(function (p) {
          var base = SVCS.filter(function (x) { return x.id === p.svc; })[0];
          return chip('data-svc="' + p.svc + '"', esc(p.label || base.label), st.svc === p.svc);
        }).join('') +
        '</div></fieldset>';
      var s = svc();
      if (s && s.freq) {
        h += '<fieldset><legend>How Often?</legend><div class="chips">' +
          s.freq.map(function (f) { return chip('data-freq="' + esc(f) + '"', esc(f), st.freq === f); }).join('') +
          '</div></fieldset>';
      }
      if (st.season !== 'care') h += '<p class="lead">Share a few photos of your property and we\u2019ll follow up personally with an estimate.</p>';
    }

    if (st.step === 2) {
      h += '<p class="summary">' + esc(summary()) + '</p>';
      h += '<div class="fields">' +
        '<label>Name<input type="text" autocomplete="name" data-field="name" value="' + esc(st.name) + '"></label>' +
        '<label>Cell<input type="tel" autocomplete="tel" data-field="phone" value="' + esc(st.phone) + '"></label>' +
        '<label class="full">Property Address<input type="text" autocomplete="street-address" data-field="addr" value="' + esc(st.addr) + '"></label>' +
        '<div class="full photo-tip"><span class="photo-tip-h">Photos</span><p>After you tap Send, your text to Hafele opens. Tap <strong>+</strong> and add 2\u20134 photos of your lawn, driveway or the area you need done.</p></div>' +
        '<label class="full">Notes (Optional)<textarea rows="2" data-field="notes" placeholder="Gate code, pets, anything we should know…">' + esc(st.notes) + '</textarea></label>' +
        '</div>';
    }

    if (st.step !== 3) {
      h += '<div class="actions">' +
        (st.step > 1 ? '<button type="button" class="btn-back" data-act="back">Back</button>' : '') +
        '<button type="button" class="btn-next" data-act="next"' + (okNow() ? '' : ' disabled') + '>' +
        (st.step === 2 ? 'Send' : 'Continue') + '</button></div>';
    } else {
      var smsHref = 'sms:' + PHONE + '?&body=' + encodeURIComponent(messageBody());
      var mailHref = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Estimate request: ' + (svc() ? svc().label : '')) +
        '&body=' + encodeURIComponent(messageBody());
      h += '<div class="done" style="display:flex;flex-direction:column;gap:12px">' +
        '<span class="done-kicker">ALMOST DONE</span>' +
        '<h2>Add Your Photos, Then Send.</h2>' +
        '<ol class="done-steps"><li>In Messages, tap <strong>+</strong> next to the text box.</li><li>Pick 2\u20134 photos of your lawn, driveway or the area you need done.</li><li>Hit send. We reply within 24 hours with your estimate.</li></ol>' +
        '<p>Texting didn’t open? <a href="' + esc(smsHref) + '">Try again</a> or <a href="' + esc(mailHref) + '">send it by email</a> and attach your photos there.</p>' +
        '<button type="button" class="linkish" data-act="reset">Ask About Something Else</button>' +
        '</div>';
    }

    root.innerHTML = h;
  }

  function refreshNext() {
    var btn = root.querySelector('[data-act="next"]');
    if (btn) btn.disabled = !okNow();
  }

  if (!root) return; // quote panel lives on the home page only

  // Arriving from another page with ?service=… preselects that service
  var pre = new URLSearchParams(window.location.search).get('service');
  if (pre && SVCS.some(function (x) { return x.id === pre; })) pick(pre);

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || !root.contains(b)) return;
    if (b.dataset.season) { if (b.dataset.season !== st.season) { st.season = b.dataset.season; st.svc = st.season === 'care' ? 'care' : null; st.freq = null; } document.documentElement.setAttribute('data-tone', st.season); render(); var t = root.querySelector('.season-tab[aria-selected="true"]'); if (t) t.focus(); return; }
    if (b.dataset.svc) { st.svc = b.dataset.svc; st.freq = null; render(); return; }
    if (b.dataset.freq) { st.freq = b.dataset.freq; render(); return; }
    var act = b.dataset.act;
    if (act === 'back') { st.step = Math.max(1, st.step - 1); render(); }
    if (act === 'next' && okNow()) {
      if (st.step === 2) {
        st.step = 3;
        render();
        window.location.href = 'sms:' + PHONE + '?&body=' + encodeURIComponent(messageBody());
      } else {
        st.step += 1;
        render();
      }
    }
    if (act === 'reset') {
      document.documentElement.setAttribute('data-tone', SEA.now);
      st = { step: 1, season: SEA.now, svc: null, freq: null, name: st.name, phone: st.phone, addr: st.addr, notes: '' };
      render();
    }
  });

  root.addEventListener('input', function (e) {
    var f = e.target.dataset && e.target.dataset.field;
    if (!f) return;
    st[f] = e.target.value;
    refreshNext();
  });

  // Services: one card per service, each with its own job photo as proof
  function media(m) {
    if (!m) return '<div class="svc-media svc-media-logo"><img src="assets/logo/emblem-gold.png" alt=""></div>';
    if (m.video) return '<div class="svc-media"><video src="' + m.video + '" poster="' + m.poster + '" autoplay muted loop playsinline preload="metadata" aria-label="' + esc(m.alt) + '"></video></div>';
    return '<div class="svc-media"><img src="' + m.img + '" alt="' + esc(m.alt) + '" loading="lazy"></div>';
  }
  var list = document.getElementById('svc-list');
  if (list) {
  list.innerHTML = SVCS.filter(function (s) { return !s.featured; }).map(function (s, i) {
    return '<li class="svc-card">' + media(s.media) +
      '<div class="svc-meta"><span class="svc-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<h3><a class="svc-title-link" href="services.html#' + ANCHOR[s.id] + '">' + esc(s.label) + '</a></h3></div>' +
      '<div class="svc-links"><a class="svc-cta" href="#book" data-pick="' + s.id + '">Request an Estimate</a>' +
      '<a class="svc-more" href="services.html#' + ANCHOR[s.id] + '">Details</a></div></li>';
  }).join('');

  }

  // Any "Request an estimate" link with data-pick preselects that service
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-pick]');
    if (!a) return;
    pick(a.dataset.pick);
    render();
  });

  render();

  // Keep the hero photo's crop steady: the quote panel grows and shrinks as
  // seasons/services change, so size the photo once (with headroom) instead
  // of letting it rescale with the hero's height.
  (function lockHero() {
    var hero = document.querySelector('.hero'), img = hero && hero.querySelector('.hero-img');
    if (!img) return;
    var lastW = 0;
    function size() {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      img.style.height = '';
      img.style.height = 'max(100%, ' + (hero.offsetHeight + 320) + 'px)';
    }
    size();
    window.addEventListener('resize', size);
  })();

})();
