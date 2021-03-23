import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'

const useStyles = makeStyles(() => ({
}))

const ClassSelectionPopover = (props) => {
  const classes = useStyles()
  const { contextMenuPosition, setContextMenuPosition } = props
  const open = Boolean(contextMenuPosition)
  
  const handleClose = () => {
    setContextMenuPosition(null)
  }

  if (!open) {
    return null
  }

  return (
    <Popover
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={{ top: contextMenuPosition.y , left: contextMenuPosition.x}}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      Select class of annotation
    </Popover>
  )
}

export default ClassSelectionPopover
