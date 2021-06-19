import React from 'react'

import KonvaImage from '../../../../../../components/KonvaImage'

const Mask = (props) => {
  const { isMovingViewport, mask } = props
  return (
    <KonvaImage
      src={mask}
      opacity={0.6}
      isMovingViewport={isMovingViewport}
    />
  )
}

export default Mask