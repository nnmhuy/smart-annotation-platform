import React from 'react'
import { Group } from 'react-konva'

import Rectangle from './Rectangle'

const BBoxRender = (props) => {
  const { bBoxes } = props

  return (
    <Group>
      {bBoxes.map(bBox => {
        return (
          <Rectangle 
            key={`bBox-${bBox.id}`}
            {...bBox}
          />
        )
      })}
    </Group>
  )
}

export default BBoxRender