import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { Slide } from 'pure-react-carousel';


const useStyles = makeStyles(theme => ({
  frameItem: {
    height: 50,
    paddingLeft: 5,
    paddingRight: 5,
  },
  activeFrameItem: {

  },
  frameIndex: {
    fontSize: 12,
    marginBottom: 5,
  },
  activeFrameIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.primary.main
  },
  annotationIndicator: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    borderRadius: 5,
    width: '100%',
    height: 25,
    '&:hover': {
      background: theme.palette.primary.main,
    }
  },
  activeAnnotationIndicator: {
    border: '3px solid',
    borderColor: theme.palette.primary.main,
  },
  existAnnotationIndicator: {
    background: `repeating-linear-gradient(
        45deg,
        ${theme.palette.primary.light},
        ${theme.palette.primary.light} 10px,
        ${theme.palette.primary.dark} 10px,
        ${theme.palette.primary.dark} 20px
      )`,
    '&:hover': {
      background: `repeating-linear-gradient(
        45deg,
        ${theme.palette.primary.light},
        ${theme.palette.primary.light} 10px,
        ${theme.palette.primary.darker} 10px,
        ${theme.palette.primary.darker} 20px
      )`,
    }
  },
  keyFrameAnnotationIndicator: {
    background: theme.palette.primary.dark,
    '&:hover': {
      background: theme.palette.primary.main,
    }
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
        <Grid item className={clsx(classes.frameIndex, isActive && classes.activeFrameIndex)}>
          {index + 1}
        </Grid>
        <Grid item 
          className={clsx(
            classes.annotationIndicator, 
            isActive && classes.activeAnnotationIndicator,
            hasAnnotation && classes.existAnnotationIndicator,
            isKeyFrame && classes.keyFrameAnnotationIndicator,
          )}
        >

        </Grid>
      </Grid>
    </Slide>
  )
}

export default FrameItem