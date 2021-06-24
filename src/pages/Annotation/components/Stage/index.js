import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
// import Konva from 'konva'
import { filter, cloneDeep, get, find } from 'lodash'

import Loading from '../../../../components/Loading'
import ImageRender from './ImageRender/index'
import BBoxRender from './BBoxRender/index'
import PolygonRender from './PolygonRender/index'
import ScribbleToMaskRender from './ScribbleToMaskRender/index'
import ToolRender from './ToolRender/index'

import BBoxAnnotation from '../../../../classes/BBoxAnnotationClass'
import PolygonAnnotation from '../../../../classes/PolygonAnnotationClass'
import ScribbleToMaskAnnotation from '../../../../classes/ScribbleToMaskAnnotationClass'
import { EVENT_TYPES, MODES } from '../../constants'

const useStyles = makeStyles(() => ({
  stageContainer: {
    width: '100%',
    height: '100%',
  },
  stage: {
    background: '#f8f8f8',
    cursor: ({activeMode}) => get(find(MODES, { name: activeMode }), 'cursor', 'default')
  },
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

// Konva.hitOnDragEnabled = true;

const RenderComponent = (props) => {
  const { useStore, eventCenter } = props
  const activeMode = useStore(state => state.activeMode)
  const classes = useStyles({ activeMode })
  
  const stageContainerRef = React.useRef(null)
  const stageRef = React.useRef(null)
  const setStageRef = useStore(state => state.setStageRef)
  React.useEffect(() => {
    setStageRef(stageRef.current)
  }, [stageRef])


  const stageSize = useStore(state => state.stageSize)
  const setStageSize = useStore(state => state.setStageSize)
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

  const handleStageClick = (e) => {
    // only detect left click or tap
    if (!((e.type === "click" && e.evt.which === 1) || (e.type === "tap"))) {
      return
    }
    eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_CLICK)(e)
  }

  const isPredicting = useStore(state => state.isPredicting)
  const imageId = useStore(state => state.imageId)
  const annotations = useStore(state => state.annotations)
  const drawingAnnotation = useStore(state => state.drawingAnnotation)
  const labels = useStore(state => state.labels)

  const renderingAnnotations = filter([...annotations, drawingAnnotation], { imageId }).map((ann) => {
    if (ann === null) {
      return null
    } 
    let renderAnn = cloneDeep(ann)
    const label = find(labels, { id: renderAnn.labelId })
    renderAnn.updateData = get(label, 'annotationProperties', {})
    return renderAnn
  })

  return (
    <div className={classes.stageContainer} ref={stageContainerRef}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable
        className={classes.stage}

        onMouseOut={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_OUT)}
        onMouseEnter={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_ENTER)}
        onWheel={eventCenter.emitEvent(EVENT_TYPES.STAGE_WHEEL)}
        onContextMenu={eventCenter.emitEvent(EVENT_TYPES.STAGE_CONTEXT_MENU)}

        onMouseDown={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_DOWN)}
        onTouchStart={eventCenter.emitEvent(EVENT_TYPES.STAGE_TOUCH_START)}
        onMouseMove={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_MOVE)}
        onTouchMove={eventCenter.emitEvent(EVENT_TYPES.STAGE_TOUCH_MOVE)}
        onMouseUp={eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_UP)}
        onTouchEnd={eventCenter.emitEvent(EVENT_TYPES.STAGE_TOUCH_END)}
        onClick={handleStageClick} // limit to left click only
        onTap={eventCenter.emitEvent(EVENT_TYPES.STAGE_TAP)}
      >
        <Layer>
          <ImageRender
            useStore={useStore}
            eventCenter={eventCenter}
          />
          <BBoxRender
            useStore={useStore}
            eventCenter={eventCenter}
            bBoxes={filter(renderingAnnotations, annotation => (annotation instanceof BBoxAnnotation))}
          />
          <PolygonRender
            useStore={useStore}
            eventCenter={eventCenter}
            polygons={filter(renderingAnnotations, annotation => (annotation instanceof PolygonAnnotation))}
          />
          <ScribbleToMaskRender
            useStore={useStore}
            eventCenter={eventCenter}
            scribbleAnnotations={filter(renderingAnnotations, annotation => (annotation instanceof ScribbleToMaskAnnotation))}
          />
          <ToolRender
            useStore={useStore}
            eventCenter={eventCenter}
          />
        </Layer>
      </Stage>
      <Loading isLoading={isPredicting} />
    </div>
  )
}

export default RenderComponent