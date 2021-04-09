const flattenPointArrayToPointArray = (arr) => {
  let pointArray = []
  arr.forEach((c, index) => {
    if (index % 2 === 0) {
      pointArray.push([c])
    } else {
      pointArray[pointArray.length - 1].push(c)
    }
  });
  return pointArray
}

export default flattenPointArrayToPointArray