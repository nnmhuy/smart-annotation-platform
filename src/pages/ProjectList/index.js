import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import SearchBar from './components/SearchBar/index'

import useProjectListStore from './store'

const useStyles = makeStyles(() => ({
  root: {
    padding: 50,
  },
  divider: {
    marginTop: 20,
  }
}))

const ProjectList = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <SearchBar useStore={useProjectListStore}/>
      <Divider className={classes.divider}/>
    </div>
  )
}

export default ProjectList