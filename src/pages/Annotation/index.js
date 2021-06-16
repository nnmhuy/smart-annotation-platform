import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Toolbox from './components/Toolbox/index'
import ModeController from './components/ModeController/index'
import RenderComponent from './components/Stage/index'

import EventCenter from '../../classes/EventCenterClass'
import useAnnotationStore from './store'


const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    flexDirection: 'row',
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
  }
}))

const annotationEventCenter = new EventCenter()

const Annotation = (props) => {
  const classes = useStyles()

  React.useEffect(() => {
    // const testSubject = annotationEventCenter.getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
    // const subscription = testSubject.subscribe({
    //   next: (data) => console.log(`MOVE: ${JSON.stringify(data)}`)
    // });

    // return () => {
    //   subscription.unsubscribe()
    // }
  }, [])
  
  return (
    <div className={classes.root}>
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
        </div>
        <div className={classes.sidebarWrapper}>

        </div>
    </div>
  )
}

export default Annotation