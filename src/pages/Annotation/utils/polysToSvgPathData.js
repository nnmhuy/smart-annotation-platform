const polysToSvgPathData = (polys) => {
  const pathData = polys.map(poly => poly.reduce((path, point, index, arr) => {
    path += (index ? "L" : "M") + String(point[0]) + "," + String(point[1]) + " "
    if (index + 1 === arr.length) {
      path += "z "
    }
    return path
  }, '')).join(' ')

  return pathData
}

export default polysToSvgPathData
