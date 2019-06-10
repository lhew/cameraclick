function cameraClick(element, camOptions) {


    const options = {
        width: 320,
        height: 480,
        ...camOptions
    }

    const constraint = {
        video: { width: { min: options.width }, height: { min: options.height } }
    };

    let mediaTracks = {};

    const videoElement = element;
    const captureBtn = document.createElement('button');
    const toggleVideo = document.createElement('button');
    const videoCanvas = document.createElement('video');

    let isPlaying = false;

    videoCanvas.autoplay = true;
    videoCanvas.width = options.width;
    videoCanvas.height = options.height;
    videoCanvas.style.objectFit = 'cover';
    videoCanvas.style.backgroundColor = 'red';

    captureBtn.innerHTML = "SCREENSHOT";
    captureBtn.disabled = true;
    captureBtn.onclick = function () {
        const canvas = document.createElement('canvas');
        canvas.width = videoCanvas.width;
        canvas.height = videoCanvas.height;
        canvas.getContext('2d').drawImage(videoCanvas, 0, 0);

        if(typeof camOptions.onCapture === 'function')
            return camOptions.onCapture(canvas.toDataURL('image/png'));
    };

    toggleVideo.innerHTML = "START";
    toggleVideo.onclick = function () {
        if (!isPlaying) {
            isPlaying = true;
            captureBtn.disabled = false;
            videoElement.appendChild(videoCanvas);
            toggleVideo.innerHTML = "STOP";

            navigator.getUserMedia(constraint, function (localMediaStream) {
                videoCanvas.srcObject = localMediaStream;
                mediaTracks = localMediaStream;
            }, function (error) {
                console.log('oops', error);
            });

        } else {
            captureBtn.disabled = true;
            isPlaying = false;
            videoElement.removeChild(videoCanvas);
            toggleVideo.innerHTML = "START";
            [...mediaTracks.getTracks()].map(track => track.stop());
        }
    };


    videoElement.appendChild(captureBtn);
    videoElement.appendChild(toggleVideo);

    function handleError(error) {
        console.error('Error: ', error);
    }

}

