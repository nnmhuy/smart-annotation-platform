import React from 'react'
import { makeStyles } from '@material-ui/core'

import ObjectInfoPanel from './components/ObjectInfoPanel/index'
import LabelInfoPanel from './components/LabelInfoPanel/index'
import DataInstanceListPanel from './components/DataInstanceListPanel/index'
import UpdateStatusButtonPanel from './components/UpdateStatusButtonPanel/index'
import DescriptionBox from './components/DescriptionBox'


const useStyles = makeStyles(theme => ({
  sideBarWrapper: {
    boxSizing: 'border-box',
    height: '100%',
    background: theme.palette.primary.darker,
    padding: 10,
    overflowY: 'scroll',
  },
}))

const SideBar = () => {
  const classes = useStyles()
  return (
    <div className={classes.sideBarWrapper}>
      <ObjectInfoPanel/>
      <DataInstanceListPanel/>
      <LabelInfoPanel/>
      <UpdateStatusButtonPanel/>
      <DescriptionBox/>
    </div>
  )
}

export default SideBar