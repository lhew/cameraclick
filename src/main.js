import CameraClick from './cameraclick'
import './cameraclick.scss'
import adjustSizing from './utils'
window.canvas = {
  remove: () => ({})
}

var camera

window.onload = () => {
  const element = document.querySelector('#camera')
  console.log(element.clientWidth)
  const createElement = ({ image, cropInfo }) => {
    var img = document.createElement('img')
    img.style.float = 'right'
    img.src = image
    var canvas = document.createElement('canvas')
    canvas.width = element.clientWidth
    canvas.height = element.clientHeight
    const { width, height } = cropInfo

    const { newWidth, newHeight, x, y } = adjustSizing(width, height, element.clientWidth, element.clientHeight)
    console.log(width, height, element.clientWidth, element.clientHeight, adjustSizing(width, height, element.clientWidth, element.clientHeight))

    img.onload = function () {
      canvas.getContext('2d').drawImage(img, x, y, newWidth, newHeight)
    }

    document.body.appendChild(canvas)
    element.classList.toggle('open')
    camera.close()
  }

  camera = new CameraClick(element, {
    onCapture: function (data) {
      createElement(data)
    }
  })

  const start = document.querySelector('#start')
  start.onclick = function () {
    element.classList.toggle('open')
    if (element.classList.contains('open')) {
      camera.open()
    } else {
      setTimeout(() => { camera.close() }, 300)
    }
  }
  console.log(camera)
}
