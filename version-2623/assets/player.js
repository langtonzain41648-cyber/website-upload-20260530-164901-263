(function () {
  var attached = false;
  var hlsInstance = null;

  function attachSource(video, source) {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        capLevelToPlayerSize: true,
        startLevel: -1,
        autoStartLoad: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  window.initMoviePlayer = function (source) {
    var video = document.getElementById('moviePlayer');
    var overlay = document.getElementById('playerOverlay');

    if (!video || !source) {
      return;
    }

    function start() {
      attachSource(video, source);

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      video.controls = true;

      var playTask = video.play();

      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          video.controls = true;
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!attached || video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
