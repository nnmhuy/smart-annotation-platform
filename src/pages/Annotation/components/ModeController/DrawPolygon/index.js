import React from 'react'
import create from 'zustand'
import UIDGenerator from 'uid-generator'
import { get, cloneDeep } from 'lodash'

import PolygonAnnotationClass from '../../../../../classes/PolygonAnnotationClass'

import Cursor from '../Cursor/index'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';

const uidgen = new UIDGenerator(96, UIDGenerator.BASE16);

const useDrawPolygonStore = create((set, get) => ({
  isMouseOverPolygonStart: false,
  getIsMouseOverPolygonStart: () => get().isMouseOverPolygonStart,
  setIsMouseOverPolygonStart: (newStatus) => set({ isMouseOverPolygonStart: newStatus }),

  drawingPoly: null,
  getDrawingPoly: () => get().drawingPoly,
  setDrawingPoly: (newPoly) => set({ drawingPoly: newPoly }),
  appendDrawingPoly: (newPoint) => set(state => ({ drawingPoly: [...state.drawingPoly, newPoint] })),
}))

const DrawPolygon = (props) => {
  const { useStore, eventCenter } = props
  const getImageId = useStore(state => state.getImageId)
  const getImage = useStore(state => state.getImage)
  const appendAnnotation = useStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useStore(state => state.setDrawingAnnotation)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useStore(state => state.getCurrentMousePosition)


  const getIsMouseOverPolygonStart = useDrawPolygonStore(state => state.getIsMouseOverPolygonStart)
  const setIsMouseOverPolygonStart = useDrawPolygonStore(state => state.setIsMouseOverPolygonStart)
  const getDrawingPoly = useDrawPolygonStore(state => state.getDrawingPoly)
  const setDrawingPoly = useDrawPolygonStore(state => state.setDrawingPoly)
  const appendDrawingPoly = useDrawPolygonStore(state => state.appendDrawingPoly)

  const handleClickDrawPolygon = () => {
    const imageId = getImageId()
    const image = getImage()
    const imageWidth = get(image, 'width', 1)
    const imageHeight = get(image, 'height', 1)
    const currentMousePosition = getCurrentMousePosition()
    const drawingPolygon = getDrawingAnnotation()

    const drawingPoly = getDrawingPoly()
    const isMouseOverPolygonStart = getIsMouseOverPolygonStart()

    if (drawingPoly === null) {
      setDrawingAnnotation(new PolygonAnnotationClass(uidgen.generateSync(), '', imageId, {
        x: 0,
        y: 0,
        polys: [[[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
      }, DEFAULT_ANNOTATION_ATTRS))
      setDrawingPoly([[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]])
    } else {
      if (isMouseOverPolygonStart) {
        finishDrawPolygon()
      } else {
        const newDrawingAnnotation = cloneDeep(drawingPolygon)
        newDrawingAnnotation.updateData = {
          polys: [[...drawingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
        }
        setDrawingAnnotation(newDrawingAnnotation)
        appendDrawingPoly([currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight])
      }
    }
  }

  const finishDrawPolygon = () => {
    const drawingPolygon = getDrawingAnnotation()
    const drawingPoly = getDrawingPoly()

    const finishedPolygon = cloneDeep(drawingPolygon)
    finishedPolygon.updateData = {
      polys: [drawingPoly]
    }

    setDrawingAnnotation(null)
    setDrawingPoly(null)
    appendAnnotation(finishedPolygon)
    setIsMouseOverPolygonStart(false)
    eventCenter.emitEvent(EVENT_TYPES.FINISH_ANNOTATION)(finishedPolygon.id)
  }


  const handleDragDrawPolygon = () => {
    const image = getImage()
    const imageWidth = get(image, 'width', 1)
    const imageHeight = get(image, 'height', 1)
    const drawingPoly = cloneDeep(getDrawingPoly())
    const drawingPolygon = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()

    if (drawingPoly !== null) {
      let newDrawingPolygon = cloneDeep(drawingPolygon)
      newDrawingPolygon.updateData = {
        polys: [[...drawingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
      }
      setDrawingAnnotation(newDrawingPolygon)
    }
  }


  const handleRightClickDrawPolygon = () => {
    const image = getImage()
    const imageWidth = get(image, 'width', 1)
    const imageHeight = get(image, 'height', 1)
    const drawingPoly = getDrawingPoly()
    const drawingPolygon = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()

    if (drawingPoly !== null) {
      const newDrawingPoly = cloneDeep(drawingPoly)
      newDrawingPoly.pop()
      if (newDrawingPoly.length === 0) { // remove all drawing polygon's points
        setDrawingAnnotation(null)
        setDrawingPoly(null)
      } else {
        const newPolygon = cloneDeep(drawingPolygon)
        newPolygon.updateData = {
          polys: [[...newDrawingPoly, [currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]]]
        }
        setDrawingPoly(newDrawingPoly)
        setDrawingAnnotation(newPolygon)
      }
    }
  }

  const handleMouseOverPolygonStart = (value) => {
    setIsMouseOverPolygonStart(value)
  }

  const handleMouseClick = () => {
    updateCurrentMousePosition()
    handleClickDrawPolygon()
  }

  const handleMouseMove = () => {
    updateCurrentMousePosition()
    handleDragDrawPolygon()
  }

  const handleContextMenu = (e) => {
    e.evt.preventDefault()

    updateCurrentMousePosition()
    handleRightClickDrawPolygon()
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_CONTEXT_MENU]: getSubject(EVENT_TYPES.STAGE_CONTEXT_MENU)
        .subscribe({ next: (e) => handleContextMenu(e) }),
      [EVENT_TYPES.MOUSE_OVER_POLYGON_START]: getSubject(EVENT_TYPES.MOUSE_OVER_POLYGON_START)
        .subscribe({ next: (e) => handleMouseOverPolygonStart(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    <Cursor {...props} />
  )
}

export default DrawPolygon