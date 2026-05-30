(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupHeader() {
        var header = document.querySelector('[data-header]');
        var toggle = document.querySelector('[data-mobile-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        var backTop = document.querySelector('[data-back-top]');

        function onScroll() {
            if (header) {
                header.classList.toggle('is-scrolled', window.scrollY > 16);
            }
            if (backTop) {
                backTop.classList.toggle('is-visible', window.scrollY > 320);
            }
        }

        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                panel.classList.toggle('is-open');
            });
        }

        if (backTop) {
            backTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function setupHero() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = selectAll('.hero-slide', slider);
        var dots = selectAll('[data-slide-dot]', slider);
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide-dot')) || 0);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupFilters() {
        selectAll('[data-filter-root]').forEach(function (panel) {
            var section = panel.parentElement;
            var input = panel.querySelector('[data-filter-input]');
            var region = panel.querySelector('[data-filter-region]');
            var year = panel.querySelector('[data-filter-year]');
            var category = panel.querySelector('[data-filter-category]');
            var empty = panel.querySelector('[data-filter-empty]');
            var cards = selectAll('.js-movie-card', section);

            function valueOf(element) {
                return element ? String(element.value || '').trim().toLowerCase() : '';
            }

            function apply() {
                var query = valueOf(input);
                var regionValue = valueOf(region);
                var yearValue = valueOf(year);
                var categoryValue = valueOf(category);
                var visible = 0;

                cards.forEach(function (card) {
                    var search = String(card.getAttribute('data-search') || '').toLowerCase();
                    var cardRegion = String(card.getAttribute('data-region') || '').toLowerCase();
                    var cardYear = String(card.getAttribute('data-year') || '').toLowerCase();
                    var cardCategory = String(card.getAttribute('data-category') || '').toLowerCase();
                    var matched = true;

                    if (query && search.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (regionValue && cardRegion !== regionValue) {
                        matched = false;
                    }
                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }
                    if (categoryValue && cardCategory !== categoryValue) {
                        matched = false;
                    }

                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            [input, region, year, category].forEach(function (element) {
                if (element) {
                    element.addEventListener('input', apply);
                    element.addEventListener('change', apply);
                }
            });
        });
    }

    window.initMoviePlayer = function (videoId, buttonId, sourceUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var ready = false;
        var hls = null;

        if (!video || !sourceUrl) {
            return;
        }

        function attachSource() {
            if (ready) {
                return;
            }
            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                return;
            }

            video.src = sourceUrl;
            video.load();
        }

        function playVideo() {
            attachSource();
            if (button) {
                button.classList.add('is-hidden');
            }
            video.controls = true;
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        setupHeader();
        setupHero();
        setupFilters();
    });
})();
