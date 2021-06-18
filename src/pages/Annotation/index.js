import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Toolbox from './components/Toolbox/index'
import ModeController from './components/ModeController/index'
import RenderComponent from './components/Stage/index'
import Sidebar from './components/Sidebar/index'
import ThumbnailSlider from './components/ThumbnailSlider'
import LabelSelection from './components/LabelSelection/index'

import EventCenter from '../../classes/EventCenterClass'
import useAnnotationStore from './store'


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
    height: '100vh',
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

  return (
    <div className={classes.root}>
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