import React from 'react'
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { EVENT_TYPES } from '../../../constants'


const EditKeyboardHandler = (props) => {
  const { useStore, eventCenter } = props

  return (
    <>
      {/* Handle key delete: delete selected annotation */}
      <KeyboardEventHandler
        handleKeys={['backspace']}
        onKeyEvent={eventCenter.emitEvent(EVENT_TYPES.EDIT.DELETE_ANNOTATION)}
      />
    </>
  )
}

export default EditKeyboardHandler