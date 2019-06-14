export default function adjustSizing(w, h, parentWidth, parentHeight){
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
