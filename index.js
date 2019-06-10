function cameraClick(element){
    const videoElement = element;
    const videoCanvas = document.createElement('video');
    videoCanvas.autoplay = true;
    const videoCaptureBtn = document.createElement('button');
    videoCaptureBtn.innerHTML = "CAPTURE"

    videoElement.appendChild(videoCanvas);
    videoElement.appendChild(videoCaptureBtn);
    // const audioSelect = document.querySelector('select#audioSource');
    // const videoSelect = document.querySelector('select#videoSource');
    navigator.mediaDevices.enumerateDevices()
    .then(getStream)
    .then(gotStream)
    .catch(handleError);
    /*    
    
      
    audioSelect.onchange = getStream;
    videoSelect.onchange = getStream;

    function gotDevices(deviceInfos) {
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
          option.text = deviceInfo.label ||
            'microphone ' + (audioSelect.length + 1);
          audioSelect.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || 'camera ' +
            (videoSelect.length + 1);
          videoSelect.appendChild(option);
        } else {
          console.log('Found another kind of device: ', deviceInfo);
        }
      }
    }
*/    
    function getStream() {
      if (window.stream) {
        window.stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    
      const constraints = {
        video: true
      };
    
      navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).catch(handleError);
    }
    
    function gotStream(stream) {
      window.stream = stream; // make stream available to console
      videoCanvas.srcObject = stream;
    }
    
    function handleError(error) {
      console.error('Error: ', error);
    }
}

