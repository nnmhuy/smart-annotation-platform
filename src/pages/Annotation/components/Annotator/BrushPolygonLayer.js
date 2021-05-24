import React from 'react'
import { Layer } from 'react-konva'
import UIDGenerator from 'uid-generator'
import { get } from 'lodash'

import BrushPolygon from './BrushPolygon'

import {
  MODES,
  MANUAL_EVENTS,
  DEFAULT_SHAPE_ATTRS,
} from '../../constants'
import formatPolygonsToRightCCW from '../../utils/formatPolygonsToRightCCW'
import convertBrushToPolygon from '../../utils/convertBrushToPolygon'

const uidgen = new UIDGenerator();

const BrushPolygonLayer = (props) => {
  const { 
    layerRef,
    polygons, setPolygons,
    toolboxConfig,
    activeMode,
    currentMousePos, stageSize, image,
  } = props

  const [drawingBrushPolygon, setDrawingBrushPolygon] = React.useState(null)
  const [drawingBrush, setDrawingBrush] = React.useState(null)

  const resetAllState = () => {
    setDrawingBrushPolygon(null)
    setDrawingBrush(null)
  }

  const initializeDrawByBrush = () => {
    setDrawingBrushPolygon({
      ...DEFAULT_SHAPE_ATTRS,
      id: uidgen.generateSync(),
      x: 0,
      y: 0,
      strokeWidth: 2,
      stroke: 'red',
      lineJoin: 'round',
      polys: [],
    })
  }

  React.useEffect(() => { // change to draw polygon by brush => initialize
    resetAllState()

    if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
      initializeDrawByBrush()
    } else {
      setDrawingBrushPolygon(null)
    }
  }, [activeMode])

  React.useEffect(() => {
    const layer = layerRef.current
    layer.on(MANUAL_EVENTS.RESET_ALL_STATE, resetAllState)
    layer.on(MANUAL_EVENTS.INITIALIZE_POLYGON_BY_BRUSH, initializeDrawByBrush)
    layer.on(MANUAL_EVENTS.FINISH_DRAW_POLYGON_BY_BRUSH, finishDrawPolygonByBrush)
  }, [layerRef]) // eslint-disable-line

  const handleStartDrawByBrush = (e) => {
    setDrawingBrush({
      points: [[currentMousePos.x, currentMousePos.y]],
      type: toolboxConfig.brushType,
      strokeWidth: toolboxConfig.brushSize,
    })
  }

  const handleDrawByBrush = (e) => {
    if (drawingBrush) { // wait initialization to finish
      setDrawingBrush({
        ...drawingBrush,
        points: [...drawingBrush.points, [currentMousePos.x, currentMousePos.y]]
      })
    }
  }

  const handleFinishDrawByBrush = (e) => {
    if (drawingBrushPolygon && drawingBrush) { // wait initialization to finish
      setDrawingBrushPolygon({
        ...drawingBrushPolygon,
        polys: [...drawingBrushPolygon.polys, drawingBrush],
      })
      setDrawingBrush(null)
    }
  }

  /**
   * this can be converted to one choices of methods to convert from brush to polygon mask
   */
  const finishDrawPolygonByBrush = () => {
    if (drawingBrushPolygon &&
      drawingBrushPolygon.polys.length > 0
    ) {
      const canvasWidth = get(image, 'resizedImageSize.width', stageSize.width)
      const canvasHeight = get(image, 'resizedImageSize.height', stageSize.height)
      const newDrawingBrushPolygon = convertBrushToPolygon(drawingBrushPolygon, {
        canvasWidth,
        canvasHeight,
      })
      if (newDrawingBrushPolygon) {
        setPolygons([...polygons, {
          ...newDrawingBrushPolygon,
          ...DEFAULT_SHAPE_ATTRS,
          polys: formatPolygonsToRightCCW(newDrawingBrushPolygon.polys)
        }])
      }
    }
    initializeDrawByBrush()
  }

  const handleLayerMouseDown = (e) => {
    if (e.manually_triggered) {
      // prevent propagate to stage click
      e.cancelBubble = true

      if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
        handleStartDrawByBrush()
      }
    }
  }

  const handleLayerMouseMove = (e) => {
    if (e.manually_triggered) {
      // prevent propagate to stage click
      e.cancelBubble = true

      if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
        handleDrawByBrush()
      }
    }
  }

  const handleLayerMouseUp = (e) => {
    if (e.manually_triggered) {
      // prevent propagate to stage click
      e.cancelBubble = true

      if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
        handleFinishDrawByBrush(e)
      }
    }
  }

  return (
    <Layer
      id="brush-polygon-layer"
      ref={layerRef}
      onMouseDown={handleLayerMouseDown}
      onTouchStart={handleLayerMouseDown}
      onMouseMove={handleLayerMouseMove}
      onTouchMove={handleLayerMouseMove}
      onMouseUp={handleLayerMouseUp}
      onTouchEnd={handleLayerMouseUp}
    >
      {drawingBrushPolygon &&
        <BrushPolygon
          key='drawing-brush-polygon'
          brushPolygon={{
            ...drawingBrushPolygon,
            polys: drawingBrush ? [...drawingBrushPolygon.polys, drawingBrush] : drawingBrushPolygon.polys
          }}
          currentMousePos={currentMousePos}
          currentStrokeWidth={toolboxConfig.brushSize}
        />
      }
    </Layer>
  )
}

export default BrushPolygonLayer