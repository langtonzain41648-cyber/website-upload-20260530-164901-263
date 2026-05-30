
(function() {
  function initMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      menu.classList.toggle('is-open');
      menu.style.display = menu.classList.contains('is-open') ? 'flex' : 'none';
      menu.style.paddingTop = menu.classList.contains('is-open') ? '0 16px 16px' : '0';
    });
  }

  function initHero() {
    const root = document.querySelector('[data-hero]');
    if (!root) return;
    const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
    const prev = root.querySelector('[data-hero-prev]');
    const next = root.querySelector('[data-hero-next]');
    if (!slides.length) return;
    let index = 0;
    let timer = null;

    function setActive(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }

    function start() {
      stop();
      timer = window.setInterval(() => setActive(index + 1), 5000);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    prev && prev.addEventListener('click', () => { setActive(index - 1); start(); });
    next && next.addEventListener('click', () => { setActive(index + 1); start(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { setActive(i); start(); }));
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    setActive(0);
    start();
  }

  function initSearch() {
    const inputs = Array.from(document.querySelectorAll('[data-search-input]'));
    if (!inputs.length) return;
    inputs.forEach((input) => {
      const page = input.closest('main') || document;
      const root = page.querySelector('[data-filter-root]');
      const cards = root ? Array.from(root.querySelectorAll('[data-card]')) : [];
      if (!cards.length) return;
      const filter = () => {
        const q = input.value.trim().toLowerCase();
        cards.forEach((card) => {
          const hay = [card.dataset.title, card.dataset.region, card.dataset.genre, card.dataset.tags, card.dataset.year, card.textContent].join(' ').toLowerCase();
          card.style.display = hay.includes(q) ? '' : 'none';
        });
      };
      input.addEventListener('input', filter);
    });
  }

  function initPlayers() {
    document.querySelectorAll('[data-player]').forEach((wrap) => {
      if (wrap.dataset.ready) return;
      const src = wrap.dataset.src;
      const video = wrap.querySelector('video');
      const btn = wrap.querySelector('[data-play-button]');
      if (!src || !video) return;
      const attach = () => {
        if (window.Hls && Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(video);
          wrap._hls = hls;
        } else {
          video.src = src;
        }
        wrap.dataset.ready = '1';
      };
      attach();
      const tryPlay = () => {
        video.play().catch(() => {});
        if (btn) btn.style.display = 'none';
      };
      btn && btn.addEventListener('click', () => {
        if (!wrap.dataset.ready) attach();
        tryPlay();
      });
      video.addEventListener('play', () => { if (btn) btn.style.display = 'none'; });
    });
  }

  function initActiveNav() {
    const path = location.pathname.replace(/\\/g, '/');
    document.querySelectorAll('.nav-link, .mobile-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const normalized = href.replace(/^\.\//, '');
      if (path.endsWith('/' + normalized) || path.endsWith(normalized)) {
        link.classList.add('active');
      }
      if (normalized === 'index.html' && (path.endsWith('/') || path.endsWith('/index.html') || path === '')) {
        link.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initHero();
    initSearch();
    initPlayers();
    initActiveNav();
  });
})();
