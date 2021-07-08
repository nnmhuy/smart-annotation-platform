import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import SearchBar from './components/SearchBar/index'
import List from './components/List/index'

import useProjectListStore from './store'

const useStyles = makeStyles(() => ({
  root: {
    padding: 50,
  },
}))

const ProjectList = () => {
  const classes = useStyles()

  const queryProjects = useProjectListStore(state => state.queryProjects)

  React.useEffect(() => {
    queryProjects()
  })

  return (
    <div className={classes.root}>
      <SearchBar useStore={useProjectListStore}/>
      <List useStore={useProjectListStore}/>
    </div>
  )
}

export default ProjectList