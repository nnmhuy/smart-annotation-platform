import React from 'react'

import { useDatasetStore, useAnnotationStore } from '../../../stores/index'

import DrawingHandler from './DrawingHandler'
import EditingHandler from './EditingHandler'

const DrawBBox = (props) => {
  const currentAnnotationImageId = useDatasetStore(state => state.currentAnnotationImageId)
  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const getCurrentAnnotation = useAnnotationStore(state => state.getCurrentAnnotation)

  const currentAnnotation = getCurrentAnnotation(currentAnnotationImageId, selectedObjectId)

  return (currentAnnotation ? 
    <EditingHandler currentAnnotation={currentAnnotation} {...props}/>
    : <DrawingHandler {...props}/>
  )
}

export default DrawBBox