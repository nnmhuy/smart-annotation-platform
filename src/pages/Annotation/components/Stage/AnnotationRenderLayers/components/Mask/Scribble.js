import React from 'react'
import { Circle, Line } from 'react-konva'

import pointArrayToFlattenPointArray from '../../../../../utils/pointArrayToFlattenPointArray'
import { SCRIBBLE_TO_MASK_CONSTANTS, COLOR_BY_SCRIBBLE_TYPE } from '../../../../../constants'


// TODO: may use this to enhance transparent experience https://konvajs.org/docs/sandbox/Transparent_Group.html

const Scribble = (props) => {
  const { scribble, imageWidth, imageHeight, } = props
  const { 
    type, points, strokeWidth, 
    ...others 
  } = scribble

  const flattenPoints = pointArrayToFlattenPointArray(points, imageWidth, imageHeight)
  const strokeColor = COLOR_BY_SCRIBBLE_TYPE[type]

  return (
    <>
      <Circle
        x={points[0][0] * imageWidth}
        y={points[0][1] * imageHeight}
        radius={strokeWidth / 2}
        opacity={1}
        globalCompositeOperation={'destination-out'}
        fill={strokeColor}
        listening={false}
      />
      <Circle
        x={points[0][0] * imageWidth}
        y={points[0][1] * imageHeight}
        radius={strokeWidth / 2}
        opacity={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 1 : 0.6}
        globalCompositeOperation={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 'destination-out' : 'source-over'}
        fill={strokeColor}
        listening={false}
      />
      <Line
        points={flattenPoints}
        {...others}
        strokeWidth={strokeWidth}
        globalCompositeOperation={'destination-out'}
        opacity={1}
        stroke={strokeColor}
        listening={false}
      />
      <Line
        points={flattenPoints}
        {...others}
        strokeWidth={strokeWidth}
        globalCompositeOperation={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 'destination-out' : undefined}
        opacity={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 1 : 0.6}
        stroke={strokeColor}
        listening={false}
      />
      <Circle
        x={points[points.length - 1][0] * imageWidth}
        y={points[points.length - 1][1] * imageHeight}
        radius={strokeWidth / 2}
        opacity={1}
        globalCompositeOperation={'destination-out'}
        fill={strokeColor}
        listening={false}
      />
      <Circle
        x={points[points.length - 1][0] * imageWidth}
        y={points[points.length - 1][1] * imageHeight}
        radius={strokeWidth / 2}
        opacity={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 1 : 0.6}
        globalCompositeOperation={type === SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER ? 'destination-out' : 'source-over'}
        fill={strokeColor}
        listening={false}
      />
    </>
  )
}

export default Scribble