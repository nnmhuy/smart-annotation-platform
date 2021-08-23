import React from 'react'
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { useConfirm } from 'material-ui-confirm';
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.palette.error.main
  },
  deleteButton: {
    fontWeight: 'bold',
    color: 'white',
    background: theme.palette.error.main,
    marginTop: 20,
  }
}))

const Settings = (props) => {
  const classes = useStyles()
  const confirm = useConfirm()
  const history = useHistory()
  const { useStore } = props

  const project = useStore(state => state.project)
  const deleteProject = useStore(state => state.deleteProject)

  const handleDeleteProject = () => {
    confirm({ 
      title: `Delete project "${project.name}"`,
      description: `This action is permanent! You'll lost all dataset and annotations in this project.`
    })
    .then(async () => { 
      await deleteProject()
      history.replace(`/projects`)
    })
  }

  return (
    <div className={classes.root}>
      <div className={classes.warningText}>
        You'll lost all dataset and annotations in this project.
      </div>
      <Button 
        className={classes.deleteButton}
        onClick={handleDeleteProject}
      >
        Delete project
      </Button>
    </div>
  )
}

export default Settings