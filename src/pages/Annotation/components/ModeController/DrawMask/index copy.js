import React from 'react'
import create from 'zustand'
import { get, cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useDatasetStore, useGeneralStore, useAnnotationStore } from '../../../stores/index'

import MaskAnnotationClass from '../../../../../classes/MaskAnnotationClass'
import MiVOSScribbleToMaskBuilder from './MiVOSScribbleToMaskBuilder/index'

import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'
import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants'

import thresholdMask from '../../../utils/thresholdMask'
import hexColorToRGB from '../../../../../utils/hexColorToRGB'

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

  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useAnnotationStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useAnnotationStore(state => state.setDrawingAnnotation)
  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)

  const getToolConfig = useGeneralStore(state => state.getToolConfig)
  const setIsLoading = useGeneralStore(state => state.setIsLoading)

  const getIsDrawingScribble = useScribbleToMaskStore(state => state.getIsDrawingScribble)
  const setIsDrawingScribble = useScribbleToMaskStore(state => state.setIsDrawingScribble)
  const getMiVOSBuilder = useScribbleToMaskStore(state => state.getMiVOSBuilder)
  const setMiVOSBuilder = useScribbleToMaskStore(state => state.setMiVOSBuilder)


  React.useEffect(() => {
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


  const handleStartDrawByBrush = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)

    const drawingAnnotation = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()
    const toolConfig = getToolConfig()


    if (drawingAnnotation === null) {
      const objectId = getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.MASK, DEFAULT_ANNOTATION_ATTRS)
      const annotationImageId = getCurrentAnnotationImageId()
      setDrawingAnnotation(new MaskAnnotationClass('', objectId, annotationImageId, {
        scribbles: [{
          points: [[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]],
          type: toolConfig.scribbleType,
          strokeWidth: toolConfig.scribbleSize,
        }],
        mask: null,
        threshold: toolConfig.threshold
      }, true))
    } else {
      const newDrawingAnnotation = cloneDeep(drawingAnnotation)
      newDrawingAnnotation.maskData.scribbles.push({
        points: [[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]],
        type: toolConfig.scribbleType,
        strokeWidth: toolConfig.scribbleSize,
      })
      setDrawingAnnotation(newDrawingAnnotation)
    }

    setIsDrawingScribble(true)
  }

  const handleDrawByBrush = () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)
    const drawingAnnotation = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()
    const isDrawingScribble = getIsDrawingScribble()

    if (drawingAnnotation && isDrawingScribble) { // wait initialization to finish
      const newDrawingAnnotation = cloneDeep(drawingAnnotation)
      let scribbles = newDrawingAnnotation.maskData.scribbles
      let drawingScribble = scribbles.pop()
      drawingScribble.points.push([currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight])
      newDrawingAnnotation.updateData = {
        scribbles: [...scribbles, drawingScribble]
      }
      setDrawingAnnotation(newDrawingAnnotation)
    }
  }

  const handleFinishDrawByBrush = async () => {
    const drawingAnnotation = getDrawingAnnotation()

    let miVOSBuilder = getMiVOSBuilder()
    await miVOSBuilder.setScribbles(drawingAnnotation.maskData.scribbles)
    setMiVOSBuilder(miVOSBuilder)

    setIsDrawingScribble(false)
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

  const handleTriggerPredict = () => {
    const drawingAnnotation = getDrawingAnnotation()
    let miVOSBuilder = getMiVOSBuilder()

    if (!instanceId || !drawingAnnotation) {
      alert("Image not found")
      return
    }

    setIsLoading("predictingScribbleToMask", true)
    const data = miVOSBuilder.getMiVOSScribbleToMaskInput()
    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M)(data)
  }

  const handleFinishPredict = async (data) => {
    const drawingAnnotation = getDrawingAnnotation()
    let miVOSBuilder = getMiVOSBuilder()
    const toolConfig = getToolConfig()

    const { base64 } = data

    const newDrawingAnnotation = cloneDeep(drawingAnnotation)
    newDrawingAnnotation.updateData = {
      mask: base64
    }
    newDrawingAnnotation.updateProperties = {
      threshold: toolConfig.threshold
    }

    await miVOSBuilder.setMask(base64)
    setDrawingAnnotation(newDrawingAnnotation)
    setMiVOSBuilder(miVOSBuilder)
    setIsLoading("predictingScribbleToMask", false)
  }

  const handlePredictError = () => {
    alert("Prediction error")
    setIsLoading("predictingScribbleToMask", false)
  }

  const handleUpdateThreshold = () => {
    const drawingAnnotation = getDrawingAnnotation()
    const toolConfig = getToolConfig()

    if (drawingAnnotation) {
      const newDrawingAnnotation = cloneDeep(drawingAnnotation)
      newDrawingAnnotation.properties.threshold = toolConfig.threshold
      setDrawingAnnotation(newDrawingAnnotation)
    }
  }

  const handleSave = async () => {
    const renderingSize = getRenderingSize()
    const imageWidth = get(renderingSize, 'width', 1)
    const imageHeight = get(renderingSize, 'height', 1)
    
    const drawingAnnotation = getDrawingAnnotation()

    if (drawingAnnotation) {
      const finishedAnnotation = cloneDeep(drawingAnnotation)

      const mask = finishedAnnotation.maskData.mask
      let threshold = get(finishedAnnotation, 'properties.threshold', 0)

      const thresholdedMask = await thresholdMask(mask, threshold, {
        color: hexColorToRGB('#FFFFFF'),
        canvasWidth: imageWidth,
        canvasHeight: imageHeight,
      })

      finishedAnnotation.updateData = {
        scribbles: [],
        mask: thresholdedMask
      }

      appendAnnotation(finishedAnnotation)
      setDrawingAnnotation(null)
      EventCenter.emitEvent(EVENT_TYPES.FINISH_ANNOTATION)(finishedAnnotation.id)
    }
  }

  const handleClearAll = () => {
    setDrawingAnnotation(null)
  }

  React.useEffect(() => {
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
      [EVENT_TYPES.DRAW_MASK.SAVE]: getSubject(EVENT_TYPES.DRAW_MASK.SAVE)
        .subscribe({ next: (e) => handleSave(e) }),
      [EVENT_TYPES.DRAW_MASK.CLEAR_ALL]: getSubject(EVENT_TYPES.DRAW_MASK.CLEAR_ALL)
        .subscribe({ next: (e) => handleClearAll(e) }),
      [EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD]: getSubject(EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD)
        .subscribe({ next: (e) => handleUpdateThreshold(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [instanceId])

  return null
}

export default ScribbleToMask