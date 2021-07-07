import React from 'react'

import KonvaImage from '../../../../../../../components/KonvaImage'

const Mask = (props) => {
  const { 
    isSelected, 
    mask,
    handleSelectMask,
    handleContextMenu,
    imageWidth,
    imageHeight,
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
    />
  )
}

export default Mask