import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import Popover from '@material-ui/core/Popover'
import { SwatchesPicker } from 'react-color'

import TextField from '../../../../../components/TextField'

const useCellStyles = makeStyles((theme) => ({
  colorCell: {
    display: 'flex',
    alignItems: 'center',
  },
  colorDot: {
    display: 'inline-block',
    marginLeft: 10,
    width: 20,
    height: 20,
  }
}))

export const ColorCell = (props) => {
  const classes = useCellStyles()
  const { value } = props
  const displayValue = value || '#000000'

  return (
    <div className={classes.colorCell}>
      <span>{displayValue}</span>
      <span className={classes.colorDot} style={{ backgroundColor: displayValue }}></span>
    </div>
  )
}

const useInputCellStyles = makeStyles((theme) => ({
  colorDot: {
    display: 'inline-block',
    width: 20,
    height: 20,
  }
}))

export const ColorEditInput = (props) => {
  const classes = useInputCellStyles()
  const { label, field = {}, form = {}, ...others } = props

  const { setFieldValue } = form
  const { name, value } = field

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePicker = () => {
    setAnchorEl(null);
  };

  const handleChange = (color) => {
    setFieldValue(name, color.hex.toUpperCase())
    handleClosePicker()
  }

  const openPicker = Boolean(anchorEl);

  return (
    <>
      <TextField
        {...props}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <span className={classes.colorDot} style={{ backgroundColor: value }}></span>
          </InputAdornment>,
        }}
        onClick={handleFocus}
        onChange={handleChange}
      />
      <Popover
        open={openPicker}
        anchorEl={anchorEl}
        onClose={handleClosePicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <SwatchesPicker color={value} onChangeComplete={handleChange}/>
      </Popover>
    </>
  )
}

