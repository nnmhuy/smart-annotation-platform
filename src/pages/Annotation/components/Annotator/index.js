import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
import UIDGenerator from 'uid-generator'

import { MODES, DEFAULT_SHAPE_ATTRS } from '../../constants'

import Image from './KonvaImage'
import Portal from './Portal'
import Rectangle from './Rectangle'
import Polygon from './Polygon'
import ClassSelectionPopover from './ClassSelectionPopover'

import getPointerPosition from './getPointerPosition'

const uidgen = new UIDGenerator();

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
    rectangles, setRectangles,
    polygons, setPolygons,
  } = props
  const stageRef = React.createRef(null)
  
  const [currentMousePos, setCurrentMousePos] = React.useState(null)
  const [selectedId, selectShape] = React.useState(null)
  const [highlightId, setHighlightId] = React.useState(null)
  const [contextMenuPosition, setContextMenuPosition] = React.useState(null)
  const [viewportStartPos, setViewportStartPos] = React.useState(null)
  const [drawingRectangle, setDrawingRectangle] = React.useState(null)
  const [drawingPolygon, setDrawingPolygon] = React.useState(null)
  const [isMouseOverPolygonStart, setIsMouseOverPolygonStart] = React.useState(false)

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

  const isEmptyPosition = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target.getClassName() === "Image"
    return clickedOnEmpty || clickedOnImage
  }

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const deselect = isEmptyPosition(e)
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
      setRectangles([...rectangles, drawingRectangle])
      setDrawingRectangle(null)
    }
  }

  const handleDragDrawRectangle = (e) => {
    const stage = stageRef.current

    if (drawingRectangle !== null) {
      setDrawingRectangle({
        ...drawingRectangle,
        width: currentMousePos.x - drawingRectangle.x,
        height: currentMousePos.y - drawingRectangle.y,
      })
    }
  }

  const handleClickDrawPolygon = (e) => {
    if (drawingPolygon === null) {
      setDrawingPolygon({
        ...DEFAULT_SHAPE_ATTRS,
        id: uidgen.generateSync(),
        x: 0,
        y: 0,
        points: [[currentMousePos.x, currentMousePos.y]]
      })
    } else {
      if (isMouseOverPolygonStart) {
        setPolygons([...polygons, drawingPolygon])
        setDrawingPolygon(null)
      } else {
        setDrawingPolygon({
          ...drawingPolygon,
          points: [...drawingPolygon.points, [currentMousePos.x, currentMousePos.y]]
        })
      }
    }
  }

  const handleHighlightShape = (e) => {
    if (!isEmptyPosition(e)) {
      const shapeId = e.target.attrs.id
      setHighlightId(shapeId)
    } else {
      setHighlightId(null)
    }
  }


  const handleClickDelete = (e) => {
    if (!isEmptyPosition(e)) {
      const shapeId = e.target.attrs.id
      setRectangles(rectangles.filter(rect => rect.id !== shapeId))
      setPolygons(polygons.filter(poly => poly.id !== shapeId))
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
    const stage = stageRef.current
    setCurrentMousePos(getPointerPosition(stage))

    if (activeMode === MODES.CURSOR) {
      handleViewportMove(e)
      handleHighlightShape(e)
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
    if (activeMode === MODES.DRAW_POLYGON) {
      handleClickDrawPolygon(e)
    } else {
      setDrawingPolygon(null)
    }
    if (activeMode === MODES.DELETE) {
      handleClickDelete(e)
    }
  }

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    if (activeMode === MODES.CURSOR) {
      if (!isEmptyPosition(e)) {
        setContextMenuPosition({
          x: e.evt.x,
          y: e.evt.y
        })
      }
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
      onContextMenu={handleContextMenu}
      className={classes.stage}
    >
      <Layer>
        {image && 
          <Image src={image.resizedImg} />
        }
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={rect.id}
              shapeProps={{
                ...rect,
                opacity: (rect.id === highlightId || rect.id === selectedId) ? 0.5 : 0.4,
              }}
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
        {polygons.map((poly, i) => {
          return (
            <Polygon
              key={poly.id}
              polygon={{
                ...poly,
                opacity: (poly.id === highlightId || poly.id === selectedId) ? 0.5 : 0.4,
              }}
              isSelected={poly.id === selectedId}
              onSelect={() => {
                if (activeMode === MODES.CURSOR) {
                  selectShape(poly.id);
                }
              }}
              onChange={(newAttrs) => {
                const polys = polygons.slice();
                polys[i] = newAttrs;
                setPolygons(polys);
              }}
              currentMousePos={currentMousePos}
            />
          )
        })}
        {drawingPolygon &&
          <Polygon
            key={'drawing-polygon'}
            isDrawing={true}
            currentMousePos={currentMousePos}
            polygon={drawingPolygon}
            setIsMouseOverPolygonStart={setIsMouseOverPolygonStart}
          />
        }
        <Portal>
          <ClassSelectionPopover
            contextMenuPosition={contextMenuPosition}
            setContextMenuPosition={setContextMenuPosition}
          />
        </Portal>
      </Layer>
    </Stage>
  );
}

export default Annotator