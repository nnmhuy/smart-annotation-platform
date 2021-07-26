import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  root: {

  },
}))

const FrameThumbnail = (props) => {
  console.log(props)
  return (
    <div>
    </div>
  )
}

const VideoTrack = (props) => {
  const classes = useStyles()
  const { playingFrame, numFrames, handleGoToFrame } = props


  const handleChange = (_, frame) => {
    handleGoToFrame(frame)
  }

  return (
    <Grid container item xs={5} className={classes.root} alignItems="center">
      <Slider
        value={playingFrame}
        max={numFrames - 1}
        onChangeCommitted={handleChange}
        onHover={(e) => console.log(e)}
      />
    </Grid>
  )
}

export default VideoTrack