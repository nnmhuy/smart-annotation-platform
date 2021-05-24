/*global cv*/
/*eslint no-undef: "error"*/
import flattenPointArrayToPointArray from './flattenPointArrayToPointArray'

const APPROXIMATION_COEFFICIENT = 3 // smaller -> more similar

// Step 1: Draw all polygons to canvas
// Step 2: Apply closing operation
// Step 2: Find one external contour that wrap all polygons
// Step 3: Approximate the contour
// Step 4: Return one approximate contour polygon
const convertBrushToPolygon = (drawingBrushPolygon, options) => {
  const { canvasWidth, canvasHeight } = options

  let tmpCanvas = document.createElement("canvas")
  tmpCanvas.setAttribute("id", "tmpCanvas")
  tmpCanvas.setAttribute("width", canvasWidth)
  tmpCanvas.setAttribute("height", canvasHeight)

  const polygons = drawingBrushPolygon.polys

  let ctx = tmpCanvas.getContext('2d')

  // Step 1: Draw all polygons to canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  ctx.lineJoin = 'round'
  polygons.forEach((poly) => {
    const { points, type, strokeWidth } = poly
    if (type === 'brush') {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#fff';
    } else {
      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#000';
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
  let imgData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
  let src = cv.matFromImageData(imgData);
  // Apply closing operation
  let closedImgData = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
  let M = cv.Mat.ones(10, 10, cv.CV_8U);
  cv.morphologyEx(src, closedImgData, cv.MORPH_CLOSE, M);

  // Step 2: Find one external contour that wrap all polygons
  let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
  cv.cvtColor(closedImgData, closedImgData, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(closedImgData, closedImgData, 120, 200, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  cv.findContours(closedImgData, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  const newDrawingBrushPolygon = {
    ...drawingBrushPolygon,
    polys: []
  }

  console.log("Number of contours: ", contours.size())
  for (let i = 0; i < contours.size(); ++i) {
    // Step 3: Approximate the contour
    let approxContour = new cv.Mat()
    cv.approxPolyDP(contours.get(i), approxContour, APPROXIMATION_COEFFICIENT, true)
    console.log("Original contour length: ", contours.get(i).data32S.length / 2)
    console.log("Approximate contour length: ", approxContour.data32S.length / 2)
    let color = new cv.Scalar(255, 255, 255);
    let approxColor = new cv.Scalar(255, 0, 0);
    cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
    contours.set(i, approxContour)
    cv.drawContours(dst, contours, i, approxColor, 1, cv.LINE_8, hierarchy, 100);
    
    newDrawingBrushPolygon.polys.push(flattenPointArrayToPointArray(approxContour.data32S))
    approxContour.delete()
  }

  src.delete(); dst.delete(); contours.delete(); hierarchy.delete();

  tmpCanvas.remove()

  if (newDrawingBrushPolygon.polys.length <= 0) return null
  return newDrawingBrushPolygon
}

export default convertBrushToPolygon