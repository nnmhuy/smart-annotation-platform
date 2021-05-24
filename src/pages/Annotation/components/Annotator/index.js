import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
import UIDGenerator from 'uid-generator'
import { get } from 'lodash'

import { 
  MODES, 
  MANUAL_EVENTS,
  DEFAULT_SHAPE_ATTRS,
  MIN_ZOOM_SCALE,
  MAX_ZOOM_SCALE,
  ANNOTATION_SHAPE_LIST,
} from '../../constants'

import Image from './KonvaImage'
import Portal from './Portal'
import Rectangle from './Rectangle'
import BrushPolygon from './BrushPolygon'
import ClassSelectionPopover from './ClassSelectionPopover'
import KeyboardHandler from './KeyboardHandler'
import PolygonLayer from './PolygonLayer'
import RectangleLayer from './RectangleLayer'

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
  const polygonLayerRef = React.createRef(null)
  const rectangleLayerRef = React.createRef(null)

  
  const [currentMousePos, setCurrentMousePos] = React.useState(null)
  const [selectedId, selectShape] = React.useState(null)
  const [highlightId, setHighlightId] = React.useState(null)
  const [contextMenuPosition, setContextMenuPosition] = React.useState(null)
  const [forceViewportHandling, setForceViewportHandling] = React.useState(false)
  const [viewportStartPos, setViewportStartPos] = React.useState(null)
  const [drawingRectangle, setDrawingRectangle] = React.useState(null)
  const [drawingBrushPolygon, setDrawingBrushPolygon] = React.useState(null)
  const [drawingBrush, setDrawingBrush] = React.useState(null)
  
  const resetAllState = () => {
    selectShape(null)
    setDrawingRectangle(null)
    setDrawingBrushPolygon(null)
    setDrawingBrush(null)

    handlePropagateStageEventToChildrenLayers(MANUAL_EVENTS.RESET_ALL_STATE)
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
      // allow at most half of each dimension out of viewport
      let newPos = {
        x: stagePos.x + (pointer.x - viewportStartPos.x),
        y: stagePos.y + (pointer.y - viewportStartPos.y),
      }
      let posLimit = {
        xMin: -stageSize.width / 2,
        xMax: stageSize.width / 2,
        yMin: -stageSize.height / 2,
        yMax: stageSize.height / 2,
      }
      if (imageWidth && imageHeight) {
        if (imageWidth * scale <= stageSize.width) {
          let acceptedOutWidth = (imageWidth * scale / 2)
          posLimit.xMin = Math.min(0 - acceptedOutWidth, stagePos.x)
          posLimit.xMax = Math.max(stageSize.width - (imageWidth * scale) + acceptedOutWidth, stagePos.x)
        } else {
          let acceptedOutWidth = (stageSize.width / 2)
          posLimit.xMin = Math.min(stageSize.width - imageWidth * scale - acceptedOutWidth, stagePos.x)
          posLimit.xMax = Math.max(0 + acceptedOutWidth, stagePos.x)
        }
        if (imageHeight * scale <= stageSize.height) {
          let acceptedOutHeight = (imageHeight / 2)
          posLimit.yMin = Math.min(0 - acceptedOutHeight, stagePos.y)
          posLimit.yMax = Math.max(stageSize.height - (imageHeight * scale) + acceptedOutHeight, stagePos.y)
        } else {
          let acceptedOutHeight = (stageSize.height / 2)
          posLimit.yMin = Math.min(stageSize.height - imageHeight * scale - acceptedOutHeight, stagePos.y)
          posLimit.yMax = Math.max(0 + acceptedOutHeight, stagePos.y)
        }
      }

      newPos = {
        x: Math.min(Math.max(newPos.x, posLimit.xMin), posLimit.xMax),
        y: Math.min(Math.max(newPos.y, posLimit.yMin), posLimit.yMax),
      }

      stage.position(newPos);
      stage.batchDraw();
  
      setViewportStartPos(pointer)
    }
  } 

  /**
  * check clicking on empty area
  */
  const isEmptyPosition = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnImage = e.target.getClassName() === "Image"
    return clickedOnEmpty || clickedOnImage
  }

  const isClickOn = (e, classList) => {
    const className = e.target.getClassName()
    return (!isEmptyPosition(e) && classList.includes(className))
  }

  /**
   * deselect when clicking on empty area
   */
  const checkDeselect = (e) => {
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
    // Note: this can be converted to one choices of methods to convert from brush to polygon mask
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

  const handlePropagateStageEventToChildrenLayers = (evt, e) => {
    const stage = stageRef.current

    const childrenLayers = stage.getLayers()
    childrenLayers.forEach(layer => layer.fire(evt))
  }

  const handleStageMouseDown = (e) => {
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
    if (activeMode === MODES.DELETE) {
      if (checkDeselect(e)) {
        handleViewportStart(e)
      }
    }
    if (activeMode === MODES.CUT) {
      if (!isClickOn(e, ANNOTATION_SHAPE_LIST.POLYGON)) { // not clicking to select/cut polygon
        handleViewportStart(e)
      }
    }
    // if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
    //   handleStartDrawByBrush()
    // }
  }

  const handleStageMouseMove = (e) => {
    const stage = stageRef.current
    setCurrentMousePos(getPointerPosition(stage))

    if (forceViewportHandling) {
      handleViewportMove(e)
      return
    }

    handlePropagateStageEventToChildrenLayers("mousemove", e)

    if (activeMode === MODES.CURSOR) {
      handleViewportMove(e)
    }
    if (activeMode === MODES.EDIT) {
      handleViewportMove(e)
      handleHighlightShape(e)
    }
    if (activeMode === MODES.DELETE) {
      handleViewportMove(e)
      handleHighlightShape(e)
    }
    if (activeMode === MODES.CUT) {
      handleViewportMove(e)
      handleHighlightShape(e, ANNOTATION_SHAPE_LIST.POLYGON) // highlight polygons only
    }
    
    // if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
    //   handleDrawByBrush()
    // }
  }

  const handleStageMouseUp = (e) => {
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
    if (activeMode === MODES.DELETE) {
      handleViewportEnd(e)
    }
    if (activeMode === MODES.CUT) {
      handleViewportEnd(e)
    }
    // if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
    //   handleFinishDrawByBrush(e)
    // }
  }

  /**
   * Trigger when mouse move outside the stage
   */
  const handleStageMouseOut = (e) => {
  }

  /**
   * Trigger when mouse move inside the stage
   * handle viewport end here instead of when mouse out for smooth dragging
   * konva listen to mouse on elements without hitFunc as move out
   */
  const handleStageMouseEnter = (e) => {
    if (activeMode === MODES.CURSOR || activeMode === MODES.EDIT || forceViewportHandling) {
      handleViewportEnd(e)
    }
  }

  const handleStageClick = (e) => {
    // only detect left click
    if (e.evt.which !== 1) {
      return
    }

    handlePropagateStageEventToChildrenLayers("click", e)

    if (activeMode === MODES.DELETE) {
      handleClickDelete(e)
    }
  }

  const handleStageContextMenu = (e) => {
    e.evt.preventDefault()

    handlePropagateStageEventToChildrenLayers("contextmenu", e)

    if (activeMode === MODES.EDIT) {
      if (!isEmptyPosition(e)) {
        setContextMenuPosition({
          x: e.evt.x,
          y: e.evt.y
        })
      }
    }
  }

  return (
    <>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseOut={handleStageMouseOut}
        onMouseEnter={handleStageMouseEnter}
        onWheel={handleZoom}
        onContextMenu={handleStageContextMenu}

        onMouseDown={handleStageMouseDown}
        onTouchStart={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onTouchMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onTouchEnd={handleStageMouseUp}
        onClick={handleStageClick}
        onTap={handleStageClick}
        className={classes.stage}
      >
        <PolygonLayer
          layerRef={polygonLayerRef}
          polygons={polygons}
          setPolygons={setPolygons}
          activeMode={activeMode}
          selectedId={selectedId}
          selectShape={selectShape}
          highlightId={highlightId}
          currentMousePos={currentMousePos}
          isDraggingViewport={!!viewportStartPos}
          isClickOn={isClickOn}
        />
        <RectangleLayer
          layerRef={rectangleLayerRef}
          rectangles={rectangles}
          setRectangles={setRectangles}
          activeMode={activeMode}
          selectedId={selectedId}
          selectShape={selectShape}
          highlightId={highlightId}
          currentMousePos={currentMousePos}
          isDraggingViewport={!!viewportStartPos}
        />
        {/* <Layer>
          {image && 
            <Image 
              src={image.resizedImg} 
              isDraggingViewport={!!viewportStartPos}
            />
          }
          <Portal>
            <ClassSelectionPopover
              contextMenuPosition={contextMenuPosition}
              setContextMenuPosition={setContextMenuPosition}
            />
          </Portal>
        </Layer>
        
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
        } */}
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