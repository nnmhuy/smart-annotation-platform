const base64ToBlob = (base64) => {
  return fetch(base64)
  .then(res => res.blob())
}

export default base64ToBlob