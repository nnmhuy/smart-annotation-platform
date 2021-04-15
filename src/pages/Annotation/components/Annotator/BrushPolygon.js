import React from 'react'
import { Group, Line, Circle } from 'react-konva'

import pointArrayToFlattenPointArray from '../../../../helpers/pointArrayToFlattenPointArray'

const BrushPolygon = (props) => {
  const { 
    brushPolygon,
  } = props

  const groupRef = React.useRef(null)
  const { id, polys, ...others } = brushPolygon

  return (
    <Group
      ref={groupRef}
      id={id}
    > 
      {polys.map((poly, polyIndex) => {
        const points = pointArrayToFlattenPointArray(poly.points)
        const { strokeWidth, type } = poly
        return (
          <Line
            key={`brush-polygon-${polyIndex}`}
            points={points}
            id={id}
            {...others}
            strokeWidth={strokeWidth}
            globalCompositeOperation={type === 'eraser' ? 'destination-out' : undefined}
            opacity={type === 'eraser' ? 1 : others.opacity}
          />
        )
      })}
    </Group>
  )
}

export default BrushPolygon