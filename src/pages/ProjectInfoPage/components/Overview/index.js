import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  overviewContainer: {
    background: theme.palette.primary.light,
    textAlign: 'left',
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
    <div className={classes.overviewContainer}>
      <div className={classes.projectName}>{name}</div>     
      <div className={classes.projectDescription}>{description}</div>
      <div className={classes.date}>
        {moment(date_created).format('MMMM Do YYYY, HH:mm')}
      </div>
    </div>
  )
}

export default Overview