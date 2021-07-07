import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { EVENT_TYPES } from '../../../constants'


const ScribbleToMaskKeyboardHandler = (props) => {
  const { eventCenter } = props

  return (
    <>
      {/* Handle key shift + enter: save mask */}
      <KeyboardEventHandler
        handleKeys={['shift+enter']}
        onKeyEvent={eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.SAVE)}
      />
      {/* Handle key enter: predict mask */}
      <KeyboardEventHandler
        handleKeys={['enter']}
        onKeyEvent={eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT)}
      />
      {/* Handle key Esc: reset all state */}
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.CLEAR_ALL)}
      />
    </>
  )
}

export default ScribbleToMaskKeyboardHandler