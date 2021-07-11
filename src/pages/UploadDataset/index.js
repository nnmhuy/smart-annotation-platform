import React from 'react'
import { makeStyles } from '@material-ui/core'

import InfoSection from './components/InfoSection/index'
import UploadZone from './components/UploadZone'
import PreviewSection from './components/PreviewSection'
import UploadHandle from './components/UploadHandle/index'

import useUploadDatasetStore from './store.js'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  }
}))

const UploadDataset = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <InfoSection useStore={useUploadDatasetStore}/>
      <UploadZone useStore={useUploadDatasetStore}/>
      <PreviewSection useStore={useUploadDatasetStore}/>
      <UploadHandle useStore={useUploadDatasetStore}/>
    </div>
  )
}

export default UploadDataset