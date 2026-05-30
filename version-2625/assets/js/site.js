(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  if (slides.length) {
    showSlide(0);

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterForm = document.querySelector('[data-filter-form]');
  var queryInput = document.querySelector('[data-filter-query]');
  var typeSelect = document.querySelector('[data-filter-type]');
  var regionSelect = document.querySelector('[data-filter-region]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var emptyState = document.querySelector('[data-empty-state]');

  function getText(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var query = getText(queryInput && queryInput.value);
    var type = getText(typeSelect && typeSelect.value);
    var region = getText(regionSelect && regionSelect.value);
    var year = getText(yearSelect && yearSelect.value);
    var visible = 0;

    cards.forEach(function (card) {
      var text = getText([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.category
      ].join(' '));
      var ok = true;

      if (query && text.indexOf(query) === -1) {
        ok = false;
      }

      if (type && getText(card.dataset.type) !== type) {
        ok = false;
      }

      if (region && getText(card.dataset.region).indexOf(region) === -1) {
        ok = false;
      }

      if (year && getText(card.dataset.year) !== year) {
        ok = false;
      }

      card.style.display = ok ? '' : 'none';

      if (ok) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('visible', visible === 0);
    }
  }

  if (filterForm && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q && queryInput) {
      queryInput.value = q;
    }

    [queryInput, typeSelect, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilters();
    });

    applyFilters();
  }
})();
