import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'


const ScribbleToMaskKeyboardHandler = (props) => {
  return (
    <>
      {/* Handle key shift + enter: save mask */}
      <KeyboardEventHandler
        handleKeys={['shift+enter']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.SAVE)}
      />
      {/* Handle key enter: predict mask */}
      <KeyboardEventHandler
        handleKeys={['enter']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT)}
      />
      {/* Handle key Esc: reset all state */}
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.CLEAR_ALL)}
      />
    </>
  )
}

export default ScribbleToMaskKeyboardHandler