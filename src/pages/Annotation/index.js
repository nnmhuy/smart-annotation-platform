import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'

import Loading from '../../components/Loading'
import Toolbox from './components/Toolbox/index'
import RenderComponent from './components/Stage/index'
import ThumbnailSlider from './components/ThumbnailSlider'
import PlayControl from './components/PlayControl/index'
import ModeController from './components/ModeController/index'
import Sidebar from './components/Sidebar/index'
import TopNav from './components/TopNav/index'
import LabelSelection from './components/LabelSelection/index'
import Prediction from './components/Prediction/index'
import KeyboardHandler from './components/KeyboardHandler/index'

import annotationEventCenter from './EventCenter'
import { useDatasetStore, useGeneralStore, useAnnotationStore } from './stores/index'
import useQuery from '../../utils/useQuery'


const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  annotationWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
    flex: 1,
    overflow: 'hidden'
  },
  annotatorContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowX: 'hidden',
    height: '100%',
  },
  toolboxContainer: {

  },
  sidebarWrapper: {
    width: '20%',
  }
}))


const Annotation = (props) => {
  const classes = useStyles()
  const { datasetId, } = useParams()
  const query = useQuery()
  const page = JSON.parse(query.get("page") || 1)

  const instanceId = useDatasetStore(state => state.instanceId)
  const getDatasetInfo = useDatasetStore(state => state.getDatasetInfo)
  const getDataInstances = useDatasetStore(state => state.getDataInstances)
  const setInstanceId = useDatasetStore(state => state.setInstanceId)

  const loadAnnotationLabels = useAnnotationStore(state => state.loadAnnotationLabels)
  const loadAnnotationObjects = useAnnotationStore(state => state.loadAnnotationObjects)
  const loadAnnotations = useAnnotationStore(state => state.loadAnnotations)

  useEffect(() => {
    if (datasetId) {
      setInstanceId(null)
      getDatasetInfo(datasetId)
      loadAnnotationLabels(datasetId)
    }
  }, [datasetId])

  useEffect(() => {
    getDataInstances(datasetId, page)
  }, [datasetId, page])

  useEffect(() => {
    if (instanceId) {
      loadAnnotationObjects(instanceId)
      loadAnnotations(instanceId)
    }
  }, [instanceId])



  const isGeneralLoading = useGeneralStore(state => state.isLoading)
  const isDatasetLoading = useDatasetStore(state => state.isLoading)
  const isAnnotationLoading = useAnnotationStore(state => state.isLoading)

  return (
    <div className={classes.root}>
      <Loading isLoading={{ ...isGeneralLoading, ...isDatasetLoading, ...isAnnotationLoading }} />
      <TopNav/>
      <div className={classes.annotationWrapper}>
        <div className={classes.toolboxContainer}>
          <Toolbox eventCenter={annotationEventCenter}/>
        </div>
        <div className={classes.annotatorContainer}>
          <RenderComponent/>
          <PlayControl/>
          <ThumbnailSlider/>
          
          {/* Non-UI elements */}
          <ModeController/>
          {/*
          <LabelSelection
            useStore={useAnnotationStore}
            eventCenter={annotationEventCenter}
          />
          <Prediction
            useStore={useAnnotationStore}
            eventCenter={annotationEventCenter}
          />
          <KeyboardHandler
            useStore={useAnnotationStore}
            eventCenter={annotationEventCenter}
          /> */}
        </div>
        <div className={classes.sidebarWrapper}>
          <Sidebar/>
        </div>
      </div>
    </div>
  )
}

export default Annotation