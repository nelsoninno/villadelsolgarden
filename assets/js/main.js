/* Villa del Sol Garden - header state, mobile nav, scroll reveals, lazy hero video */
(function () {
  var header = document.querySelector('.site-header');
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');

  // header solidifies on scroll - hysteresis (different add/remove thresholds)
  // prevents the logo-resize feedback loop that made the header jitter near the top
  var scrolledState = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (!scrolledState && y > 130) { scrolledState = true; header.classList.add('scrolled'); }
    else if (scrolledState && y < 60) { scrolledState = false; header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile nav
  if (toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var open = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // scroll reveals
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // lazy hero video: poster paints instantly, video swaps in after load on larger screens
  var v = document.querySelector('.hero-video');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loadHeroVideo() {
    if (!v || prefersReduced || window.innerWidth < 768) return;
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    ['mp4', 'webm'].forEach(function (type) {
      var src = v.getAttribute('data-' + type);
      if (!src) return;
      var s = document.createElement('source');
      s.src = src;
      s.type = type === 'webm' ? 'video/webm' : 'video/mp4';
      v.appendChild(s);
    });
    v.load();
    v.addEventListener('playing', function () { v.classList.add('playing'); });
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  if (document.readyState === 'complete') loadHeroVideo();
  else window.addEventListener('load', loadHeroVideo);

  // ambient wind-blown leaf flock: a cluster of small leaves crossing left to right,
  // each with a staggered delay so a gust ripples through them
  if (!prefersReduced) {
    // three leaf shapes drawn in the style of the Villa del Sol Garden logo (lanceolate, with a midrib)
    var LEAVES = [
      '<svg viewBox="0 0 40 100"><path d="M20 2C33 26 33 74 20 98 7 74 7 26 20 2Z" fill="currentColor"/><path d="M20 12V88" stroke="rgba(0,0,0,.15)" stroke-width="1.6"/></svg>',
      '<svg viewBox="0 0 54 100"><path d="M27 2C47 24 47 76 27 98 7 76 7 24 27 2Z" fill="currentColor"/><path d="M27 12V88" stroke="rgba(0,0,0,.15)" stroke-width="1.8"/></svg>',
      '<svg viewBox="0 0 64 100"><path d="M12 96C3 58 22 18 56 6 52 46 40 84 12 96Z" fill="currentColor"/><path d="M18 88C26 58 40 32 50 16" stroke="rgba(0,0,0,.15)" stroke-width="1.8" fill="none"/></svg>'
    ];
    var COLORS = ['#234A39', '#C39A3D', '#D98A6B']; // forest green, gold, coral, from the logo
    document.querySelectorAll('.leaf-flock').forEach(function (flock) {
      var n = parseInt(flock.getAttribute('data-n') || '12', 10);
      var onDark = flock.classList.contains('on-dark');
      var band = 26 + Math.random() * 24;      // vertical centre of this flock (%)
      for (var i = 0; i < n; i++) {
        var lf = document.createElement('span');
        lf.className = 'lf';
        var size = 12 + Math.round(Math.random() * 26);       // small, varied
        lf.style.width = size + 'px';
        lf.style.height = size + 'px';
        lf.style.top = (band + (Math.random() * 26 - 13)).toFixed(1) + '%'; // clustered band
        lf.style.animationDuration = (16 + Math.random() * 6).toFixed(1) + 's';
        // staggered negative delays spread the flock along the wind path (gust ripple)
        lf.style.animationDelay = '-' + (i * 0.55 + Math.random() * 0.3).toFixed(2) + 's';
        lf.style.color = onDark ? '#EDE3CE' : COLORS[i % 3];
        lf.innerHTML = LEAVES[i % 3];
        flock.appendChild(lf);
      }
    });
  }
})();

/* copy-to-clipboard buttons (e.g. Wi-Fi password on the guest page) */
(function () {
  function flash(b){ b.classList.add('copied'); setTimeout(function(){ b.classList.remove('copied'); }, 1600); }
  document.querySelectorAll('.copyable').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var t = btn.getAttribute('data-copy') || btn.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function(){ flash(btn); }).catch(function(){ flash(btn); });
      } else { flash(btn); }
    });
  });
})();
