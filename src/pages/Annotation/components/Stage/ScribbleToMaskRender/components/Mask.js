import React from 'react'

import KonvaImage from '../../../../../../components/KonvaImage'

const Mask = (props) => {
  const { 
    isSelected, isMovingViewport, 
    mask,
    handleSelectMask,
    handleContextMenu,
  } = props

  return (
    <KonvaImage
      cache
      hitFromCache
      src={mask}
      opacity={isSelected ? 0.6 : 0.4}
      isMovingViewport={isMovingViewport}
      onClick={handleSelectMask}
      onTap={handleSelectMask}
      onContextMenu={handleContextMenu}
    />
  )
}

export default Mask