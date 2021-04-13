/*global cv*/
/*eslint no-undef: "error"*/
import flattenPointArrayToPointArray from './flattenPointArrayToPointArray'

const APPROXIMATION_COEFFICIENT = 1 // smaller -> more similar

// Step 1: Draw all polygons to canvas
// Step 2: Find one external contour that wrap all polygons
// Step 3: Approximate the contour
// Step 4: Return one approximate contour polygon
const convertBrushToPolygon = (drawingBrushPolygon, drawingBrush, options) => {
  if (drawingBrush.length <= 2) {
    return drawingBrushPolygon
  }
  const { canvasWidth, canvasHeight } = options

  console.log("Length: ", drawingBrush.length)
  // let tmpCanvas = document.createElement("canvas")
  // tmpCanvas.setAttribute("id", "tmpCanvas")
  // tmpCanvas.setAttribute("width", canvasWidth)
  // tmpCanvas.setAttribute("height", canvasHeight)
  let tmpCanvas = document.getElementById("tmpCanvas")

  const polygons = [...drawingBrushPolygon.polys, drawingBrush]

  let ctx = tmpCanvas.getContext('2d')

  // Step 1: Draw all polygons to canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineJoin = 'round'
  polygons.forEach((poly, polyIndex) => {
    if (polyIndex === polygons.length - 1) {
      ctx.lineWidth = 15;
    } else {
      ctx.lineWidth = 0.1;
    }
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    poly.forEach(point => {
      ctx.lineTo(point[0], point[1])
    });
    ctx.stroke();
    if (polyIndex !== polygons.length - 1) {
      ctx.fill();
    }
  })
  let imgData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);

  // Step 2: Find one external contour that wrap all polygons
  let src = cv.matFromImageData(imgData);
  let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

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

  console.log(newDrawingBrushPolygon)

  cv.imshow('canvasOutput', dst);
  src.delete(); dst.delete(); contours.delete(); hierarchy.delete();

  // tmpCanvas.remove()

  return newDrawingBrushPolygon
}

export default convertBrushToPolygon