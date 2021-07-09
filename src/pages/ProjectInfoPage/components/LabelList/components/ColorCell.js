import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Popover from '@material-ui/core/Popover'
import { SwatchesPicker } from 'react-color'
import { get } from 'lodash'

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
  const { id, label, value, onChange, ...others } = props

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePicker = () => {
    setAnchorEl(null);
  };

  const handleChange = (color) => {
    onChange(id, color.hex.toUpperCase())
    handleClosePicker()
  }

  const openPicker = Boolean(anchorEl);

  return (
    <>
      <TextField
        label={label}
        value={value}
        id={id}
        onClick={handleFocus}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <span className={classes.colorDot} style={{ backgroundColor: value }}></span>
          </InputAdornment>,
        }}
        variant="outlined"
        {...others}
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

