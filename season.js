/* Hafele seasons: picks the season from today's date and sets the look.
   Loaded in <head> on every page so the right season shows on first paint.
   Preview any season with ?season=spring | summer | fall | winter        */
(function () {
  // Start dates (month 1-12, day). Winter starts mid-November for plow season.
  var STARTS = [
    { id: 'spring', m: 3,  d: 15 },
    { id: 'summer', m: 6,  d: 1 },
    { id: 'fall',   m: 9,  d: 1 },
    { id: 'winter', m: 11, d: 15 }
  ];

  var SEASONS = {
    spring: {
      label: 'Spring',
      line: 'Spring cleanups and mowing, booking now.',
      hero: { img: 'assets/img/hydroseeding.jpg', pos: '50% 50%', alt: 'Fresh green hydroseed mulch spread over a lawn' },
      picks: [
        { svc: 'maint', label: 'Spring cleanup', ask: 'I need a spring cleanup' },
        { svc: 'mow' },
        { svc: 'seed' },
        { svc: 'gutter' },
        { svc: 'other' }
      ]
    },
    summer: {
      label: 'Summer',
      line: 'Weekly and every-2-week mowing, booking now.',
      hero: { img: 'assets/img/hero.jpg', pos: '50% 50%', alt: 'Freshly striped front lawn at a gray home with a three-car garage' },
      picks: [
        { svc: 'mow' },
        { svc: 'maint' },
        { svc: 'other' }
      ]
    },
    fall: {
      label: 'Fall',
      line: 'Fall cleanups now. Reserve your winter plowing.',
      hero: { img: 'assets/img/gutters.jpg', pos: '50% 50%', alt: 'Leaf blower clearing a gutter along the roof edge' },
      picks: [
        { svc: 'maint', label: 'Fall cleanup', ask: 'I need a fall cleanup' },
        { svc: 'seed', label: 'Fall seeding', ask: 'I need fall seeding / hydroseeding' },
        { svc: 'gutter' },
        { svc: 'snow', label: 'Reserve winter plowing', ask: 'I’d like to reserve snow plowing for this winter' },
        { svc: 'other' }
      ]
    },
    winter: {
      label: 'Winter',
      line: 'Plow season is here. Whole season or per storm.',
      hero: { img: 'assets/img/snow-plowing.jpg', pos: '62% 55%', alt: 'Hafele plow truck clearing a snowy driveway' },
      picks: [
        { svc: 'snow' },
        { svc: 'mow', label: 'Spring mowing list', ask: 'I’d like to get on your spring mowing list', freq: ['Weekly', 'Every 2 weeks'] },
        { svc: 'other' }
      ]
    }
  };

  function fromDate(dt) {
    var md = (dt.getMonth() + 1) * 100 + dt.getDate();
    var cur = 'winter';
    STARTS.forEach(function (s) { if (md >= s.m * 100 + s.d) cur = s.id; });
    return cur;
  }

  var forced = null;
  try { forced = new URLSearchParams(window.location.search).get('season'); } catch (e) {}
  var now = SEASONS[forced] ? forced : fromDate(new Date());

  document.documentElement.setAttribute('data-season', now);

  window.HF_SEASON = {
    now: now,
    order: ['spring', 'summer', 'fall', 'winter'],
    all: SEASONS,
    // Called right after the hero <img> so only the season's photo downloads
    hero: function (img) {
      if (!img) return;
      var h = SEASONS[now].hero;
      img.style.objectPosition = h.pos;
      img.alt = h.alt;
      img.src = h.img;
    },
    line: function (el) { if (el) el.textContent = SEASONS[now].line; },
    // Switch the whole look to another season (quote panel tabs)
    show: function (id) {
      if (!SEASONS[id]) return;
      document.documentElement.setAttribute('data-season', id);
      var line = document.getElementById('season-line');
      if (line) line.textContent = SEASONS[id].line;
      var img = document.getElementById('hero-img');
      if (!img) return;
      var h = SEASONS[id].hero;
      if (img.getAttribute('src') === h.img) return;
      var next = new Image();
      next.onload = function () {
        img.classList.add('is-swapping');
        setTimeout(function () {
          img.src = h.img; img.alt = h.alt; img.style.objectPosition = h.pos;
          img.classList.remove('is-swapping');
        }, 250);
      };
      next.src = h.img;
    }
  };
})();
