import React from 'react'
import { get } from 'lodash'

import DrawBBox from './DrawBBox/index'

import { MODES } from '../../constants'

const mapModeToComponent = {
  [MODES.DRAW_BBOX.name]: DrawBBox,
}


const ModeController = (props) => {
  const { useStore } = props
  const activeMode = useStore(state => state.activeMode)

  const ActiveModeComponent = get(mapModeToComponent, activeMode.name, null)
  return (
    <ActiveModeComponent {...props}/>
  )
}

export default ModeController