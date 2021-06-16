const getCenter = (p1, p2) => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

const getMovement = (p1, p2) => {
  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  }
}

export {
  getCenter,
  getDistance,
  getMovement,
}