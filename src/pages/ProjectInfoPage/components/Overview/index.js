import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
  overviewContainer: {
    background: theme.palette.primary.light,
    padding: 20,
  },
  projectName: {
    fontSize: 30,
  },
  projectDescription: {
    marginTop: 20,
    lineHeight: 1.5,
    color: theme.palette.primary.dark,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: theme.palette.primary.dark,
  }
}))

const Overview = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const project = useStore(state => state.project)
  const { name, description, date_created } = project
  return (
    <Grid container className={classes.overviewContainer}>
      <Grid container item xs={10} direction="column" alignItems="flex-start">
        <div className={classes.projectName}>{name}</div>     
        <div className={classes.projectDescription}>{description}</div>
        <div className={classes.date}>
          {moment(date_created).format('MMMM Do YYYY, HH:mm')}
        </div>
      </Grid>
      <Grid container item xs={2} justifyContent="flex-end" alignItems="flex-start">
        <IconButton
          href={`/projects`}
        >
          <CloseIcon />
        </IconButton>
      </Grid>
    </Grid>

  )
}

export default Overview