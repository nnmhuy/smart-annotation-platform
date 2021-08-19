import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { cloneDeep } from 'lodash'

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

const PropagationConfig = (props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null);

  const { playingFrame, frames, annotations, selectedObjectId } = props

  const updateAnnotation = useAnnotationStore(state => state.updateAnnotation)
  const appendAnnotation = useAnnotationStore(state => state.appendAnnotation)
  const cleanUpPropagatingAnnotation = useAnnotationStore(state => state.cleanUpPropagatingAnnotation)


  const [isPropagating, setIsPropagating] = useState(false)
  const [propagationConfig, setPropagationConfig] = useState({
    direction: PROPAGATION_DIRECTION.FORWARD,
    frames: 20
  })

  const setPropagatedMasks = async (localAnnotationStore, propagatedFrames, propagatedMasks) => {
    for (let j = 0; j < propagatedFrames.length; ++j) {

      const newAnnotation = localAnnotationStore[propagatedFrames[j]]
      try {
        await newAnnotation.setMask(propagatedMasks[j])
        newAnnotation.isPropagating = false

        updateAnnotation(newAnnotation, { commitAnnotation: true })
      } catch (error) {
        debugger
      }
    }
  }

  const cleanUpCanceledPropagation = async (localAnnotationStore, isTemporaryAnnotation) => {
    Object.keys(localAnnotationStore).forEach(frameIndex => {
      if (isTemporaryAnnotation[frameIndex]) {
        cleanUpPropagatingAnnotation(localAnnotationStore[frameIndex].id)
      } else {
        const newAnnotation = localAnnotationStore[frameIndex]
        newAnnotation.isPropagating = false
        updateAnnotation(newAnnotation, { commitAnnotation: false })
      }
    })
  }

  const handleStartPropagation = async () => {
    setIsPropagating(true)

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

    const BATCH_SIZE = 10
    const totalFrames = frames.length

    let count = 0
    for (count = 1; count <= numFrames; count += BATCH_SIZE) {
      let propagatingFrames = []
      for (let j = 0; j < Math.min(BATCH_SIZE, numFrames - count + 1) && keyFrame + count + j < totalFrames; ++j) {
        const frameIndex = keyFrame + (direction === PROPAGATION_DIRECTION.FORWARD ? 1 : -1) * (count + j)
        if (annotations[frameIndex]?.keyFrame) {
          continue;
        }
        propagatingFrames.push(frameIndex)
      }
      // TODO: should or should not await?
      // Promise.all?
      await RestConnector.post('/mask_propagation/predict', {
        "annotation_id": annotations[keyFrame].id,
        "key_frame": keyFrame,
        "propagating_frames": propagatingFrames
      })
        .then(response => response.data)
        .then((propagatedMasks) => {
          // Assign urls to annotations and commit
          setPropagatedMasks(localAnnotationStore, propagatingFrames, propagatedMasks)
        })
    }

    await cleanUpCanceledPropagation(localAnnotationStore, isTemporaryAnnotation)
    setIsPropagating(false)
  }

  const handleCancelPropagation = () => {
    // TODO: handle cancel
    setIsPropagating(false)
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
                disabled={!!!annotations[playingFrame]}
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
            onClick={(e) => { !isPropagating && setAnchorEl(e.currentTarget) }}
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
                disabled={!!!annotations[playingFrame]}
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