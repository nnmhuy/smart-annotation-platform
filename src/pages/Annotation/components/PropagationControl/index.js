import React, { useCallback } from 'react'
import { find } from 'lodash'

import { useDatasetStore, useAnnotationStore } from '../../stores/index'

import VideoPropagationControl from './components/VideoPropagationControl/index'

import VideoDataInstanceClass from '../../../../classes/VideoDataInstanceClass'

const PlayControl = () => {
  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(useCallback(state => find(state.dataInstances, { id: instanceId }), [instanceId]))

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)

  if (!selectedObjectId) {
    return null
  }
  
  if (dataInstance instanceof VideoDataInstanceClass) {
    return <VideoPropagationControl/>
  }
  return null
}

export default PlayControl