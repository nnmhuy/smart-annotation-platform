import React from 'react'
import create from 'zustand'
import UIDGenerator from 'uid-generator'
import { get, cloneDeep } from 'lodash'

import ScribbleToMaskAnnotationClass from '../../../../../classes/ScribbleToMaskAnnotationClass'

import thresholdMask from '../../../utils/thresholdMask'
import base64ToBlob from '../../../../../utils/base64ToBlob'
import { EVENT_TYPES } from '../../../constants';

const uidgen = new UIDGenerator();

const useScribbleToMaskStore = create((set, get) => ({
  isDrawingScribble: false,
  getIsDrawingScribble: () => get().isDrawingScribble,
  setIsDrawingScribble: (value) => set({ isDrawingScribble: value }),
}))

const ScribbleToMask = (props) => {
  const { useStore, eventCenter } = props
  const getImageId = useStore(state => state.getImageId)
  const getImage = useStore(state => state.getImage)
  const appendAnnotation = useStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useStore(state => state.setDrawingAnnotation)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useStore(state => state.getCurrentMousePosition)
  const getToolConfig = useStore(state => state.getToolConfig)
  const getIsDrawingScribble = useScribbleToMaskStore(state => state.getIsDrawingScribble)
  const setIsDrawingScribble = useScribbleToMaskStore(state => state.setIsDrawingScribble)
  const setIsPredicting = useStore(state => state.setIsPredicting)
  
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
        mask: {
          threshold: toolConfig.threshold,
        }
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

  const handleDragStart = (e) => {
    console.log("dragstart")
    const stage = e.target.getStage()
    e.evt.preventDefault()
    if (stage.isDragging()) {
      stage.stopDrag();
    }
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

  const handleMouseEnter = () => {
    setIsDrawingScribble(false)
  }

  const handleTriggerPredict = () => {
    const image = getImage()
    const drawingAnnotation = getDrawingAnnotation()

    if (!image || !drawingAnnotation) {
      alert("Image not found")
      return
    }

    setIsPredicting(true)
    eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.MI_VOS_S2M)({
      image, 
      annotation: drawingAnnotation
    })
  }

  const handleFinishPredict = (data) => {
    const drawingAnnotation = getDrawingAnnotation()
    const toolConfig = getToolConfig()

    const { originalBase64, base64, blob } = data

    const newDrawingAnnotation = cloneDeep(drawingAnnotation)
    newDrawingAnnotation.updateData = {
      mask: {
        base64,
        originalBase64,
        blob,
        threshold: toolConfig.threshold
      }
    }
    setDrawingAnnotation(newDrawingAnnotation)
    setIsPredicting(false)
  }

  const handlePredictError = () => {
    alert("Prediction error")
    setIsPredicting(false)
  }

  const handleUpdateThreshold = () => {
    const drawingAnnotation = getDrawingAnnotation()
    const toolConfig = getToolConfig()

    if (drawingAnnotation) {
      const newDrawingAnnotation = cloneDeep(drawingAnnotation)
      newDrawingAnnotation.maskData.mask.threshold = toolConfig.threshold
      setDrawingAnnotation(newDrawingAnnotation)
    }
  }

  const handleSave = async () => {
    const image = getImage()
    const drawingAnnotation = getDrawingAnnotation()

    if (drawingAnnotation) {
      const finishedAnnotation = cloneDeep(drawingAnnotation)

      const mask = finishedAnnotation.maskData.mask
      let originalBase64 = get(mask, 'originalBase64', null)
      let base64 = get(mask, 'base64', null)
      let threshold = get(mask, 'threshold', 0)

      const thresholdOriginalBase64 = await thresholdMask(originalBase64, threshold, {
        canvasWidth: image.originalWidth,
        canvasHeight: image.originalHeight,
      })
      const thresholdBase64 = await thresholdMask(base64, threshold, {
        canvasWidth: image.width,
        canvasHeight: image.height,
      })
      const thresholdBlob = await base64ToBlob(thresholdOriginalBase64)

      finishedAnnotation.updateData = {
        scribbles: [],
        mask: {
          originalBase64: thresholdOriginalBase64,
          base64: thresholdBase64,
          blob: thresholdBlob
        }
      }
    
      appendAnnotation(finishedAnnotation)
      setDrawingAnnotation(null)
      eventCenter.emitEvent(EVENT_TYPES.FINISH_ANNOTATION)(finishedAnnotation.id)
    }
  }

  const handleClearAll = () => {
    setDrawingAnnotation(null)
  }
  
  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_DRAG_START]: getSubject(EVENT_TYPES.STAGE_DRAG_START)
        .subscribe({ next: (e) => handleDragStart(e) }),
      [EVENT_TYPES.STAGE_MOUSE_DOWN]: getSubject(EVENT_TYPES.STAGE_MOUSE_DOWN)
        .subscribe({ next: (e) => handleMouseDown(e) }),
      [EVENT_TYPES.STAGE_MOUSE_MOVE]: getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
        .subscribe({ next: (e) => handleMouseMove(e) }),
      [EVENT_TYPES.STAGE_MOUSE_UP]: getSubject(EVENT_TYPES.STAGE_MOUSE_UP)
        .subscribe({ next: (e) => handleMouseUp(e) }),
      [EVENT_TYPES.STAGE_MOUSE_ENTER]: getSubject(EVENT_TYPES.STAGE_MOUSE_ENTER)
        .subscribe({ next: (e) => handleMouseEnter(e) }),
      [EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT]: getSubject(EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT)
        .subscribe({ next: (e) => handleTriggerPredict(e) }),
      [EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT_ERROR]: getSubject(EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT_ERROR)
        .subscribe({ next: (e) => handlePredictError(e) }),
      [EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT_FINISH]: getSubject(EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT_FINISH)
        .subscribe({ next: (e) => handleFinishPredict(e) }),
      [EVENT_TYPES.SCRIBBLE_TO_MASK.SAVE]: getSubject(EVENT_TYPES.SCRIBBLE_TO_MASK.SAVE)
        .subscribe({ next: (e) => handleSave(e) }),
      [EVENT_TYPES.SCRIBBLE_TO_MASK.CLEAR_ALL]: getSubject(EVENT_TYPES.SCRIBBLE_TO_MASK.CLEAR_ALL)
        .subscribe({ next: (e) => handleClearAll(e) }),
      [EVENT_TYPES.SCRIBBLE_TO_MASK.UPDATE_THRESHOLD]: getSubject(EVENT_TYPES.SCRIBBLE_TO_MASK.UPDATE_THRESHOLD)
        .subscribe({ next: (e) => handleUpdateThreshold(e) }),
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