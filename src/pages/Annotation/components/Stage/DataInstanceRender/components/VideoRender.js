import React from 'react'

import KonvaImage from '../../../../../../components/KonvaImage'

const Video = (props) => {
  const { video, renderingSize } = props

  const { width, height } = renderingSize


  return (video ?
    <KonvaImage
      src={video.original.URL}
      width={width}
      height={height}
    />
    : null
  )
}

export default Video