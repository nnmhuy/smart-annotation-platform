import React from 'react'
import Flatten from '@flatten-js/core'
import { Path } from 'react-konva'

const PolygonPath = (props) => {
  const { 
    polygon,
    scale,
    isEditing, isDraggingViewport,
    onSelect,
    onDragPolygonStart, onDragPolygonMove, onDragPolygonEnd,
  } = props

  const { id, polys, ...others } = polygon

  const [fullPolygonData, setFullPolygonData] = React.useState('')

  React.useEffect(() => {
    let fullPolygon = Flatten.polygon()
    polys.forEach((points, polyIndex) => {
      if (points.length <= 1) {
        return
      }
      let newFace = fullPolygon.addFace(points)
      if ((polyIndex === 0 && newFace.orientation() === Flatten.ORIENTATION.CCW) ||
        (polyIndex !== 0 && newFace.orientation() === Flatten.ORIENTATION.CW)
      ) {
        newFace.reverse()
      }
    })
    setFullPolygonData(fullPolygon.svg())
  }, [polys])



  return (
    <Path
      id={id}
      data={fullPolygonData}
      onClick={onSelect}
      onTap={onSelect}
      draggable={isEditing}
      onDragStart={onDragPolygonStart}
      onDragMove={onDragPolygonMove}
      onDragEnd={onDragPolygonEnd}
      strokeWidth={others.strokeWidth / scale}
      hitFunc={isDraggingViewport && function () {
        // disable hitFunc while dragging viewport
      }}
      {...others}
    />
  )
}

export default PolygonPath