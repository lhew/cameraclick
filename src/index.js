import CameraClick from './cameraclick'
import './cameraclick.scss'

const canvas = document.querySelector('#camera')
const camera = new CameraClick(canvas, {
  resolution: 'hd',
  onCapture: function (data) {
    console.log('here is the data ', data)
  }
})

console.log(camera)
