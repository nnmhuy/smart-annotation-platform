import React from 'react'
import { Layer, Circle } from 'react-konva'
import UIDGenerator from 'uid-generator'
import { get } from 'lodash'

import BrushPolygon from './BrushPolygon'
import Image from './KonvaImage'

import {
  MODES,
  MANUAL_EVENTS,
  DEFAULT_SHAPE_ATTRS,
  BRUSH_TYPES,
} from '../../constants'
// import formatPolygonsToRightCCW from '../../utils/formatPolygonsToRightCCW'
// import convertBrushToPolygon from '../../utils/convertBrushToPolygon'
import convertBrushToBase64Image from '../../utils/convertBrushToBase64Image'
import sendFormData from '../../../../utils/sendFormData'
import base64ToBlob from '../../../../utils/base64ToBlob'

const uidgen = new UIDGenerator();

const DEFAULT_DRAWING_BRUSH_POLYGON = {
  ...DEFAULT_SHAPE_ATTRS,
  id: uidgen.generateSync(),
  x: 0,
  y: 0,
  strokeWidth: 2,
  stroke: 'red',
  lineJoin: 'round',
  polys: [],
}

const getColorByBrushType = (type) => {
  switch (type) {
    case BRUSH_TYPES.POSITIVE_SCRIBBLE:
      return 'green'
    case BRUSH_TYPES.NEGATIVE_SCRIBBLE:
      return 'red'
    case BRUSH_TYPES.ERASER:
      return 'blue'
    default:
      return 'green'
  }
}

const BrushPolygonLayer = (props) => {
  const { 
    // layerRef,
    // setPolygons,
    toolboxConfig,
    activeMode,
    currentMousePos, stageSize, image,
    isDraggingViewport,
    setIsLoading,
    setRunningTime,
  } = props

  // TODO: move out drawingBrushPolygon to reducer
  const [drawingBrushPolygon, setDrawingBrushPolygon] = React.useState(null)
  const [drawingBrush, setDrawingBrush] = React.useState(null)
  const [mask, setMask] = React.useState(null)
  const [displayMask, setDisplayMask] = React.useState(null)

  const resetAllState = () => {
    setDrawingBrushPolygon(currentDrawingBrushPolygon => currentDrawingBrushPolygon ? DEFAULT_DRAWING_BRUSH_POLYGON : null)
    setDrawingBrush(null)
    setMask(null)
    setDisplayMask(null)
  }

  const initializeDrawByBrush = () => {
    setDrawingBrushPolygon(DEFAULT_DRAWING_BRUSH_POLYGON)
  }

  React.useEffect(() => { // change to draw polygon by brush => initialize
    resetAllState()

    if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
      initializeDrawByBrush()
    } else {
      setDrawingBrushPolygon(null)
    }
  }, [activeMode])

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
  const finishDrawPolygonByBrush = React.useCallback(async () => {
    if (drawingBrushPolygon &&
      drawingBrushPolygon.polys.length > 0
    ) {
      const t0 = performance.now()
      const canvasWidth = get(image, 'width', stageSize.width)
      const canvasHeight = get(image, 'height', stageSize.height)
      // const newDrawingBrushPolygon = convertBrushToPolygon(drawingBrushPolygon, {
      //   canvasWidth,
      //   canvasHeight,
      // })
      // if (newDrawingBrushPolygon) {
      //   setPolygons(currentPolygons => [...currentPolygons, {
      //     ...newDrawingBrushPolygon,
      //     ...DEFAULT_SHAPE_ATTRS,
      //     polys: formatPolygonsToRightCCW(newDrawingBrushPolygon.polys)
      //   }])
      // }
      setIsLoading(true)
      const imgBlob = await base64ToBlob(image.img)
      const p_srb = await convertBrushToBase64Image(
        drawingBrushPolygon.polys.filter(poly => poly.type !== BRUSH_TYPES.NEGATIVE_SCRIBBLE), 
        {
          canvasWidth,
          canvasHeight,
        }
      )
      const n_srb = await convertBrushToBase64Image(
        drawingBrushPolygon.polys.filter(poly => poly.type !== BRUSH_TYPES.POSITIVE_SCRIBBLE),
        {
          canvasWidth,
          canvasHeight,
        }
      )
      sendFormData({
        image: imgBlob,
        p_srb,
        n_srb,
        mask
      }, 's2m/predict')
      .then(newMask => {
        setDisplayMask("data:image/jpeg;base64," + newMask)
      })
      .catch(() => {
        setDisplayMask(null)
      })
      .finally(() => {
        setIsLoading(false)
        var t1 = performance.now()
        setRunningTime((t1 - t0) / 1000.0)
      })

    }
  }, [drawingBrushPolygon, image, stageSize, mask])

  const commitMask = React.useCallback(() => {
    setMask(displayMask)
    initializeDrawByBrush()
  }, [displayMask])

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

  const layerRef = React.useCallback(layer => {
    if (layer !== null) {
      layer.off(MANUAL_EVENTS.RESET_ALL_STATE)
      layer.on(MANUAL_EVENTS.RESET_ALL_STATE, resetAllState)
      layer.off(MANUAL_EVENTS.INITIALIZE_POLYGON_BY_BRUSH)
      layer.on(MANUAL_EVENTS.INITIALIZE_POLYGON_BY_BRUSH, initializeDrawByBrush)
      layer.off(MANUAL_EVENTS.FINISH_DRAW_POLYGON_BY_BRUSH)
      layer.on(MANUAL_EVENTS.FINISH_DRAW_POLYGON_BY_BRUSH, finishDrawPolygonByBrush)
      layer.off(MANUAL_EVENTS.COMMIT_DRAW_BY_BRUSH_MASK)
      layer.on(MANUAL_EVENTS.COMMIT_DRAW_BY_BRUSH_MASK, finishDrawPolygonByBrush)
    }
  }, [finishDrawPolygonByBrush, commitMask]);

  const dotColor = getColorByBrushType(toolboxConfig.brushType)

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
      {displayMask &&
        <Image
          src={displayMask}
          isDraggingViewport={isDraggingViewport}
          opacity={0.6}
        />
      }
      {drawingBrushPolygon &&
        <BrushPolygon
          key='drawing-brush-polygon'
          brushPolygon={{
            ...drawingBrushPolygon,
            polys: drawingBrush ? [...drawingBrushPolygon.polys, drawingBrush] : drawingBrushPolygon.polys
          }}
          getColorByBrushType={getColorByBrushType}
        />
      }
      {activeMode === MODES.DRAW_POLYGON_BY_BRUSH &&
        <Circle
          x={currentMousePos.x}
          y={currentMousePos.y}
          radius={toolboxConfig.brushSize / 2}
          fill={dotColor}
        />
      }
    </Layer>
  )
}

export default BrushPolygonLayer