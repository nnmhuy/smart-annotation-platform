import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import SkipNextIcon from '@material-ui/icons/SkipNextRounded';
import SkipPreviousIcon from '@material-ui/icons/SkipPreviousRounded';
import PreviousIcon from '@material-ui/icons/ArrowBackRounded';
import NextIcon from '@material-ui/icons/ArrowForwardRounded';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  button: {
    minWidth: 30,
    minHeight: 30,
    marginRight: 5,
  }
}))

const ButtonControlGroup = (props) => {
  const classes = useStyles()
  const { isPlaying, handleSkipFrame, handleClickPlay, handleClickPause, } = props

  return (
    <Grid container item xs={3} className={classes.root}>
      <Button size="small" color="secondary" onClick={handleSkipFrame(-10)} className={classes.button}>
        <SkipPreviousIcon fontSize="small" />
      </Button>
      <Button size="small" color="secondary" onClick={handleSkipFrame(-1)} className={classes.button}>
        <PreviousIcon fontSize="small" />
      </Button>
      {!isPlaying ?
        <Button size="small" color="secondary" onClick={handleClickPlay} className={classes.button}>
          <PlayIcon fontSize="small" />
        </Button>
        :
        <Button size="small" color="secondary" onClick={handleClickPause} className={classes.button}>
          <PauseIcon fontSize="small" />
        </Button>
      }
      <Button size="small" color="secondary" onClick={handleSkipFrame(1)} className={classes.button}>
        <NextIcon fontSize="small" />
      </Button>
      <Button size="small" color="secondary" onClick={handleSkipFrame(10)} className={classes.button}>
        <SkipNextIcon fontSize="small" />
      </Button>
    </Grid>
  )
}

export default ButtonControlGroup