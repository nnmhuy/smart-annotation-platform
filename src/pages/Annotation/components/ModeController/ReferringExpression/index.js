import React from 'react'
import { cloneDeep } from 'lodash'

import EventCenter from '../../../EventCenter'
import { useDatasetStore, useGeneralStore, useAnnotationStore } from '../../../stores/index'

import StorageFileClass from '../../../../../classes/StorageFileClass'
import MaskAnnotationClass from '../../../../../classes/MaskAnnotationClass'

import { EVENT_TYPES, DEFAULT_ANNOTATION_ATTRS, DEFAULT_TOOL_CONFIG, MODES } from '../../../constants';
import { ENUM_ANNOTATION_TYPE } from '../../../../../constants/constants'


const ReferringExpression = (props) => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const getCurrentAnnotationImageId = useDatasetStore(state => state.getCurrentAnnotationImageId)

  const getAnnotationByAnnotationObjectId = useAnnotationStore(state => state.getAnnotationByAnnotationObjectId)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const setAnnotation = useAnnotationStore(state => state.setAnnotation)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)
  const getOrCreateSelectedObjectId = useAnnotationStore(state => state.getOrCreateSelectedObjectId)
  const setAnnotationObjectAttributes = useAnnotationStore(state => state.setAnnotationObjectAttributes)

  const getCurrentAnnotationObjectId = async () => {
    const objectId = await getOrCreateSelectedObjectId(instanceId, ENUM_ANNOTATION_TYPE.MASK, {
      ...DEFAULT_ANNOTATION_ATTRS,
      fill: '#FFFFFF'
    })
    return objectId
  }

  const getCurrentAnnotation = async () => {
    const objectId = await getCurrentAnnotationObjectId()
    const annotationImageId = getCurrentAnnotationImageId()

    const drawingAnnotation = getAnnotationByAnnotationObjectId(objectId, annotationImageId)

    if (drawingAnnotation) {
      return drawingAnnotation
    } else {
      const newAnnotation = new MaskAnnotationClass('', objectId, annotationImageId, {
        scribbles: [],
        mask: new StorageFileClass(),
        threshold: DEFAULT_TOOL_CONFIG[MODES.DRAW_MASK.name].threshold,
      }, true)

      appendAnnotation(newAnnotation, { commitAnnotation: true })
      return newAnnotation
    }
  }

  const handleFocusTextInput = () => {
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.FOCUS_TEXT_INPUT)()
  }

  const handleReferringExpressionChange = async (value) => {
    const objectId = await getCurrentAnnotationObjectId()
    setAnnotationObjectAttributes(objectId, {
      referringExpression: value
    })
  }

  const handleTriggerPredict = async (value) => {
    if (!instanceId) {
      alert("Image not found")
      return
    }
    
    const objectId = await getCurrentAnnotationObjectId()
    const annotationImageId = getCurrentAnnotationImageId()
    const data = {
      annotation_image_id: annotationImageId,
      annotation_object_id: objectId,
      referring_expression: value,
    }

    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.CMPC_REFERRING_EXPRESSION_TO_MASK)(data)
  }

  const handleFinishPredict = async (data) => {
    const currentAnnotation = await getCurrentAnnotation()

    await currentAnnotation.setMask(data)

    setAnnotation(currentAnnotation.id, cloneDeep(currentAnnotation.maskData), { commitAnnotation: true })
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_FINISH)()
  }

  const handlePredictError = () => {
    alert("Prediction error")
    EventCenter.emitEvent(EVENT_TYPES.REFERRING_EXPRESSION.PREDICT_ERROR)()
  }

  const handleUnselectCurrentAnnotationObject = () => {
    setSelectedObjectId(null)
  }

  React.useEffect(() => {
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
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [instanceId])

  return null
}

export default ReferringExpression