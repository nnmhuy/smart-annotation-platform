import React from 'react'
import create from 'zustand'

import {
  EVENT_TYPES,
  MIN_ZOOM_SCALE, MAX_ZOOM_SCALE, } from '../../../constants';

const useCursorStore = create((set, get) => ({
  lastCenter: null,
  lastDist: 0,

  setLastCenter: (newCenter) => set({ lastCenter: newCenter }),
  getLastCenter: () => get().lastCenter,
  setLastDist: (newDist) => set({ dist: newDist }),
  getLastDist: () => get().lastDist,
}))

const Cursor = (props) => {
  const { useStore, eventCenter } = props
  const stage = useStore(state => state.stageRef)

  const setLastCenter = useCursorStore(state => state.setLastCenter)
  const getLastCenter = useCursorStore(state => state.getLastCenter)
  const setLastDist = useCursorStore(state => state.setLastDist)
  const getLastDist = useCursorStore(state => state.getLastDist)

  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCenter(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  const handleTouchMove = (e) => {
    window.addEventListener("touchend", handleTouchEnd)

    e.evt.preventDefault();
    var touch1 = e.evt.touches[0];
    var touch2 = e.evt.touches[1];

    let lastCenter = getLastCenter()
    let lastDist = getLastDist() 

    if (touch1 && touch2) {
      // if the stage was under Konva's drag&drop
      // we need to stop it, and implement our own pan logic with two pointers
      if (stage.isDragging()) {
        stage.stopDrag();
      }

      var p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      var p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastCenter) {
        setLastCenter(getCenter(p1, p2))
        return;
      }
      var newCenter = getCenter(p1, p2);

      var dist = getDistance(p1, p2);

      if (!lastDist) {
        lastDist = dist;
        setLastDist(dist)
      }

      // local coordinates of center point
      var pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      };

      var scale = stage.scaleX() * (dist / lastDist);

      stage.scaleX(scale);
      stage.scaleY(scale);

      // calculate new position of the stage
      var dx = newCenter.x - lastCenter.x;
      var dy = newCenter.y - lastCenter.y;

      var newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };

      stage.position(newPos);

      setLastDist(dist)
      setLastCenter(newCenter)
    }
  }

  const handleTouchEnd = () => {
    setLastCenter(null)
    setLastDist(0)

    window.removeEventListener("touchend", handleTouchEnd)
  }



  const handleZoom = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale =
      e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // limit zoom scale
    if (newScale >= MIN_ZOOM_SCALE && newScale <= MAX_ZOOM_SCALE) {
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();
    }
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_TOUCH_MOVE]: getSubject(EVENT_TYPES.STAGE_TOUCH_MOVE)
        .subscribe({ next: (e) => handleTouchMove(e) }),
      [EVENT_TYPES.STAGE_WHEEL]: getSubject(EVENT_TYPES.STAGE_WHEEL)
        .subscribe({ next: (e) => handleZoom(e) }),
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