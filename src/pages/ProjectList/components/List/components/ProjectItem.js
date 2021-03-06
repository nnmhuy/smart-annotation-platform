import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar';
import Link from '../../../../../components/Link'


import moment from 'moment'


const useStyles = makeStyles((theme) => ({
  projectContainer: {
    paddingBottom: 20,
    '&:hover': {
      background: '#eef2f7'
    }
  },
  divider: {
    marginBottom: 20,
  },
  avatar: {
    margin: 'auto',
    width: theme.spacing(7),
    height: theme.spacing(7),
    [theme.breakpoints.down('md')]: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    }
  },
  projectName: {
    fontWeight: 'bold',
    lineHeight: 1.5,
  },
  projectDescription: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'left',
  },
  date: {
    fontSize: 12,
    color: '#595959'
  }
}))

const ProjectItem = (props) => {
  const classes = useStyles()
  const { useStore, project } = props

  const { id, name, description, date_created, } = project

  return (
    <Grid
      container
      className={classes.projectContainer}
      component={Link}
      to={`/projects/project=${id}`}
    >
        <Grid item xs={12}>
          <Divider className={classes.divider}/>
        </Grid>
        <Grid container item xs={2} md={1}>
          <Avatar className={classes.avatar}>{name[0]}</Avatar>
        </Grid>
        <Grid container item xs={7} md={8} direction="column" justifyContent="center" alignItems="flex-start">
          <div className={classes.projectName}>{name}</div>
          <div className={classes.projectDescription}>{description}</div>
        </Grid>
        <Grid container item xs={3} alignItems="center">
          <div className={classes.date}>
            {moment(date_created).format('MMMM Do YYYY, h:mm')}
          </div>
        </Grid>
    </Grid>
  )
}

export default ProjectItem