import React from 'react'
import { Group } from 'react-konva'

import PolygonPath from './PolygonPath'
// import PolygonMidPoints from './PolygonMidPoints'
// import PolygonMainPoints from './PolygonMainPoints'

const Polygon = (props) => {
  const {
    polygon, useStore, eventCenter,
  } = props
  
  const { id } = polygon

  const stage = useStore(state => state.stageRef)

  const groupRef = React.useRef(null)

  const scale = stage ? stage.scaleX() : 1

  return (
    <Group
      id={id}
      ref={groupRef}
    >
      <PolygonPath
        id={polygon.id}
        polygon={polygon.polygon}
        scale={scale}
      />
    </Group>
  )
}

export default Polygon