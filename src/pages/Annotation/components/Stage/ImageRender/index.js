import React from 'react'

import KonvaImage from './components/KonvaImage'

const ImageRender = (props) => {
  const { useStore } = props
  const image = useStore(state => state.image)
  const isMovingViewport = useStore(state => state.isMovingViewport)

  return (image ?
    <KonvaImage
      src={image.img}
      isMovingViewport={isMovingViewport}
    />
    : null
  )
}

export default ImageRender