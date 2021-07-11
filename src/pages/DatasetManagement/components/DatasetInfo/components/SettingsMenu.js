import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { makeStyles } from '@material-ui/core/styles';

const SettingsMenu = (props) => {
  const { anchorEl, handleClose, handleClickDelete } = props

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <MenuItem onClick={handleClickDelete} style={{ color: 'red' }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" style={{ color: 'red' }}/>
        </ListItemIcon>
        <Typography variant="inherit">Delete dataset</Typography>
      </MenuItem>
    </Menu>
  )
}

export default SettingsMenu