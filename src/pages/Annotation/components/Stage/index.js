import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
import { filter } from 'lodash'

import BBoxRender from './BBoxRender/index'

import BBoxAnnotation from '../../../../classes/BBoxAnnotationClass'
import { EVENT_TYPES } from '../../constants'

const useStyles = makeStyles(() => ({
  stageContainer: {
    width: '100%',
    height: '100%',
  }
}))


const emittingSubjects = [
  EVENT_TYPES.STAGE_MOUSE_CLICK,
  EVENT_TYPES.STAGE_MOUSE_DOWN,
  EVENT_TYPES.STAGE_MOUSE_UP,
  EVENT_TYPES.STAGE_MOUSE_MOVE,

  EVENT_TYPES.STAGE_MOUSE_OUT,
  EVENT_TYPES.STAGE_MOUSE_ENTER,

  EVENT_TYPES.STAGE_TAP,
  EVENT_TYPES.STAGE_TOUCH_START,
  EVENT_TYPES.STAGE_TOUCH_END,
  EVENT_TYPES.STAGE_TOUCH_MOVE,

  EVENT_TYPES.STAGE_CONTEXT_MENU,
]

const RenderComponent = (props) => {
  const classes = useStyles()
  const { useStore, eventCenter } = props
  
  const stageContainerRef = React.useRef(null)
  const stageRef = React.useRef(null)
  const setStageRef = useStore(state => state.setStageRef)
  React.useEffect(() => {
    setStageRef(stageRef.current)
  }, [stageRef])

  const [stageSize, setStageSize] = React.useState({ width: 0, height: 0 })
  const handleNewStageSize = () => {
    const container = stageContainerRef.current
    setStageSize({
      width: container.clientWidth,
      height: container.clientHeight,
    })
  }

  React.useEffect(() => {
    handleNewStageSize()
    window.addEventListener('resize', handleNewStageSize)
    return () => {
      window.removeEventListener('resize', handleNewStageSize)
    }
  }, [stageContainerRef])


  // const [listeningSubjects, setListeningSubjects] = React.useState({}) // subjects listen by this component
  React.useEffect(() => {
    let initializingObservingSubjects = {}

    emittingSubjects.forEach(subject => {
      initializingObservingSubjects[subject] = eventCenter.getSubject(subject)
    })
  }, [])

  const annotations = useStore(state => state.annotations)
  const drawingAnnotation = useStore(state => state.drawingAnnotation)

  return (
    <div className={classes.stageContainer} ref={stageContainerRef}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        // className={classes.stage}

        onMouseOut={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_OUT)}
        onMouseEnter={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_ENTER)}
        // onWheel={handleZoom}
        // onContextMenu={handleStageContextMenu}

        onMouseDown={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_DOWN)}
        // onTouchStart={handleStageMouseDown}
        onMouseMove={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_MOVE)}
        // onTouchMove={emitEvent(EVENT_TYPES.STAGE_MOUSE_MOVE)}
        onMouseUp={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_UP)}
        // onTouchEnd={handleStageMouseUp}
        onClick={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_CLICK)}
        // onTap={handleStageClick}
      >
        <Layer>
          <BBoxRender
            useStore={useStore}
            eventCenter={eventCenter}
            bBoxes={filter([drawingAnnotation, ...annotations], annotation => (annotation instanceof BBoxAnnotation))}
          />
        </Layer>
      </Stage>
    </div>
  )
}

export default RenderComponent