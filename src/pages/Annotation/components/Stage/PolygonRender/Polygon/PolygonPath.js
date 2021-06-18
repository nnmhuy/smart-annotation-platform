import React from 'react'
import { Path } from 'react-konva'

import polysToSvgPathData from '../../../../utils/polysToSvgPathData'

const PolygonPath = (props) => {
  const {
    id,
    polygon,
    scale,

    isSelected,

    handleSelectPolygon,
    handleContextMenu,
    onDragPolygonStart,
    onDragPolygonMove,
    onDragPolygonEnd,
  } = props


  const polys = polygon.polys
  const { ...others } = polygon

  const pathRef = React.useRef(null)

  const pathData = polysToSvgPathData(polys)
  return (
    <Path
      ref={pathRef}
      id={id}
      strokeWidth={others.strokeWidth / scale}
      data={pathData}
      // hitFunc={isDraggingViewport && function () {
      //   // disable hitFunc while dragging viewport
      // }}
      {...others}
      draggable={isSelected}
      onClick={handleSelectPolygon}
      onTap={handleSelectPolygon}
      onContextMenu={handleContextMenu}
      onDragStart={onDragPolygonStart}
      onDragMove={onDragPolygonMove}
      onDragEnd={onDragPolygonEnd}
    />
  )
}

export default PolygonPath