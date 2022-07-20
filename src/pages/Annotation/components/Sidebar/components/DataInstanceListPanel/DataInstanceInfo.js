import React from 'react'
import { makeStyles, SvgIcon } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx'

import ImageDataInstanceClass from '../../../../../../models/ImageDataInstanceClass';
import VideoDataInstanceClass from '../../../../../../models/VideoDataInstanceClass';

import ImageIcon from '@material-ui/icons/Image';
import VideoIcon from '@material-ui/icons/Movie';
import DoneIcon from '@material-ui/icons/Done'
import HelpIcon from '@material-ui/icons/HelpOutline'
import UnfinishedIcon from '@material-ui/icons/NotInterested'
import { ENUM_ANNOTATE_STATUS } from 'constants/index';

const useStyles = makeStyles((theme) => ({
  container: {
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  selectedContainer: {
    background: '#c5defc',
    borderRadius: '5px 5px 0px 0px',
  },
  objectId: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 10,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  divider: {
    background: theme.palette.primary.main
  },
  infoContainerCollapse: {
    width: '100%',
    justifyContent: 'center',
    background: '#c5defc',
    '&.MuiCollapse-entered': {
      borderRadius: '0px 0px 5px 5px',
    }
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  }
}))

const mapDataInstanceClsToIcon = {
  [ImageDataInstanceClass._cls]: ImageIcon,
  [VideoDataInstanceClass._cls]: VideoIcon
}

const mapStatusToIcon = {
  [ENUM_ANNOTATE_STATUS.FINSIHED]: DoneIcon,
  [ENUM_ANNOTATE_STATUS.UNCERTAIN]: HelpIcon,
  [ENUM_ANNOTATE_STATUS.UNFINISHED]: UnfinishedIcon,
}

const DataInstanceInfo = (props) => {
  const classes = useStyles()
  const { 
    isSelected, 
    dataInstance,
    setSelectedInstanceId,
  } = props


  const { id, name, thumbnail } = dataInstance
  const InstanceIcon = mapDataInstanceClsToIcon[dataInstance.__proto__.constructor._cls]
  const AnnotateStatusIcon = mapStatusToIcon[dataInstance.annotateStatus]
  return (
    <>
      <ListItem className={clsx(classes.container, isSelected && classes.selectedContainer)}
        onClick={() => {
          if (!isSelected) {
            setSelectedInstanceId(id)
          }
        }}
      >
        <ListItemIcon style={{ alignItems: 'center', marginRight: 10 }}>
          <Avatar
            variant="rounded"
            src={thumbnail?.URL}
            className={classes.avatar}
          />
        </ListItemIcon>
        <ListItemText 
          primary={name}
          secondary={
            <div className={classes.objectId}>
              ID: {id}
            </div>
          }
          className={classes.objectId}
        />
        <ListItemIcon>
          <InstanceIcon/>
        </ListItemIcon>
        <ListItemSecondaryAction>
          <AnnotateStatusIcon/>
        </ListItemSecondaryAction>
      </ListItem>
      {/* <Collapse in={isSelected} className={classes.infoContainerCollapse}>
        <Divider className={classes.divider} variant="middle" light/>
      </Collapse> */}
    </>
  )
}

export default DataInstanceInfo