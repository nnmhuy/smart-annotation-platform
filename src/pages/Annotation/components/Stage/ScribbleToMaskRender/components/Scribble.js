import React from 'react'
import { Group, Line } from 'react-konva'

import pointArrayToFlattenPointArray from '../../../../utils/pointArrayToFlattenPointArray'
import { SCRIBBLE_TO_MASK_CONSTANTS } from '../../../../constants'

const colorByScribbleType = {
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.POSITIVE]: 'green',
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.NEGATIVE]: 'red',
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER]: 'black',
}

const Scribble = (props) => {
  const { scribble } = props
  const { type, points, strokeWidth, ...others } = scribble

  const flattenPoints = pointArrayToFlattenPointArray(points)
  const strokeColor = colorByScribbleType[type]

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