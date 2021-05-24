import React from 'react'
import { Layer } from 'react-konva'
import UIDGenerator from 'uid-generator'

import Rectangle from './Rectangle'

import {
  MODES,
  MANUAL_EVENTS,
  DEFAULT_SHAPE_ATTRS,
} from '../../constants'

const uidgen = new UIDGenerator();

const RectangleLayer = (props) => {
  const {
    layerRef,
    rectangles, setRectangles,
    activeMode,
    selectedId, highlightId, selectShape,
    currentMousePos,
    isDraggingViewport,
  } = props

  const [drawingRectangle, setDrawingRectangle] = React.useState(null)


  const handleClickDrawRectangle = (e) => {
    if (drawingRectangle === null) {
      setDrawingRectangle({
        ...DEFAULT_SHAPE_ATTRS,
        x: currentMousePos.x,
        y: currentMousePos.y,
        width: 0,
        height: 0,
        id: uidgen.generateSync(),
      })
    } else {
      finishDrawRectangle()
    }
  }

  const finishDrawRectangle = () => {
    setRectangles([...rectangles, drawingRectangle])
    setDrawingRectangle(null)
  }

  const handleDragDrawRectangle = (e) => {
    console.log(currentMousePos)
    if (drawingRectangle !== null) {
      setDrawingRectangle({
        ...drawingRectangle,
        width: currentMousePos.x - drawingRectangle.x,
        height: currentMousePos.y - drawingRectangle.y,
      })
    }
  }

  const handleLayerClick = (e) => {
    // prevent propagate to stage click
    e.cancelBubble = true

    console.log(activeMode)
    if (activeMode === MODES.DRAW_RECTANGLE) {
      handleClickDrawRectangle(e)
    }
  }

  const handleLayerMouseMove = (e) => {
    // prevent propagate to stage mousemove
    // e.cancelBubble = true

    if (activeMode === MODES.DRAW_RECTANGLE) {
      handleDragDrawRectangle(e)
    }
  }

  return (
    <Layer
      id="rectangle-layer"
      ref={layerRef}
      onClick={handleLayerClick}
      onTap={handleLayerClick}
      onMouseMove={handleLayerMouseMove}
      onTouchMove={handleLayerMouseMove}
    >
      {rectangles.map((rect, i) => {
        return (
          <Rectangle
            key={rect.id}
            shapeProps={{
              ...rect,
              opacity: (rect.id === highlightId || rect.id === selectedId) ? 0.5 : 0.4,
            }}
            isSelected={rect.id === selectedId}
            onChange={(newAttrs) => {
              const rects = rectangles.slice();
              rects[i] = newAttrs;
              setRectangles(rects);
            }}
            onSelect={() => {
              if (activeMode === MODES.EDIT) {
                selectShape(rect.id);
              }
            }}
            isDraggingViewport={isDraggingViewport}
          />
        );
      })}
      {drawingRectangle &&
        <Rectangle
          key={'drawing-rectangle'}
          shapeProps={drawingRectangle}
          isSelected={true}
          isDraggingViewport={isDraggingViewport}
        />
      }
    </Layer>
  )
}

export default RectangleLayer