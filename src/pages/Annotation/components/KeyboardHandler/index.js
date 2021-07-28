import React from 'react'
import { get } from 'lodash'

import { useGeneralStore } from '../../stores'

import ScribbleToMaskKeyboardHandler from './component/ScribbleToMaskKeyboardHandler'
import EditKeyboardHandler from './component/EditKeyboardHandler'
import BBoxKeyboardHandler from './component/BBoxKeyboardHandler'
import PolygonKeyboardHandler from './component/PolygonKeyboardHandler'

import { MODES } from '../../constants'

const mapModeToKeyboardHandler = {
  [MODES.SCRIBBLE_TO_MASK.name]: ScribbleToMaskKeyboardHandler,
  [MODES.EDIT.name]: EditKeyboardHandler,
  [MODES.DRAW_BBOX.name]: BBoxKeyboardHandler,
  [MODES.DRAW_POLYGON.name]: PolygonKeyboardHandler,
}

const KeyboardHandler = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const ActiveKeyboardHandlerComponent = get(mapModeToKeyboardHandler, activeMode, null)

  if (!ActiveKeyboardHandlerComponent) {
    return null
  }

  return (
    <ActiveKeyboardHandlerComponent {...props} />
  )
}

export default KeyboardHandler