import { BRUSH_TYPES } from '../constants'

// Step 1: Draw all polygons to canvas
const convertBrushToBase64Image = (polygons, options) => {
  const { canvasWidth, canvasHeight } = options

  let tmpCanvas = document.createElement("canvas")
  tmpCanvas.setAttribute("id", "tmpCanvas")
  tmpCanvas.setAttribute("width", canvasWidth)
  tmpCanvas.setAttribute("height", canvasHeight)

  let ctx = tmpCanvas.getContext('2d')

  // Step 1: Draw all polygons to canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  ctx.lineJoin = 'round'
  polygons.forEach((poly) => {
    const { points, type, strokeWidth } = poly
    if (type === BRUSH_TYPES.ERASER) {
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#000';
    } else {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#fff';
    }
    ctx.lineWidth = strokeWidth
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    points.forEach(point => {
      ctx.lineTo(point[0], point[1])
    });
    ctx.stroke();
    ctx.fill();
  })
  // let imgData = tmpCanvas.toDataURL();
  
  // return imgData
  return new Promise(function (resolve, reject) {
    tmpCanvas.toBlob(function (blob) {
      resolve(blob)
    })
  })
}

export default convertBrushToBase64Image