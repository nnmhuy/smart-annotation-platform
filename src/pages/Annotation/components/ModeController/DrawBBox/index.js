import React from 'react'
import UIDGenerator from 'uid-generator'
import { cloneDeep } from 'lodash'

import Cursor from '../Cursor/index'
import BBoxAnnotationClass from '../../../../../classes/BBoxAnnotationClass'

import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';

const uidgen = new UIDGenerator(96, UIDGenerator.BASE16);

const DrawBBox = (props) => {
  const { useStore, eventCenter } = props
  const getImageId = useStore(state => state.getImageId)
  const appendAnnotation = useStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useStore(state => state.setDrawingAnnotation)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useStore(state => state.getCurrentMousePosition)

  const handleClickDrawRectangle = () => {
    const imageId = getImageId()
    const currentMousePosition = getCurrentMousePosition()
    const drawingAnnotation = getDrawingAnnotation()

    if (drawingAnnotation === null) {
      setDrawingAnnotation(new BBoxAnnotationClass(uidgen.generateSync(), '', imageId, {
        x: currentMousePosition.x,
        y: currentMousePosition.y,
        width: 0,
        height: 0,
      }, DEFAULT_ANNOTATION_ATTRS))
    } else {
      finishDrawRectangle()
    }
  }

  const finishDrawRectangle = () => {
    const currentMousePosition = getCurrentMousePosition()
    const drawingAnnotation = getDrawingAnnotation()

    let finishedRectangle = cloneDeep(drawingAnnotation)

    const bBoxWidth = currentMousePosition.x - drawingAnnotation.bBox.x
    const bBoxHeight = currentMousePosition.y - drawingAnnotation.bBox.y

    finishedRectangle.updateData = {
      x: finishedRectangle.bBox.x + Math.min(0, bBoxWidth),
      y: finishedRectangle.bBox.y + Math.min(0, bBoxHeight),
      width: Math.abs(bBoxWidth),
      height: Math.abs(bBoxHeight)
    }

    setDrawingAnnotation(null)
    appendAnnotation(finishedRectangle)
    eventCenter.emitEvent(EVENT_TYPES.FINISH_ANNOTATION)(finishedRectangle.id)
  }


  const handleDragDrawRectangle = () => {
    const currentMousePosition = getCurrentMousePosition()
    const drawingAnnotation = getDrawingAnnotation()

    if (drawingAnnotation !== null) {
      let newDrawingAnnotation = cloneDeep(drawingAnnotation)
      newDrawingAnnotation.updateData = {
        width: currentMousePosition.x - drawingAnnotation.bBox.x,
        height: currentMousePosition.y - drawingAnnotation.bBox.y,
      }
      setDrawingAnnotation(newDrawingAnnotation)
    }
  }

  const handleMouseClick = (e) => {
    updateCurrentMousePosition()
    handleClickDrawRectangle()
  }

  const handleMouseMove = (e) => {
    updateCurrentMousePosition()
    handleDragDrawRectangle()
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleMouseClick(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_TAP]: getSubject(EVENT_TYPES.STAGE_TAP)
        .subscribe({ next: (e) => handleMouseClick(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    <Cursor {...props}/>
  )
}

export default DrawBBox