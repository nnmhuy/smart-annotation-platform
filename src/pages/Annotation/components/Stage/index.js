import React, { useCallback, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
import { get, find, debounce } from 'lodash'

import { useGeneralStore, useDatasetStore } from '../../stores/index'

import DataInstanceRender from './DataInstanceRender/index'
// import AnnotationRender from './AnnotationRender/index'
// import ToolRender from './ToolRender/index'

import { EVENT_TYPES, MODES, STAGE_PADDING } from '../../constants'
import getStagePosLimit from '../../utils/getStagePosLimit'
import getRenderingSize from '../../utils/getRenderingSize'

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

const RenderComponent = (props) => {
  const { eventCenter } = props
  const activeMode = useGeneralStore(state => state.activeMode)
  const classes = useStyles({ activeMode })
  
  const stageContainerRef = React.useRef(null)
  const stageRef = React.useRef(null)
  const setStage = useGeneralStore(state => state.setStage)
  React.useEffect(() => {
    setStage(stageRef.current)
  }, [setStage, stageRef])


  const stage = useGeneralStore(state => state.stage)
  const stageSize = useGeneralStore(state => state.stageSize)
  const setStageSize = useGeneralStore(state => state.setStageSize)
  const handleNewStageSize = debounce(() => {
    const container = stageContainerRef.current
    if (container) {
      setStageSize({
        width: container.clientWidth,
        height: container.clientHeight,
      })
    }
  }, 500)

  React.useEffect(() => {
    handleNewStageSize()
    window.addEventListener('resize', handleNewStageSize)
    return () => {
      window.removeEventListener('resize', handleNewStageSize)
    }
  }, [stageContainerRef])

  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(useCallback(state => find(state.dataInstances, { id: instanceId }), [instanceId]))

  const renderingSize = useMemo(() =>
    getRenderingSize(stageSize, dataInstance, STAGE_PADDING)
    , [stageSize, dataInstance]
  )

  useEffect(() => {
    if (stage) {
      stage.position({
        x: (stageSize.width - renderingSize.width) / 2,
        y: (stageSize.height - renderingSize.height) / 2,
      });
      stage.scale({ x: 1, y: 1 })
    }
  }, [stageSize, dataInstance])

  const dragBoundFunc = (pos) => {
    // important pos - is absolute position of the node
    // you should return absolute position too
    const stage = stageRef.current
    let posLimit = getStagePosLimit(stage, stageSize, renderingSize)

    return {
      x: Math.min(Math.max(pos.x, posLimit.xMin), posLimit.xMax),
      y: Math.min(Math.max(pos.y, posLimit.yMin), posLimit.yMax)
    };
  }


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
        // only detect left click or tap
        onClick={(e) => {
          if (!((e.type === "click" && e.evt.which === 1) || (e.type === "tap"))) {
            return
          }
          eventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_CLICK)(e)
        }}
        onTap={eventCenter.emitEvent(EVENT_TYPES.STAGE_TAP)}
      >
        <Layer>
          <DataInstanceRender 
            eventCenter={eventCenter} 
            renderingSize={renderingSize}
          />
        </Layer>
        {/* <Layer>
          <AnnotationRender
            useStore={useStore}
            eventCenter={eventCenter}
          />
          <ToolRender
            useStore={useStore}
            eventCenter={eventCenter}
          />
        </Layer> */}
      </Stage>
    </div>
  )
}

export default RenderComponent