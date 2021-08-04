import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { Slide } from 'pure-react-carousel';


const useStyles = makeStyles(theme => ({
  frameItem: {
    height: 50,
    boxSizing: 'border-box'
  },
  activeFrameItem: {
    fontWeight: 'bold'
  }
}))


const FrameItem = (props) => {
  const classes = useStyles()
  const { index, isActive, isKeyFrame, hasAnnotation, ...others } = props

  return (
    <Slide {...others}>
      <Grid container direction="column" alignItems="center" justifyContent="space-evenly"
        className={clsx(classes.frameItem, isActive && classes.activeFrameItem)}
      >
        <Grid item>
          {index + 1}
        </Grid>
        <Grid item>

        </Grid>
      </Grid>
    </Slide>
  )
}

export default FrameItem