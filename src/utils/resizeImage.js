const resizeImage = (imgData, { maxWidth, maxHeight }) => new Promise((resolve, reject) => {
  let image = new Image();
  image.onload = function () {
    // Resize the image
    let canvas = document.createElement('canvas'),
      width = image.width,
      height = image.height;

    if ((width / height) > (maxWidth / maxHeight)) {
      height *= maxWidth / width;
      width = maxWidth;
    } else {
      width *= maxHeight / height;
      height = maxHeight;
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    let resizedImage = canvas.toDataURL('image/jpeg');
    resolve({
      img: resizedImage,
      width,
      height
    })
  }
  image.onerror = reject

  image.src = imgData
})

export default resizeImage