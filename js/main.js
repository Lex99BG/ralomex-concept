/* Раломекс — концепция от ARISE. Анимациите са пренесени от дизайна без библиотеки. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  doc.classList.add('js');

  /* ---------- reveals, mask wipes ---------- */
  var rv = [].slice.call(document.querySelectorAll('[data-rv]'));
  var masks = [].slice.call(document.querySelectorAll('[data-mask]'));
  function show(el) {
    if (el.hasAttribute('data-rv')) el.style.transitionDelay = (parseInt(el.getAttribute('data-rv') || '0', 10) * 90) + 'ms';
    el.classList.add('in');
  }
  if (reduce || !('IntersectionObserver' in window)) {
    rv.concat(masks).forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
    // a clip-path:inset(0 100% 0 0) target has an empty visible box, so watch its parent instead
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        (en.target.__masks || []).forEach(function (m) { m.classList.add('in'); });
        mio.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    masks.forEach(function (el) {
      var host = el.parentElement;
      (host.__masks = host.__masks || []).push(el);
      mio.observe(host);
    });
    // first pass for what is already on screen
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      rv.forEach(function (el) { if (el.getBoundingClientRect().top < vh) { show(el); io.unobserve(el); } });
      masks.forEach(function (el) { if (el.parentElement.getBoundingClientRect().top < vh) el.classList.add('in'); });
    });
  }

  /* ---------- counters ---------- */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduce) { el.textContent = String(target); return; }
    var t0 = performance.now(), dur = 1500;
    (function tick(t) {
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if (reduce || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  } else {
    counters.forEach(function (el) { el.textContent = '0'; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- scroll: hero parallax + season timeline ---------- */
  var par = document.querySelector('[data-par]');
  var fill = document.querySelector('[data-tl-fill]');
  var steps = [].slice.call(document.querySelectorAll('[data-tstep]'));
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (par && !reduce && y < window.innerHeight * 1.4) par.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0)';
    if (fill && steps.length) {
      var first = steps[0].getBoundingClientRect();
      var last = steps[steps.length - 1].getBoundingClientRect();
      var anchor = window.innerHeight * 0.55;
      var total = (last.top + 20) - first.top;
      var prog = Math.max(0, Math.min(1, (anchor - first.top) / total));
      fill.style.height = (prog * 100) + '%';
      steps.forEach(function (s) { s.classList.toggle('on', s.getBoundingClientRect().top < anchor); });
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- hero: mouse parallax (desktop only) ---------- */
  var heroImg = document.querySelector('[data-hero-img]');
  var heroIn = document.querySelector('[data-mouse]');
  if (heroImg && finePointer && !reduce) {
    var tx = 0, ty = 0, cx = 0, cy = 0, heroVisible = true;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
    (function loop() {
      if (heroVisible) {
        cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
        heroImg.style.transform = 'translate3d(' + (cx * -14) + 'px,' + (cy * -10) + 'px,0) scale(1.03)';
        if (heroIn) heroIn.style.transform = 'translate3d(' + (cx * 6) + 'px,' + (cy * 4) + 'px,0)';
      }
      requestAnimationFrame(loop);
    })();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe(heroImg);
  }

  /* ---------- hero: soil dust particles ---------- */
  var canvas = document.querySelector('[data-dust]');
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext('2d');
    var size = function () { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    size(); window.addEventListener('resize', size);
    var count = window.innerWidth < 700 ? 22 : 42;
    var P = [];
    for (var i = 0; i < count; i++) P.push({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, vx: 0.01 + Math.random() * 0.03, vy: -(0.008 + Math.random() * 0.022), a: 0.04 + Math.random() * 0.12, ph: Math.random() * Math.PI * 2 });
    var dustVisible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { dustVisible = en[0].isIntersecting; }, { threshold: 0 }).observe(canvas);
    (function draw(t) {
      if (dustVisible && !document.hidden) {
        var w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        for (var j = 0; j < P.length; j++) {
          var p = P[j];
          p.x += p.vx / 100; p.y += p.vy / 100;
          if (p.x > 1.02) p.x = -0.02; if (p.y < -0.02) p.y = 1.02;
          var tw = 0.7 + 0.3 * Math.sin((t || 0) / 900 + p.ph);
          ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(217,185,140,' + (p.a * tw) + ')'; ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- markets map ---------- */
  var map = document.querySelector('[data-map]');
  if (map) {
    if (reduce || !('IntersectionObserver' in window)) { map.classList.add('play'); }
    else {
      map.classList.add('js');
      var mo = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { map.classList.add('play'); mo.disconnect(); }
      }, { threshold: 0.35 });
      mo.observe(map);
    }
  }

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Затвори менюто' : 'Отвори менюто');
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if ('inert' in menu) menu.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    setMenu(false);
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && menu.classList.contains('open')) setMenu(false); });
  }

  /* ---------- toast: „Очаквайте скоро“ ---------- */
  var toast = document.querySelector('.toast');
  var toastTimer;
  var soonText = { en: 'English version — coming soon', ro: 'Versiunea în limba română — în curând', bg: 'Очаквайте скоро' };
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-soon]');
    if (!b) return;
    e.preventDefault();
    var page = b.getAttribute('data-page');
    say(page ? '„' + page + '“ — очаквайте скоро' : (soonText[b.getAttribute('data-soon')] || soonText.bg));
  });

  /* ---------- product links preselect the form ---------- */
  var form = document.getElementById('rfq');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-product]');
    if (a && form) { var sel = form.querySelector('select[name=machine]'); if (sel) sel.value = a.getAttribute('data-product'); }
  });

  /* ---------- enquiry form: composes an e-mail, no server ---------- */
  if (form) {
    var done = document.querySelector('[data-done]');
    var err = form.querySelector('.f-err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim(), phone = f.phone.value.trim(), email = f.email.value.trim();
      f.name.setAttribute('aria-invalid', String(!name));
      var noContact = !phone && !email;
      f.phone.setAttribute('aria-invalid', String(noContact)); f.email.setAttribute('aria-invalid', String(noContact));
      if (!name || noContact) {
        err.hidden = false;
        err.textContent = !name ? 'Моля, напишете името си.' : 'Моля, оставете телефон или имейл, за да ви отговорим.';
        (!name ? f.name : f.phone).focus();
        return;
      }
      err.hidden = true;
      var machine = f.machine.value;
      var details = [
        'Име: ' + name,
        f.company.value.trim() && 'Фирма / стопанство: ' + f.company.value.trim(),
        phone && 'Телефон: ' + phone,
        email && 'Имейл: ' + email,
        f.place.value.trim() && 'Населено място: ' + f.place.value.trim(),
        'Машина: ' + machine,
        f.tractor.value.trim() && 'Трактор: ' + f.tractor.value.trim()
      ].filter(Boolean);
      var lines = ['Здравейте,', '', 'Изпращам запитване от сайта.', ''].concat(details);
      if (f.message.value.trim()) lines.push('', f.message.value.trim());
      var href = 'mailto:order@ralomex.com?subject=' + encodeURIComponent('Запитване от сайта: ' + machine) + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
      form.hidden = true; done.hidden = false;
      var h = done.querySelector('[tabindex]'); if (h) h.focus();
    });
    var again = document.querySelector('[data-again]');
    if (again) again.addEventListener('click', function () { done.hidden = true; form.hidden = false; form.reset(); form.elements.name.focus(); });
  }

  /* ---------- hero clip: loads after the page, never blocks the first paint ---------- */
  var vid = document.querySelector('[data-hero-vid]');
  if (vid && !reduce && !(navigator.connection && navigator.connection.saveData)) {
    var startVid = function () {
      var small = window.innerWidth < 900;
      var webm = vid.canPlayType('video/webm; codecs="vp9"');   // smaller file, plays in Chrome, Edge, Firefox
      var src = webm ? vid.getAttribute(small ? 'data-webm-sm' : 'data-webm-lg') : vid.getAttribute(small ? 'data-src-sm' : 'data-src-lg');
      vid.preload = 'auto';            // preload="none" in the markup keeps the first paint light
      vid.addEventListener('playing', function () { vid.classList.add('on'); }, { once: true });
      vid.src = src;
      var tryPlay = function () { var p = vid.play(); if (p && p.catch) p.catch(function () {}); };
      tryPlay();
      vid.addEventListener('loadeddata', tryPlay, { once: true });
    };
    if (document.readyState === 'complete') setTimeout(startVid, 300);
    else window.addEventListener('load', function () { setTimeout(startVid, 300); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) vid.pause(); else if (vid.classList.contains('on')) vid.play().catch(function () {}); });
  }

  /* ---------- vision band parallax ---------- */
  var band = document.querySelector('[data-par2]');
  if (band && !reduce) {
    var bandTick = false;
    var bandMove = function () {
      bandTick = false;
      var r = band.parentElement.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      band.style.transform = 'translate3d(0,' + (p * -40) + 'px,0)';
    };
    window.addEventListener('scroll', function () { if (!bandTick) { bandTick = true; requestAnimationFrame(bandMove); } }, { passive: true });
    bandMove();
  }

  /* ---------- year ---------- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
