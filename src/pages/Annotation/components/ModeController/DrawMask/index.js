import React, { useEffect } from 'react'
import create from 'zustand'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useDatasetStore, useGeneralStore, useAnnotationStore } from '../../../stores/index'

import MaskAnnotationClass from '../../../../../classes/MaskAnnotationClass'
import StorageFileClass from '../../../../../classes/StorageFileClass'
import MiVOSScribbleToMaskBuilder from './MiVOSScribbleToMaskBuilder/index'

import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants'

import thresholdMask from '../../../utils/thresholdMask'

const useScribbleToMaskStore = create((set, get) => ({
  isDrawingScribble: false,
  getIsDrawingScribble: () => get().isDrawingScribble,
  setIsDrawingScribble: (value) => set({ isDrawingScribble: value }),

  miVOSBuilder: new MiVOSScribbleToMaskBuilder(),
  getMiVOSBuilder: () => get().miVOSBuilder,
  setMiVOSBuilder: (newBuilder) => set({ miVOSBuilder: newBuilder })
}))

const ScribbleToMask = (props) => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const playingState = useDatasetStore(state => state.playingState)
  const getDataInstance = useDatasetStore(state => state.getDataInstance)
  const currentAnnotationImageId = useDatasetStore(state => state.currentAnnotationImageId)
  const getCurrentAnnotationImageId = useDatasetStore(state => state.getCurrentAnnotationImageId)

  const getRenderingSize = useGeneralStore(state => state.getRenderingSize)
  const updateCurrentMousePosition = useGeneralStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useGeneralStore(state => state.getCurrentMousePosition)

  const getAnnotationByAnnotationObjectId = useAnnotationStore(state => state.getAnnotationByAnnotationObjectId)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const setAnnotation = useAnnotationStore(state => state.setAnnotation)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)

  const getToolConfig = useGeneralStore(state => state.getToolConfig)
  const setIsLoading = useGeneralStore(state => state.setIsLoading)

  const getIsDrawingScribble = useScribbleToMaskStore(state => state.getIsDrawingScribble)
  const setIsDrawingScribble = useScribbleToMaskStore(state => state.setIsDrawingScribble)
  const getMiVOSBuilder = useScribbleToMaskStore(state => state.getMiVOSBuilder)
  const setMiVOSBuilder = useScribbleToMaskStore(state => state.setMiVOSBuilder)


  useEffect(() => {
    let miVOSBuilder = getMiVOSBuilder()
    if (currentAnnotationImageId) {
      const dataInstance = getDataInstance()
      if (dataInstance && playingState) {
        const currentImage = dataInstance.getCurrentImage(playingState)
        miVOSBuilder.setImage(currentImage)
      }
    }
    setMiVOSBuilder(miVOSBuilder)
  }, [currentAnnotationImageId])


  const getCurrentAnnotation = () => {
    const objectId = getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.MASK, {
      ...DEFAULT_ANNOTATION_ATTRS,
      fill: '#FFFFFF'
    })
    const annotationImageId = getCurrentAnnotationImageId()
    const toolConfig = getToolConfig()

    const drawingAnnotation = getAnnotationByAnnotationObjectId(objectId, annotationImageId)

    if (drawingAnnotation) {
      return drawingAnnotation
    } else {
      const newAnnotation = new MaskAnnotationClass('', objectId, annotationImageId, {
        scribbles: [],
        mask: new StorageFileClass(),
        threshold: toolConfig.threshold
      }, true)
  
      let miVOSBuilder = getMiVOSBuilder()
      miVOSBuilder.setScribbles([])
      miVOSBuilder.setMask(null)
  
      appendAnnotation(newAnnotation, false)
  
      return newAnnotation
    }
  }

  const handleStartDrawByBrush = async () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const drawingAnnotation = getCurrentAnnotation()
    const currentMousePosition = getCurrentMousePosition()
    const toolConfig = getToolConfig()

    const maskData = cloneDeep(drawingAnnotation.maskData)
    maskData.scribbles.push({
      points: [[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]],
      type: toolConfig.scribbleType,
      strokeWidth: toolConfig.scribbleSize,
    })
    setAnnotation(drawingAnnotation.id, maskData, false)

    setIsDrawingScribble(true)
  }

  const handleDrawByBrush = async () => {
    const isDrawingScribble = getIsDrawingScribble()
    if (!isDrawingScribble) {
      return
    }
    
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const drawingAnnotation = getCurrentAnnotation()
    const currentMousePosition = getCurrentMousePosition()

    const maskData = cloneDeep(drawingAnnotation.maskData)
    let scribbles = maskData.scribbles
    let drawingScribble = scribbles.pop()
    // not finish initialization
    if (!drawingScribble){
      return
    }
    drawingScribble.points.push([currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight])
    maskData.scribbles = [...scribbles, drawingScribble]

    setAnnotation(drawingAnnotation.id, maskData, false)
  }

  const handleFinishDrawByBrush = async () => {
    const isDrawingScribble = getIsDrawingScribble()
    if (!isDrawingScribble) {
      return
    }

    setIsDrawingScribble(false)
    const drawingAnnotation = getCurrentAnnotation()
    setAnnotation(drawingAnnotation.id, {}, true)

    let miVOSBuilder = getMiVOSBuilder()
    await miVOSBuilder.setScribbles(drawingAnnotation.maskData.scribbles)
    setMiVOSBuilder(miVOSBuilder)

    setIsDrawingScribble(false)
  }

  const handleClearAllScribbles = async () => {
    const drawingAnnotation = getCurrentAnnotation()
    setAnnotation(drawingAnnotation.id, {
      scribbles: []
    }, true)

    let miVOSBuilder = getMiVOSBuilder()
    await miVOSBuilder.setScribbles([])
    setMiVOSBuilder(miVOSBuilder)
  }

  
  const handleDragStart = (e) => {
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
    handleFinishDrawByBrush()
  }

  const handleUpdateThreshold = async () => {
    const drawingAnnotation = getCurrentAnnotation()
    const toolConfig = getToolConfig()

    setAnnotation(drawingAnnotation.id, {
      threshold: toolConfig.threshold
    }, true)
  }

  const handleTriggerPredict = async () => {
    const drawingAnnotation = getCurrentAnnotation()
    let miVOSBuilder = getMiVOSBuilder()

    if (!instanceId) {
      alert("Image not found")
      return
    }
    const renderingSize = getRenderingSize()
    const { mask, threshold, scribbles} = drawingAnnotation.maskData
    const maskBase64 = await mask.getBase64()
    // TODO: update code here
    const thresholdedMask = await thresholdMask(maskBase64, threshold, {
      canvasWidth: renderingSize.width,
      canvasHeight: renderingSize.height,
      makeTransparent: true,
    })
    await miVOSBuilder.setScribbles(scribbles)

    miVOSBuilder.setMask(thresholdedMask)

    setIsLoading("predicting_scribble_to_mask", true)
    const data = miVOSBuilder.getMiVOSScribbleToMaskInput()
    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M)(data)
  }

  const handleFinishPredict = async (data) => {
    const drawingAnnotation = getCurrentAnnotation()
    const { base64 } = data
    await drawingAnnotation.setMaskBase64(base64)

    setAnnotation(drawingAnnotation.id, cloneDeep(drawingAnnotation.maskData), true)
    setIsLoading("predicting_scribble_to_mask", false)
  }

  const handlePredictError = () => {
    alert("Prediction error")
    setIsLoading("predicting_scribble_to_mask", false)
  }

  const handleUnselectCurrentAnnotationObject = () => {
    setSelectedObjectId(null)
  }

  useEffect(() => {
    const { getSubject } = EventCenter
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
      [EVENT_TYPES.DRAW_MASK.PREDICT]: getSubject(EVENT_TYPES.DRAW_MASK.PREDICT)
        .subscribe({ next: (e) => handleTriggerPredict(e) }),
      [EVENT_TYPES.DRAW_MASK.PREDICT_ERROR]: getSubject(EVENT_TYPES.DRAW_MASK.PREDICT_ERROR)
        .subscribe({ next: (e) => handlePredictError(e) }),
      [EVENT_TYPES.DRAW_MASK.PREDICT_FINISH]: getSubject(EVENT_TYPES.DRAW_MASK.PREDICT_FINISH)
        .subscribe({ next: (e) => handleFinishPredict(e) }),
      [EVENT_TYPES.DRAW_MASK.CLEAR_ALL]: getSubject(EVENT_TYPES.DRAW_MASK.CLEAR_ALL_SCRIBBLES)
        .subscribe({ next: (e) => handleClearAllScribbles(e) }),
      [EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD]: getSubject(EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD)
        .subscribe({ next: (e) => handleUpdateThreshold(e) }),
      [EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT]: getSubject(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)
        .subscribe({ next: (e) => handleUnselectCurrentAnnotationObject(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [instanceId])

  return null
}

export default ScribbleToMask