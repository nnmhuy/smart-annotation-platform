import React from 'react'
import { get } from 'lodash'

import { useDatasetStore } from '../../../../stores/index'

import KonvaImage from '../../../../../../components/KonvaImage'

const Video = (props) => {
  const { video, renderingSize } = props
  const { width, height } = renderingSize
  
  const playingState = useDatasetStore(state => state.playingState)

  const playingFrame = get(playingState, 'playingFrame', 0)
  const bitmap = get(video, `frames[${playingFrame}].original.bitmap`, null)

  return (video ?
    <KonvaImage
      bitmap={bitmap}
      width={width}
      height={height}
    />
    : null
  )
}

export default Video