import React from 'react'

import { get } from 'lodash'

import MiVOSScribbleToMask from './MiVOSScribbleToMask/index'

import { MODES } from '../../constants'

const mapActiveModeToPredictor = {
  [MODES.SCRIBBLE_TO_MASK.name]: MiVOSScribbleToMask
}


const Prediction = (props) => {
  const { useStore, eventCenter } = props

  const activeMode = useStore(state => state.activeMode)
  const ActiveToolRenderComponent = get(mapActiveModeToPredictor, activeMode, null)

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

export default Prediction