import React, { useCallback, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Stage, Layer } from 'react-konva'
import { get, find, debounce } from 'lodash'

import EventCenter from '../../EventCenter'
import { useGeneralStore, useDatasetStore } from '../../stores/index'

import DataInstanceRender from './DataInstanceRender/index'
import AnnotationRenderLayers from './AnnotationRenderLayers/index'
import ToolRender from './ToolRender/index'

import { EVENT_TYPES, MODES, STAGE_PADDING } from '../../constants'
import getStagePosLimit from '../../utils/getStagePosLimit'
import getRenderingSize from '../../utils/getRenderingSize'

const CANVAS_SIZE = 300

const useStyles = makeStyles(() => ({
  stageContainer: {
    width: '100%',
    flex: 1,
    overflowY: 'hidden',
    background: '#f8f8f8',
    cursor: ({ activeMode }) => get(find(MODES, { name: activeMode }), 'cursor', 'default')
  },
  stage: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    transformOrigin: '0 0',
    '-webkit-transform-origin': '0 0',
    background: '#f8f8f8',
    cursor: ({activeMode}) => get(find(MODES, { name: activeMode }), 'cursor', 'default')
  },
}))


const RenderComponent = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const classes = useStyles({ activeMode })
  
  const stageContainerRef = React.useRef(null)
  const getStageContainerRef = useCallback(() => stageContainerRef.current, [stageContainerRef])
  const stageRef = React.useRef(null)
  const setStage = useGeneralStore(state => state.setStage)
  React.useEffect(() => {
    setStage(stageRef.current)
  }, [stageRef])


  const stage = useGeneralStore(state => state.stage)
  const setStageSize = useGeneralStore(state => state.setStageSize)


  const [transformRule, setTransformRule] = React.useState(null)
  const handleNewStageSize = debounce(() => {
    const container = getStageContainerRef()

    if (container && container.clientWidth > 0 && container.clientHeight > 0) {
      // Minimum scale to cover whole canvas
      const scale = Math.max(
        container.clientWidth / CANVAS_SIZE,
        container.clientHeight / CANVAS_SIZE);
      // Scaled content size
      const size = CANVAS_SIZE * scale
      // Offset from top/left
      const offset = [
        (container.clientWidth - size) / 2, (container.clientHeight - size) / 2];

      // Apply CSS transform
      const rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scale + ")";
      setTransformRule(rule)

      setStageSize({
        width: container.clientWidth,
        height: container.clientHeight,
      })
    }
  }, 500, { leading: true, trailing: true })

  React.useEffect(() => {
    handleNewStageSize()
    window.addEventListener('resize', handleNewStageSize)
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.RESIZE_STAGE]: getSubject(EVENT_TYPES.RESIZE_STAGE)
        .subscribe({ next: (e) => handleNewStageSize(e) }),
    }

    return () => {
      window.removeEventListener('resize', handleNewStageSize)
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  const instanceId = useDatasetStore(state => state.instanceId)
  const dataInstance = useDatasetStore(useCallback(state => find(state.dataInstances, { id: instanceId }), [instanceId]))

  const setRenderingSize = useGeneralStore(state => state.setRenderingSize)
  const renderingSize = useMemo(() =>
    getRenderingSize({
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
    }, dataInstance, STAGE_PADDING)
    , [dataInstance]
  )

  useEffect(() => {
    setRenderingSize(renderingSize)
    window.canvasRenderingSize = renderingSize
    if (stage) {
      stage.position({
        x: (CANVAS_SIZE- renderingSize.width) / 2,
        y: (CANVAS_SIZE - renderingSize.height) / 2,
      });
      stage.scale({ x: 1, y: 1 })
    }
  }, [renderingSize])


  const dragBoundFunc = (pos) => {
    // important pos - is absolute position of the node
    // you should return absolute position too
    const stage = stageRef.current
    let posLimit = getStagePosLimit(stage, { width: CANVAS_SIZE, height: CANVAS_SIZE }, renderingSize)

    return {
      x: Math.min(Math.max(pos.x, posLimit.xMin), posLimit.xMax),
      y: Math.min(Math.max(pos.y, posLimit.yMin), posLimit.yMax)
    };
  }

  return (
    <div className={classes.stageContainer} ref={stageContainerRef}>
      <Stage
        ref={stageRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className={classes.stage}
        style={{ transform: transformRule }}

        draggable
        dragBoundFunc={dragBoundFunc}
        onDragStart={EventCenter.emitEvent(EVENT_TYPES.STAGE_DRAG_START)}
        onDragMove={EventCenter.emitEvent(EVENT_TYPES.STAGE_DRAG_MOVE)}
        onDragEnd={EventCenter.emitEvent(EVENT_TYPES.STAGE_DRAG_END)}

        onMouseOut={EventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_OUT)}
        onMouseEnter={EventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_ENTER)}
        onWheel={EventCenter.emitEvent(EVENT_TYPES.STAGE_WHEEL)}
        onContextMenu={EventCenter.emitEvent(EVENT_TYPES.STAGE_CONTEXT_MENU)}

        onMouseDown={EventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_DOWN)}
        onTouchStart={EventCenter.emitEvent(EVENT_TYPES.STAGE_TOUCH_START)}
        onMouseMove={EventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_MOVE)}
        onTouchMove={EventCenter.emitEvent(EVENT_TYPES.STAGE_TOUCH_MOVE)}
        onMouseUp={EventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_UP)}
        onTouchEnd={EventCenter.emitEvent(EVENT_TYPES.STAGE_TOUCH_END)}
        // only detect left click or tap
        onClick={(e) => {
          if (!((e.type === "click" && e.evt.which === 1) || (e.type === "tap"))) {
            return
          }
          EventCenter.emitEvent(EVENT_TYPES.STAGE_MOUSE_CLICK)(e)
        }}
        onTap={EventCenter.emitEvent(EVENT_TYPES.STAGE_TAP)}
      >
        <Layer listening={false}>
          <DataInstanceRender/>
        </Layer>
        <AnnotationRenderLayers/>
        <Layer listening={false}>
          <ToolRender/>
        </Layer>
      </Stage>
    </div>
  )
}

export default RenderComponent