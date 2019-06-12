function calculateCanvasPosition (canvas, width, height) {
  return {
    x: (canvas.width - width) / 2,
    y: (canvas.height - height) / 2
  }
}

export default function CameraClick (element, camOptions) {
  let isPlaying = false

  const options = {
    width: 320,
    height: 480,
    screenshotCaption: 'Screenshot',
    resolution: 'auto',
    captureCaption: { start: 'Start', stop: 'Stop' },
    ...camOptions
  }

  let mediaTracks = {}

  const videoElement = element

  const captureBtn = document.createElement('button')
  const toggleVideo = document.createElement('button')
  const videoCanvas = document.createElement('video')
  const videoWrapper = document.createElement('div')

  videoElement.className = 'cameraclick'
  videoWrapper.className = `${element.id || 'element'}__video-wrapper`
  toggleVideo.className = `${element.id || 'element'}__camera-toggler`
  videoCanvas.autoplay = true
  videoCanvas.width = options.width
  videoCanvas.height = options.height
  videoCanvas.style.objectFit = 'cover'

  const open = async (onOpen, onError) => {
    if (typeof onOpen === 'function') {
      onOpen((await checkPermissions()) === 'granted')
    }

    isPlaying = true
    captureBtn.disabled = false
    toggleVideo.innerHTML = options.captureCaption.stop

    navigator.getUserMedia(
      { video: true },
      function (localMediaStream) {
        videoWrapper.innerHTML = ''
        videoWrapper.appendChild(videoCanvas)
        videoCanvas.srcObject = localMediaStream
        mediaTracks = localMediaStream
        window.mediaTracks = mediaTracks
      },
      function (error) {
        if (typeof onError === 'function') onError(error)
      }
    )
  }

  const capture = (captureArguments = {}) => {
    const captureOptions = {
      type: 'image/jpeg',
      quality: 0.85,
      stopStreamAfterCapture: true,
      ...captureArguments
    }
    const canvas = document.createElement('canvas')
    canvas.width = videoCanvas.clientWidth
    canvas.height = videoCanvas.clientHeight
    const { width, height } = [...mediaTracks.getVideoTracks()].filter(video => video.enabled)[0].getSettings()
    const newWidth = Math.ceil((canvas.width / width + 1) * width)
    const newHeight = Math.ceil((canvas.height / height) * height)
    const { x, y } = calculateCanvasPosition(canvas, newWidth, newHeight)

    canvas.getContext('2d').drawImage(videoCanvas, x, y, newWidth, newHeight)

    if (typeof camOptions.onCapture === 'function') {
      const { type, quality } = captureOptions
      camOptions.onCapture({ image: canvas.toDataURL(type, quality), cropInfo: { x, y, width: newWidth, height: newHeight } })
    }
  }

  toggleVideo.innerHTML = options.captureCaption.start
  toggleVideo.onclick = function () {
    if (!isPlaying) {
      open()
    } else {
      close(true)
    }
  }

  const close = (activateCallback) => {
    captureBtn.disabled = true
    isPlaying = false
    toggleVideo.innerHTML = options.captureCaption.start
    videoCanvas.srcObject = null;

    [...mediaTracks.getTracks()].map(track => track.stop())

    if (typeof camOptions.onClose === 'function' && activateCallback) {
      camOptions.onClose()
    }
  }

  const checkPermissions = async function () {
    const permissions = await navigator.permissions.query({ name: 'camera' })
    const result = await permissions

    return result.state
  }

  const isOpen = () => isPlaying

  captureBtn.innerHTML = options.screenshotCaption
  captureBtn.className = `${element.id || 'element'}__capture`
  captureBtn.disabled = true
  captureBtn.onclick = capture

  videoElement.appendChild(videoWrapper)
  videoElement.appendChild(captureBtn)
  videoElement.appendChild(toggleVideo)

  return {
    isOpen,
    capture,
    open,
    close
  }
}
