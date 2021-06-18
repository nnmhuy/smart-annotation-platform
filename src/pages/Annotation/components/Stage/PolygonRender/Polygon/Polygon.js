import React from 'react'
import { Group } from 'react-konva'

import PolygonPath from './PolygonPath'
import PolygonMainPoints from './PolygonMainPoints'
// import PolygonMidPoints from './PolygonMidPoints'

const Polygon = (props) => {
  const {
    polygon, useStore, eventCenter,
  } = props
  
  const { id } = polygon

  const stage = useStore(state => state.stageRef)

  const groupRef = React.useRef(null)

  const scale = stage ? stage.scaleX() : 1

  const drawingAnnotation = useStore(state => state.drawingAnnotation)
  const isDrawing = (drawingAnnotation && drawingAnnotation.id === id)

  return (
    <Group
      id={id}
      ref={groupRef}
    >
      <PolygonPath
        useStore={useStore}
        eventCenter={eventCenter}
        id={polygon.id}
        polygon={polygon.polygon}
        scale={scale}
      />
      {isDrawing && 
        <PolygonMainPoints
          isDrawing={isDrawing}
          useStore={useStore}
          eventCenter={eventCenter}
          id={polygon.id}
          polygon={polygon.polygon}
          scale={scale}
        />
      }
    </Group>
  )
}

export default Polygon