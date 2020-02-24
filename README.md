# cameraclick

Capture photos from your webcam easily

## Usage

Create a new instance:
```
  import { CameraClick, createCanvas } from 'cameraclick'
  let camera;
  const element = document.querySelector('#camera')

  camera = new CameraClick(element, {
    onCapture: async (imageData) => {
      const parentDimensions = {
        width: 320, //or the element width, like element.clientWidth
        height: 480 //or the element height, like element.clientHeight
      }
      const resource = await createCanvas(imageData, parentDimensions, 'jpeg', 0.5)
      // resource has two methods: `.toImage()` returns an <img /> 
      // element and `toBase64()` returns an
      // encoded base64 image string 
      camera.close()
    }
  })
```

