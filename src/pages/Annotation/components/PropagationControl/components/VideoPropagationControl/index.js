import React, { useCallback, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { find } from 'lodash'

import { useDatasetStore, useAnnotationStore } from '../../../../stores/index'
import EventCenter from '../../../../EventCenter'

import FrameCarousel from './FrameCarousel/index'

import { EVENT_TYPES } from '../../../../constants'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5px 10px',
    width: '100%',
  },
}))

const VideoPropagationControl = (props) => {
  const classes = useStyles()

  const videoId = useDatasetStore(state => state.instanceId)
  const video = useDatasetStore(useCallback(state => find(state.dataInstances, { id: videoId }), [videoId]))
  const getVideoId = useDatasetStore(state => state.getInstanceId)
  const playingState = useDatasetStore(state => state.playingState)
  const getPlayingState = useDatasetStore(state => state.getPlayingState)
  const setPlayingState = useDatasetStore(state => state.setPlayingState)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const annotations = useAnnotationStore(state => state.annotations)

  const { fps, numFrames, frames } = video
  const { playingFrame } = playingState

  const currentAnnotations = useMemo(() =>
    frames.map((frame) => {
      const frameAnnotations = annotations[frame.id]
      return find(frameAnnotations, { annotationObjectId: selectedObjectId })
    }
  ), [selectedObjectId, annotations, frames])

  useEffect(() => {
    EventCenter.emitEvent(EVENT_TYPES.RESIZE_STAGE)()

    return EventCenter.emitEvent(EVENT_TYPES.RESIZE_STAGE)
  }, [])


  return (
    <Grid container className={classes.root} direction="row">
      <FrameCarousel playingFrame={playingFrame} annotations={currentAnnotations}/>
    </Grid>
  )
}

export default VideoPropagationControl