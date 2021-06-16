import React from 'react'

import { EVENT_TYPES } from '../../../constants';

const Cursor = (props) => {
  const { useStore, eventCenter } = props
  const stage = useStore(state => state.stageRef)
  const setIsMovingViewport = useStore(state => state.setIsMovingViewport)
  const handleSetViewport = useStore(state => state.handleSetViewport)

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

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_DOWN]: getSubject(EVENT_TYPES.STAGE_MOUSE_DOWN)
        .subscribe({ next: (e) => handleMouseDown(e) }),
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