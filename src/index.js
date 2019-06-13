import CameraClick from './cameraclick'
import './cameraclick.scss'
window.onload = () => {
  const createElement = (data, width, height) => {
    const img = document.createElement('img')
    img.id = 'ai'
    img.style.width = `${element.clientWidth}px`
    img.style.height = `${element.clientHeight}px`
    img.style.float = 'right'
    img.src = data.image
    img.style.objectFit = 'cover'
    const canvas = document.createElement('canvas')
    canvas.width = element.clientWidth
    canvas.height = element.clientHeight
    canvas.getContext('2d').drawImage(img, 0, 0)

    console.log('here is the data ', img)
  }

  const element = document.querySelector('#camera')
  const camera = new CameraClick(element, {
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
