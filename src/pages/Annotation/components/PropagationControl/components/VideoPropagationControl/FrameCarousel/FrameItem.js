import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  frameItem: {
    height: 50
  }
}))


const FrameItem = (props) => {
  const classes = useStyles()
  const { index, isActive, isKeyFrame, hasAnnotation, ...others } = props

  return (
    <Grid container {...others} className={classes.frameItem} direction="column" alignItems="center" justify="space-evenly">
      <Grid item>
        {index + 1}
      </Grid>
      <Grid item>

      </Grid>
    </Grid>
  )
}

export default FrameItem