export const createCanvas = async (imageData, parentDimensions, extension, quality) => {
  const { data, cropInfo } = imageData
  const img = document.createElement('img')
  const canvas = document.createElement('canvas')
  const { width, height } = cropInfo
  const { newWidth, newHeight, x, y } = adjustSizing(width, height, parentDimensions)

  img.src = data
  canvas.getContext('2d').drawImage(img, x, y, newWidth, newHeight)
  canvas.width = parentDimensions.width
  canvas.height = parentDimensions.height

  return new Promise(function (resolve, reject) {
    img.onload = function () {
      canvas.getContext('2d').drawImage(img, x, y, newWidth, newHeight)
      resolve({
        toBase64: () => canvas.toDataURL(`image/${extension || 'jpeg'}`, quality || 0.8),
        toImage: () => {
          const output = document.createElement('img')
          output.src = canvas.toDataURL(`image/${extension || 'jpeg'}`, quality || 0.8)
          return output
        }
      })
    }
  })
}

export const adjustSizing = (w, h, parentDimensions) => {
  const { width: parentWidth, height: parentHeight } = parentDimensions

  const portraitAdjust = (even) => {
    const newHeight = parentHeight
    const newWidth = (w * parentHeight) / h
    const offset = { x: (!even ? w - newWidth : newWidth - w) / (w > parentWidth ? 1 : 2), y: 0 }
    return { newWidth, newHeight, ...offset }
  }

  const landscapeAdjust = (even) => {
    const newWidth = parentWidth
    const newHeight = (h * parentWidth) / w
    const offset = { x: 0, y: (!even ? h - newHeight : newHeight - h) / (h > parentHeight ? 1 : 2) }
    return { newWidth, newHeight, ...offset }
  }

  const squareAdjust = () => {
    return {
      newWidth: parentWidth,
      newHeight: parentHeight,
      x: 0,
      y: 0
    }
  }

  if (parentWidth > parentHeight) {
    return landscapeAdjust()
  }

  if (parentHeight > parentWidth) {
    return portraitAdjust()
  }

  if (parentHeight === parentWidth) {
    if (w > h) {
      return portraitAdjust(true)
    }

    if (h > w) {
      return landscapeAdjust(true)
    }

    if (h === w) {
      return squareAdjust()
    }
  }
}
