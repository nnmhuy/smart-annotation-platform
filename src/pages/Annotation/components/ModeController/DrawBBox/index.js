import React from 'react'
import UIDGenerator from 'uid-generator'
import { cloneDeep } from 'lodash'

import BBoxAnnotationClass from '../../../../../classes/BBoxAnnotationClass'

import { EVENT_TYPES, DEFAULT_SHAPE_ATTRS } from '../../../constants';
import getPointerPosition from '../../../utils/getPointerPosition'

const uidgen = new UIDGenerator();

const DrawBBox = (props) => {
  const { useStore, eventCenter } = props
  const handleSetDrawingShape = useStore(stage => stage.handleSetDrawingShape)
  const setCurrentMousePosition = useStore(stage => stage.setCurrentMousePosition)

  // const handleClickDrawRectangle = () => {
  //   if (drawingRectangle === null) {
  //     setDrawingRectangle({
  //       ...DEFAULT_SHAPE_ATTRS,
  //       x: currentMousePosition.x,
  //       y: currentMousePosition.y,
  //       width: 0,
  //       height: 0,
  //       id: uidgen.generateSync(),
  //     })
  //   } else {
  //     finishDrawRectangle()
  //   }
  // }

  const handleClickDrawRectangleOnStore = (state) => {
    const { drawingShape, currentMousePosition } = state
    if (drawingShape === null) {
        return ({
          drawingShape: new BBoxAnnotationClass(uidgen.generateSync(), '', '' , {
            ...DEFAULT_SHAPE_ATTRS,
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
    const { drawingShape, currentMousePosition, annotations } = state

    let finishedRectangle = cloneDeep(drawingShape)
    finishedRectangle.updateData = {
      width: currentMousePosition.x - drawingShape.bBox.x,
      height: currentMousePosition.y - drawingShape.bBox.y,
    }
    return {
      drawingShape: null,
      annotations: [...annotations, finishedRectangle]
    }
  }

  // const finishDrawRectangle = () => {
  //   let finishedRectangle = {
  //     ...drawingRectangle,
  //     width: currentMousePosition.x - drawingRectangle.x,
  //     height: currentMousePosition.y - drawingRectangle.y,
  //   }
  //   handleFinishDrawingShape(new BBoxAnnotationClass(finishedRectangle.id, '', '', finishedRectangle))
  // }


  const handleDragDrawRectangleOnStore = (state) => {
    const { currentMousePosition, drawingShape } = state
    if (drawingShape !== null) {
      let newDrawingShape = cloneDeep(drawingShape)
      newDrawingShape.updateData = {
        width: currentMousePosition.x - drawingShape.bBox.x,
        height: currentMousePosition.y - drawingShape.bBox.y,
      }
      return (
        { 
          drawingShape: newDrawingShape
        }
      )
    }
    return {}
  }

  // const handleDragDrawRectangle = () => {
  //   if (drawingRectangle !== null) {
  //     setDrawingRectangle({
  //       ...drawingRectangle,
  //       width: currentMousePosition.x - drawingRectangle.x,
  //       height: currentMousePosition.y - drawingRectangle.y,
  //     })
  //   }
  // }

  const handleMouseClick = (e) => {
    const stage = e.target.getStage()
    setCurrentMousePosition(getPointerPosition(stage))
    handleSetDrawingShape(handleClickDrawRectangleOnStore)
  }

  const handleMouseMove = (e) => {
    const stage = e.target.getStage()
    setCurrentMousePosition(getPointerPosition(stage))
    handleSetDrawingShape(handleDragDrawRectangleOnStore)
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