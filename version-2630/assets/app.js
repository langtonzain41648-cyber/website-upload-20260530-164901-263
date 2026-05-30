(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMobileNav() {
    var button = document.querySelector("[data-mobile-nav-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var previous = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    if (previous) {
      previous.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalized(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setupFilters() {
    var form = document.querySelector("[data-filter-form]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
    if (!form || !cards.length) {
      return;
    }
    var input = form.querySelector("[data-filter-input]");
    var category = form.querySelector("[data-filter-category]");
    var region = form.querySelector("[data-filter-region]");
    var year = form.querySelector("[data-filter-year]");
    var params = new URLSearchParams(window.location.search);

    if (input && params.get("q")) {
      input.value = params.get("q");
    }
    if (category && params.get("category")) {
      category.value = params.get("category");
    }

    function apply() {
      var q = normalized(input && input.value);
      var cat = normalized(category && category.value);
      var reg = normalized(region && region.value);
      var yr = normalized(year && year.value);

      cards.forEach(function (card) {
        var text = normalized([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags,
          card.textContent
        ].join(" "));
        var matches = true;
        if (q && text.indexOf(q) === -1) {
          matches = false;
        }
        if (cat && normalized(card.dataset.category) !== cat) {
          matches = false;
        }
        if (reg && normalized(card.dataset.region).indexOf(reg) === -1) {
          matches = false;
        }
        if (yr && normalized(card.dataset.year).indexOf(yr) === -1) {
          matches = false;
        }
        card.classList.toggle("is-filter-hidden", !matches);
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      apply();
    });

    [input, category, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    apply();
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var overlay = player.querySelector(".player-overlay");
      var stream = player.getAttribute("data-stream");
      var hls = null;
      var attached = false;

      if (!video || !stream || !overlay) {
        return;
      }

      function attach() {
        if (attached) {
          return;
        }
        attached = true;
        video.controls = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function play() {
        attach();
        overlay.classList.add("is-hidden");
        var action = video.play();
        if (action && typeof action.catch === "function") {
          action.catch(function () {});
        }
      }

      overlay.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (!attached || video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });
      video.addEventListener("ended", function () {
        overlay.classList.remove("is-hidden");
      });
      window.addEventListener("beforeunload", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMobileNav();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
