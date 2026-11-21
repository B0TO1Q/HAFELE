(function () {
  'use strict';

  var PHONE = '+12035606079';
  var EMAIL = 'hafelelandscapingllc@gmail.com';

  var SVCS = [
    { id: 'mow', label: 'Lawn care & mowing', freq: ['One-time', 'Weekly', 'Every 2 weeks'] },
    { id: 'maint', label: 'Landscape maintenance' },
    { id: 'seed', label: 'Seeding & hydroseeding' },
    { id: 'gutter', label: 'Gutters & siding' },
    { id: 'snow', label: 'Snow plowing', freq: ['Whole season', 'Per storm'] },
    { id: 'other', label: 'Something else' }
  ];
  var WINS = ['Morning', 'Midday', 'Afternoon'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var st = { step: 1, svc: null, freq: null, day: null, win: null, name: '', phone: '', addr: '', notes: '' };
  var root = document.getElementById('book');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function upcoming() {
    var out = [];
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < 10) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue;
      out.push({ key: d.toDateString(), dow: DOW[d.getDay()], md: MON[d.getMonth()] + ' ' + d.getDate() });
    }
    return out;
  }
  var DAYS = upcoming();

  function svc() { return SVCS.filter(function (s) { return s.id === st.svc; })[0] || null; }
  function isSnow() { return st.svc === 'snow'; }
  function dayObj() { return DAYS.filter(function (d) { return d.key === st.day; })[0] || null; }

  function okNow() {
    var s = svc();
    if (st.step === 1) return !!s && (!s.freq || !!st.freq);
    if (st.step === 2) return true; // day and time are optional preferences
    if (st.step === 3) return !!(st.name.trim() && st.phone.trim() && st.addr.trim());
    return false;
  }

  function when() {
    if (isSnow()) return 'Snow route' + (st.freq ? ' · ' + st.freq.toLowerCase() : '');
    var d = dayObj();
    if (!d && !st.win) return 'flexible on timing';
    return 'prefers ' + (d ? d.dow + ' ' + d.md : 'any day') + (st.win ? ' · ' + st.win.toLowerCase() : '');
  }

  function summary() {
    var s = svc();
    var f = s && s.freq && !isSnow() && st.freq ? ' (' + st.freq.toLowerCase() + ')' : '';
    return (s ? s.label : '') + f + ' — ' + when();
  }

  function messageBody() {
    var lines = [
      'Service inquiry from the website',
      'Service: ' + summary(),
      'Name: ' + st.name.trim(),
      'Cell: ' + st.phone.trim(),
      'Address: ' + st.addr.trim()
    ];
    if (st.notes.trim()) lines.push('Notes: ' + st.notes.trim());
    return lines.join('\n');
  }

  function chip(attrs, label, pressed, extraClass) {
    return '<button type="button" class="chip' + (extraClass ? ' ' + extraClass : '') + '" ' + attrs +
      ' aria-pressed="' + (pressed ? 'true' : 'false') + '">' + label + '</button>';
  }

  function render() {
    var h = '';
    if (st.step !== 4) {
      h += '<div class="glass-head"><h2>Service inquiry</h2><span class="count">0' + st.step + ' / 03</span></div>';
      h += '<div class="bars" aria-hidden="true">' +
        [1, 2, 3].map(function (n) { return '<span class="' + (st.step >= n ? 'on' : '') + '"></span>'; }).join('') +
        '</div>';
    }

    if (st.step === 1) {
      h += '<fieldset><legend>What do you need?</legend><div class="chips">' +
        SVCS.map(function (s) { return chip('data-svc="' + s.id + '"', esc(s.label), st.svc === s.id); }).join('') +
        '</div></fieldset>';
      var s = svc();
      if (s && s.freq) {
        h += '<fieldset><legend>How often?</legend><div class="chips">' +
          s.freq.map(function (f) { return chip('data-freq="' + esc(f) + '"', esc(f), st.freq === f); }).join('') +
          '</div></fieldset>';
      }
    }

    if (st.step === 2) {
      if (isSnow()) {
        h += '<div class="note"><p><strong>Snow runs storm by storm.</strong></p><p>No day to pick. Once you’re on the route, we come when it snows.</p></div>';
      } else {
        h += '<fieldset><legend>Preferred day (optional)</legend><div class="days">' +
          DAYS.map(function (d) {
            return chip('data-day="' + esc(d.key) + '"', '<span class="dow">' + d.dow + '</span><span class="md">' + d.md + '</span>', st.day === d.key);
          }).join('') + '</div></fieldset>';
        h += '<fieldset><legend>Preferred time (optional)</legend><div class="chips wins">' +
          WINS.map(function (w) { return chip('data-win="' + w + '"', w, st.win === w); }).join('') +
          '</div></fieldset>';
      }
    }

    if (st.step === 3) {
      h += '<div class="fields">' +
        '<label>Name<input type="text" autocomplete="name" data-field="name" value="' + esc(st.name) + '"></label>' +
        '<label>Cell (for the text)<input type="tel" autocomplete="tel" data-field="phone" value="' + esc(st.phone) + '"></label>' +
        '<label class="full">Property address<input type="text" autocomplete="street-address" data-field="addr" value="' + esc(st.addr) + '"></label>' +
        '<label class="full">Notes (optional)<textarea rows="2" data-field="notes" placeholder="Gate code, dog in the yard, steep hill…">' + esc(st.notes) + '</textarea></label>' +
        '</div>';
      h += '<p class="summary">' + esc(summary()) + '</p>';
    }

    if (st.step !== 4) {
      h += '<div class="actions">' +
        (st.step > 1 ? '<button type="button" class="btn-back" data-act="back">Back</button>' : '') +
        '<button type="button" class="btn-next" data-act="next"' + (okNow() ? '' : ' disabled') + '>' +
        (st.step === 3 ? 'Send inquiry' : 'Continue') + '</button></div>';
    } else {
      var smsHref = 'sms:' + PHONE + '?&body=' + encodeURIComponent(messageBody());
      var mailHref = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Service inquiry: ' + (svc() ? svc().label : '')) +
        '&body=' + encodeURIComponent(messageBody());
      h += '<div class="done" style="display:flex;flex-direction:column;gap:12px">' +
        '<span class="done-kicker">ALMOST DONE</span>' +
        '<h2>Hit send in Messages.</h2>' +
        '<p>Your inquiry is filled in and ready to text to Hafele. We reply within 24 hours with availability and pricing.</p>' +
        '<p>Texting didn’t open? <a href="' + esc(smsHref) + '">Try again</a> or <a href="' + esc(mailHref) + '">send it by email</a>.</p>' +
        '<button type="button" class="linkish" data-act="reset">Send another inquiry</button>' +
        '</div>';
    }

    root.innerHTML = h;
  }

  function refreshNext() {
    var btn = root.querySelector('[data-act="next"]');
    if (btn) btn.disabled = !okNow();
    var sum = root.querySelector('.summary');
    if (sum) sum.textContent = summary();
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || !root.contains(b)) return;
    if (b.dataset.svc) { st.svc = b.dataset.svc; st.freq = null; st.day = null; st.win = null; render(); return; }
    if (b.dataset.freq) { st.freq = b.dataset.freq; render(); return; }
    if (b.dataset.day) { st.day = st.day === b.dataset.day ? null : b.dataset.day; render(); return; }
    if (b.dataset.win) { st.win = st.win === b.dataset.win ? null : b.dataset.win; render(); return; }
    var act = b.dataset.act;
    if (act === 'back') { st.step = Math.max(1, st.step - 1); render(); }
    if (act === 'next' && okNow()) {
      if (st.step === 3) {
        st.step = 4;
        render();
        window.location.href = 'sms:' + PHONE + '?&body=' + encodeURIComponent(messageBody());
      } else {
        st.step += 1;
        render();
      }
    }
    if (act === 'reset') {
      st = { step: 1, svc: null, freq: null, day: null, win: null, name: st.name, phone: st.phone, addr: st.addr, notes: '' };
      render();
    }
  });

  root.addEventListener('input', function (e) {
    var f = e.target.dataset && e.target.dataset.field;
    if (!f) return;
    st[f] = e.target.value;
    refreshNext();
  });

  // Services list: "Inquire" preselects the service in the inquiry box
  var list = document.getElementById('svc-list');
  list.innerHTML = SVCS.map(function (s, i) {
    return '<li class="svc-row"><span class="svc-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<h3>' + esc(s.label) + '</h3><a href="#book" data-pick="' + s.id + '">Inquire</a></li>';
  }).join('');
  list.addEventListener('click', function (e) {
    var a = e.target.closest('[data-pick]');
    if (!a) return;
    st.svc = a.dataset.pick; st.freq = null; st.day = null; st.win = null; st.step = 1;
    render();
  });

  render();
})();
