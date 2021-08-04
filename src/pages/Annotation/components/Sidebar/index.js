import React from 'react'
import { makeStyles } from '@material-ui/core'

import { useAnnotationStore } from '../../stores'
import { theme } from '../../../../theme'

import ObjectInfoPanel from './components/ObjectInfoPanel/index'
import LabelInfoPanel from './components/LabelInfoPanel/index'
import DataInstanceListPanel from './components/DataInstanceListPanel/index'


const useStyles = makeStyles((props) => ({
  sideBarWrapper: {
    // width: '100%',
    boxSizing: 'border-box',
    height: '100%',
    backgroundColor: theme.light.primaryColor,
    padding: 10,
    overflowY: 'scroll',
  },
}))

const SideBar = (props) => {
  const classes = useStyles()
  return (
    <div className={classes.sideBarWrapper}>
      <ObjectInfoPanel/>
      <DataInstanceListPanel/>
      <LabelInfoPanel/>
    </div>
  )
}

export default SideBar