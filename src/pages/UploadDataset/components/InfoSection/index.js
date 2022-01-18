import React from 'react'
import { makeStyles } from '@material-ui/core'
import { useParams } from 'react-router'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import BackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'left',
    color: theme.palette.primary.dark
  },
  icon: {
    width: 30,
    height: 30,
  }
}))

const Info = (props) => {
  const classes = useStyles()
  const { datasetId } = useParams()

  return (
    <Grid container className={classes.root}>
      <Grid container item xs={1}>
        <IconButton
          href={`/datasets/dataset=${datasetId}`}
          className={classes.icon}
        >
          <BackIcon />
        </IconButton>
      </Grid>
      <Grid container item xs={10} justifyContent="center">
        <div className={classes.title}>
          Append to dataset
        </div>
      </Grid>
    </Grid>
  )
}

export default Info