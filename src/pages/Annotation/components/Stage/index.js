import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
import { get, find, debounce } from 'lodash'

import Loading from '../../../../components/Loading'
import ImageRender from './ImageRender/index'
import AnnotationRender from './AnnotationRender/index'
import ToolRender from './ToolRender/index'

import { EVENT_TYPES, MODES } from '../../constants'
import getStagePosLimit from '../../utils/getStagePosLimit'

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
  const setStageSize = debounce(useStore(state => state.setStageSize), 500)
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

  const image = useStore(state => state.image)

  const handleStageClick = (e) => {
    // only detect left click or tap
    if (!((e.type === "click" && e.evt.which === 1) || (e.type === "tap"))) {
      return
    }
    eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_CLICK)(e)
  }

  const dragBoundFunc = (pos) => {
    // TODO: limit viewport drag here
    // important pos - is absolute position of the node
    // you should return absolute position too
    const stage = stageRef.current


    let posLimit = getStagePosLimit(stage, stageSize, image)

    return {
      x: Math.min(Math.max(pos.x, posLimit.xMin), posLimit.xMax),
      y: Math.min(Math.max(pos.y, posLimit.yMin), posLimit.yMax)
    };
  }

  const isLoading = useStore(state => state.isLoading)

  return (
    <div className={classes.stageContainer} ref={stageContainerRef}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        className={classes.stage}

        draggable
        dragBoundFunc={dragBoundFunc}
        onDragStart={eventCenter.emitEvent(EVENT_TYPES.STAGE_DRAG_START)}
        onDragMove={eventCenter.emitEvent(EVENT_TYPES.STAGE_DRAG_MOVE)}
        onDragEnd={eventCenter.emitEvent(EVENT_TYPES.STAGE_DRAG_END)}

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
        </Layer>
        <Layer>
          <AnnotationRender
            useStore={useStore}
            eventCenter={eventCenter}
          />
          <ToolRender
            useStore={useStore}
            eventCenter={eventCenter}
          />
        </Layer>
      </Stage>
      <Loading isLoading={isLoading} />
    </div>
  )
}

export default RenderComponent