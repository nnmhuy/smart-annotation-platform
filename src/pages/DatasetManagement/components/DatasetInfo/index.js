import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { useParams } from 'react-router'

import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.light,
    padding: 20,
  },
  name: {
    fontSize: 30,
  },
  description: {
    marginTop: 20,
    lineHeight: 1.5,
    color: theme.palette.primary.dark,
  },
  instances: {
    marginTop: 10,
    fontSize: 12,
    color: theme.palette.primary.dark,
  },
  button: {
    height: 'fit-content'
  }
}))

const DatasetInfo = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const { datasetId } = useParams()

  const dataset = useStore(state => state.dataset)
  const { name, description, instances } = dataset

  return (
    <Grid container className={classes.root}>
      <Grid container item xs={8} direction="column" alignItems="flex-start">
        <div className={classes.name}>{name}</div>
        <div className={classes.description}>{description}</div>
        <div className={classes.instances}>{instances} instances</div>
      </Grid>
      <Grid container item xs={4} alignItems="center" justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Button 
            variant="outlined" className={classes.button}
            color="primary"
            startIcon={<AddIcon />}
            href={`/datasets/upload/${datasetId}`}
          >
            Append to dataset
          </Button>
        </Grid>
        <Grid item>
          <IconButton>
            <SettingsIcon/>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DatasetInfo