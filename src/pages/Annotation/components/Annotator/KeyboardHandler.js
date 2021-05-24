import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { MODES, MAX_BRUSH_SIZE, MIN_BRUSH_SIZE } from '../../constants'


const KeyboardHandler = (props) => {
  const {
    activeMode,
    resetAllState,
    toolboxConfig, setToolboxConfig,
    selectShape, selectedId,
    
    setForceViewportHandling, handleViewportEnd,

    initializeDrawByBrush, finishDrawPolygonByBrush,

    deleteById,
  } = props
  return (
    <>
      {/* Handle key enter: finish drawing */}
      <KeyboardEventHandler
        handleKeys={['enter']}
        onKeyEvent={() => {
          if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
            finishDrawPolygonByBrush()
          }
        }}
      />
      {/* Handle key Esc: reset all state */}
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={() => {
          resetAllState()
          if (activeMode === MODES.DRAW_POLYGON_BY_BRUSH) {
            initializeDrawByBrush()
          }
        }}
      />
      {/* Handle key Delete: delete shape */}
      <KeyboardEventHandler
        handleKeys={['backspace']}
        onKeyEvent={() => {
          if (activeMode === MODES.EDIT && selectedId) {
            deleteById(selectedId)
            selectShape(null)
          }
        }}
      />
      {/* Handle key Space: force viewport handling */}
      <KeyboardEventHandler
        handleKeys={['space']}
        handleEventType='keydown'
        onKeyEvent={() => {
          setForceViewportHandling(true)
        }}
      />
      <KeyboardEventHandler
        handleKeys={['space']}
        handleEventType='keyup'
        onKeyEvent={(key, evt) => {
          setForceViewportHandling(false)
          handleViewportEnd({ evt })
        }}
      />
      {activeMode === MODES.DRAW_POLYGON_BY_BRUSH && 
        <>
          {/* Handle key Ctrl+], Meta+]: Enlarge brush size */ }
          <KeyboardEventHandler
            handleKeys={['meta+]', 'ctrl+]']}
            onKeyEvent={(key, e) => {
              e.preventDefault()
              setToolboxConfig({
                ...toolboxConfig,
                brushSize: Math.min(toolboxConfig.brushSize + 1, MAX_BRUSH_SIZE),
              })
            }}
          />
          {/* Handle key Ctrl+[, Meta+[: Reduce brush size */}
          <KeyboardEventHandler
            handleKeys={['meta+[', 'ctrl+[']}
            onKeyEvent={(key, e) => {
              e.preventDefault()
              setToolboxConfig({
                ...toolboxConfig,
                brushSize: Math.max(toolboxConfig.brushSize - 1, MIN_BRUSH_SIZE),
              })
            }}
          />
        </>
      }
    </>
  )
}

export default KeyboardHandler