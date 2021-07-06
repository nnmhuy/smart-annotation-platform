const resizeImage = (imgData, { maxWidth, maxHeight }) => new Promise((resolve, reject) => {
  let image = new Image();
  image.onload = function () {
    // Resize the image
    let canvas = document.createElement('canvas'),
      width = image.width,
      height = image.height;
    let scale = 1

    if ((width / height) > (maxWidth / maxHeight)) {
      scale = maxWidth / width
      height *= scale
      width = maxWidth;
    } else {
      scale = maxHeight / height
      width *= scale;
      height = maxHeight;
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    let resizedImage = canvas.toDataURL('image/jpeg');
    resolve({
      originalImg: imgData,
      originalWidth: image.width,
      originalHeight: image.height,
      img: resizedImage,
      width,
      height,
      scale
    })
  }
  image.onerror = reject

  image.src = imgData
})

export default resizeImage
