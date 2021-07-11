import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import { filter } from 'lodash'
import { useConfirm }from 'material-ui-confirm'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    margin: 'auto',
    width: 'calc(100% - 40px)',
    background: theme.palette.secondary.light,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 18,
  },
}))


const BulkSelection = (props) => {
  const classes = useStyles()
  const confirm = useConfirm()
  const { useStore } = props

  const selected = useStore(state => state.selected)
  const deselectAll = useStore(state => state.deselectAll)
  const deleteSelectedImages = useStore(state => state.deleteSelectedImages)

  const selectedIds = filter(Object.keys(selected), key => selected[key])

  const handleDeleteSelected = () => {
    confirm({
      title: 'Delete selected images',
      description: `This action can't be undone and will delete ${selectedIds.length} images and associated annotations.`
    }).then(() => {
      deleteSelectedImages()
    })
  }

  return (
    <Collapse in={Boolean(selectedIds.length)} timeout={500}>
      <Grid container className={classes.root}>
        <Grid container item xs={8} alignItems="center">
          <div className={classes.infoText}>
            Selected <b>{selectedIds.length}</b> instances
          </div>
        </Grid>
        <Grid container item xs={4} justifyContent="flex-end" spacing={1}>
          <Grid item>
            <Button
              color="primary"
              variant="outlined"
              onClick={deselectAll}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Collapse>
  )

}

export default BulkSelection