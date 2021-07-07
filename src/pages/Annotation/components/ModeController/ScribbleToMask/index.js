import React from 'react'
import create from 'zustand'
import UIDGenerator from 'uid-generator'
import { get, cloneDeep } from 'lodash'

import ScribbleToMaskAnnotationClass from '../../../../../classes/ScribbleToMaskAnnotationClass'
import MiVOSScribbleToMaskBuilder from './MiVOSScribbleToMaskBuilder/index'

import Cursor from '../Cursor/index'
import thresholdMask from '../../../utils/thresholdMask'
import { EVENT_TYPES } from '../../../constants';
import hexColorToRGB from '../../../../../utils/hexColorToRGB'
import resizeImage from '../../../../../utils/resizeImage'

const uidgen = new UIDGenerator(96, UIDGenerator.BASE16);

const useScribbleToMaskStore = create((set, get) => ({
  isDrawingScribble: false,
  getIsDrawingScribble: () => get().isDrawingScribble,
  setIsDrawingScribble: (value) => set({ isDrawingScribble: value }),

  miVOSBuilder: new MiVOSScribbleToMaskBuilder(),
  getMiVOSBuilder: () => get().miVOSBuilder,
  setMiVOSBuilder: (newBuilder) => set({ miVOSBuilder: newBuilder })
}))

const ScribbleToMask = (props) => {
  const { useStore, eventCenter } = props
  const getImageId = useStore(state => state.getImageId)
  const image = useStore(state => state.image)
  const getImage = useStore(state => state.getImage)
  const appendAnnotation = useStore(state => state.appendAnnotation)
  const getDrawingAnnotation = useStore(state => state.getDrawingAnnotation)
  const setDrawingAnnotation = useStore(state => state.setDrawingAnnotation)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const getCurrentMousePosition = useStore(state => state.getCurrentMousePosition)
  const getToolConfig = useStore(state => state.getToolConfig)
  const setIsPredicting = useStore(state => state.setIsPredicting)

  const getIsDrawingScribble = useScribbleToMaskStore(state => state.getIsDrawingScribble)
  const setIsDrawingScribble = useScribbleToMaskStore(state => state.setIsDrawingScribble)
  const getMiVOSBuilder = useScribbleToMaskStore(state => state.getMiVOSBuilder)
  const setMiVOSBuilder = useScribbleToMaskStore(state => state.setMiVOSBuilder)


  React.useEffect(() => {
    let miVOSBuilder = getMiVOSBuilder()
    miVOSBuilder.setImage(image)
    setMiVOSBuilder(miVOSBuilder)
  }, [image])

  const handleStartDrawByBrush = () => {
    const imageId = getImageId()
    const image = getImage()
    const imageWidth = get(image, 'width', 1)
    const imageHeight = get(image, 'height', 1)
    const drawingAnnotation = getDrawingAnnotation()
    const currentMousePosition = getCurrentMousePosition()
    const toolConfig = getToolConfig()


    if (drawingAnnotation === null) {
      setDrawingAnnotation(new ScribbleToMaskAnnotationClass(uidgen.generateSync(), '', imageId, {
        scribbles: [{
          points: [[currentMousePosition.x / imageWidth, currentMousePosition.y / imageHeight]],
          type: toolConfig.scribbleType,
          strokeWidth: toolConfig.scribbleSize,
        }],
        mask: null
      }, {
        threshold: toolConfig.threshold,
      }))
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
    const image = getImage()
    const imageWidth = get(image, 'width', 1)
    const imageHeight = get(image, 'height', 1)
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

  const handleFinishDrawByBrush = () => {
    const drawingAnnotation = getDrawingAnnotation()

    let miVOSBuilder = getMiVOSBuilder()
    miVOSBuilder.setScribbles(drawingAnnotation.maskData.scribbles)
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
    setIsDrawingScribble(false)
  }

  const handleTriggerPredict = () => {
    const image = getImage()
    const drawingAnnotation = getDrawingAnnotation()
    let miVOSBuilder = getMiVOSBuilder()

    if (!image || !drawingAnnotation) {
      alert("Image not found")
      return
    }

    setIsPredicting(true)
    const data = miVOSBuilder.getMiVOSScribbleToMaskInput()
    eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.MI_VOS_S2M)(data)
  }

  const handleFinishPredict = async (data) => {
    const drawingAnnotation = getDrawingAnnotation()
    let miVOSBuilder = getMiVOSBuilder()
    const toolConfig = getToolConfig()

    const { base64 } = data
    const originalBase64 = await resizeImage(base64,
      {
        maxWidth: image.originalWidth,
        maxHeight: image.originalHeight
      },
      true
    ).then(({img}) => img)

    const newDrawingAnnotation = cloneDeep(drawingAnnotation)
    newDrawingAnnotation.updateData = {
      mask: originalBase64
    }
    newDrawingAnnotation.updateProperties = {
      threshold: toolConfig.threshold
    }

    miVOSBuilder.setMask(base64)
    setDrawingAnnotation(newDrawingAnnotation)
    setMiVOSBuilder(miVOSBuilder)
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
      newDrawingAnnotation.properties.threshold = toolConfig.threshold
      setDrawingAnnotation(newDrawingAnnotation)
    }
  }

  const handleSave = async () => {
    const image = getImage()
    const drawingAnnotation = getDrawingAnnotation()

    if (drawingAnnotation) {
      const finishedAnnotation = cloneDeep(drawingAnnotation)

      const mask = finishedAnnotation.maskData.mask
      let threshold = get(finishedAnnotation, 'properties.threshold', 0)

      const thresholdedMask = await thresholdMask(mask, threshold, {
        color: hexColorToRGB('#FFFFFF'),
        canvasWidth: image.originalWidth,
        canvasHeight: image.originalHeight,
      })

      finishedAnnotation.updateData = {
        scribbles: [],
        mask: thresholdedMask
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
    <Cursor {...props} />
  )
}

export default ScribbleToMask