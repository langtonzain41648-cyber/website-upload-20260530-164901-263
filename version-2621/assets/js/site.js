(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const navLinks = document.querySelector('[data-nav-links]');
    const navSearch = document.querySelector('.nav-search');

    if (menuButton && navLinks) {
        menuButton.addEventListener('click', function () {
            navLinks.classList.toggle('is-open');
            if (navSearch) {
                navSearch.classList.toggle('is-open');
            }
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let currentSlide = 0;
    let heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === currentSlide);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function startHeroTimer() {
        if (slides.length <= 1) {
            return;
        }
        heroTimer = window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    function resetHeroTimer() {
        if (heroTimer) {
            window.clearInterval(heroTimer);
        }
        startHeroTimer();
    }

    const prevButton = document.querySelector('[data-hero-prev]');
    const nextButton = document.querySelector('[data-hero-next]');

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            showSlide(currentSlide - 1);
            resetHeroTimer();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            showSlide(currentSlide + 1);
            resetHeroTimer();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const index = Number(dot.getAttribute('data-hero-dot') || 0);
            showSlide(index);
            resetHeroTimer();
        });
    });

    showSlide(0);
    startHeroTimer();

    const localSearchInputs = Array.from(document.querySelectorAll('[data-local-search]'));
    localSearchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            const keyword = input.value.trim().toLowerCase();
            const items = Array.from(document.querySelectorAll('[data-search-item]'));
            items.forEach(function (item) {
                const blob = (item.getAttribute('data-search') || '').toLowerCase();
                item.classList.toggle('is-hidden', keyword && !blob.includes(keyword));
            });
        });
    });

    const searchDataScript = document.getElementById('movie-search-data');
    const globalInput = document.getElementById('global-search-input');
    const results = document.getElementById('global-search-results');
    const count = document.getElementById('global-search-count');

    if (searchDataScript && globalInput && results && count) {
        let data = [];
        try {
            data = JSON.parse(searchDataScript.textContent || '[]');
        } catch (error) {
            data = [];
        }

        function card(movie) {
            const tags = (movie.tags || []).slice(0, 3).map(function (tag) {
                return '<span>' + escapeHtml(tag) + '</span>';
            }).join('');
            return [
                '<article class="movie-card">',
                '    <a class="poster-box" href="' + movie.href + '">',
                '        <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
                '        <span class="play-float">▶</span>',
                '    </a>',
                '    <div class="movie-card-body">',
                '        <a class="movie-title" href="' + movie.href + '">' + escapeHtml(movie.title) + '</a>',
                '        <p class="movie-desc">' + escapeHtml(movie.oneLine || '') + '</p>',
                '        <div class="movie-meta">',
                '            <span>' + escapeHtml(String(movie.year || '')) + '</span>',
                '            <span>' + escapeHtml(movie.region || '') + '</span>',
                '            <span>' + escapeHtml(movie.type || '') + '</span>',
                '        </div>',
                '        <div class="tag-row">' + tags + '</div>',
                '    </div>',
                '</article>'
            ].join('');
        }

        function escapeHtml(value) {
            return String(value).replace(/[&<>"]/g, function (character) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;'
                }[character];
            });
        }

        function render() {
            const params = new URLSearchParams(window.location.search);
            const fromQuery = params.get('q') || '';
            if (!globalInput.value && fromQuery) {
                globalInput.value = fromQuery;
            }
            const keyword = globalInput.value.trim().toLowerCase();
            const filtered = data.filter(function (movie) {
                if (!keyword) {
                    return true;
                }
                const blob = [
                    movie.title,
                    movie.year,
                    movie.region,
                    movie.type,
                    movie.genre,
                    movie.category,
                    (movie.tags || []).join(' '),
                    movie.oneLine
                ].join(' ').toLowerCase();
                return blob.includes(keyword);
            }).slice(0, 120);
            count.textContent = keyword
                ? '找到 ' + filtered.length + ' 条匹配结果，最多展示 120 条。'
                : '当前收录 ' + data.length + ' 部影片，可输入关键词搜索。';
            results.innerHTML = filtered.map(card).join('');
        }

        globalInput.addEventListener('input', render);
        render();
    }
})();
