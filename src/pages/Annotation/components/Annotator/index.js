import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage } from 'react-konva'
import { get } from 'lodash'

import {
  MODES,
  MANUAL_EVENTS,
  ANNOTATION_SHAPE_LIST,
  ANNOTATION_TYPE,
} from '../../constants'

import KeyboardHandler from './KeyboardHandler'
import PolygonLayer from './PolygonLayer'
import BrushPolygonLayer from './BrushPolygonLayer'
import RectangleLayer from './RectangleLayer'
import CommonLayer from './CommonLayer'

import getPointerPosition from '../../utils/getPointerPosition'
import getStagePosLimit from '../../utils/getStagePosLimit'
import handleStageZoom from '../../utils/handleStageZoom'
import PolygonAnnotation from '../../../../classes/PolygonAnnotationClass'
import BboxAnnotation from '../../../../classes/BBoxAnnotationClass'
import ClassSelectionPopover from './ClassSelectionPopover'

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
    annotations, setAnnotations,
    annotationClasses,
  } = props

  const stageRef = React.createRef(null)

  const [currentMousePos, setCurrentMousePos] = React.useState({ x: 0, y: 0 })
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ x: 0, y: 0 })
  const [isOpenClassSelection, setIsOpenClassSelection] = React.useState(false)
  const [selectedId, selectShape] = React.useState(null)
  const [highlightId, setHighlightId] = React.useState(null)
  const [forceViewportHandling, setForceViewportHandling] = React.useState(false)
  const [viewportStartPos, setViewportStartPos] = React.useState(null)
  const resetAllState = () => {
    selectShape(null)

    handlePropagateStageEventToChildrenLayers(MANUAL_EVENTS.RESET_ALL_STATE)
  }

  React.useEffect(() => { // change mode => reset all states
    resetAllState()
  }, [activeMode]) // eslint-disable-line

  React.useEffect(() => { // upload new image => reset all states & drawn polygons
    if (image) {
      resetAllState()
      setRectangles([])
      setPolygons([])

      const stage = stageRef.current
      const imageWidth = get(image, 'width', 0)
      const imageHeight = get(image, 'height', 0)
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

      // limit viewport movement base on scale
      // allow at most half of each dimension out of viewport
      let newPos = {
        x: stagePos.x + (pointer.x - viewportStartPos.x),
        y: stagePos.y + (pointer.y - viewportStartPos.y),
      }
      let posLimit = getStagePosLimit(stage, stageSize, image)

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
    const stage = stageRef.current

    handleStageZoom(stage, e)
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

  const handlePropagateStageEventToChildrenLayers = (evt, e = {}) => {
    const stage = stageRef.current

    const childrenLayers = stage.getLayers()
    e.manually_triggered = true
    childrenLayers.forEach(layer => layer.fire(evt, e))
  }

  const handleStageMouseDown = (e) => {
    if (forceViewportHandling) {
      handleViewportStart(e)
      return
    }

    handlePropagateStageEventToChildrenLayers("mousedown", e)

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
  }

  const handleStageMouseUp = (e) => {
    if (forceViewportHandling) {
      handleViewportEnd(e)
      return
    }

    handlePropagateStageEventToChildrenLayers("mouseup", e)

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
    if (activeMode === MODES.EDIT && selectedId) {
      setContextMenuPosition(currentMousePos)
      setIsOpenClassSelection(true)
    }
  }

  const handleFinishDraw = (type) => (data) => {
    let annotation
    switch (type) {
      case ANNOTATION_TYPE.MASK:
        annotation = new PolygonAnnotation(data.id, '', '', data.polys)
        break
      case ANNOTATION_TYPE.BBOX:
        annotation = new BboxAnnotation(data.id, '', '', data)
        break
      default:
        break
    }
    setAnnotations([...annotations, annotation])
    setContextMenuPosition(currentMousePos)
    setIsOpenClassSelection(true)
    selectShape(data.id)
  }

  const handleSelectClass = (labelId) => {
    let typeOfAnnotate
    const newAnnotations = annotations.map((annotation) => {
      if (annotation.id === selectedId) {
        const newAnnotation = { ...annotation, labelId }
        typeOfAnnotate = annotation.type
        return newAnnotation
      }
      return annotation
    })

    const labelColor = ((annotationClasses.find(value => value.id === labelId) || {}).color || 'green')

    switch (typeOfAnnotate) {
      case ANNOTATION_TYPE.MASK:
        const newPolygons = polygons.map((polygon) => {
          if (polygon.id === selectedId) {
            const newPolygon = { ...polygon, fill: labelColor }
            return newPolygon
          }
          return polygon
        })
        setPolygons(newPolygons)
        break;
      case ANNOTATION_TYPE.BBOX:
        const newRects = rectangles.map((rect) => {
          if (rect.id === selectedId) {
            const newRect = { ...rect, fill: labelColor }
            return newRect
          }
          return rect
        })
        setRectangles(newRects)
        break;
      default:
        break;
    }
    setAnnotations(newAnnotations)
  }


  return (
    <>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        className={classes.stage}

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
      >
        <CommonLayer
          image={image}
          activeMode={activeMode}
          isDraggingViewport={!!viewportStartPos}
          isEmptyPosition={isEmptyPosition}
        />
        <PolygonLayer
          polygons={polygons}
          setPolygons={setPolygons}
          annotations={annotations}
          setAnnotations={setAnnotations}
          activeMode={activeMode}
          selectedId={selectedId}
          selectShape={selectShape}
          highlightId={highlightId}
          currentMousePos={currentMousePos}
          isDraggingViewport={!!viewportStartPos}
          setPositionClassSelection={setContextMenuPosition}
          handleFinishDraw={handleFinishDraw(ANNOTATION_TYPE.MASK)}
          isClickOn={isClickOn}
        />
        <BrushPolygonLayer
          polygons={polygons}
          setPolygons={setPolygons}
          toolboxConfig={toolboxConfig}
          activeMode={activeMode}
          currentMousePos={currentMousePos}
          stageSize={stageSize}
          image={image}
          isDraggingViewport={!!viewportStartPos}
        />
        <RectangleLayer
          rectangles={rectangles}
          setRectangles={setRectangles}
          activeMode={activeMode}
          selectedId={selectedId}
          selectShape={selectShape}
          highlightId={highlightId}
          currentMousePos={currentMousePos}
          isDraggingViewport={!!viewportStartPos}
          handleFinishDraw={handleFinishDraw(ANNOTATION_TYPE.BBOX)}
        />
      </Stage>
      <ClassSelectionPopover
        isOpen={isOpenClassSelection}
        selectShape={selectShape}
        annotationClasses={annotationClasses}
        setOpenState={setIsOpenClassSelection}
        contextMenuPosition={contextMenuPosition}
        setContextMenuPosition={setContextMenuPosition}
        handleSelectClass={handleSelectClass}
      />
      <KeyboardHandler
        activeMode={activeMode}
        toolboxConfig={toolboxConfig}
        setToolboxConfig={setToolboxConfig}
        resetAllState={resetAllState}
        selectedId={selectedId}
        selectShape={selectShape}
        setForceViewportHandling={setForceViewportHandling}
        handleViewportEnd={handleViewportEnd}
        initializeDrawByBrush={() => handlePropagateStageEventToChildrenLayers(MANUAL_EVENTS.INITIALIZE_POLYGON_BY_BRUSH)}
        finishDrawPolygonByBrush={() => handlePropagateStageEventToChildrenLayers(MANUAL_EVENTS.FINISH_DRAW_POLYGON_BY_BRUSH)}
        commitDrawByBrushMask={() => handlePropagateStageEventToChildrenLayers(MANUAL_EVENTS.COMMIT_DRAW_BY_BRUSH_MASK)}
        deleteById={deleteById}
      />
    </>
  );
}

export default Annotator