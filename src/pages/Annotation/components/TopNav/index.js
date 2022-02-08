import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import { useParams } from 'react-router'

import DataInfo from './components/DataInfo/index'
import ToolConfig from './components/ToolConfig/index'
import useQuery from '../../../../utils/useQuery'
import { Modal, Paper, TextField } from '@material-ui/core';

import {MODEL_SERVER_URL_KEY} from '../../constants'
import ToolURLConfig from './components/ToolURLConfig';

const useStyles = makeStyles(theme => ({
  topNavWrapper: {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 55,
    paddingLeft: 20,
    paddingRight: 20,
    background: theme.palette.primary.darker
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  centerSection: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  modal: {
    width: 500,
    padding: 20,
    marginTop: 100,
    margin: 'auto',
  }
}))

// TODO: keyboard instruction
const TopNav = (props) => {
  const classes = useStyles()
  const { datasetId } = useParams()
  const query = useQuery()
  const page = JSON.parse(query.get("page") || 1)
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={classes.topNavWrapper}>
      <div className={classes.leftSection}>
        <DataInfo />
      </div>
      <div className={classes.centerSection}>
        <ToolConfig />
      </div>
      <div className={classes.rightSection}>
        <IconButton onClick={handleOpen}>
          <SettingsIcon color="secondary"/>
        </IconButton>
        <IconButton
          href={`/datasets/dataset=${datasetId}?page=${1}`}
        >
          <CloseIcon color="secondary"/>
        </IconButton>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Paper className={classes.modal}>
          <ToolURLConfig/>
        </Paper>
      </Modal>
    </div>
  )
}

export default TopNav