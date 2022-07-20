import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx'

import useQuery from '../../../../utils/useQuery'
import { NUM_DISP_DATA_PER_PAGE } from 'constants/index';

import CheckIcon from '@material-ui/icons/CheckCircle';
import UncheckIcon from '@material-ui/icons/RadioButtonUnchecked';
import { ENUM_ANNOTATE_STATUS } from '../../../../constants';
import DoneIcon from '@material-ui/icons/CheckCircle'
import HelpIcon from '@material-ui/icons/Help'
import UnfinishedIcon from '@material-ui/icons/NotInterested'


const useStyles = makeStyles((theme) => ({
  dataList: {
    padding: 30,
  },
  icon: {
    color: 'white'
  },
  selectedIcon: {
    opacity: 1,
  },
  dataListItem: {
    cursor: 'pointer'
  },
  selectedItemBar: {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.7,
  },
}))

const mapStatusToIcon = {
  [ENUM_ANNOTATE_STATUS.FINSIHED]: DoneIcon,
  [ENUM_ANNOTATE_STATUS.UNCERTAIN]: HelpIcon,
  [ENUM_ANNOTATE_STATUS.UNFINISHED]: UnfinishedIcon,
}

const DataListSection = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const query = useQuery()
  const isMobileLayout = useMediaQuery('(max-width:800px)');

  const page = JSON.parse(query.get("page") || 1)

  const pageStart = (page - 1) * NUM_DISP_DATA_PER_PAGE 
  const pageEnd = page * NUM_DISP_DATA_PER_PAGE


  const dataList = useStore(state => state.dataList)
  const setSelectedData = useStore(state => state.setSelectedData)
  const selected = useStore(state => state.selected)
  
  return (
    <ImageList className={classes.dataList} cols={isMobileLayout ? 2 : 4}>
      {dataList.map((item) => {
        const isSelected = selected[item.id]
        const AnnotateStatusIcon = mapStatusToIcon[item.annotateStatus]
        return (
          <ImageListItem key={item.id}
            className={classes.dataListItem}
          >
            <img src={item?.thumbnail?.URL} alt={item.name} onClick={() => setSelectedData(item.id, !selected[item.id])} />
            <ImageListItemBar
              className={clsx(isSelected && classes.selectedItemBar)}
              title={item.name}
              status={item.annotateStatus}
              actionIcon={
                <IconButton
                  aria-label={`check ${item.name}`}
                // className={clsx(classes.icon, isSelected && classes.selectedIcon)}
                >
                  <AnnotateStatusIcon className={classes.icon}/>
                </IconButton>
              }
            />
          </ImageListItem>
        )
      })
      }
    </ImageList>
  )
}


export default DataListSection