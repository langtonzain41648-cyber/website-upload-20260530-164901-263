(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobile = document.querySelector('[data-mobile-nav]');

  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    const input = root.querySelector('[data-search-input]');
    const selects = Array.from(root.querySelectorAll('[data-filter-select]'));
    const scope = root.parentElement || document;
    const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));

    function valueOf(name) {
      const item = selects.find(function (select) {
        return select.getAttribute('data-filter-select') === name;
      });
      return item ? item.value : '';
    }

    function applyFilters() {
      const keyword = (input ? input.value : '').trim().toLowerCase();
      const year = valueOf('year');
      const region = valueOf('region');
      const type = valueOf('type');

      cards.forEach(function (card) {
        const text = (card.getAttribute('data-title') || '').toLowerCase();
        const sameKeyword = !keyword || text.indexOf(keyword) !== -1;
        const sameYear = !year || card.getAttribute('data-year') === year;
        const sameRegion = !region || card.getAttribute('data-region') === region;
        const sameType = !type || card.getAttribute('data-type') === type;
        card.hidden = !(sameKeyword && sameYear && sameRegion && sameType);
      });
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    selects.forEach(function (select) {
      select.addEventListener('change', applyFilters);
    });
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const thumbs = Array.from(hero.querySelectorAll('[data-hero-thumb]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('active', thumbIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        show(Number(thumb.getAttribute('data-hero-thumb')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  });
})();
