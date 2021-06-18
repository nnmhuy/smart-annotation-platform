import React from 'react'
import { Circle } from 'react-konva'


const PolygonMainPoints = (props) => {
  const {
    id,
    polygon,
    scale,
  } = props

  const { polys, x: dX, y: dY } = polygon

  return (polys.map((mainPoints, polyIndex) => {
    return (mainPoints.map((point, pointIndex) => {
      const x = point[0] + dX;
      const y = point[1] + dY;
      return (
        <Circle
          key={`poly-main_points-${id}-${polyIndex}-${pointIndex}`}
          x={x}
          y={y}
          radius={6 / scale}
          fill="white"
          stroke="black"
          strokeWidth={2 / scale}
        // hitFunc={(isCutting || isDraggingViewport) && function () {
        //   // disable hitFunc while cutting or dragging viewport
        // }}
        />
      );
    }))
  })
  )
}

export default PolygonMainPoints