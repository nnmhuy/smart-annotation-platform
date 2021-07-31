import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'


const BBoxKeyboardHandler = (props) => {

  return (
    <>
      {/* Handle key delete: delete selected annotation */}
      <KeyboardEventHandler
        handleKeys={['backspace']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.EDIT.DELETE_ANNOTATION)}
      />
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.BBOX.CANCEL_DRAWING_BBOX)}
      />
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={EventCenter.emitEvent(EVENT_TYPES.UNSELECT_CURRENT_ANNOTATION_OBJECT)}
      />
    </>
  )
}

export default BBoxKeyboardHandler