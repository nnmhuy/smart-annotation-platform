const pointArrayToFlattenPointArray = (arr) => {
  return arr.reduce((a, b) => a.concat(b), [])
}

export default pointArrayToFlattenPointArray