import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { cloneDeep } from 'lodash'
import create from 'zustand'
import { CancelToken } from 'axios'

import { useAnnotationStore } from '../../../../../stores'

import PropagateIcon from '@material-ui/icons/DoubleArrowRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import CancelIcon from '@material-ui/icons/CancelRounded';

import PopoverConfig from './PopoverConfig'
import RestConnector from '../../../../../../../connectors/RestConnector'

import MaskAnnotationClass from '../../../../../../../classes/MaskAnnotationClass'

import { PROPAGATION_DIRECTION } from '../../../../../constants'


const useStyles = makeStyles(theme => ({
  root: {

  },
  pointerUp: {
    width: 0,
    height: 0,
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: `10px solid ${theme.palette.primary.dark}`
  },
  configContainer: {
    padding: 5,
    borderRadius: 5,
    background: theme.palette.primary.dark,
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    color: theme.palette.primary.contrastText,
    fontSize: 10,
  },
  configInfo: {
    marginRight: 10,
    background: theme.palette.primary.darker,
    color: theme.palette.primary.contrastText,
    fontSize: 10,
    '&:hover': {
      background: theme.palette.primary.darker,
    }
  }
}))

const usePropagationStore = create((set, get) => ({
  isPropagating: false,
  blockPropagation: false,
  
  setBlockPropagation: (value) => set({ blockPropagation: value }),
  setIsPropagating: (value) => set({ isPropagating: value }),
  getIsPropagating: () => get().isPropagating,
  
  cancelToken: null,
  setCancelToken: (token) => set({ cancelToken: token }),
  getCancelToken: () => get().cancelToken,
  
  localAnnotationStore: {},
  setLocalAnnotationStore: (newValue) => set({ localAnnotationStore: newValue }),
  getLocalAnnotationStore: () => get().localAnnotationStore,
  updateLocalAnnotationStore: (key, value) => set(state => ({
    localAnnotationStore: {
      ...state.localAnnotationStore,
      [key]: value
    }
  })),

  isTemporaryAnnotation: {},
  setIsTemporaryAnnotation: (newValue) => set({ isTemporaryAnnotation: newValue }),
  getIsTemporaryAnnotation: () => get().isTemporaryAnnotation,
}))

const PropagationConfig = (props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null);

  const { playingFrame, frames, annotations, selectedObjectId } = props

  const updateAnnotation = useAnnotationStore(state => state.updateAnnotation)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const cleanUpPropagatingAnnotation = useAnnotationStore(state => state.cleanUpPropagatingAnnotation)


  const isPropagating = usePropagationStore(state => state.isPropagating)
  const getIsPropagating = usePropagationStore(state => state.getIsPropagating)
  const setIsPropagating = usePropagationStore(state => state.setIsPropagating)
  const blockPropagation = usePropagationStore(state => state.blockPropagation)
  const setBlockPropagation = usePropagationStore(state => state.setBlockPropagation)
  const getLocalAnnotationStore = usePropagationStore(state => state.getLocalAnnotationStore)
  const setLocalAnnotationStore = usePropagationStore(state => state.setLocalAnnotationStore)
  const updateLocalAnnotationStore = usePropagationStore(state => state.updateLocalAnnotationStore)
  const getIsTemporaryAnnotation = usePropagationStore(state => state.getIsTemporaryAnnotation)
  const setIsTemporaryAnnotation = usePropagationStore(state => state.setIsTemporaryAnnotation)
  const setCancelToken = usePropagationStore(state => state.setCancelToken)
  const getCancelToken = usePropagationStore(state => state.getCancelToken)


  const [propagationConfig, setPropagationConfig] = useState({
    direction: PROPAGATION_DIRECTION.FORWARD,
    frames: 20
  })


  const runPropagation = async (keyFrame, numFrames, direction) => {
    const BATCH_SIZE = 10
    const totalFrames = frames.length

    let count = 0
    for (count = 1; count <= numFrames; count += BATCH_SIZE) {
      let isPropagating = getIsPropagating()
      if (!isPropagating) return
      let propagatingFrames = []
      for (let j = 0; j < Math.min(BATCH_SIZE, numFrames - count + 1) && keyFrame + count + j < totalFrames; ++j) {
        const frameIndex = keyFrame + (direction === PROPAGATION_DIRECTION.FORWARD ? 1 : -1) * (count + j)
        if (annotations[frameIndex]?.keyFrame) {
          continue;
        }
        propagatingFrames.push(frameIndex)
      }
      // TODO: should or should not await?
      // await => cannot cancel immediately
      // not await => wait performance of models
      // Promise.all?
      await RestConnector.post('/mask_propagation/predict', {
        "annotation_id": annotations[keyFrame].id,
        "key_frame": keyFrame,
        "propagating_frames": propagatingFrames
      }, {
        cancelToken: getCancelToken().token
      })
        .then(response => response.data)
        .then((propagatedMasks) => {
          // Assign urls to annotations and commit
          return setPropagatedMasks(propagatingFrames, propagatedMasks)
        })
        .catch(() => {
          console.log("Canceled propagation")
          return cleanUpCanceledPropagation()
        })
    }
  }

  const setPropagatedMasks = async (propagatedFrames, propagatedMasks) => {
    const localAnnotationStore = getLocalAnnotationStore()

    const newAnnotations = await Promise.all(propagatedFrames.map(async (frameIndex, index) => {
      const newAnnotation = localAnnotationStore[frameIndex]
      await newAnnotation.setMask(propagatedMasks[index])
      newAnnotation.isPropagating = false
      return newAnnotation
    }))
    newAnnotations.forEach((annotation, index) => {
      const frameIndex = propagatedFrames[index]
      updateAnnotation(annotation, { commitAnnotation: true })
      updateLocalAnnotationStore(frameIndex, annotation)
    })
  }

  const cleanUpCanceledPropagation = async () => {
    console.log("clean up")
    // TODO: this function run too slow (15s)
    const start_time = performance.now()
    const localAnnotationStore = getLocalAnnotationStore()
    const isTemporaryAnnotation = getIsTemporaryAnnotation()
    Object.keys(localAnnotationStore).forEach(frameIndex => {
      if (!localAnnotationStore[frameIndex].isPropagating) return;

      if (isTemporaryAnnotation[frameIndex]) {
        cleanUpPropagatingAnnotation(localAnnotationStore[frameIndex].id)
      } else {
        const newAnnotation = localAnnotationStore[frameIndex]
        newAnnotation.isPropagating = false
        updateAnnotation(newAnnotation, { commitAnnotation: false })
      }
    })
    console.log("clean up done")
    console.log(performance.now() - start_time)
  }

  const handleStartPropagation = async () => {
    setIsPropagating(true)
    setBlockPropagation(true)
    setCancelToken(CancelToken.source())

    const keyFrame = cloneDeep(playingFrame)
    const numFrames = cloneDeep(propagationConfig.frames)
    const direction = cloneDeep(propagationConfig.direction)

    const keyAnnotation = cloneDeep(annotations[keyFrame])
    keyAnnotation.keyFrame = true
    updateAnnotation(keyAnnotation, { commitAnnotation: true })

    const localAnnotationStore = {}
    const isTemporaryAnnotation = {}
    // Create local annotations
    for (let i = 1; i <= numFrames; ++i) {
      const frameIndex = keyFrame + (direction === PROPAGATION_DIRECTION.FORWARD ? 1 : -1) * i
      if (annotations[frameIndex]) {
        if (annotations[frameIndex].keyFrame) {
          continue;
        } else {
          const newAnnotation = cloneDeep(annotations[frameIndex])
          newAnnotation.isPropagating = true
          updateAnnotation(newAnnotation, { commitAnnotation: false })
          localAnnotationStore[frameIndex] = newAnnotation
          isTemporaryAnnotation[frameIndex] = false
        }
      } else {
        const newAnnotation = new MaskAnnotationClass('', selectedObjectId, frames[frameIndex].id, {}, false)
        newAnnotation.isPropagating = true
        appendAnnotation(newAnnotation, { commitAnnotation: false })
        localAnnotationStore[frameIndex] = newAnnotation
        isTemporaryAnnotation[frameIndex] = true
      }
    }
    setLocalAnnotationStore(localAnnotationStore)
    setIsTemporaryAnnotation(isTemporaryAnnotation)
    await runPropagation(keyFrame, numFrames, direction)

    setIsPropagating(false)
    setBlockPropagation(false)
    setLocalAnnotationStore({})
    setIsTemporaryAnnotation({})
  }

  const handleCancelPropagation = () => {
    setIsPropagating(false)
    const source = getCancelToken()
    source.cancel("Cancel propagating request")
  }

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid container item xs={12} justifyContent="center">
        <Grid container item xs={12} justifyContent="center">
          <div className={classes.pointerUp}></div>
        </Grid>
        <div className={classes.configContainer}>
          {(propagationConfig.direction === PROPAGATION_DIRECTION.BACKWARD) &&
            (!isPropagating ?
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<PropagateIcon fontSize="small" style={{ transform: `rotate(180deg)` }} />}
                disabled={!!!annotations[playingFrame] || blockPropagation}
                onClick={handleStartPropagation}
              >
                Backward
              </Button>
              :
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<CancelIcon fontSize="small" />}
                onClick={handleCancelPropagation}
              >
                Cancel
              </Button>
            )}
          <PopoverConfig
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            propagationConfig={propagationConfig}
            setPropagationConfig={setPropagationConfig}
          />
          <Button
            color="secondary"
            size="small"
            className={classes.configInfo}
            startIcon={<SettingsIcon fontSize="small" />}
            onClick={(e) => { !blockPropagation && setAnchorEl(e.currentTarget) }}
          >
            {propagationConfig.frames} frames
          </Button>
          {(propagationConfig.direction === PROPAGATION_DIRECTION.FORWARD) &&
            (!isPropagating ?
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                endIcon={<PropagateIcon fontSize="small" />}
                disabled={!!!annotations[playingFrame] || blockPropagation}
                onClick={handleStartPropagation}
              >
                Forward
              </Button>
              :
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<CancelIcon fontSize="small" />}
                onClick={handleCancelPropagation}
              >
                Cancel
              </Button>
            )}
        </div>
      </Grid>
    </Grid>
  )
}

export default PropagationConfig