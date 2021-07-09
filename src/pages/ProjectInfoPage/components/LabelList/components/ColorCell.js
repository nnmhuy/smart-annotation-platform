import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
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

}))

export const ColorEditInputCell = (props) => {
  const classes = useInputCellStyles()
  const { id, api, field, value } = props;

  const handleChange = (color) => {
    debugger
    api.commitCellChange({ id, field, props: {color: color.hex }});
    api.setCellMode(id, field, 'view');
  };

  const handleClose = () => {
    api.setCellMode(id, field, 'view');
  }
  
  return (
    <div className={classes.root}>
      <Dialog
        open
        onClose={handleClose}
      >
        <div>
          <SwatchesPicker
            color={value}
            onChangeComplete={handleChange}
            height='auto'
          />
        </div>
      </Dialog>
    </div>
  );
}

