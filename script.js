(function () {
  'use strict';

  var PHONE = '+12035606079';
  var EMAIL = 'hafelelandscapingllc@gmail.com';

  // media: a real Hafele job photo/video, or null for the logo panel (until photos are added)
  var SVCS = [
    { id: 'mow', label: 'Lawn care & mowing', ask: 'I need my lawn mowed', freq: ['One-time', 'Weekly', 'Every 2 weeks'],
      media: { img: 'assets/img/backyard-hillside.jpg', alt: 'Long striped backyard lawn climbing toward a gray house' } },
    { id: 'maint', label: 'Landscape maintenance', ask: 'I need landscape maintenance',
      media: { img: 'assets/img/work-05.jpg', alt: 'Cape-style home with trimmed shrubs and a freshly mowed lawn' } },
    { id: 'seed', label: 'Seeding & hydroseeding', ask: 'I need seeding / hydroseeding', media: null },
    { id: 'gutter', label: 'Gutters & siding', ask: 'I need my gutters or siding cleaned', media: null },
    { id: 'snow', label: 'Snow plowing', ask: 'I need snow plowing', freq: ['Whole season', 'Per storm'], media: null },
    { id: 'other', label: 'Something else', ask: 'I have a job I need help with',
      media: { img: 'assets/img/sign.jpg', alt: 'Hafele yard sign on a freshly cut client lawn' } }
  ];

  var st = { step: 1, svc: null, freq: null, name: '', phone: '', addr: '', notes: '' };
  var root = document.getElementById('book');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function svc() { return SVCS.filter(function (s) { return s.id === st.svc; })[0] || null; }

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
      'Hi Hafele, ' + (s ? s.ask.charAt(0).toLowerCase() + s.ask.slice(1) : 'I have a job') +
        (s && s.freq && st.freq ? ' (' + st.freq.toLowerCase() + ')' : '') +
        '. Can I get a quote? I\'m sending photos of the property (lawn / driveway) with this message.',
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
      h += '<div class="glass-head"><h2>Request a quote</h2><span class="count">0' + st.step + ' / 02</span></div>';
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
      h += '<p class="lead">Send us a few photos of your property and we\u2019ll get back to you with a quote.</p>';
    }

    if (st.step === 2) {
      h += '<p class="summary">' + esc(summary()) + '</p>';
      h += '<div class="fields">' +
        '<label>Name<input type="text" autocomplete="name" data-field="name" value="' + esc(st.name) + '"></label>' +
        '<label>Cell<input type="tel" autocomplete="tel" data-field="phone" value="' + esc(st.phone) + '"></label>' +
        '<label class="full">Property address<input type="text" autocomplete="street-address" data-field="addr" value="' + esc(st.addr) + '"></label>' +
        '<div class="full photo-tip"><span class="photo-tip-h">Photos</span><p>After you tap Send, your text to Hafele opens. Tap <strong>+</strong> and add 2\u20134 photos of your lawn, driveway or the area you need done.</p></div>' +
        '<label class="full">Notes (optional)<textarea rows="2" data-field="notes" placeholder="Gate code, dog in the yard, steep hill…">' + esc(st.notes) + '</textarea></label>' +
        '</div>';
    }

    if (st.step !== 3) {
      h += '<div class="actions">' +
        (st.step > 1 ? '<button type="button" class="btn-back" data-act="back">Back</button>' : '') +
        '<button type="button" class="btn-next" data-act="next"' + (okNow() ? '' : ' disabled') + '>' +
        (st.step === 2 ? 'Send' : 'Continue') + '</button></div>';
    } else {
      var smsHref = 'sms:' + PHONE + '?&body=' + encodeURIComponent(messageBody());
      var mailHref = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Quote request: ' + (svc() ? svc().label : '')) +
        '&body=' + encodeURIComponent(messageBody());
      h += '<div class="done" style="display:flex;flex-direction:column;gap:12px">' +
        '<span class="done-kicker">ALMOST DONE</span>' +
        '<h2>Add your photos, then send.</h2>' +
        '<ol class="done-steps"><li>In Messages, tap <strong>+</strong> next to the text box.</li><li>Pick 2\u20134 photos of your lawn, driveway or the area you need done.</li><li>Hit send. We reply within 24 hours with your quote.</li></ol>' +
        '<p>Texting didn’t open? <a href="' + esc(smsHref) + '">Try again</a> or <a href="' + esc(mailHref) + '">send it by email</a> and attach your photos there.</p>' +
        '<button type="button" class="linkish" data-act="reset">Ask about something else</button>' +
        '</div>';
    }

    root.innerHTML = h;
  }

  function refreshNext() {
    var btn = root.querySelector('[data-act="next"]');
    if (btn) btn.disabled = !okNow();
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || !root.contains(b)) return;
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
      st = { step: 1, svc: null, freq: null, name: st.name, phone: st.phone, addr: st.addr, notes: '' };
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
  list.innerHTML = SVCS.map(function (s, i) {
    return '<li class="svc-card">' + media(s.media) +
      '<div class="svc-meta"><span class="svc-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<h3>' + esc(s.label) + '</h3></div>' +
      '<a class="svc-cta" href="#book" data-pick="' + s.id + '">Request a quote</a></li>';
  }).join('');
  list.addEventListener('click', function (e) {
    var a = e.target.closest('[data-pick]');
    if (!a) return;
    st.svc = a.dataset.pick; st.freq = null; st.step = 1;
    render();
  });

  render();
})();
