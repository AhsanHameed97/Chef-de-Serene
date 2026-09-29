(function () {
  'use strict';

  /* ---------- Sticky nav shrink ---------- */
  var nav = document.getElementById('siteNav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero load-in ---------- */
  var hero = document.getElementById('hero');
  window.addEventListener('load', function () {
    requestAnimationFrame(function () { hero.classList.add('loaded'); });
  });

  /* ---------- Hero scroll cue ---------- */
  var scrollCue = document.getElementById('heroScrollCue');
  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var next = document.querySelector('.hero-wrap').nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Moat row spotlight ---------- */
  document.querySelectorAll('.moat-row').forEach(function (row) {
    row.addEventListener('mousemove', function (e) {
      var rect = row.getBoundingClientRect();
      row.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      row.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  revealEls.forEach(function (el) {
    var delay = el.getAttribute('data-reveal-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------- Mobile nav fullscreen ---------- */
  var mobileNav = document.getElementById('mobileNav');
  var mobileNavClose = document.getElementById('mobileNavClose');
  document.querySelectorAll('.nav-burger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  });
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function () { mobileNav.classList.remove('open'); });
  }
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
  });

  /* ---------- Nav link active pill on click ---------- */
  document.querySelectorAll('.site-nav, .hero-nav').forEach(function (navEl) {
    var links = navEl.querySelectorAll('.nav-group a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        links.forEach(function (l) { l.classList.remove('nav-pill'); });
        link.classList.add('nav-pill');
      });
    });
  });

  /* ---------- Gallery tabs ---------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');
  var underline = document.getElementById('tabUnderline');

  function positionUnderline(btn) {
    underline.style.left = btn.offsetLeft + 'px';
    underline.style.width = btn.offsetWidth + 'px';
  }
  function activateTab(name) {
    tabBtns.forEach(function (b) { b.classList.toggle('active', b.dataset.tab === name); });
    tabPanels.forEach(function (p) { p.classList.toggle('active', p.id === 'panel-' + name); });
    var activeBtn = document.querySelector('.tab-btn[data-tab="' + name + '"]');
    positionUnderline(activeBtn);
  }
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { activateTab(btn.dataset.tab); });
  });
  window.addEventListener('load', function () { positionUnderline(document.querySelector('.tab-btn.active')); });
  window.addEventListener('resize', function () { positionUnderline(document.querySelector('.tab-btn.active')); });

  /* ---------- Modal ---------- */
  var modalBackdrop = document.getElementById('modalBackdrop');
  var modalClose = document.getElementById('modalClose');
  var openTriggers = [document.getElementById('navCta'), document.getElementById('navCtaHero'), document.getElementById('heroCtaPrimary'), document.getElementById('openIntakeModal')];
  var intakeForm = document.getElementById('intakeForm');
  var formSuccess = document.getElementById('formSuccess');

  function openModal() {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      intakeForm.style.display = '';
      formSuccess.classList.remove('show');
    }, 400);
  }
  openTriggers.forEach(function (btn) {
    if (btn) btn.addEventListener('click', openModal);
  });
  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', function (e) {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
  });

  intakeForm.addEventListener('submit', function (e) {
    e.preventDefault();
    intakeForm.style.display = 'none';
    formSuccess.classList.add('show');
  });

  /* ---------- Smooth nav link scroll offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
