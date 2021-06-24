import React from 'react'

import Rectangle from './Rectangle'

const BBoxRender = (props) => {
  const { useStore, eventCenter, bBoxes } = props

  return (
    bBoxes.map(bBox => {
      return (
        <Rectangle 
          useStore={useStore}
          eventCenter={eventCenter}
          key={`bBox-${bBox.id}`}
          {...bBox}
        />
      )
    })
  )
}

export default BBoxRender