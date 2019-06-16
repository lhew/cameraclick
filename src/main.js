import CameraClick from './cameraclick'
import './cameraclick.scss'
import { createCanvas } from './utils'
window.canvas = {
  remove: () => ({})
}


window.onload = () => {
  const element = document.querySelector('#camera')
  let camera
  camera = new CameraClick(element, {
    onCapture: async (imageData) => {
      const parentDimensions = {
        width: 320,
        height: 480
      }
      const resource = await createCanvas(imageData, parentDimensions, 'jpeg', 0.5)
      console.log(resource.toBase64())
      camera.close()
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
