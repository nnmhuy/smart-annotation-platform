import React from 'react'
import { Line } from 'react-konva'

import pointArrayToFlattenPointArray from '../../../../../utils/pointArrayToFlattenPointArray'
import { SCRIBBLE_TO_MASK_CONSTANTS, COLOR_BY_SCRIBBLE_TYPE } from '../../../../../constants'


// TODO: may use this to enhance transparent experience https://konvajs.org/docs/sandbox/Transparent_Group.html

const Scribble = (props) => {
  const { scribble } = props
  const { type, points, strokeWidth, ...others } = scribble

  const flattenPoints = pointArrayToFlattenPointArray(points)
  const strokeColor = COLOR_BY_SCRIBBLE_TYPE[type]

  return (
    <Line
      points={flattenPoints}
      {...others}
      strokeWidth={strokeWidth}
      globalCompositeOperation={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 'destination-out' : undefined}
      opacity={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 1 : 0.6}
      stroke={strokeColor}
    />
  )
}

export default Scribble