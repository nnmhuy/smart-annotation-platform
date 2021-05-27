import React from 'react'
import Popover from '@material-ui/core/Popover'


import {TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab'

const ClassSelectionPopover = (props) => {
  const { contextMenuPosition, isOpen, setOpenState, handleSelectClass, selectShape, annotationClasses = [] } = props
  const [selectedValue, setValue] = React.useState('')
  const handleClose = () => {
    console.log("Close")
    selectShape(null)
    setValue(null)
    setOpenState(false)

  }

  if (!isOpen) {
    return null
  }

  return (
    <Popover
      open={isOpen}
      anchorReference="anchorPosition"
      anchorPosition={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
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
      <Autocomplete
        options={annotationClasses}
        style={{ width: 300 }}
        getOptionLabel={(options) => options.label || ''}
        value={selectedValue}
        onChange={(event, newValue) => {
          if (newValue) {
            setValue(newValue);
            handleSelectClass(newValue.id)
          }
          else {
            setValue(null)
            handleSelectClass(null)
          }
        }}
        autoHighlight
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a class"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />
    </Popover>
  )
}

export default ClassSelectionPopover
