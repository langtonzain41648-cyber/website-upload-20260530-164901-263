(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(nextSlide, 5000);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startHero();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')));
        startHero();
      });
    });

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    showSlide(0);
    startHero();
  }

  var lists = Array.prototype.slice.call(document.querySelectorAll('[data-card-list]'));

  lists.forEach(function (list) {
    var root = list.closest('section') || document;
    var input = root.querySelector('[data-filter-input]');
    var type = root.querySelector('[data-filter-type]');
    var category = root.querySelector('[data-filter-category]');
    var empty = root.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(list.children);

    function cardText(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category')
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var typeValue = type ? type.value.trim().toLowerCase() : '';
      var categoryValue = category ? category.value.trim().toLowerCase() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = cardText(card);
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchType = !typeValue || String(card.getAttribute('data-type')).toLowerCase().indexOf(typeValue) !== -1;
        var matchCategory = !categoryValue || String(card.getAttribute('data-category')).toLowerCase() === categoryValue;
        var matched = matchKeyword && matchType && matchCategory;

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, type, category].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });
})();
