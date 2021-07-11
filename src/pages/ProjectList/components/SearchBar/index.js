import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { throttle } from 'lodash'

import SearchField from './components/SearchField'
import CreateProjectDialog from './components/CreateProjectDialog'

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
  const appendProject = useStore(state => state.appendProject)

  const [openCreateDialog, setOpenCreateDialog] = React.useState(false)

  const handleChangeSearchValue = (e) => {
    // queryProjects(e.target.value)
  }

  const handleCreateProject = (newProject) => {
    appendProject(newProject)
    window.location = `/projects/project=${newProject.id}`
  }
  

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid container item xs={7}>
        <SearchField handleChange={handleChangeSearchValue}/>
      </Grid>
      <Grid container item xs={5} justifyContent="flex-end">
        <Button 
          className={classes.createButton}
          variant="contained" 
          color="primary"
          size="large"
          onClick={() => setOpenCreateDialog(true)}
        >
          New project
        </Button>
        <CreateProjectDialog
          open={openCreateDialog}
          setOpen={setOpenCreateDialog}
          handleCreate={handleCreateProject}
        />
      </Grid>
    </Grid>
  )
}

export default SearchBar