const getDistancePointAndPoint = (a, b) => {
  try {
    return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]))
  } catch (error) {
    return 0
  }
}

export {
  getDistancePointAndPoint
}