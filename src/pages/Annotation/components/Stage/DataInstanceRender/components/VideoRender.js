import React, { useState } from 'react'
import { get } from 'lodash'

import { useDatasetStore } from '../../../../stores/index'

import KonvaImage from '../../../../../../components/KonvaImage'

const Video = (props) => {
  const { video, renderingSize } = props
  
  const playingState = useDatasetStore(state => state.playingState)

  const [imageBitmap, setImageBitmap] = useState(null)
  React.useEffect(() => {
    const playingFrame = get(playingState, 'playingFrame', 0)

    const loadImageBitmap = async () => {
      if (video) {
        const bitmap = await video.frames[playingFrame]?.original?.getBitmap(renderingSize)
        setImageBitmap(bitmap)
      }
    }

    loadImageBitmap()
  }, [playingState, renderingSize])

  return (video ?
    <KonvaImage
      bitmap={imageBitmap}
    />
    : null
  )
}

export default Video