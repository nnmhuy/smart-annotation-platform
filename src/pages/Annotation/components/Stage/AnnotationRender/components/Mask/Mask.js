import React from 'react'

import KonvaImage from '../../../../../../../components/KonvaImage'

const ThresholdAndColorFilter = function (imageData) {
  var data = imageData.data,
    nPixels = data.length,
    red = this.red() || 255,
    green = this.green() || 255,
    blue = this.blue() || 255,
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