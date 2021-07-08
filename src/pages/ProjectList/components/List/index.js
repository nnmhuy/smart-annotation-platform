import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import ProjectItem from './components/ProjectItem'

const useStyles = makeStyles(() => ({
  listContainer: {
    marginTop: 20
  }
}))

const List = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const projects = useStore(state => state.projects)

  return (
    <Grid container spacing={1} className={classes.listContainer}>
      {
        projects.map(project => (
          <ProjectItem
            key={`project-${project.id}`}
            project={project}
          />
        ))
      }
    </Grid>
  )
}

export default List