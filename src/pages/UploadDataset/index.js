import React, { useEffect } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'

import InfoSection from './components/InfoSection/index'
import UploadZoneFolder from './components/UploadZoneFolder'
import UploadZoneFiles from './components/UploadZoneFiles'
import PreviewSection from './components/PreviewSection'

import useUploadDatasetStore from './store.js'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  uploadWrapper: {
    display: 'flex',
    width: '100%'
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
      <Grid container justifyContent='space-around'>
        <Grid item xs={5}>
          <UploadZoneFolder useStore={useUploadDatasetStore}/>
        </Grid>
        <Grid item xs={5}>
          <UploadZoneFiles useStore={useUploadDatasetStore}/>
        </Grid>
      </Grid>
      <PreviewSection useStore={useUploadDatasetStore}/>
    </div>
  )
}

export default UploadDataset