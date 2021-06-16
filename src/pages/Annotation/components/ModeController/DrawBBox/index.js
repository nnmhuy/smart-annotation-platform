import React from 'react'
import UIDGenerator from 'uid-generator'
import { cloneDeep } from 'lodash'

import BBoxAnnotationClass from '../../../../../classes/BBoxAnnotationClass'

import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';
import getPointerPosition from '../../../utils/getPointerPosition'

const uidgen = new UIDGenerator();

const DrawBBox = (props) => {
  const { useStore, eventCenter } = props
  const getAnnotations = useStore(state => state.getAnnotations)
  const setAnnotations = useStore(state => state.setAnnotations)
  const getDrawingAnnotation = useStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useStore(state => state.setDrawingAnnotation)
  const setCurrentMousePosition = useStore(state => state.setCurrentMousePosition)
  const getCurrentMousePosition = useStore(state => state.getCurrentMousePosition)

  const handleClickDrawRectangle = (state) => {
    const currentMousePosition = getCurrentMousePosition()
    const drawingAnnotation = getDrawingAnnotation()
  
    if (drawingAnnotation === null) {
        setDrawingAnnotation(new BBoxAnnotationClass(uidgen.generateSync(), '', '' , {
            ...DEFAULT_ANNOTATION_ATTRS,
            x: currentMousePosition.x,
            y: currentMousePosition.y,
            width: 0,
            height: 0,
          }
        ))
    } else {
      finishDrawRectangle(state)
    }
  }

  const finishDrawRectangle = () => {
    const annotations = getAnnotations()
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
    setAnnotations([...annotations, finishedRectangle])
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
    const stage = e.target.getStage()
    setCurrentMousePosition(getPointerPosition(stage))
    handleClickDrawRectangle()
  }

  const handleMouseMove = (e) => {
    const stage = e.target.getStage()
    setCurrentMousePosition(getPointerPosition(stage))
    handleDragDrawRectangle()
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
                                      .subscribe({next: (e) => handleMouseClick(e)}),
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
    null
  )
}

export default DrawBBox