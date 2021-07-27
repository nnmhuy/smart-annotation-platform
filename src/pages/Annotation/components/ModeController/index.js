import React from 'react'
import { get } from 'lodash'

import Cursor from './Cursor/index'
// import Edit from './Edit/index'
import DrawBBox from './DrawBBox/index'
// import DrawPolygon from './DrawPolygon/index'
// import CutPolygon from './CutPolygon/index'
// import ScribbleToMask from './ScribbleToMask/index'
// import Delete from './Delete/index'

import { MODES } from '../../constants'

import { useGeneralStore } from '../../stores/index'

const mapModeToComponent = {
  [MODES.CURSOR.name]: Cursor,
  // [MODES.EDIT.name]: Edit,
  [MODES.DRAW_BBOX.name]: DrawBBox,
  // [MODES.DRAW_POLYGON.name]: DrawPolygon,
  // [MODES.SCRIBBLE_TO_MASK.name]: ScribbleToMask,
  // [MODES.CUT_POLYGON.name]: CutPolygon,
  // [MODES.DELETE.name]: Delete,
}

const ModeController = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const ActiveModeComponent = get(mapModeToComponent, activeMode, null)

  return ([
    <Cursor key="cursor-handler" {...props}/>,
    ActiveModeComponent && <ActiveModeComponent key="mode-handler" {...props}/>
  ])
}

export default ModeController