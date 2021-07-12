import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router'

import Toolbox from './components/Toolbox/index'
import ModeController from './components/ModeController/index'
import RenderComponent from './components/Stage/index'
import Sidebar from './components/Sidebar/index'
import ThumbnailSlider from './components/ThumbnailSlider'
import TopNav from './components/TopNav/index'
import LabelSelection from './components/LabelSelection/index'
import Prediction from './components/Prediction/index'
import KeyboardHandler from './components/KeyboardHandler/index'

import EventCenter from '../../classes/EventCenterClass'
import useAnnotationStore from './store'
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
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  toolboxContainer: {

  },
  sidebarWrapper: {
    width: '20%',
  }
}))

const annotationEventCenter = new EventCenter()

const Annotation = (props) => {
  const classes = useStyles()
  const { projectId, datasetId, } = useParams()
  const query = useQuery()
  const page = JSON.parse(query.get("page") || 1)

  const getDatasetData = useAnnotationStore(state => state.getDatasetData)

  React.useEffect(() => {
    if (projectId && datasetId) {
      getDatasetData(projectId, datasetId, page)
    }
  }, [projectId, datasetId, page])

  return (
    <div className={classes.root}>
      <TopNav
        useStore={useAnnotationStore}
        eventCenter={annotationEventCenter}
      />
      <div className={classes.annotationWrapper}>
        <div className={classes.toolboxContainer}>
          <Toolbox
            useStore={useAnnotationStore}
            eventCenter={annotationEventCenter}
          />
        </div>
        <div className={classes.annotatorContainer}>
          <ModeController
            useStore={useAnnotationStore}
            eventCenter={annotationEventCenter}
          />
          <RenderComponent
            useStore={useAnnotationStore}
            eventCenter={annotationEventCenter}
          />
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
          />
        </div>
        <div className={classes.sidebarWrapper}>
          <Sidebar
            useStore={useAnnotationStore}
            eventCenter={annotationEventCenter}
          />
        </div>
      </div>
      <ThumbnailSlider
        useStore={useAnnotationStore}
        eventCenter={annotationEventCenter}
      />
    </div>
  )
}

export default Annotation