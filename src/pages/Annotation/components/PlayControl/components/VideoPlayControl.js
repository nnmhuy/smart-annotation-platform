import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { find } from 'lodash'

import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';

import { useDatasetStore } from '../../../stores/index'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 10,
  }
}))

const VideoPlayControl = (props) => {
  const classes = useStyles()

  const videoId = useDatasetStore(state => state.instanceId)
  const video = useDatasetStore(useCallback(state => find(state.dataInstances, { id: videoId }), [videoId]))

  return (
    <Grid container>
      <Grid container item>
        <Button size="small">
          <PlayIcon fontSize="small"/>
        </Button>
        <Button size="small">
          <PauseIcon fontSize="small" />
        </Button>
      </Grid>
    </Grid>
  )
}

export default VideoPlayControl