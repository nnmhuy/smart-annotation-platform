import React from 'react'
import { Group } from 'react-konva'

import Scribble from './Scribble'
import Mask from './Mask'

const MaskAnnotation = (props) => {
  const { id, maskData, useStore } = props

  const scribbles = maskData.scribbles
  // TODO: resize/change color of mask
  const mask = maskData.mask

  const isMovingViewport = useStore(state => state.isMovingViewport)

  return (
    <Group
      id={id}
    >
      {scribbles.map((scribble, index) => <Scribble key={`scribble-${id}-${index}`} scribble={scribble}/>)}
      <Mask 
        mask={mask}
        isMovingViewport={isMovingViewport}
      />
    </Group>
  )
}

export default MaskAnnotation