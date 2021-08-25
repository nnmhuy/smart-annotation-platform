import React, { useState } from 'react'

import KonvaImage from '../../../../../../components/KonvaImage'

const ImageRender = (props) => {
  const { image: image_data, renderingSize } = props

  const [imageBitmap, setImageBitmap] = useState(null)

  React.useEffect(() => {
    const loadImageBitmap = async () => {
      if (image_data) {
        const bitmap = await image_data?.image?.original?.getBitmap(renderingSize)
        setImageBitmap(bitmap)
      }
    }

    loadImageBitmap()
  }, [image_data, renderingSize])

  return (
    imageBitmap &&
      <KonvaImage
        bitmap={imageBitmap}
        width={renderingSize.width}
        height={renderingSize.height}
      />
  )
}

export default ImageRender
