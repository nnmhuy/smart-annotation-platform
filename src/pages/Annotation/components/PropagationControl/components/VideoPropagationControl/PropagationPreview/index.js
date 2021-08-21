import React, { useEffect } from 'react'


import { useAnnotationStore, usePropagationStore } from '../../../../../stores'

import RestConnector from '../../../../../../../connectors/RestConnector'


const PropagationPreview = (props) => {
  const { playingFrame, annotations } = props

  const updateAnnotation = useAnnotationStore(state => state.updateAnnotation)

  const getPropagationTask = usePropagationStore(state => state.getPropagationTask)
  const getIsPropagating = usePropagationStore(state => state.getIsPropagating)

  useEffect(() => {
    const currentAnnotation = annotations[playingFrame]
    if (!!currentAnnotation && currentAnnotation.isPropagating) {
      const propagationTask = getPropagationTask()
      const { keyFrame } = propagationTask
      RestConnector.post('/mask_propagation/predict', {
        "annotation_id": annotations[keyFrame].id,
        "key_frame": keyFrame,
        "propagating_frames": [playingFrame]
      })
      .then(response => response.data)
      .then(async maskURLs => {
        const maskURL = maskURLs[0]
        await currentAnnotation.setMask(maskURL)
        const isPropagating = getIsPropagating()
        if (isPropagating) {
          updateAnnotation(currentAnnotation, { commitAnnotation: false })
        }
      })
      .catch(err => console.log(err))
    }
  }, [playingFrame, annotations])

  // TODO: button to get preview or when playing it will load all previews (waste)

  return null
}

export default PropagationPreview