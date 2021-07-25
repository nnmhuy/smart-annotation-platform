import React, { useCallback } from 'react'
import { find } from 'lodash'

import { useDatasetStore } from '../../stores/index'

import VideoPlayControl from './components/VideoPlayControl'

import VideoDataInstanceClass from '../../../../classes/VideoDataInstanceClass'

const PlayControl = (props) => {
  const { renderingSize } = props

  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(useCallback(state => find(state.dataInstances, { id: instanceId }), [instanceId]))

  if (dataInstance instanceof VideoDataInstanceClass) {
    return <VideoPlayControl renderingSize={renderingSize} />
  }
  return null
}

export default PlayControl