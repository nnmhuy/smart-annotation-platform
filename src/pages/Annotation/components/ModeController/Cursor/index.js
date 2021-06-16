import React from 'react'
import create from 'zustand'

import { EVENT_TYPES } from '../../../constants';
import { getMovement } from '../../../utils/touchUtils'

const useCursorStore = create((set, get) => ({
  lastCenter: null,

  setLastCenter: (newCenter) => set({ lastCenter: newCenter }),
  getTouchMovement: (center) => {
    const lastCenter = get().lastCenter
    if (lastCenter) {
      return getMovement(lastCenter, center)
    } else {
      return { x: 0, y: 0 }
    }
  }
}))

const Cursor = (props) => {
  const { useStore, eventCenter } = props
  const stage = useStore(state => state.stageRef)
  const setIsMovingViewport = useStore(state => state.setIsMovingViewport)
  const handleSetViewport = useStore(state => state.handleSetViewport)

  const setLastCenter = useCursorStore(state => state.setLastCenter)
  const getTouchMovement = useCursorStore(state => state.getTouchMovement)

  const handleMouseDown = (e) => {
    e.evt.preventDefault();
    setIsMovingViewport(true)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  /**
   * Handle moving viewport base on mouse position relative to window
   */
  const handleMouseMove = (e) => {
    const stagePosition = stage.position()
    let newPosition = {
      x: stagePosition.x + e.movementX,
      y: stagePosition.y + e.movementY,
    }
    
    handleSetViewport(newPosition)
  }

  const handleMouseUp = (e) => {
    setIsMovingViewport(false)
    window.removeEventListener("mousemove", handleMouseMove)
    window.removeEventListener("mouseup", handleMouseUp)
  }

  const handleTouchStart = (e) => {
    const touch = e.evt.touches[0]
    const center = {
      x: touch.clientX,
      y: touch.clientY
    }
    setLastCenter(center)
    setIsMovingViewport(true)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)
  }


  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    const center = {
      x: touch.clientX,
      y: touch.clientY
    }

    const stagePosition = stage.position()
    const movement = getTouchMovement(center)

    let newPosition = {
      x: stagePosition.x + movement.x,
      y: stagePosition.y + movement.y,
    }

    setLastCenter(center)
    handleSetViewport(newPosition)
  }

  const handleTouchEnd = () => {
    setLastCenter(null)
    window.removeEventListener("touchmove", handleTouchMove)
    window.removeEventListener("touchend", handleTouchEnd)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_DOWN]: getSubject(EVENT_TYPES.STAGE_MOUSE_DOWN)
        .subscribe({ next: (e) => handleMouseDown(e) }),
      [EVENT_TYPES.STAGE_TOUCH_START]: getSubject(EVENT_TYPES.STAGE_TOUCH_START)
        .subscribe({ next: (e) => handleTouchStart(e) }),
      // [EVENT_TYPES.STAGE_TOUCH_MOVE]: getSubject(EVENT_TYPES.STAGE_TOUCH_MOVE)
      //   .subscribe({ next: (e) => handleTouchMove(e) }),
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