import React from 'react'
import Konva from 'konva'

import KonvaImage from '../../../../../../../components/KonvaImage'

const Mask = (props) => {
  const { 
    isSelected, 
    mask,
    handleSelectMask,
    handleContextMenu,
    imageWidth,
    imageHeight,
    color
  } = props

  return (
    <KonvaImage
      cache
      hitFromCache
      src={mask}
      opacity={isSelected ? 0.6 : 0.4}
      onClick={handleSelectMask}
      onTap={handleSelectMask}
      onContextMenu={handleContextMenu}
      width={imageWidth}
      height={imageHeight}
      red={color.r}
      green={color.g}
      blue={color.b}
      filters={[Konva.Filters.RGB]}
    />
  )
}

export default Mask