import React from 'react'

import KonvaImage from '../../../../../components/KonvaImage'

const ImageRender = (props) => {
  const { useStore } = props
  const image = useStore(state => state.image)

  return (image ?
    <KonvaImage
      src={image.img}
    />
    : null
  )
}

export default ImageRender