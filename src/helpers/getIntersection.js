const getIntersectionLineAndLine = (st1, en1, st2, en2) => {
  // Check if none of the lines are of length 0
  if ((st1[0] === en1[0] && st1[1] === en1[1]) || (st2[0] === en2[0] && st2[1] === en2[1])) {
    return false
  }

  const denominator = ((en2[1] - st2[1]) * (en1[0] - st1[0]) - (en2[0] - st2[0]) * (en1[1] - st1[1]))

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((en2[0] - st2[0]) * (st1[1] - st2[1]) - (en2[1] - st2[1]) * (st1[0] - st2[0])) / denominator
  let ub = ((en1[0] - st1[0]) * (st1[1] - st2[1]) - (en1[1] - st1[1]) * (st1[0] - st2[0])) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  let x = st1[0] + ua * (en1[0] - st1[0])
  let y = st1[1] + ua * (en1[1] - st1[1])

  return [x, y]
}

const getIntersectionLineAndPolygon = (st, en, poly) => {
  for (let i = 0; i < poly.length; ++i) {
    const p = getIntersectionLineAndLine(st, en, poly[i], poly[(i + 1) % poly.length])
    if (p) {
      return p
    }
  }
  return false
}

export {
  getIntersectionLineAndLine,
  getIntersectionLineAndPolygon
}