import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'

import InfoSection from './components/InfoSection/index'
import UploadZone from './components/UploadZone'
import PreviewSection from './components/PreviewSection'

import useUploadDatasetStore from './store.js'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  }
}))

const UploadDataset = (props) => {
  const { datasetId } = useParams()
  const classes = useStyles()

  const getDatasetInfo = useUploadDatasetStore(state => state.getDatasetInfo)

  useEffect(() => {
    if (datasetId) {
      getDatasetInfo(datasetId)
    }
  }, [datasetId])

  return (
    <div className={classes.root}>
      <InfoSection useStore={useUploadDatasetStore}/>
      <UploadZone useStore={useUploadDatasetStore}/>
      <PreviewSection useStore={useUploadDatasetStore}/>
    </div>
  )
}

export default UploadDataset