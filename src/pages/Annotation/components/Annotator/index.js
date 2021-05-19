import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
import UIDGenerator from 'uid-generator'
import { get } from 'lodash'


import { 
  MODES, DEFAULT_SHAPE_ATTRS,
  MIN_ZOOM_SCALE,
  MAX_ZOOM_SCALE,
} from '../../constants'

import Image from './KonvaImage'
import Portal from './Portal'
import Rectangle from './Rectangle'
import Polygon from './Polygon'
import BrushPolygon from './BrushPolygon'
import ClassSelectionPopover from './ClassSelectionPopover'
import KeyboardHandler from './KeyboardHandler'

import getPointerPosition from './getPointerPosition'
import convertBrushToPolygon from '../../../../helpers/convertBrushToPolygon'

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
    toolboxConfig, setToolboxConfig,
    image,
    rectangles, setRectangles,
    polygons, setPolygons,
  } = props
  const stageRef = React.createRef(null)
  
  const [currentMousePos, setCurrentMousePos] = React.useState(null)
  const [selectedId, selectShape] = React.useState(null)
  const [highlightId, setHighlightId] = React.useState(null)
  const [contextMenuPosition, setContextMenuPosition] = React.useState(null)
  const [forceViewportHandling, setForceViewportHandling] = React.useState(false)
  const [viewportStartPos, setViewportStartPos] = React.useState(null)
  const [drawingRectangle, setDrawingRectangle] = React.useState(null)
  const [drawingPolygon, setDrawingPolygon] = React.useState(null)
  const [cuttingPolygon, setCuttingPolygon] = React.useState(null)
  const [isMouseOverCuttingPolygon, setIsMouseOverCuttingPolygon] = React.useState(false)
  const [isMouseOverPolygonStart, setIsMouseOverPolygonStart] = React.useState(false)
  const [drawingBrushPolygon, setDrawingBrushPolygon] = React.useState(null)
  const [drawingBrush, setDrawingBrush] = React.useState(null)
  
  const resetAllState = () => {
    selectShape(null)
    setDrawingRectangle(null)
    setDrawingPolygon(null)
    setCuttingPolygon(null)
    setIsMouseOverPolygonStart(false)
    setDrawingBrushPolygon(null)
    setDrawingBrush(null)
  }

  React.useEffect(() => { // change mode => reset all states
    resetAllState()

    if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
      initializeDrawByBrush()
    } else {
      setDrawingBrushPolygon(null)
    }
  }, [activeMode])

  React.useEffect(() => { // upload new image => reset all states & drawn polygons
    if (image) {
      resetAllState()
      setRectangles([])
      setPolygons([])

      const stage = stageRef.current
      const imageWidth = get(image, 'resizedImageSize.width', 0)
      const imageHeight = get(image, 'resizedImageSize.height', 0)
      stage.position({
        x: (stageSize.width - imageWidth) / 2,
        y: (stageSize.height - imageHeight) / 2,
      });
      stage.scale({ x: 1, y: 1 })
    }
  }, [image]) // eslint-disable-line

  const handleViewportStart = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current

    const pointer = stage.getPointerPosition();

    setViewportStartPos(pointer)
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
  
      const scale = stage.scaleX();
      const imageWidth = get(image, 'resizedImageSize.width', 0)
      const imageHeight = get(image, 'resizedImageSize.height', 0)

      // limit viewport movement base on scale
      let newPos = {
        x: stagePos.x + (pointer.x - viewportStartPos.x),
        y: stagePos.y + (pointer.y - viewportStartPos.y),
      }
      if (scale <= 1) {
        newPos = {
          x: Math.min(Math.max(newPos.x, 0), (stageSize.width - (imageWidth * scale))),
          y: Math.min(Math.max(newPos.y, 0), (stageSize.height - (imageHeight * scale))),
        }
      } else {
        newPos = {
          x: Math.min(Math.max(newPos.x, stageSize.width - imageWidth * scale), imageWidth * scale - stageSize.width),
          y: Math.min(Math.max(newPos.y, stageSize.height - imageHeight * scale), imageHeight * scale - stageSize.height),
        }
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

  const isClickOn = (e, classList) => {
    const className = e.target.getClassName()
    return (!isEmptyPosition(e) && classList.includes(className))
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

    // limit zoom scale
    if (newScale >= MIN_ZOOM_SCALE && newScale <= MAX_ZOOM_SCALE) {
      stage.scale({ x: newScale, y: newScale });
  
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  }

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
      setRectangles([...rectangles, drawingRectangle])
      setDrawingRectangle(null)
    }
  }

  const handleDragDrawRectangle = (e) => {
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
        polys: [[[currentMousePos.x, currentMousePos.y]]]
      })
    } else {
      if (isMouseOverPolygonStart) {
        // setPolygons([...polygons, drawingPolygon])
        setPolygons([...polygons, drawingPolygon])
        setDrawingPolygon(null)
      } else {
        setDrawingPolygon({
          ...drawingPolygon,
          polys: [[...drawingPolygon.polys[0], [currentMousePos.x, currentMousePos.y]]],
        })
      }
    }
  }

  const handleRightClickDrawPolygon = (e) => {
    if (drawingPolygon !== null) {
      const drawingPoly = drawingPolygon.polys[0]
      drawingPoly.pop()
      if (drawingPoly.length === 0) { // remove all drawing polygon's points
        setDrawingPolygon(null)
      } else {
        setDrawingPolygon({
          ...drawingPolygon,
          polys: [drawingPoly]
        })
      }
    }
  }

  const handleClickFinishCutPolygon = () => {
    setPolygons(polygons.map(polygon => {
      if (polygon.id !== selectedId) {
        return polygon
      } else {
        return ({
          ...polygon,
          polys: [...polygon.polys, cuttingPolygon]
        })
      }
    }))
    setCuttingPolygon(null)
    selectShape(null)
    setIsMouseOverPolygonStart(false)
  }

  const handleClickCutPolygon = (e) => {
    const shapeId = e.target.attrs.id
    if (isMouseOverPolygonStart) {
      handleClickFinishCutPolygon()
      return
    }
    if (cuttingPolygon) {
      if (cuttingPolygon.length === 0 && shapeId === selectedId) {
        setCuttingPolygon([...cuttingPolygon, [currentMousePos.x, currentMousePos.y]])
      } else {
        if (isMouseOverCuttingPolygon) {
          setCuttingPolygon([...cuttingPolygon, [currentMousePos.x, currentMousePos.y]])
        }
      }
    } else {
      if (isClickOn(e, ['Line', 'Path'])) {
        setCuttingPolygon([])
        selectShape(shapeId)
      }
    }
  }

  const handleRightClickCutPolygon = (e) => {
    if (cuttingPolygon) {
      const newCuttingPolygon = cuttingPolygon
      newCuttingPolygon.pop()
      if (newCuttingPolygon.length === 0) { // remove all cutting polygon's points
        setCuttingPolygon([])
      } else {
        setCuttingPolygon(newCuttingPolygon)
      }
    }
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
          ...DEFAULT_SHAPE_ATTRS
        }])
      }
    }
    initializeDrawByBrush()
  }

  const handleHighlightShape = (e, classList) => {
    const className = e.target.getClassName()

    if (!isEmptyPosition(e) && (!classList || classList.includes(className))) {
      const shapeId = e.target.attrs.id
      setHighlightId(shapeId)
    } else {
      setHighlightId(null)
    }
  }

  const deleteById = (shapeId) => {
    setRectangles(rectangles.filter(rect => rect.id !== shapeId))
    setPolygons(polygons.filter(poly => poly.id !== shapeId))
  }

  const handleClickDelete = (e) => {
    if (!isEmptyPosition(e)) {
      const shapeId = e.target.attrs.id
      deleteById(shapeId)
    }
  }

  const handleMouseDown = (e) => {
    if (forceViewportHandling) {
      handleViewportStart(e)
      return
    }
    if (activeMode === MODES.CURSOR) {
      handleViewportStart(e)
    }
    if (activeMode === MODES.EDIT) {
      if (checkDeselect(e)) {
        handleViewportStart(e)
      }
    }
    if (activeMode === MODES.CUT) {
      if (!isClickOn(e, ['Line', 'Path'])) {
        handleViewportStart(e)
      }
    }
    if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
      handleStartDrawByBrush()
    }
  }

  const handleMouseMove = (e) => {
    const stage = stageRef.current
    setCurrentMousePos(getPointerPosition(stage))

    if (forceViewportHandling) {
      handleViewportMove(e)
      return
    }
    if (activeMode === MODES.CURSOR) {
      handleViewportMove(e)
    }
    if (activeMode === MODES.EDIT) {
      handleViewportMove(e)
      handleHighlightShape(e)
    }
    if (activeMode === MODES.DRAW_RECTANGLE) {
      handleDragDrawRectangle(e)
    }
    if (activeMode === MODES.CUT) {
      handleViewportMove(e)
      handleHighlightShape(e, ['Line', 'Path'])
    }
    if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
      handleDrawByBrush()
    }
  }

  const handleMouseUp = (e) => {
    if (forceViewportHandling) {
      handleViewportEnd(e)
      return
    }
    if (activeMode === MODES.CURSOR) {
      handleViewportEnd(e)
    }
    if (activeMode === MODES.EDIT) {
      handleViewportEnd(e)
    }
    if (activeMode === MODES.CUT) {
      handleViewportEnd(e)
    }
    if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
      handleFinishDrawByBrush(e)
    }
  }

  const handleMouseOut = (e) => {
    if (activeMode === MODES.CURSOR || activeMode === MODES.EDIT) {
      handleViewportEnd(e)
    }
  }

  const handleClick = (e) => {
    // only detect left click
    if (e.evt.which !== 1) {
      return
    }
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
    if (activeMode === MODES.EDIT) {
    }
    if (activeMode === MODES.CUT) {
      handleClickCutPolygon(e)
    }
    if (activeMode === MODES.DELETE) {
      handleClickDelete(e)
    }
  }

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    if (activeMode === MODES.EDIT) {
      if (!isEmptyPosition(e)) {
        setContextMenuPosition({
          x: e.evt.x,
          y: e.evt.y
        })
      }
    }
    if (activeMode === MODES.DRAW_POLYGON) {
      handleRightClickDrawPolygon(e)
    }
    if (activeMode === MODES.CUT) {
      handleRightClickCutPolygon(e)
    }
  }

  return (
    <>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleZoom}
        onClick={handleClick}
        onTap={handleClick}
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
          <Portal>
            <ClassSelectionPopover
              contextMenuPosition={contextMenuPosition}
              setContextMenuPosition={setContextMenuPosition}
            />
          </Portal>
        </Layer>
        
        {polygons.map((polygon, i) => {
          const isCutting = Boolean(polygon.id === selectedId && cuttingPolygon)
          const isEditing = Boolean(polygon.id === selectedId &&  activeMode === MODES.EDIT)
          return (
            <Layer key={polygon.id}>
              <Polygon
                key={polygon.id}
                polygon={{
                  ...polygon,
                  opacity: (polygon.id === highlightId || polygon.id === selectedId) ? 0.5 : 0.4,
                  polys: isCutting ? [...polygon.polys, cuttingPolygon] : polygon.polys
                }}
                isSelected={polygon.id === selectedId}
                isCutting={isCutting}
                isEditing={isEditing}
                onChange={(newPolygon) => {
                  if (newPolygon.polys.length > 0) {
                    const polys = polygons.slice();
                    polys[i] = newPolygon;
                    setPolygons(polys);
                  } else {
                    setPolygons(polygons.filter(poly => poly.id !== newPolygon.id))
                  }
                }}
                onSelect={() => {
                  if (activeMode === MODES.EDIT) {
                    selectShape(polygon.id);
                  }
                }}
                currentMousePos={currentMousePos}
                setCuttingPolygon={isCutting && setCuttingPolygon}
                setIsMouseOverCuttingPolygon={setIsMouseOverCuttingPolygon}
                setIsMouseOverPolygonStart={setIsMouseOverPolygonStart}
              />
            </Layer>
          )
        })}
        {drawingPolygon &&
          <Layer>
            <Polygon
              key={'drawing-polygon'}
              isDrawing={true}
              currentMousePos={currentMousePos}
              polygon={drawingPolygon}
              setIsMouseOverPolygonStart={setIsMouseOverPolygonStart}
            />
          </Layer>
        }
        {drawingBrushPolygon &&
          <Layer>
            <BrushPolygon
              key='drawing-brush-polygon'
              brushPolygon={{
                ...drawingBrushPolygon,
                polys: drawingBrush ? [...drawingBrushPolygon.polys, drawingBrush] : drawingBrushPolygon.polys
              }}
              currentMousePos={currentMousePos}
              currentStrokeWidth={toolboxConfig.brushSize}
            />
          </Layer>
        }
      </Stage>
      <KeyboardHandler
        activeMode={activeMode}
        toolboxConfig={toolboxConfig}
        setToolboxConfig={setToolboxConfig}
        resetAllState={resetAllState}
        selectedId={selectedId}
        selectShape={selectShape}
        setForceViewportHandling={setForceViewportHandling}
        handleViewportEnd={handleViewportEnd}
        initializeDrawByBrush={initializeDrawByBrush}
        finishDrawPolygonByBrush={finishDrawPolygonByBrush}
        deleteById={deleteById}
      />
    </>
  );
}

export default Annotator