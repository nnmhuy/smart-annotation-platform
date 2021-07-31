import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'


const ScribbleToMaskKeyboardHandler = (props) => {
  return (
    <>
      {/* Handle key enter: predict mask */}
      <KeyboardEventHandler
        handleKeys={['enter']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT)}
      />
      {/* Handle key Esc: unselect object*/}
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)}
      />
    </>
  )
}

export default ScribbleToMaskKeyboardHandler