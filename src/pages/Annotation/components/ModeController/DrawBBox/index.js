import React from 'react'
import UIDGenerator from 'uid-generator'
import { cloneDeep } from 'lodash'

import BBoxAnnotationClass from '../../../../../classes/BBoxAnnotationClass'

import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';
import getPointerPosition from '../../../utils/getPointerPosition'

const uidgen = new UIDGenerator();

const DrawBBox = (props) => {
  const { useStore, eventCenter } = props
  const handleSetDrawingAnnotation = useStore(stage => stage.handleSetDrawingAnnotation)
  const setCurrentMousePosition = useStore(stage => stage.setCurrentMousePosition)

  const handleClickDrawRectangleOnStore = (state) => {
    const { drawingAnnotation, currentMousePosition } = state
    if (drawingAnnotation === null) {
        return ({
          drawingAnnotation: new BBoxAnnotationClass(uidgen.generateSync(), '', '' , {
            ...DEFAULT_ANNOTATION_ATTRS,
            x: currentMousePosition.x,
            y: currentMousePosition.y,
            width: 0,
            height: 0,
          }
        )})
    } else {
      return finishDrawRectangleOnStore(state)
    }
  }

  const finishDrawRectangleOnStore = (state) => {
    const { drawingAnnotation, currentMousePosition, annotations } = state

    let finishedRectangle = cloneDeep(drawingAnnotation)

    const bBoxWidth = currentMousePosition.x - drawingAnnotation.bBox.x
    const bBoxHeight = currentMousePosition.y - drawingAnnotation.bBox.y

    finishedRectangle.updateData = {
      x: finishedRectangle.bBox.x + Math.min(0, bBoxWidth),
      y: finishedRectangle.bBox.y + Math.min(0, bBoxHeight),
      width: Math.abs(bBoxWidth),
      height: Math.abs(bBoxHeight)
    }

    return {
      drawingAnnotation: null,
      annotations: [...annotations, finishedRectangle]
    }
  }


  const handleDragDrawRectangleOnStore = (state) => {
    const { currentMousePosition, drawingAnnotation } = state
    if (drawingAnnotation !== null) {
      let newDrawingAnnotation = cloneDeep(drawingAnnotation)
      newDrawingAnnotation.updateData = {
        width: currentMousePosition.x - drawingAnnotation.bBox.x,
        height: currentMousePosition.y - drawingAnnotation.bBox.y,
      }
      return (
        { 
          drawingAnnotation: newDrawingAnnotation
        }
      )
    }
    return {}
  }

  const handleMouseClick = (e) => {
    const stage = e.target.getStage()
    setCurrentMousePosition(getPointerPosition(stage))
    handleSetDrawingAnnotation(handleClickDrawRectangleOnStore)
  }

  const handleMouseMove = (e) => {
    const stage = e.target.getStage()
    setCurrentMousePosition(getPointerPosition(stage))
    handleSetDrawingAnnotation(handleDragDrawRectangleOnStore)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
                                      .subscribe({next: (e) => handleMouseClick(e)}),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
                                      .subscribe({ next: (e) => handleMouseMove(e) }),
                                
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