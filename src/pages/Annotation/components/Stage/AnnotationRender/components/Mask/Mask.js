import React from 'react'
import Konva from 'konva'

import KonvaImage from '../../../../../../../components/KonvaImage'

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
      threshold={0.2 + (threshold / 100) * 0.8}
      filters={[Konva.Filters.Threshold, Konva.Filters.Mask, Konva.Filters.RGB]}
    />
  )
}

export default Mask