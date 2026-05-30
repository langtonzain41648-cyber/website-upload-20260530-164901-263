(function() {
  var video = document.querySelector('.video-player');
  var cover = document.querySelector('.player-cover');
  var url = window.pageVideoUrl;
  var prepared = false;
  var hls = null;

  if (!video || !url) {
    return;
  }

  function prepare() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      return;
    }

    video.src = url;
  }

  function start() {
    prepare();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function() {});
    }
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  video.addEventListener('click', function() {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  prepare();
})();
