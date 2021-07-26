import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import ClockIcon from '@material-ui/icons/Schedule';
import moment from 'moment'

import NakedField from '../../../../../../components/NakedField'


const useStyles = makeStyles((theme) => ({
  root: {

  },
  group: {
  },
  time: {
    marginLeft: 5,
    marginRight: 5,
  },
  frameInputContainer: {
    width: 60,
  },
  frameNumberInput: {
    textAlign: 'center',
    padding: 5,
    marginRight: 5,
    background: theme.palette.primary.light
  }
}))

const FrameInput = (props) => {
  const classes = useStyles()
  const { playingFrame, fps, numFrames, handleGoToFrame } = props

  const [frameValue, setFrameValue] = useState(playingFrame || 0)

  useEffect(() => {
    setFrameValue(playingFrame || 0)
  }, [playingFrame])

  const handleChange = (e) => {
    let frame = e.target.value
    frame = Math.min(Math.max(frame, 0), numFrames - 1)

    setFrameValue(frame)
  }

  const handleBlur = () => {
    handleGoToFrame(frameValue, true)
  }

  return (
    <Grid container item xs={4} className={classes.root} alignItems="center" justifyContent="space-between" direction="row">
      <Grid container item xs={6} className={classes.group} alignItems="center" justifyContent="flex-end">
        <ClockIcon fontSize="small"/>
        <span className={classes.time}>
          {moment().minute(0).second(playingFrame / fps).format("m:ss")}
        </span>
        /
        <span className={classes.time}>
          {moment().minute(0).second(numFrames / fps).format("m:ss")}
        </span>
      </Grid>
      <Grid container item xs={6} className={classes.group} alignItems="center" justifyContent="flex-end">
        <div className={classes.frameInputContainer}>
          <NakedField
            value={frameValue + 1}
            size="small"
            type="number"
            onChange={handleChange}
            onBlur={handleBlur}
            inputProps={{
              className: classes.frameNumberInput
            }}
          />
        </div>
        <span>
          / {numFrames}
        </span>
      </Grid>
    </Grid>
  )
}

export default FrameInput