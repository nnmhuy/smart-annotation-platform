import React from 'react'
import { get } from 'lodash'

import Edit from './Edit/index'
import DrawBBox from './DrawBBox/index'

import { MODES } from '../../constants'

const mapModeToComponent = {
  [MODES.EDIT.name]: Edit,
  [MODES.DRAW_BBOX.name]: DrawBBox,
}


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