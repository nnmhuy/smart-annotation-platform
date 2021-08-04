import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputBase from '@material-ui/core/InputBase'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import PropagateIcon from '@material-ui/icons/DoubleArrowRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';

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
  directionSelect: {
    marginRight: 10,
    color: theme.palette.primary.contrastText,
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

const PROPAGATION_DIRECTION = {
  FORWARD: 'Forward',
  BACKWARD: 'Backward',
}

const PropagationConfig = (props) => {
  const classes = useStyles()

  const [propagationConfig, setPropagationConfig] = useState({
    direction: PROPAGATION_DIRECTION.FORWARD,
    frames: 20
  })

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid container item xs={12} justifyContent="center">
        <Grid container item xs={12} justifyContent="center">
          <div className={classes.pointerUp}></div>
        </Grid>
        <div className={classes.configContainer}>
          {(propagationConfig.direction === PROPAGATION_DIRECTION.BACKWARD) &&
            <Button
              color="secondary"
              size="small"
              className={classes.button}
              startIcon={<PropagateIcon fontSize="small" style={{ transform: `rotate(180deg)` }} />}
            >
              Backward
            </Button>
          }
          {/* <FormControl variant="outlined" size="small" color="secondary" className={classes.directionSelect}>
            <InputLabel id="select-direction-label">Direction</InputLabel>
            <Select
              labelId="select-direction-label"
              id="select-direction"
              value={propagationConfig.direction}
              onChange={(value) => {alert(value)}}
              label="Direction"
              size="small"
            >
              <MenuItem value={PROPAGATION_DIRECTION.FORWARD}>Forward</MenuItem>
              <MenuItem value={PROPAGATION_DIRECTION.BACKWARD}>Backward</MenuItem>
            </Select>
          </FormControl>
          <TextField
            className={classes.margin}
            variant="outlined"
            color="secondary"
            label="Frames"
            size="small"
            type={"number"}
            min={1}
            max={20} // TODO: calculate max limit by next keyframe
            value={propagationConfig.frames}
          /> */}
          <Button
            color="secondary"
            size="small"
            className={classes.configInfo}
            startIcon={<SettingsIcon fontSize="small" />}
          >
            {propagationConfig.frames} frames
          </Button>
          {(propagationConfig.direction === PROPAGATION_DIRECTION.FORWARD) &&
            <Button
              color="secondary"
              size="small"
              className={classes.button}
              endIcon={<PropagateIcon fontSize="small" />}
            >
              Forward
            </Button>
          }
        </div>
      </Grid>
    </Grid>
  )
}

export default PropagationConfig