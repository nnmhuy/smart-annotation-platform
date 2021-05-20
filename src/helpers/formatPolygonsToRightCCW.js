import Flatten from '@flatten-js/core';
import { cloneDeep } from 'lodash'

// outer polygon must be CW
// inner polygons must be CCW
const formatPolygonsToRightCCW = (polygons) => {
  let newPolygons = cloneDeep(polygons)
  let fullPolygon = Flatten.polygon()

  newPolygons.forEach((points, polyIndex) => {
    if (points.length < 3) {
      return
    }
    let newFace = fullPolygon.addFace(points)
    if ((polyIndex === 0 && newFace.orientation() === Flatten.ORIENTATION.CCW) ||
      (polyIndex !== 0 && newFace.orientation() === Flatten.ORIENTATION.CW)
    ) {
      newFace.reverse()
      newPolygons[polyIndex].reverse()
    }
  })

  return newPolygons;
}

export default formatPolygonsToRightCCW