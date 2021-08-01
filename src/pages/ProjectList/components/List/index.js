import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Loading from '../../../../components/Loading'
import ProjectItem from './components/ProjectItem'

const useStyles = makeStyles(() => ({
  listContainer: {
    marginTop: 20
  }
}))

const List = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const isLoading = useStore(state => state.isLoading)
  const projects = useStore(state => state.projects)

  return (
    <Grid container spacing={1} className={classes.listContainer}>
      <Loading isLoading={isLoading}/>
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