import React from 'react'

import Polygon from './Polygon/Polygon'

const PolygonRender = (props) => {
  const { useStore, eventCenter, polygons } = props

  return (
    polygons.map(polygon => {
      return (
        <Polygon
          key={`polygon-${polygon.id}`}
          useStore={useStore}
          eventCenter={eventCenter}
          polygon={polygon}
        />
      )
    })
  )
}

export default PolygonRender