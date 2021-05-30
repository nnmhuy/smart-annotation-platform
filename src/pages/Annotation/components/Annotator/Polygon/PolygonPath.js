import React from 'react'
import Flatten from '@flatten-js/core'
import { Path } from 'react-konva'

const PolygonPath = (props) => {
  const { polygon } = props

  const { id, polys } = polygon

  let fullPolygon = Flatten.polygon()
  polys.forEach((points, polyIndex) => {
    if (points.length < 3) {
      return
    }
    let newFace = fullPolygon.addFace(points)
    if ((polyIndex === 0 && newFace.orientation() === Flatten.ORIENTATION.CCW) ||
      (polyIndex !== 0 && newFace.orientation() === Flatten.ORIENTATION.CW)
    ) {
      newFace.reverse()
    }
  })


  return (
    <Path
      id={id}
      data={fullPolygon.svg()}
      onClick={onSelect}
      onTap={onSelect}
      draggable={isEditing}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      strokeWidth={others.strokeWidth / scale}
      hitFunc={isDraggingViewport && function (context) {
        // disable hitFunc while dragging viewport
      }}
      {...others}
    />
  )
}

export default PolygonPath