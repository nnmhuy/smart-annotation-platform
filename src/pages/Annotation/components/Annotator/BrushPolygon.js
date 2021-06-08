import React from 'react'
import { Group, Line } from 'react-konva'

import pointArrayToFlattenPointArray from '../../utils/pointArrayToFlattenPointArray'
import { BRUSH_TYPES } from '../../constants'

const BrushPolygon = (props) => {
  const { 
    brushPolygon,
    getColorByBrushType,
  } = props

  const { id, polys, ...others } = brushPolygon

  return (
    <Group
      id={id}
    > 
      {polys.map((poly, polyIndex) => {
        const points = pointArrayToFlattenPointArray(poly.points)
        const { strokeWidth, type } = poly
        const strokeColor = getColorByBrushType(type)

        return (
          <Line
            key={`brush-polygon-${polyIndex}`}
            points={points}
            id={id}
            {...others}
            strokeWidth={strokeWidth}
            globalCompositeOperation={type === BRUSH_TYPES.ERASER ? 'destination-out' : undefined}
            opacity={type === BRUSH_TYPES.ERASER ? 1 : others.opacity}
            stroke={strokeColor}
          />
        )
      })}
    </Group>
  )
}

export default BrushPolygon