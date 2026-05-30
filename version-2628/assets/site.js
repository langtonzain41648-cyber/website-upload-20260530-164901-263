(function() {
  var header = document.querySelector("[data-header]");
  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");
  var dropdownButton = document.querySelector("[data-dropdown-button]");
  var dropdown = dropdownButton ? dropdownButton.closest(".nav-dropdown") : null;

  function onScroll() {
    if (!header) {
      return;
    }

    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function() {
      mobilePanel.classList.toggle("is-open");
    });
  }

  if (dropdownButton && dropdown) {
    dropdownButton.addEventListener("click", function(event) {
      event.preventDefault();
      dropdown.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });

    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });
  }

  if (slides.length) {
    dots.forEach(function(dot, dotIndex) {
      dot.addEventListener("click", function() {
        showSlide(dotIndex);
      });
    });

    showSlide(0);

    window.setInterval(function() {
      showSlide(currentSlide + 1);
    }, 5600);
  }

  var input = document.querySelector("[data-search-input]");
  var clearButton = document.querySelector("[data-clear-search]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
  var noResult = document.querySelector("[data-no-result]");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function filterCards() {
    if (!input || !cards.length) {
      return;
    }

    var keyword = normalize(input.value);
    var visibleCount = 0;

    cards.forEach(function(card) {
      var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-meta"));
      var matched = !keyword || haystack.indexOf(keyword) >= 0;
      card.style.display = matched ? "" : "none";

      if (matched) {
        visibleCount += 1;
      }
    });

    if (noResult) {
      noResult.classList.toggle("is-visible", visibleCount === 0);
    }
  }

  if (input) {
    input.addEventListener("input", filterCards);
  }

  if (clearButton && input) {
    clearButton.addEventListener("click", function() {
      input.value = "";
      filterCards();
      input.focus();
    });
  }

  var player = document.querySelector("[data-player]");
  var video = document.querySelector("[data-video]");
  var overlay = document.querySelector("[data-player-overlay]");
  var playButton = document.querySelector("[data-play-button]");
  var hlsInstance = null;

  function startVideo() {
    if (!video) {
      return;
    }

    var source = video.getAttribute("data-video-url");

    if (!source) {
      return;
    }

    if (overlay) {
      overlay.classList.add("is-hidden");
    }

    video.setAttribute("controls", "controls");

    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      }

      video.play().catch(function() {});
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (!video.getAttribute("src")) {
        video.setAttribute("src", source);
      }

      video.play().catch(function() {});
      return;
    }

    if (!video.getAttribute("src")) {
      video.setAttribute("src", source);
    }

    video.play().catch(function() {});
  }

  if (player && video) {
    player.addEventListener("click", function(event) {
      if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === "video") {
        return;
      }

      startVideo();
    });
  }

  if (playButton) {
    playButton.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      startVideo();
    });
  }
})();
