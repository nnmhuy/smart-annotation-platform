import React, { useState } from 'react'
import { get } from 'lodash'

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
  }, [image_data])

  const { width, height } = renderingSize

  return (image_data ?
    <KonvaImage
      bitmap={imageBitmap}
      width={width}
      height={height}
    />
    : null
  )
}

export default ImageRender
