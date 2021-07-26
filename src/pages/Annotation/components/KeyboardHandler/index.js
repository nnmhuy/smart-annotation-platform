import React from 'react'
import { get } from 'lodash'

import ScribbleToMaskKeyboardHandler from './component/ScribbleToMaskKeyboardHandler'
import EditKeyboardHandler from './component/EditKeyboardHandler'

import { MODES } from '../../constants'

const mapModeToKeyboardHandler = {
  [MODES.SCRIBBLE_TO_MASK.name]: ScribbleToMaskKeyboardHandler,
  [MODES.EDIT.name]: EditKeyboardHandler,
}

const KeyboardHandler = (props) => {
  const { useStore } = props

  const activeMode = useStore(state => state.activeMode)
  const ActiveKeyboardHandlerComponent = get(mapModeToKeyboardHandler, activeMode, null)

  if (!ActiveKeyboardHandlerComponent) {
    return null
  }

  return (
    <ActiveKeyboardHandlerComponent {...props} />
  )
}

export default KeyboardHandler