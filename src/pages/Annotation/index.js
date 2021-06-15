import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { cloneDeep } from 'lodash'

import RenderComponent from './components/Stage/index'
import ModeController from './components/ModeController/index'

import EventCenter from '../../classes/EventCenterClass'
import useAnnotationStore from './store'
import { EVENT_TYPES } from './constants'


const useStyles = makeStyles(() => ({
  annotatorContainer: {
    height: '100vh',
    width: '100vw',
  }
}))

const annotationEventCenter = new EventCenter()

const Annotation = (props) => {
  const classes = useStyles()

  
  // React.useEffect(() => {
  //   const testSubject = annotationEventCenter.getSubject(EVENT_TYPES.STAGE_MOUSE_MOVE)
  //   const subscription = testSubject.subscribe({
  //     next: (data) => console.log(`MOVE: ${JSON.stringify(data)}`)
  //   });

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [])
  
  return (
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
  )
}

export default Annotation