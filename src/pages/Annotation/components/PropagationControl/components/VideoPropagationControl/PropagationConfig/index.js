import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import PropagateIcon from '@material-ui/icons/DoubleArrowRounded';
import SettingsIcon from '@material-ui/icons/SettingsRounded';

import PopoverConfig from './PopoverConfig'

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
            onClick={(e) => { setAnchorEl(e.currentTarget) }}
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