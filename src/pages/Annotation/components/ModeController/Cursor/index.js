import React from 'react'
import UIDGenerator from 'uid-generator'
import { cloneDeep } from 'lodash'

import BBoxAnnotationClass from '../../../../../classes/BBoxAnnotationClass'

import { EVENT_TYPES } from '../../../constants';
import getPointerPosition from '../../../utils/getPointerPosition'

const uidgen = new UIDGenerator();

const Cursor = (props) => {
  const { useStore, eventCenter } = props
  const stage = useStore(state => state.stageRef)
  const setIsMovingViewport = useStore(state => state.setIsMovingViewport)
  const handleSetViewport = useStore(state => state.handleSetViewport)

  const handleMouseDown = (e) => {
    e.evt.preventDefault();
    setIsMovingViewport(true)
  }

  const handleMouseMove = (e) => {
    e.evt.preventDefault();
    
    const stagePosition = stage.position()
    let newPosition = {
      x: stagePosition.x + e.evt.movementX,
      y: stagePosition.y + e.evt.movementY,
    }
    
    handleSetViewport(newPosition)
  }

  const handleMouseUp = (e) => {
    e.evt.preventDefault();
    setIsMovingViewport(false)
  }

  /**
   * Trigger when mouse move inside the stage
   * handle viewport end here instead of when mouse out for smooth dragging
   * konva listen to mouse on elements without hitFunc as move out
  */
  const handleMouseEnter = (e) => {
    e.evt.preventDefault();
    setIsMovingViewport(false)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_DOWN]: getSubject(EVENT_TYPES.STAGE_MOUSE_DOWN)
        .subscribe({ next: (e) => handleMouseDown(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_MOUSE_UP]: getSubject(EVENT_TYPES.STAGE_MOUSE_UP)
        .subscribe({ next: (e) => handleMouseUp(e) }),
      [EVENT_TYPES.STAGE_MOUSE_UP]: getSubject(EVENT_TYPES.STAGE_MOUSE_ENTER)
        .subscribe({ next: (e) => handleMouseEnter(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [stage])

  return (
    null
  )
}

export default Cursor