import React from 'react'

import KonvaImage from '../../../../../../components/KonvaImage'

const ImageRender = (props) => {
  const { image, renderingSize } = props

  const { width, height } = renderingSize

  return (image ?
    <KonvaImage
      src={image.original.URL}
      width={width}
      height={height}
    />
    : null
  )
}

export default ImageRender