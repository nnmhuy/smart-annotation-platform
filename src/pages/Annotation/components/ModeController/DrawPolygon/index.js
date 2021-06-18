import React from 'react'
import create from 'zustand'
import UIDGenerator from 'uid-generator'
import { cloneDeep } from 'lodash'

import PolygonAnnotationClass from '../../../../../classes/PolygonAnnotationClass'

import formatPolygonsToRightCCW from '../../../utils/formatPolygonsToRightCCW'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';

const uidgen = new UIDGenerator();

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
    const currentMousePosition = getCurrentMousePosition()
    const drawingPolygon = getDrawingAnnotation()

    const drawingPoly = getDrawingPoly()
    const isMouseOverPolygonStart = getIsMouseOverPolygonStart()

    if (drawingPoly === null) {
      setDrawingAnnotation(new PolygonAnnotationClass(uidgen.generateSync(), '', imageId, {
        ...DEFAULT_ANNOTATION_ATTRS,
        x: 0,
        y: 0,
        polys: [[[currentMousePosition.x, currentMousePosition.y]]]
      }))
      setDrawingPoly([[currentMousePosition.x, currentMousePosition.y]])
    } else {
      if (isMouseOverPolygonStart) {
        // TODO: add logic to check enough points
        finishDrawPolygon()
      } else {
        const newDrawingAnnotation = cloneDeep(drawingPolygon)
        newDrawingAnnotation.updateData = {
          polys: [[...drawingPoly, [currentMousePosition.x, currentMousePosition.y]]]
        }
        setDrawingAnnotation(newDrawingAnnotation)
        appendDrawingPoly([currentMousePosition.x, currentMousePosition.y])
      }
    }
  }

  const finishDrawPolygon = () => {
    const drawingPolygon = getDrawingAnnotation()
    const drawingPoly = getDrawingPoly()

    const finishedPolygon = cloneDeep(drawingPolygon)
    finishedPolygon.updateData = {
      polys: formatPolygonsToRightCCW([drawingPoly])
    }

    setDrawingAnnotation(null)
    setDrawingPoly(null)
    appendAnnotation(finishedPolygon)
    setIsMouseOverPolygonStart(false)
  }


  const handleDragDrawPolygon = () => {
    const drawingPoly = cloneDeep(getDrawingPoly())
    const drawingPolygon = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()

    if (drawingPoly !== null) {
      let newDrawingPolygon = cloneDeep(drawingPolygon)
      newDrawingPolygon.updateData = {
        polys: [[...drawingPoly, [currentMousePosition.x, currentMousePosition.y]]]
      }
      setDrawingAnnotation(newDrawingPolygon)
    }
  }


  const handleRightClickDrawPolygon = () => {
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
          polys: [[...drawingPoly, [currentMousePosition.x, currentMousePosition.y]]]
        }
        setDrawingPoly(newDrawingPoly)
        setDrawingAnnotation(newPolygon)
      }
    }
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
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    null
  )
}

export default DrawPolygon