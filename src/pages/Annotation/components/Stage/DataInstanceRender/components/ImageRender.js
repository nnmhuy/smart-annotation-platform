import React, { useState } from 'react'

import KonvaImage from '../../../../../../components/KonvaImage'

const ImageRender = (props) => {
  const { image: image_data, renderingSize } = props

  const [imageBitmap, setImageBitmap] = useState(null)

  React.useEffect(() => {
    const loadImageBitmap = async () => {
      if (image_data) {
        const bitmap = await image_data?.image?.original?.getBitmap()
        setImageBitmap(bitmap)
      }
    }

    loadImageBitmap()
  }, [image_data, renderingSize])

  return (image_data ?
    <KonvaImage bitmap={imageBitmap}/>
    : null
  )
}

export default ImageRender
