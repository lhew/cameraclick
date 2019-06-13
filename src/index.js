import CameraClick from './cameraclick'
import './cameraclick.scss'
window.onload = () => {
  const createElement = (width, height) => {
    
  }

  const element = document.querySelector('#camera')
  const camera = new CameraClick(element, {
    onCapture: function (data) {
      const img = document.createElement('img')
      img.width = element.clientWidth
      img.height = element.clientHeight
      img.src = data.image
      img.style.objectFit = 'cover'
      img.style.float = 'right'
      document.body.appendChild(img)

      // img.onload = function () {
      //   const canvas = document.createElement('canvas')
      //   canvas.width = element.clientWidth
      //   canvas.height = element.clientHeight
      //   canvas.getContext('2d').drawImage(img, 0, 0)

      //   console.log(canvas.toDataURL('image/jpeg', 0.5))
      // }
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
