process.env.NODE_ENV &&
  console.log(
    `${require('../package.json').name} v${require('../package.json').version}`
  )
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
  const videoCanvas = document.createElement('video')
  const videoWrapper = document.createElement('div')
  const wrapper = document.createElement('div')

  const open = async (onOpen, onSuccess, onError) => {
    if (typeof onOpen === 'function') {
      onOpen((await checkPermissions()) === 'granted')
    }

    isPlaying = true
    captureBtn.disabled = false
    try {
      const localMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      })
      if (localMediaStream) {
        videoWrapper.innerHTML = ''
        videoWrapper.appendChild(videoCanvas)
        videoCanvas.srcObject = localMediaStream
        mediaTracks = localMediaStream
        window.mediaTracks = mediaTracks

        if (typeof onSuccess === 'function') {
          console.log('rolou')
          onSuccess(localMediaStream)
        }
      }
    } catch (e) {
      if (typeof onSuccess === 'function') {
        onError(e)
      }
    }
  }

  const capture = (captureArguments = {}) => {
    const captureOptions = {
      type: 'image/jpeg',
      quality: 1,
      stopStreamAfterCapture: true,
      ...captureArguments
    }
    const canvas = document.createElement('canvas')
    const { width, height } = [...mediaTracks.getVideoTracks()]
      .filter(video => video.enabled)[0]
      .getSettings()
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(videoCanvas, 0, 0)

    if (typeof camOptions.onCapture === 'function') {
      const { type, quality } = captureOptions
      camOptions.onCapture({
        data: canvas.toDataURL(type, quality),
        cropInfo: { width, height }
      })
    }
  }

  const close = activateCallback => {
    try {
      captureBtn.disabled = true
      isPlaying = false
      videoCanvas.srcObject = null

      /* global webkitMediaStream:true */
      var MediaStream = window.MediaStream

      if (
        typeof MediaStream === 'undefined' &&
        typeof webkitMediaStream !== 'undefined'
      ) {
        MediaStream = webkitMediaStream
      }

      if (
        typeof MediaStream !== 'undefined' &&
        !('stop' in MediaStream.prototype)
      ) {
        MediaStream.prototype.stop = function () {
          Array.from(this.getTracks()).forEach(function (track) {
            if (track) {
              track.stop()
            }
          })
        }
      }
      mediaTracks.stop()
    } catch (e) {
      console.log('cant stop tracks: ', e)
    }

    if (typeof camOptions.onClose === 'function' && activateCallback) {
      camOptions.onClose()
    }
  }

  const checkPermissions = async function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const permissions = await navigator.mediaDevices.getUserMedia({
        video: true
      })
      const result = await permissions
      return result.state
    }
    return false
  }

  const isOpen = () => isPlaying

  videoElement.className = 'cameraclick'
  wrapper.className = `${element.className || 'element'}__wrapper`
  videoWrapper.className = `${element.className || 'element'}__video-wrapper`
  captureBtn.className = `${element.className || 'element'}__capture`
  captureBtn.innerHTML = options.screenshotCaption
  captureBtn.disabled = true
  captureBtn.onclick = capture
  videoCanvas.autoplay = true
  videoCanvas.width = options.width
  videoCanvas.height = options.height
  videoCanvas.style.objectFit = 'cover'

  wrapper.appendChild(videoWrapper)
  wrapper.appendChild(captureBtn)
  videoElement.appendChild(wrapper)

  return {
    isOpen,
    capture,
    open,
    close
  }
}
