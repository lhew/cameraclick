
const constraints = {
    vga: {
        video: {width: {exact: 640}, height: {exact: 480}}
      },
    
    hd: {
        video: { width: { exact: 1280 }, height: { exact: 720 } }
    },
    
    fullhd: {
        video: { width: { exact: 1920 }, height: { exact: 1080 } }
    } 
};

export default function CameraClick(element, camOptions) {
    let isPlaying = false;

    const options = {
        width: 320,
        height: 480,
        screenshotCaption: "Screenshot",
        resolution: 'vga',
        captureCaption: { start: "Start", stop: "Stop" },
        ...camOptions,
    }

    let mediaTracks = {};

    const videoElement = element;

    const captureBtn = document.createElement('button');
    const toggleVideo = document.createElement('button');
    const videoCanvas = document.createElement('video');
    const videoWrapper = document.createElement('div');

    videoCanvas.autoplay = true;
    videoCanvas.width = options.width;
    videoCanvas.height = options.height;
    videoCanvas.style.objectFit = 'cover';

    captureBtn.innerHTML = options.screenshotCaption;
    captureBtn.disabled = true;
    captureBtn.onclick = function (captureArguments) {
        const captureOptions = {
            type: 'image/png',
            quality: 1,
            ...captureArguments
        }
        const canvas = document.createElement('canvas');
        canvas.width = videoCanvas.width;
        canvas.height = videoCanvas.height;
        canvas.getContext('2d').drawImage(videoCanvas, 0, 0);

        if (typeof camOptions.onCapture === 'function')
            return camOptions.onCapture(canvas.toDataURL(captureOptions));
    };

    toggleVideo.innerHTML = options.captureCaption.start;
    toggleVideo.onclick = function () {
        if (!isPlaying) {
            isPlaying = true;
            captureBtn.disabled = false;
            videoWrapper.appendChild(videoCanvas);
            toggleVideo.innerHTML = options.captureCaption.stop;

            navigator.getUserMedia(constraints[options.resolution], function (localMediaStream) {
                videoCanvas.srcObject = localMediaStream;
                mediaTracks = localMediaStream;
            }, function (error) {
                console.log('oops', error);
            });

        } else {
            captureBtn.disabled = true;
            isPlaying = false;
            videoWrapper.removeChild(videoCanvas);
            toggleVideo.innerHTML = "START";
            [...mediaTracks.getTracks()].map(track => track.stop());
        }
    };


    videoElement.appendChild(captureBtn);
    videoElement.appendChild(toggleVideo);
    videoElement.appendChild(videoWrapper);

    function handleError(error) {
        console.error('Error: ', error);
    }
}