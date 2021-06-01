import Flatten from '@flatten-js/core'

const checkValidPolys = (polys) => {
  let fullPoly = Flatten.polygon(polys[0])
  let isValidPolys = true

  for (let i = 1; i < polys.length; ++i) {
    const points = polys[i]

    const canShapePolygon = points.length >= 2
    let currentShape = null
    if (canShapePolygon) {
      currentShape = Flatten.polygon(points)
    } else {
      currentShape = Flatten.point(points[0])
    }

    // check intersection
    const intersectionPoints = fullPoly.intersect(currentShape)
    const hasIntersection = (intersectionPoints.length > 0)

    // check inside
    const isInside = fullPoly.contains(currentShape)

    isValidPolys = isValidPolys && !hasIntersection && isInside

    if (canShapePolygon) {
      fullPoly.addFace(points)
    }
  }

  isValidPolys = isValidPolys && fullPoly.isValid()

  return isValidPolys
}

export default checkValidPolys