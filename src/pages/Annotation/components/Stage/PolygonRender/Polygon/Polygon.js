import React from 'react'
import { Group } from 'react-konva'

import PolygonPath from './PolygonPath'
import PolygonMainPoints from './PolygonMainPoints'
// import PolygonMidPoints from './PolygonMidPoints'

import { EVENT_TYPES } from '../../../../constants'
import { cloneDeep } from 'lodash'

const Polygon = (props) => {
  const {
    polygon, useStore, eventCenter,
  } = props
  
  const { id } = polygon
  const [isDraggingPolygon, setIsDraggingPolygon] = React.useState(false)

  const stage = useStore(state => state.stageRef)
  const drawingAnnotation = useStore(state => state.drawingAnnotation)
  const editingAnnotationId = useStore(state => state.editingAnnotationId)

  const groupRef = React.useRef(null)
  const scale = stage ? stage.scaleX() : 1


  const isDrawing = (drawingAnnotation && drawingAnnotation.id === id)
  const isSelected = (id === editingAnnotationId)

  const handleSelectPolygon = (e) => {
    eventCenter.emitEvent(EVENT_TYPES.SELECT_ANNOTATION)({ e, id })
  }

  const onDragPolygonStart = () => {
    setIsDraggingPolygon(true)
  }

  const onDragPolygonMove = event => {
    const dX = event.target.x()
    const dY = event.target.y()

    eventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
      x: dX,
      y: dY,
    })
  }

  const onDragPolygonEnd = (event) => {
    const dX = event.target.x()
    const dY = event.target.y()

    const polys = cloneDeep(polygon.polygon.polys)

    eventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
      polys: polys.map(poly => poly.map(p => [p[0] + dX, p[1] + dY])),
      x: 0,
      y: 0
    })

    setIsDraggingPolygon(false)
  }

  const handleContextMenu = (e) => {
    eventCenter.emitEvent(EVENT_TYPES.CONTEXT_MENU_ANNOTATION)({
      e,
      id
    })
  }

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
        handleSelectPolygon={handleSelectPolygon}
        handleContextMenu={handleContextMenu}
        onDragPolygonStart={onDragPolygonStart}
        onDragPolygonMove={onDragPolygonMove}
        onDragPolygonEnd={onDragPolygonEnd}
      />
      {(!isDraggingPolygon && (isDrawing || isSelected)) &&
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