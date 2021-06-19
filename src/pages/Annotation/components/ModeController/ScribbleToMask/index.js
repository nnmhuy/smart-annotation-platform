import React from 'react'
import create from 'zustand'
import UIDGenerator from 'uid-generator'
import { get, cloneDeep, isEqual } from 'lodash'

import ScribbleToMaskAnnotationClass from '../../../../../classes/ScribbleToMaskAnnotationClass'

import { MODES, EVENT_TYPES } from '../../../constants';

const uidgen = new UIDGenerator();

const useScribbleToMaskStore = create((set, get) => ({
  isDrawingScribble: false,
  getIsDrawingScribble: () => get().isDrawingScribble,
  setIsDrawingScribble: (value) => set({ isDrawingScribble: value }),
}))

const ScribbleToMask = (props) => {
  const { useStore, eventCenter } = props
  const getImageId = useStore(state => state.getImageId)
  const appendAnnotation = useStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useStore(state => state.setDrawingAnnotation)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useStore(state => state.getCurrentMousePosition)
  const getToolConfig = useStore(state => state.getToolConfig)
  const getIsDrawingScribble = useScribbleToMaskStore(state => state.getIsDrawingScribble)
  const setIsDrawingScribble = useScribbleToMaskStore(state => state.setIsDrawingScribble)

  const handleStartDrawByBrush = () => {
    const imageId = getImageId()
    const drawingAnnotation = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()
    const toolConfig = getToolConfig()

    if (drawingAnnotation === null) {
      setDrawingAnnotation(new ScribbleToMaskAnnotationClass(uidgen.generateSync(), '', imageId, {
        scribbles: [{
          points: [[currentMousePosition.x, currentMousePosition.y]],
          type: toolConfig.scribbleType,
          strokeWidth: toolConfig.scribbleSize,
        }],
        mask: {}
      }))
    } else {
      const newDrawingAnnotation = cloneDeep(drawingAnnotation)
      newDrawingAnnotation.maskData.scribbles.push({
        points: [[currentMousePosition.x, currentMousePosition.y]],
        type: toolConfig.scribbleType,
        strokeWidth: toolConfig.scribbleSize,
      })
      setDrawingAnnotation(newDrawingAnnotation)
    }
    setIsDrawingScribble(true)
  }

  const handleDrawByBrush = () => {
    const drawingAnnotation = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()
    const isDrawingScribble = getIsDrawingScribble()

    if (drawingAnnotation && isDrawingScribble) { // wait initialization to finish
      const newDrawingAnnotation = cloneDeep(drawingAnnotation)
      let scribbles = newDrawingAnnotation.maskData.scribbles
      let drawingScribble = scribbles.pop()
      drawingScribble.points.push([currentMousePosition.x, currentMousePosition.y])
      newDrawingAnnotation.updateData = {
        scribbles: [...scribbles, drawingScribble]
      }
      setDrawingAnnotation(newDrawingAnnotation)
    }
  }

  const handleFinishDrawByBrush = () => {
    setIsDrawingScribble(false)
  }

  const handleMouseDown = () => {
    updateCurrentMousePosition()
    handleStartDrawByBrush()
  }

  const handleMouseMove = () => {
    updateCurrentMousePosition()
    handleDrawByBrush()
  }

  const handleMouseUp = () => {
    handleFinishDrawByBrush()
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
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    null
  )
}

export default ScribbleToMask