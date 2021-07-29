import React from 'react'

import KonvaImage from '../../../../../../../components/KonvaImage'

const ThresholdAndColorFilter = function (imageData) {
  var data = imageData.data,
    nPixels = data.length,
    red = this.red(),
    green = this.green(),
    blue = this.blue(),
    threshold = (this.threshold() || 0.5) * 255,
    i;

  for (i = 0; i < nPixels; i += 4) {
    if (data[i] < threshold) {
      data[i + 3] = 0
    } else {
      data[i] = red; // r
      data[i + 1] = green; // g
      data[i + 2] = blue; // b
      data[i + 3] = 255; // alpha
    }
  }
}


const canvas = document.createElement('canvas');
const tempCanvas = document.createElement('canvas');


function Border(imageData) {
  var nPixels = imageData.data.length;

  var size = 10;

  // - first set correct dimensions for canvases
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;

  // - the draw original shape into temp canvas
  tempCanvas.getContext('2d').putImageData(imageData, 0, 0);

  var ctx = canvas.getContext('2d');
  var color = this.getAttr('borderColor') || 'red';

  // 3. we will use shadow as border
  // so we just need apply shadow on the original image
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = size;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.restore();

  // - Then we will dive in into image data of [original image + shadow]
  // and remove transparency from shadow
  var tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  var SMOOTH_MIN_THRESHOLD = 3;
  var SMOOTH_MAX_THRESHOLD = 10;

  let val, hasValue;

  var offset = 3;

  for (var i = 3; i < nPixels; i += 4) {
    // skip opaque pixels
    if (imageData.data[i] === 255) {
      continue;
    }

    val = tempImageData.data[i];
    hasValue = val !== 0;
    if (!hasValue) {
      continue;
    }
    if (val > SMOOTH_MAX_THRESHOLD) {
      val = 255;
    } else if (val < SMOOTH_MIN_THRESHOLD) {
      val = 0;
    } else {
      val =
        ((val - SMOOTH_MIN_THRESHOLD) /
          (SMOOTH_MAX_THRESHOLD - SMOOTH_MIN_THRESHOLD)) *
        255;
    }
    tempImageData.data[i] = val;
  }

  // draw resulted image (original + shadow without opacity) into canvas
  ctx.putImageData(tempImageData, 0, 0);

  // then fill whole image with color (after that shadow is colored)
  ctx.save();
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // then we need to copy colored shadow into original imageData
  var newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  var indexesToProcess = [];
  for (var i = 3; i < nPixels; i += 4) {
    var hasTransparentOnTop =
      imageData.data[i - imageData.width * 4 * offset] === 0;
    var hasTransparentOnTopRight =
      imageData.data[i - (imageData.width * 4 + 4) * offset] === 0;
    var hasTransparentOnTopLeft =
      imageData.data[i - (imageData.width * 4 - 4) * offset] === 0;
    var hasTransparentOnRight = imageData.data[i + 4 * offset] === 0;
    var hasTransparentOnLeft = imageData.data[i - 4 * offset] === 0;
    var hasTransparentOnBottom =
      imageData.data[i + imageData.width * 4 * offset] === 0;
    var hasTransparentOnBottomRight =
      imageData.data[i + (imageData.width * 4 + 4) * offset] === 0;
    var hasTransparentOnBottomLeft =
      imageData.data[i + (imageData.width * 4 - 4) * offset] === 0;
    var hasTransparentAround =
      hasTransparentOnTop ||
      hasTransparentOnRight ||
      hasTransparentOnLeft ||
      hasTransparentOnBottom ||
      hasTransparentOnTopRight ||
      hasTransparentOnTopLeft ||
      hasTransparentOnBottomRight ||
      hasTransparentOnBottomLeft;

    // if pixel presented in original image - skip it
    // because we need to change only shadow area
    if (
      imageData.data[i] === 255 ||
      (imageData.data[i] && !hasTransparentAround)
    ) {
      continue;
    }
    if (!newImageData.data[i]) {
      // skip transparent pixels
      continue;
    }
    indexesToProcess.push(i);
  }

  for (var index = 0; index < indexesToProcess.length; index += 1) {
    var i = indexesToProcess[index];

    var alpha = imageData.data[i] / 255;

    if (alpha > 0 && alpha < 1) {
      var aa = 1 + 1;
    }
    imageData.data[i] = newImageData.data[i];
    imageData.data[i - 1] =
      newImageData.data[i - 1] * (1 - alpha) +
      imageData.data[i - 1] * alpha;
    imageData.data[i - 2] =
      newImageData.data[i - 2] * (1 - alpha) +
      imageData.data[i - 2] * alpha;
    imageData.data[i - 3] =
      newImageData.data[i - 3] * (1 - alpha) +
      imageData.data[i - 3] * alpha;

    if (newImageData.data[i] < 255 && alpha > 0) {
      var bb = 1 + 1;
    }
  }
}
const Mask = (props) => {
  const { 
    isSelected, 
    maskBmp,
    handleSelectMask,
    handleContextMenu,
    imageWidth,
    imageHeight,
    color,
    threshold
  } = props

  return (
    <KonvaImage
      cache
      hitFromCache
      bitmap={maskBmp}
      opacity={isSelected ? 0.6 : 0.4}
      onClick={handleSelectMask}
      onTap={handleSelectMask}
      onContextMenu={handleContextMenu}
      width={imageWidth}
      height={imageHeight}
      red={color.r}
      green={color.g}
      blue={color.b}
      threshold={threshold / 100}
      filters={[ThresholdAndColorFilter]}
    />
  )
}

export default Mask