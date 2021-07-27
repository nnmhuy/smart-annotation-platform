import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'
import { useConfirm } from 'material-ui-confirm'

import ArrowRightIcon from '@material-ui/icons/ChevronRightRounded'
import ArrowDownIcon from '@material-ui/icons/ExpandMoreRounded'
import DeleteIcon from '@material-ui/icons/DeleteForeverRounded'

const useStyles = makeStyles((theme) => ({
  container: {
    boxSizing: 'border-box',
    borderRadius: 5,
  },
  selectedContainer: {
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: theme.palette.secondary.main
  },
  header: {
    cursor: 'pointer',
    background: theme.palette.primary.light,
    padding: 10,
  },
  objectId: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 10,
  },
  divider: {
    background: theme.palette.primary.main
  }
}))

const ObjectInfo = (props) => {
  const confirm = useConfirm()
  const classes = useStyles()
  const { isSelected, annotationObject, setSelectedObjectId, deleteAnnotationObject } = props

  const handleDeleteAnnotationObject = (e) => {
    e.stopPropagation()
    confirm({
      title: 'Delete annotation object',
      description: `This action can't be undone and will delete this object and associated annotations.`
    }).then(() => {
      deleteAnnotationObject(annotationObject.id)
    })
  }

  return (
    <Grid container className={clsx(classes.container, isSelected && classes.selectedContainer)}>
      <Grid container item xs={12} direction="row" alignItems="center" className={classes.header}
        onClick={() => {
          if (isSelected) {
            setSelectedObjectId(null)
          } else {
            setSelectedObjectId(annotationObject.id)
            // TODO: switch mode
          }
        }}
      >
        <Grid container item direction="row" alignItems="center" xs={2}>
          {isSelected ?
            <ArrowDownIcon color="primary" fontSize="small"/>
            : <ArrowRightIcon color="primary" fontSize="small"/>
          }
        </Grid>
        <Grid container item direction="row" alignItems="center" justifyContent="flex-start" xs={4}>
          <Grid item className={classes.objectId}>
            Type: {annotationObject.annotationType}
          </Grid>
        </Grid>
        <Grid container item direction="row" alignItems="center" xs={4}>
          <Grid item className={classes.objectId}>
            ID: {annotationObject.id}
          </Grid>
        </Grid>
        <Grid container item xs={2} direction="row" justifyContent="flex-start">
          <Divider orientation="vertical" flexItem className={classes.divider} />
          <IconButton size="small" onClick={handleDeleteAnnotationObject}>
            <DeleteIcon fontSize="small" color="primary"/>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Collapse in={isSelected}>
          Annotation Object info
          {annotationObject.labelId}
          {/* TODO: select label */}
        </Collapse>
      </Grid>
    </Grid>
  )
}

export default ObjectInfo