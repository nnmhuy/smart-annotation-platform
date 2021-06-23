/*global cv*/
/*eslint no-undef: "error"*/

const thresholdMask = (base64, threshold, options) => new Promise((resolve, reject) => {
  try {
    const { canvasWidth, canvasHeight } = options

    let tmpCanvas = document.createElement("canvas")
    tmpCanvas.setAttribute("id", "tmpCanvas")
    tmpCanvas.setAttribute("width", canvasWidth)
    tmpCanvas.setAttribute("height", canvasHeight)
    let ctx = tmpCanvas.getContext('2d')

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    var image = new Image();
    image.onload = function () {
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      let imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      let img = cv.matFromImageData(imgData);

      cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
      cv.threshold(img, img, (threshold / 100) * 255, 255, cv.THRESH_BINARY);
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA, 0);

      // if (img.isContinuous()) {
      //   for (let col = 0; col < img.cols; ++col) {
      //     for (let row = 0; row < img.rows; ++row) {
      //       // TODO: convert color here
      //       let R = img.data[row * img.cols * img.channels() + col * img.channels()];
      //       if (R > 0) {
      //         img.data[row * img.cols * img.channels() + col * img.channels() + 1] = 0;
      //         img.data[row * img.cols * img.channels() + col * img.channels() + 2] = 0;
      //       }
      //       // let G = img.data[row * img.cols * img.channels() + col * img.channels() + 1];
      //       // let B = img.data[row * img.cols * img.channels() + col * img.channels() + 2];
      //       // let A = img.data[row * img.cols * img.channels() + col * img.channels() + 3];
      //       // console.log(R, G, B, A)
      //     }
      //   }
      // }

      let thresholdImgData = new ImageData(new Uint8ClampedArray(img.data), img.cols, img.rows)
      ctx.putImageData(thresholdImgData, 0, 0);

      let resBase64 = tmpCanvas.toDataURL();
      resolve(resBase64)

      tmpCanvas.remove()
      img.delete()
    };
    image.src = base64
  } catch (error) {
    reject(error)
  }
})

export default thresholdMask