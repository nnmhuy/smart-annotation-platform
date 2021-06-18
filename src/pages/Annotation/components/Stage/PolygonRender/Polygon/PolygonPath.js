import React from 'react'
import { Path } from 'react-konva'

import polysToSvgPathData from '../../../../utils/polysToSvgPathData'

const PolygonPath = (props) => {
  const {
    id,
    polygon,
    scale,
  } = props

  // const { id, polys, ...others } = polygon
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
    />
  )
}

export default PolygonPath