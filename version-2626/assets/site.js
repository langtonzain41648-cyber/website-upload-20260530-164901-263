(function() {
  var site = {};

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  site.initHeader = function() {
    var header = document.querySelector("[data-header]");
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-menu]");

    function onScroll() {
      if (!header) {
        return;
      }
      if (window.scrollY > 20) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }

    if (button && menu) {
      button.addEventListener("click", function() {
        menu.classList.toggle("is-open");
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  site.initHero = function() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, position) {
        slide.classList.toggle("is-active", position === index);
      });
      dots.forEach(function(dot, position) {
        dot.classList.toggle("is-active", position === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function() {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function(dot, position) {
      dot.addEventListener("click", function() {
        show(position);
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  };

  site.initFilters = function() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
    panels.forEach(function(panel) {
      var section = panel.closest("section") || document;
      var list = section.querySelector("[data-filter-list]");
      var empty = section.querySelector("[data-empty-state]");
      var input = panel.querySelector("[data-search-input]");
      var buttons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-value]"));
      var activeValue = "all";

      function textOf(card) {
        return [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-tags") || ""
        ].join(" ").toLowerCase();
      }

      function apply() {
        if (!list) {
          return;
        }
        var query = input ? input.value.trim().toLowerCase() : "";
        var cards = Array.prototype.slice.call(list.querySelectorAll(".filter-card"));
        var visible = 0;
        cards.forEach(function(card) {
          var region = card.getAttribute("data-region") || "";
          var matchesRegion = activeValue === "all" || region.indexOf(activeValue) !== -1 || textOf(card).indexOf(activeValue.toLowerCase()) !== -1;
          var matchesQuery = !query || textOf(card).indexOf(query) !== -1;
          var show = matchesRegion && matchesQuery;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      buttons.forEach(function(button) {
        button.addEventListener("click", function() {
          activeValue = button.getAttribute("data-filter-value") || "all";
          buttons.forEach(function(item) {
            item.classList.toggle("active", item === button);
          });
          apply();
        });
      });

      apply();
    });
  };

  site.initPlayer = function(playerId, source) {
    var player = document.getElementById(playerId);
    if (!player) {
      return;
    }

    var video = player.querySelector("video");
    var button = player.querySelector(".play-overlay");
    var started = false;
    var hls = null;

    if (!video || !button || !source) {
      return;
    }

    function attemptPlay() {
      player.classList.add("is-playing");
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function() {
          player.classList.remove("is-playing");
        });
      }
    }

    function mount() {
      if (started) {
        attemptPlay();
        return;
      }
      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.load();
        attemptPlay();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, attemptPlay);
        hls.on(window.Hls.Events.ERROR, function(event, data) {
          if (data && data.fatal && hls) {
            hls.destroy();
            hls = null;
            video.src = source;
            video.load();
            attemptPlay();
          }
        });
        window.setTimeout(attemptPlay, 800);
        return;
      }

      video.src = source;
      video.load();
      attemptPlay();
    }

    button.addEventListener("click", function(event) {
      event.preventDefault();
      mount();
    });

    video.addEventListener("click", function() {
      if (!started || video.paused) {
        mount();
      }
    });

    video.addEventListener("play", function() {
      player.classList.add("is-playing");
    });
  };

  ready(function() {
    site.initHeader();
    site.initHero();
    site.initFilters();
  });

  window.MovieSite = site;
})();
