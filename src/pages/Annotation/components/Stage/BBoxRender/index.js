import React from 'react'
import { Group } from 'react-konva'

import Rectangle from './Rectangle'

const BBoxRender = (props) => {
  const { useStore, eventCenter, bBoxes } = props

  return (
    <Group>
      {bBoxes.map(bBox => {
        return (
          <Rectangle 
            useStore={useStore}
            eventCenter={eventCenter}
            key={`bBox-${bBox.id}`}
            {...bBox}
          />
        )
      })}
    </Group>
  )
}

export default BBoxRender