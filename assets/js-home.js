/* MP Doors — master homepage */
(function () {
  'use strict';

  var body = document.body;

  /* ── Reduce-animations preference ─────────────────────── */
  var toggle = document.getElementById('motionToggle');
  var state = document.getElementById('motionState');
  var KEY = 'mpdoors:no-motion';

  function applyMotion(off) {
    body.classList.toggle('no-motion', off);
    if (toggle) toggle.setAttribute('aria-pressed', String(off));
    if (state) state.textContent = off ? 'On' : 'Off';
  }

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  applyMotion(stored === '1');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var off = !body.classList.contains('no-motion');
      applyMotion(off);
      try { localStorage.setItem(KEY, off ? '1' : '0'); } catch (e) {}
    });
  }

  /* ── Header: solid once scrolled past the hero lip ────── */
  var hdr = document.getElementById('hdr');
  if (hdr) {
    var onScroll = function () {
      hdr.classList.toggle('is-solid', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mega menu ────────────────────────────────────────── */
  var menuBtn = document.getElementById('menuBtn');
  var mega = document.getElementById('mega');

  function setMenu(open) {
    if (!menuBtn || !mega) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    mega.hidden = !open;
    hdr.classList.toggle('is-solid', open || window.scrollY > 60);
  }

  if (menuBtn && mega) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!mega.hidden && !mega.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    mega.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }

  /* ── Reveal on scroll ─────────────────────────────────────
     Rect-based rather than IntersectionObserver: it cannot leave
     content stranded at opacity 0 if a callback never fires.
     ──────────────────────────────────────────────────────── */
  var pending = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function revealAll() {
    pending.forEach(function (el) { el.classList.add('is-in'); });
    pending = [];
  }

  function check() {
    if (!pending.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    pending = pending.filter(function (el) {
      var r = el.getBoundingClientRect();
      // In view (or already scrolled past) with a small trigger margin.
      if (r.top < vh * 0.92 && r.bottom > 0) {
        var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 5) * 90 : 0) + 'ms';
        el.classList.add('is-in');
        return false;
      }
      return true;
    });
  }

  var ticking = false;
  function onMove() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { check(); ticking = false; });
  }

  check();
  window.addEventListener('scroll', onMove, { passive: true });
  window.addEventListener('resize', onMove);
  window.addEventListener('load', check);
  // Last-resort safety net: never leave the page blank.
  setTimeout(check, 400);
  setTimeout(revealAll, 4000);

  /* ── Signature rail counter ───────────────────────────── */
  var rail = document.getElementById('rail');
  var count = document.getElementById('sigCount');
  if (rail && count) {
    var cards = rail.querySelectorAll('.card');
    var total = String(cards.length).padStart(2, '0');
    var update = function () {
      var card = cards[0];
      if (!card) return;
      var step = card.offsetWidth + parseFloat(getComputedStyle(rail).gap || 0);
      var i = Math.min(cards.length, Math.round(rail.scrollLeft / step) + 1);
      count.textContent = String(i).padStart(2, '0') + ' / ' + total;
    };
    update();
    rail.addEventListener('scroll', function () {
      window.requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ── Guide form ───────────────────────────────────────── */
  var form = document.getElementById('guideForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var note = form.querySelector('.form__note');
      if (!input || !note) return;
      if (!input.checkValidity()) {
        note.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }
      form.classList.add('is-sent');
      note.textContent = 'The guide is on its way to ' + input.value + '.';
      input.value = '';
    });
  }
})();
