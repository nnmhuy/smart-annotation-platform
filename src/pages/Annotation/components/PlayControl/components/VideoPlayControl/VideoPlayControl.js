import React, { useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { find } from 'lodash'
import create from 'zustand'

import ButtonControlGroup from './ButtonControlGroup'
import VideoTrack from './VideoTrack'
import TrackInfo from './TrackInfo'

import { useDatasetStore } from '../../../../stores/index'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
}))

const useVideoControlStore = create((set, get) => ({
  isPlaying: false,
  getIsPlaying: () => get().isPlaying,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}))

const VideoPlayControl = (props) => {
  const classes = useStyles()

  const videoId = useDatasetStore(state => state.instanceId)
  const video = useDatasetStore(useCallback(state => find(state.dataInstances, { id: videoId }), [videoId]))
  const playingState = useDatasetStore(state => state.playingState)
  const getPlayingState = useDatasetStore(state => state.getPlayingState)
  const setPlayingState = useDatasetStore(state => state.setPlayingState)

  const isPlaying = useVideoControlStore(state => state.isPlaying)
  const getIsPlaying = useVideoControlStore(state => state.getIsPlaying)
  const setIsPlaying = useVideoControlStore(state => state.setIsPlaying)

  const { fps, numFrames } = video

  useEffect(() => {
    setPlayingState({
      playingFrame: 0,
      bufferingFrame: -1,
      lazyBufferingFrame: -1,
    })
  }, [videoId])

  const handleBufferingVideo = async () => {
    const { fps, numFrames } = video
    const playingState = getPlayingState()

  }

  const handleGoToFrame = async (frame) => {
    await video.frames[frame].original.getBitmap()
    setPlayingState({ playingFrame: frame })
  }

  const handlePlayVideo = async (playingId) => {
    const playingState = getPlayingState()
    const { playingFrame } = playingState

    if (playingFrame + 1 < numFrames) {
      await handleGoToFrame(playingFrame + 1)

      const isPlaying = getIsPlaying()
      if (isPlaying && playingId === videoId) {
        setTimeout(() => {
          handlePlayVideo(playingId)
        }, 1000 / fps);
      }
    } else {
      setIsPlaying(false)
    }
  }

  const handleSkipFrame = (step) => async () => {
    const { playingFrame } = playingState

    const newPlayingFrame = Math.min(Math.max(playingFrame + step, 0), numFrames - 1)
    await handleGoToFrame(newPlayingFrame)
  }


  const handleClickPlay = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      handlePlayVideo(videoId)
    }
  }

  const handleClickPause = () => {
    setIsPlaying(false)
  }

  return (
    <Grid container className={classes.root} direction="row">
      <ButtonControlGroup
        isPlaying={isPlaying}
        handleSkipFrame={handleSkipFrame}
        handleClickPlay={handleClickPlay}
        handleClickPause={handleClickPause}
      />
      <VideoTrack
        numFrames={video.numFrames}
        playingFrame={playingState.playingFrame}
        handleGoToFrame={handleGoToFrame}
      />
      <TrackInfo
        fps={video.fps}
        numFrames={video.numFrames}
        playingFrame={playingState.playingFrame}
        handleGoToFrame={handleGoToFrame}
      />
    </Grid>
  )
}

export default VideoPlayControl