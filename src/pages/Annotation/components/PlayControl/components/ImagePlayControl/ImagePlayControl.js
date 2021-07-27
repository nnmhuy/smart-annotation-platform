import React, { useCallback, useEffect } from 'react'

import { useDatasetStore } from '../../../../stores/index'


const ImagePlayControl = (props) => {
  const imageId = useDatasetStore(state => state.instanceId)

  const playingState = useDatasetStore(state => state.playingState)
  const setPlayingState = useDatasetStore(state => state.setPlayingState)
  const setCurrentAnnotationImageId = useDatasetStore(state => state.setCurrentAnnotationImageId)

  useEffect(() => {
    setPlayingState({})
  }, [imageId])

  useEffect(() => {
    setCurrentAnnotationImageId(imageId)
  }, [imageId, playingState])

  return null
}

export default ImagePlayControl