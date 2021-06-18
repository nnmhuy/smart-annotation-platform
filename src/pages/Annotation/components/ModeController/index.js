import React from 'react'
import { get } from 'lodash'

import Cursor from './Cursor/index'
import Edit from './Edit/index'
import DrawBBox from './DrawBBox/index'
import DrawPolygon from './DrawPolygon/index'

import { MODES } from '../../constants'

const mapModeToComponent = {
  [MODES.CURSOR.name]: Cursor,
  [MODES.EDIT.name]: Edit,
  [MODES.DRAW_BBOX.name]: DrawBBox,
  [MODES.DRAW_POLYGON.name]: DrawPolygon,
}

// TODO: handle zoom gestures
const ModeController = (props) => {
  const { useStore } = props
  const activeMode = useStore(state => state.activeMode)
  const ActiveModeComponent = get(mapModeToComponent, activeMode, null)

  if (!ActiveModeComponent) {
    return null
  }

  return (
    <ActiveModeComponent {...props}/>
  )
}

export default ModeController