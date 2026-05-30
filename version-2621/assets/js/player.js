import { H as Hls } from './hls-vendor-dru42stk.js';

const video = document.querySelector('[data-video-target]');
const button = document.querySelector('[data-play-url]');
const message = document.querySelector('[data-player-message]');
let hlsInstance = null;

function showMessage(text) {
    if (message) {
        message.textContent = text || '';
    }
}

function attachHls(url) {
    if (!video || !url) {
        showMessage('播放源暂不可用');
        return;
    }

    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }

    if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
            showMessage('');
            video.play().catch(function () {
                showMessage('浏览器阻止了自动播放，请再次点击播放按钮。');
            });
        });
        hlsInstance.on(Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
                return;
            }
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                showMessage('网络异常，正在尝试重新加载...');
                hlsInstance.startLoad();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                showMessage('媒体解码异常，正在尝试恢复...');
                hlsInstance.recoverMediaError();
            } else {
                showMessage('当前浏览器无法播放该视频源。');
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', function () {
            showMessage('');
            video.play().catch(function () {
                showMessage('浏览器阻止了自动播放，请再次点击播放按钮。');
            });
        }, { once: true });
    } else {
        showMessage('您的浏览器不支持 HLS 播放。');
    }
}

if (button && video) {
    button.addEventListener('click', function () {
        const url = button.getAttribute('data-play-url');
        button.classList.add('is-hidden');
        attachHls(url);
    });
}
