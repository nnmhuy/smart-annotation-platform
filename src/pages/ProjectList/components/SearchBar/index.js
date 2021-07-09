import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { throttle } from 'lodash'

import SearchField from './components/SearchField'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  createButton: {
    textTransform: 'none',
    fontWeight: 'bold',
  }
}))

const SearchBar = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const queryProjects = throttle(useStore(state => state.queryProjects), 500)

  const handleChangeSearchValue = (e) => {
    // queryProjects(e.target.value)
  }

  return (
    <div className={classes.root}>
      <SearchField handleChange={handleChangeSearchValue}/>
      <Button 
        className={classes.createButton}
        variant="contained" 
        color="primary"
        size="large"
        href="/projects/create"
      >
        New project
      </Button>
    </div>
  )
}

export default SearchBar