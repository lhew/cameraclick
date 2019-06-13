import CameraClick from './cameraclick'
import './cameraclick.scss'
import {adjustSizing} from './utils'
window.canvas = {
  remove: () => ({})
}

var camera

window.onload = () => {
  const element = document.querySelector('#camera')
  console.log(element.clientWidth);
  const createElement = ({image, cropInfo}) => {
    window.img = document.createElement('img')
    window.img.style.float = 'right'
    window.img.src = image
    window.canvas = document.createElement('canvas')
    window.canvas.width = element.clientWidth
    window.canvas.height = element.clientHeight
    const {width, height} = cropInfo;

    const {newWidth, newHeight, x, y} = adjustSizing(width, height, element.clientWidth, element.clientHeight);
    console.log(width, height, element.clientWidth, element.clientHeight, adjustSizing(width, height, element.clientWidth, element.clientHeight))

    window.img.onload = function () {
     window.canvas.getContext('2d').drawImage(window.img, x, y, newWidth, newHeight);
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
