(function () {
  function startVideo(card) {
    var video = card.querySelector('video');
    var button = card.querySelector('.play-overlay');
    var stream = card.getAttribute('data-stream');

    if (!video || !stream) {
      return;
    }

    if (!video.dataset.ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video.hls = hls;
      } else {
        video.src = stream;
      }

      video.dataset.ready = '1';
    }

    if (button) {
      button.classList.add('is-hidden');
    }

    var promise = video.play();

    if (promise && promise.catch) {
      promise.catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  document.querySelectorAll('.player-card').forEach(function (card) {
    var button = card.querySelector('.play-overlay');
    var video = card.querySelector('video');

    if (button) {
      button.addEventListener('click', function () {
        startVideo(card);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        startVideo(card);
      });
    }
  });
})();
