import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { useParams } from 'react-router'
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    textAlign: 'left',
    color: theme.palette.primary.dark
  }
}))

const Info = (props) => {
  const classes = useStyles()
  const { datasetId } = useParams()

  return (
    <Grid container className={classes.root}>
      <Grid container item xs={10} justifyContent="flex-start">
        <div className={classes.title}>
          Append to dataset
        </div>
      </Grid>
      <Grid container item xs={2} justifyContent="flex-end">
        <IconButton
          href={`/datasets/dataset=${datasetId}`}
        >
          <CloseIcon/>
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default Info