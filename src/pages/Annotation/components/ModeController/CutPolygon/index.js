import React from 'react'
import create from 'zustand'
import { cloneDeep } from 'lodash'

import Cursor from '../Cursor/index'

import { EVENT_TYPES } from '../../../constants';

const useCutPolygonStore = create((set, get) => ({
  isMouseOverPolygonCutStart: false,
  getIsMouseOverPolygonCutStart: () => get().isMouseOverPolygonCutStart,
  setIsMouseOverPolygonCutStart: (newStatus) => set({ isMouseOverPolygonCutStart: newStatus }),

  cuttingPoly: null,
  getCuttingPoly: () => get().cuttingPoly,
  setCuttingPoly: (newPoly) => set({ cuttingPoly: newPoly }),
  appendCuttingPoly: (newPoint) => set(state => ({ cuttingPoly: [...state.cuttingPoly, newPoint] })),
}))

const CutPolygon = (props) => {
  const { useStore, eventCenter } = props

  const setEditingAnnotationId = useStore(state => state.setEditingAnnotationId)
  const setEditingAnnotation = useStore(state => state.setEditingAnnotation)
  const getEditingAnnotation = useStore(state => state.getEditingAnnotation)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useStore(state => state.getCurrentMousePosition)

  const getIsMouseOverPolygonCutStart = useCutPolygonStore(state => state.getIsMouseOverPolygonCutStart)
  const setIsMouseOverPolygonCutStart = useCutPolygonStore(state => state.setIsMouseOverPolygonCutStart)
  const getCuttingPoly = useCutPolygonStore(state => state.getCuttingPoly)
  const setCuttingPoly = useCutPolygonStore(state => state.setCuttingPoly)
  const appendCuttingPoly = useCutPolygonStore(state => state.appendCuttingPoly)

  const handleClickCutPolygon = () => {
    const currentMousePosition = getCurrentMousePosition()
    const cuttingPolygon = getEditingAnnotation()

    const cuttingPoly = getCuttingPoly()
    const isMouseOverPolygonCutStart = getIsMouseOverPolygonCutStart()

    if (!cuttingPolygon) {
      return
    }

    if (cuttingPoly === null) {
      const currentPolys = cloneDeep(cuttingPolygon.polygon.polys)
      setEditingAnnotation({
        polys: [...currentPolys, [[currentMousePosition.x, currentMousePosition.y]]]
      })
      setCuttingPoly([[currentMousePosition.x, currentMousePosition.y]])
    } else {
      if (isMouseOverPolygonCutStart) {
        finishCutPolygon()
      } else {
        const currentPolys = cloneDeep(cuttingPolygon.polygon.polys)
        currentPolys.pop()
        setEditingAnnotation({
          polys: [...currentPolys, [...cuttingPoly, [currentMousePosition.x, currentMousePosition.y]]]
        })
        appendCuttingPoly([currentMousePosition.x, currentMousePosition.y])
      }
    }
  }

  const finishCutPolygon = () => {
    const cuttingPolygon = getEditingAnnotation()
    const cuttingPoly = cloneDeep(getCuttingPoly())

    const currentPolys = cloneDeep(cuttingPolygon.polygon.polys)
    currentPolys.pop()
    setEditingAnnotation({
      polys: [...currentPolys, cuttingPoly],
      isCutting: false
    })

    setEditingAnnotationId(null)
    setCuttingPoly(null)
    getIsMouseOverPolygonCutStart(false)
  }


  const handleDragCutPolygon = () => {
    const cuttingPoly = cloneDeep(getCuttingPoly())
    const currentMousePosition = getCurrentMousePosition()
    const cuttingPolygon = getEditingAnnotation()

    if (cuttingPoly !== null) {
      const currentPolys = cloneDeep(cuttingPolygon.polygon.polys)
      currentPolys.pop()
      setEditingAnnotation({
        polys: [...currentPolys, [...cuttingPoly, [currentMousePosition.x, currentMousePosition.y]]]
      })
    }
  }


  const handleRightClickCutPolygon = () => {
    const cuttingPoly = getCuttingPoly()
    const currentMousePosition = getCurrentMousePosition()
    const cuttingPolygon = getEditingAnnotation()

    if (cuttingPoly !== null) {
      const currentPolys = cloneDeep(cuttingPolygon.polygon.polys)
      currentPolys.pop()

      const newCuttingPoly = cloneDeep(cuttingPoly)
      newCuttingPoly.pop()
      if (newCuttingPoly.length === 0) { // remove all drawing polygon's points
        setCuttingPoly(null)
      } else {
        setCuttingPoly(newCuttingPoly)
        setEditingAnnotation({
          polys: [...currentPolys, [...newCuttingPoly, [currentMousePosition.x, currentMousePosition.y]]]
        })
      }
    }
  }

  const handleSelectAnnotation = ({ e, id: annotationId }) => {
    e.cancelBubble = true
    setEditingAnnotationId(annotationId)
    setEditingAnnotation({
      isCutting: true,
    })
  }

  const handleMouseOverPolygonCutStart = (value) => {
    setIsMouseOverPolygonCutStart(value)
  }

  const handleMouseClick = () => {
    updateCurrentMousePosition()
    handleClickCutPolygon()
  }

  const handleMouseMove = () => {
    updateCurrentMousePosition()
    handleDragCutPolygon()
  }

  const handleContextMenu = (e) => {
    e.evt.preventDefault()

    updateCurrentMousePosition()
    handleRightClickCutPolygon()
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.SELECT_ANNOTATION]: getSubject(EVENT_TYPES.SELECT_ANNOTATION)
        .subscribe({ next: (e) => handleSelectAnnotation(e) }),
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_CONTEXT_MENU]: getSubject(EVENT_TYPES.STAGE_CONTEXT_MENU)
        .subscribe({ next: (e) => handleContextMenu(e) }),
      [EVENT_TYPES.MOUSE_OVER_POLYGON_START]: getSubject(EVENT_TYPES.MOUSE_OVER_POLYGON_START)
        .subscribe({ next: (e) => handleMouseOverPolygonCutStart(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    <Cursor {...props}/>
  )
}

export default CutPolygon