import React from 'react'
import { Circle } from 'react-konva'

import { COLOR_BY_SCRIBBLE_TYPE } from '../../../../constants'

const DrawScribbleToMask = (props) => {
  const { useStore } = props

  const getToolConfig = useStore(state => state.getToolConfig)
  const currentMousePosition = useStore(state => state.currentMousePosition)

  const toolConfig = getToolConfig()

  return (
    <Circle
      x={currentMousePosition.x}
      y={currentMousePosition.y}
      radius={toolConfig.scribbleSize / 2}
      fill={COLOR_BY_SCRIBBLE_TYPE[toolConfig.scribbleType]}
      opacity={0.5}
    />
  )
}

export default DrawScribbleToMask