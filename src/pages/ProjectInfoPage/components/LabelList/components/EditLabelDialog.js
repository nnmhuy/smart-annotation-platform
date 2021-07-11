import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { get, set, cloneDeep } from 'lodash'

import { ColorEditInput } from './ColorCell'

const EditLabelDialog = (props) => {
  const { open, setOpen, handleSave, label } = props

  const [editingLabel, setEditingLabel] = React.useState({})

  React.useEffect(() => {
    setEditingLabel(cloneDeep(label))
  }, [label])

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (name, value) => {
    const newLabel = cloneDeep(editingLabel)
    set(newLabel, name, value)
    setEditingLabel(newLabel)
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {label.id ? "Edit label" : "Create new label"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="label"
          label="Label name"
          variant="outlined"
          fullWidth
          required
          onChange={(e) => handleChange(e.target.id, e.target.value)}
          value={get(editingLabel, 'label', '')}
        />
        <ColorEditInput
          margin="dense"
          id="annotationProperties.fill"
          label="Fill color"
          fullWidth
          onChange={handleChange}
          value={get(editingLabel, 'annotationProperties.fill', '#000000')}
        />
        <ColorEditInput
          margin="dense"
          id="annotationProperties.stroke"
          label="Stroke color"
          fullWidth
          onChange={handleChange}
          value={get(editingLabel, 'annotationProperties.stroke', '#000000')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleSave(editingLabel)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditLabelDialog