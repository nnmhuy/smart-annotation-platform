import React, { useCallback, useEffect } from 'react'
import { find } from 'lodash'

import { useDatasetStore } from '../../../../stores/index'


const ImagePlayControl = (props) => {
  const imageId = useDatasetStore(state => state.instanceId)
  const image_data = useDatasetStore(useCallback(state => find(state.dataInstances, { id: imageId }), [imageId]))

  const playingState = useDatasetStore(state => state.playingState)
  const setPlayingState = useDatasetStore(state => state.setPlayingState)
  const setCurrentAnnotationImageId = useDatasetStore(state => state.setCurrentAnnotationImageId)

  useEffect(() => {
    setPlayingState({})
  }, [imageId])

  useEffect(() => {
    if (image_data) {
      const image = image_data.getCurrentImage(playingState)
      setCurrentAnnotationImageId(image.id)
    }
  }, [imageId, playingState])

  return null
}

export default ImagePlayControl