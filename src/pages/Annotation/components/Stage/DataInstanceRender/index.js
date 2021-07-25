import React, { useCallback } from 'react'
import { find } from 'lodash'

import { useDatasetStore } from '../../../stores/index'

import ImageRender from './components/ImageRender'
import VideoRender from './components/VideoRender'

import ImageDataInstanceClass from '../../../../../classes/ImageDataInstanceClass'
import VideoDataInstanceClass from '../../../../../classes/VideoDataInstanceClass'

const DataInstanceRender = (props) => {
  const { renderingSize } = props

  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(useCallback(state => find(state.dataInstances, { id: instanceId }), [instanceId]))

  if (dataInstance instanceof ImageDataInstanceClass) {
    return <ImageRender image={dataInstance} renderingSize={renderingSize}/>
  }
  if (dataInstance instanceof VideoDataInstanceClass) {
    return <VideoRender video={dataInstance} renderingSize={renderingSize}/>
  }
  return null
}

export default DataInstanceRender