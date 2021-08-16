import React, { useState } from 'react'
import { cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useDatasetStore, useAnnotationStore } from '../../../stores/index'

import MaskAnnotationClass from '../../../../../classes/MaskAnnotationClass'

import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS } from '../../../constants';
import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'


const ReferringExpression = (props) => {
  const [isPredicting, setIsPredicting] = useState(false)
  const instanceId = useDatasetStore(state => state.instanceId)
  const getCurrentAnnotationImageId = useDatasetStore(state => state.getCurrentAnnotationImageId)

  const getAnnotationByAnnotationObjectId = useAnnotationStore(state => state.getAnnotationByAnnotationObjectId)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const setAnnotation = useAnnotationStore(state => state.setAnnotation)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)
  const setAnnotationObjectAttributes = useAnnotationStore(state => state.setAnnotationObjectAttributes)

  const getCurrentAnnotationObjectId = async (properties = {}, attributes = {}) => {
    const objectId = await getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.MASK, {
      ...DEFAULT_ANNOTATION_ATTRS,
      fill: '#FFFFFF',
      ...properties,
    }, attributes)
    return objectId
  }

  const getCurrentAnnotation = async () => {
    const objectId = await getCurrentAnnotationObjectId()
    const annotationImageId = getCurrentAnnotationImageId()

    const drawingAnnotation = getAnnotationByAnnotationObjectId(objectId, annotationImageId)

    if (drawingAnnotation) {
      return drawingAnnotation
    } else {
      const newAnnotation = new MaskAnnotationClass('', objectId, annotationImageId, {}, true)

      await appendAnnotation(newAnnotation, { commitAnnotation: true })
      return newAnnotation
    }
  }

  const handleFocusTextInput = () => {
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT)()
  }

  const handleReferringExpressionChange = async (value) => {
    const objectId = await getCurrentAnnotationObjectId({}, { referringExpression: value })
    setAnnotationObjectAttributes(objectId, {
      referringExpression: value
    })
  }

  const handleTriggerPredict = async (value) => {
    if (!instanceId) {
      alert("Image not found")
      EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_ERROR)()
      return
    }
    if (isPredicting) {
      return
    }
    setIsPredicting(true)
    const currentAnnotation = await getCurrentAnnotation()
    
    const data = {
      annotation_id: currentAnnotation.id,
      expression: value,
    }

    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.CMPC_REFERRING_EXPRESSION_TO_MASK)(data)
  }

  const handleFinishPredict = async (data) => {
    const currentAnnotation = await getCurrentAnnotation()

    await currentAnnotation.setMask(data)

    setAnnotation(currentAnnotation.id, cloneDeep(currentAnnotation.maskData))
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_FINISH)()
    setIsPredicting(false)
  }

  const handlePredictError = () => {
    alert("Prediction error")
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_ERROR)()
    setIsPredicting(false)
  }

  const handleUnselectCurrentAnnotationObject = () => {
    setSelectedObjectId(null)
  }

  const handleUpdateThreshold = async (newThreshold) => {
    if (!instanceId) {
      return
    }
    const drawingAnnotation = await getCurrentAnnotation()

    setAnnotation(drawingAnnotation.id, {
      threshold: newThreshold
    }, { commitAnnotation: true })
  }

  React.useEffect(() => {
    if (!instanceId) {
      return
    }
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleFocusTextInput(e) }),
      [EVENT_TYPES.STAGE_TAP]: getSubject(EVENT_TYPES.STAGE_TAP)
        .subscribe({ next: (e) => handleFocusTextInput(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.REFERRING_EXPRESSION_CHANGE]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.REFERRING_EXPRESSION_CHANGE)
        .subscribe({ next: (e) => handleReferringExpressionChange(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.PREDICT]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT)
        .subscribe({ next: (e) => handleTriggerPredict(e) }),
      [EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT]: getSubject(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)
        .subscribe({ next: (e) => handleUnselectCurrentAnnotationObject(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.CMPC_REFERRING_EXPRESSION_TO_MASK_FINISH]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.CMPC_REFERRING_EXPRESSION_TO_MASK_FINISH)
        .subscribe({ next: (e) => handleFinishPredict(e) }),
      [EVENT_TYPES.REFERRING_EXPRESSION.CMPC_REFERRING_EXPRESSION_TO_MASK_ERROR]: getSubject(EVENT_TYPES.REFERRING_EXPRESSION.CMPC_REFERRING_EXPRESSION_TO_MASK_ERROR)
        .subscribe({ next: (e) => handlePredictError(e) }),
      [EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD]: getSubject(EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD)
        .subscribe({ next: (e) => handleUpdateThreshold(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [instanceId])

  return null
}

export default ReferringExpression