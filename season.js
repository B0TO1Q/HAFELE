/* Hafele seasons: picks the season from today's date so the quote panel
   opens on the services that make sense right now.
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
      picks: [
        { svc: 'mow' },
        { svc: 'maint' },
        { svc: 'other' }
      ]
    },
    fall: {
      label: 'Fall',
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

  window.HF_SEASON = {
    now: now,
    order: ['spring', 'summer', 'fall', 'winter'],
    all: SEASONS
  };
})();
