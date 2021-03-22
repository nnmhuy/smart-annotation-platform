import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'

import { MODES } from '../../constants'

import Rectangle from './Rectangle'
import Image from './KonvaImage'

import getPointerPosition from './getPointerPosition'


const useStyles = makeStyles(() => ({
  stage: {
    cursor: props => props.activeMode.cursor,
  }
}))

const Annotator = (props) => {
  const classes = useStyles(props)
  const { 
    stageSize,
    activeMode,
    image,
    rectangles, setRectangles 
  } = props
  const stageRef = React.createRef(null)
  
  const [selectedId, selectShape] = React.useState(null)
  const [viewportStartPos, setViewportStartPos] = React.useState(null)
  const [drawingRectangle, setDrawingRectangle] = React.useState(null)

  React.useEffect(() => { // change mode => reset all states
    setDrawingRectangle(null)
  }, [activeMode])

  React.useEffect(() => { // upload new image => reset all states & drawn polygons
    if (image) {
      setRectangles([])
      setDrawingRectangle(null)

      const stage = stageRef.current
      stage.position({
        x: 250,
        y: 100
      });

    }
  }, [image])

  const handleViewportStart = (e) => {
    if (activeMode === MODES.CURSOR) {
      e.evt.preventDefault();
      const stage = stageRef.current
  
      const pointer = stage.getPointerPosition();
  
      setViewportStartPos(pointer)
    }
  }

  const handleViewportEnd = (e) => {
    e.evt.preventDefault();

    setViewportStartPos(null)
  }

  const handleViewportMove = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current

    if (viewportStartPos) {
      const pointer = stage.getPointerPosition();
      const stagePos = stage.position()
  
      const newPos = {
        x: stagePos.x + (pointer.x - viewportStartPos.x),
        y: stagePos.y + (pointer.y - viewportStartPos.y)
      }
      stage.position(newPos);
      stage.batchDraw();
  
      setViewportStartPos(pointer)
    }
  } 

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target.getClassName() === "Image"
    const deselect = clickedOnEmpty || clickedOnImage
    if (deselect) {
      selectShape(null);
    }
    return deselect
  };

  const handleZoom = (e) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale =
      e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  }

  const handleClickDrawRectangle = (e) => {
    const stage = stageRef.current
    const pointer = getPointerPosition(stage)

    if (drawingRectangle === null) {
      setDrawingRectangle({
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        fill: 'green',
        opacity: 0.4,
        stroke: 'black',
        strokeWidth: 3,
        id: 'current-rectangle',
      })
    } else {
      setRectangles([...rectangles, drawingRectangle])
      setDrawingRectangle(null)
    }
  }

  const handleDragDrawRectangle = (e) => {
    const stage = stageRef.current
    const pointer = getPointerPosition(stage)

    if (drawingRectangle !== null) {
      setDrawingRectangle({
        ...drawingRectangle,
        width: pointer.x - drawingRectangle.x,
        height: pointer.y - drawingRectangle.y,
      })
    }
  }


  const handleMouseDown = (e) => {
    if (activeMode === MODES.CURSOR) {
      if (checkDeselect(e)) {
        handleViewportStart(e)
      }
    }
  }

  const handleMouseMove = (e) => {
    if (activeMode === MODES.CURSOR) {
      handleViewportMove(e)
    }
    if (activeMode === MODES.DRAW_RECTANGLE) {
      handleDragDrawRectangle(e)
    }
  }

  const handleMouseUp = (e) => {
    if (activeMode === MODES.CURSOR) {
      handleViewportEnd(e)
    }
  }

  const handleMouseOut = (e) => {
    if (activeMode === MODES.CURSOR) {
      handleViewportEnd(e)
    }
  }

  const handleTouchStart = (e) => {
    if (activeMode === MODES.CURSOR) {
      if (checkDeselect(e)) {
        handleViewportStart(e)
      }
    }
  }

  const handleClick = (e) => {
    if (activeMode === MODES.DRAW_RECTANGLE) {
      handleClickDrawRectangle(e)
    } else {
      setDrawingRectangle(null)
    }
  }

  return (
    <Stage
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onTouchStart={handleTouchStart}
      onWheel={handleZoom}
      onClick={handleClick}
      className={classes.stage}
    >
      <Layer>
        {image && 
          <Image src={image.resizedImg} />
        }
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                if (activeMode === MODES.CURSOR) {
                  selectShape(rect.id);
                }
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          );
        })}
        {drawingRectangle && 
          <Rectangle
            key={'drawing-rectangle'}
            shapeProps={drawingRectangle}
            isSelected={true}
          />
        }
      </Layer>
    </Stage>
  );
}

export default Annotator