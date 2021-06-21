import React from 'react'
import { get } from 'lodash'

import DrawScribbleToMask from './DrawScribbleToMaskRender/index'

import { MODES } from '../../../constants'

const mapActiveModeToToolRender = {
  [MODES.SCRIBBLE_TO_MASK.name]: DrawScribbleToMask
}


const ToolRender = (props) => {
  const { useStore, eventCenter } = props

  const activeMode = useStore(state => state.activeMode)
  const ActiveToolRenderComponent = get(mapActiveModeToToolRender, activeMode, null)

  if (!ActiveToolRenderComponent) {
    return null
  }

  return (
    <ActiveToolRenderComponent
      useStore={useStore}
      eventCenter={eventCenter}
    />
  )
}

export default ToolRender