import React from 'react'
import { Group } from 'react-konva'

import PolygonPath from './PolygonPath'
import PolygonMainPoints from './PolygonMainPoints'
import PolygonMidPoints from './PolygonMidPoints'

import { EVENT_TYPES } from '../../../../constants'
import { cloneDeep } from 'lodash'

const Polygon = (props) => {
  const {
    polygon, useStore, eventCenter,
  } = props

  const { id } = polygon
  const [isDraggingPolygon, setIsDraggingPolygon] = React.useState(false)
  const [draggingPointKey, setDraggingPointKey] = React.useState(null)
  const [draggingMidPoint, setDraggingMidPoint] = React.useState(null)

  const stage = useStore(state => state.stageRef)
  const drawingAnnotation = useStore(state => state.drawingAnnotation)
  const editingAnnotationId = useStore(state => state.editingAnnotationId)

  const groupRef = React.useRef(null)
  const scale = stage ? stage.scaleX() : 1


  const isDrawing = (drawingAnnotation && drawingAnnotation.id === id)
  const isSelected = (id === editingAnnotationId)
  const isCutting = polygon.polygon.isCutting

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

  const handleStartDraggingMainPoint = event => {
    const key = event.target.key;

    if (!draggingPointKey) {
      setDraggingPointKey(key)
    }
  }

  const handleMoveDraggingMainPoint = (event, polyIndex, pointIndex) => {
    const target = event.target
    const key = target.key;
    if (key !== draggingPointKey) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x, event.target.attrs.y];

    const newPolys = cloneDeep(polygon.polygon.polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex), pos, ...poly.slice(pointIndex + 1)]
      }
    })
    eventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
      polys: newPolys,
    })
  }

  const handleEndDraggingMainPoint = (event) => {
    setDraggingPointKey(null)
  }

  const getNewPolysAfterDraggingMidPoint = (polys, { polyIndex, pointIndex, position }) => {
    const newPolys = cloneDeep(polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex + 1), position, ...poly.slice(pointIndex + 1)]
      }
    })

    return newPolys
  }

  const handleStartDraggingMidPoint = (event) => {
    const key = event.target.key;

    if (!draggingPointKey) {
      setDraggingPointKey(key)
    }
  }

  const handleMoveDraggingMidPoint = (event, polyIndex, pointIndex) => {
    const key = event.target.key;
    if (key !== draggingPointKey) { // prevent dragging 2 near points
      return
    }

    setDraggingMidPoint({
      position: [event.target.attrs.x, event.target.attrs.y],
      polyIndex,
      pointIndex,
    })
  }

  const handleEndDraggingMidPoint = (event, polyIndex, pointIndex) => {
    const position = [event.target.attrs.x, event.target.attrs.y];

    const newPolys = getNewPolysAfterDraggingMidPoint(polygon.polygon.polys, {
      polyIndex,
      pointIndex,
      position
    })

    eventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
      polys: newPolys,
    })

    setDraggingPointKey(null)
    setDraggingMidPoint(null)
  }

  const handleClickMainPoint = (event) => {
    // prevent trigger stage click which stops double click
    // event.cancelBubble = true
  }

  const handleDoubleClickDeletePoint = (event, polyIndex, pointIndex) => {
    event.cancelBubble = true
    let newPolys = cloneDeep(polygon.polygon.polys).map((poly, index) => {
      if (index !== polyIndex) {
        return poly
      } else {
        return [...poly.slice(0, pointIndex), ...poly.slice(pointIndex + 1)]
      }
    }).filter(poly => poly.length >= 3)

    eventCenter.emitEvent(EVENT_TYPES.EDIT_ANNOTATION)({
      polys: newPolys,
    })
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
        polygon={{
          ...polygon.polygon,
          polys: draggingMidPoint ?
            getNewPolysAfterDraggingMidPoint(polygon.polygon.polys, draggingMidPoint)
            : polygon.polygon.polys
        }}
        properties={polygon.properties}
        scale={scale}
        isSelected={isSelected}
        isCutting={isCutting}
        handleSelectPolygon={handleSelectPolygon}
        handleContextMenu={handleContextMenu}
        onDragPolygonStart={onDragPolygonStart}
        onDragPolygonMove={onDragPolygonMove}
        onDragPolygonEnd={onDragPolygonEnd}
      />
      {(!isDraggingPolygon && (isDrawing || isSelected)) &&
        <PolygonMainPoints
          useStore={useStore}
          eventCenter={eventCenter}
          isDrawing={isDrawing}
          isSelected={isSelected}
          isCutting={isCutting}
          id={polygon.id}
          polygon={polygon.polygon}
          scale={scale}
          handleStartDraggingMainPoint={handleStartDraggingMainPoint}
          handleMoveDraggingMainPoint={handleMoveDraggingMainPoint}
          handleEndDraggingMainPoint={handleEndDraggingMainPoint}
          handleClickMainPoint={handleClickMainPoint}
          handleDoubleClickDeletePoint={handleDoubleClickDeletePoint}
        />
      }
      {(!isDraggingPolygon && isSelected && !isCutting) &&
        <PolygonMidPoints
          useStore={useStore}
          eventCenter={eventCenter}
          id={polygon.id}
          polygon={polygon.polygon}
          scale={scale}
          isSelected={isSelected}
          handleStartDraggingMidPoint={handleStartDraggingMidPoint}
          handleMoveDraggingMidPoint={handleMoveDraggingMidPoint}
          handleEndDraggingMidPoint={handleEndDraggingMidPoint}
        />
      }
    </Group>
  )
}

export default Polygon