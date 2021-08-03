import React from 'react'
import { get } from 'lodash'

import { useGeneralStore } from '../../stores/index'

import MiVOSScribbleToMask from './MiVOSScribbleToMask/index'
import CMPCReferringExpressionToMask from './CMPCReferringExpressionToMask/index'

import { MODES } from '../../constants'

const mapActiveModeToPredictor = {
  [MODES.DRAW_MASK.name]: MiVOSScribbleToMask,
  [MODES.REFERRING_EXPRESSION.name]: CMPCReferringExpressionToMask,
}


const Prediction = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const ActiveToolRenderComponent = get(mapActiveModeToPredictor, activeMode, null)

  if (!ActiveToolRenderComponent) {
    return null
  }

  return (
    <ActiveToolRenderComponent />
  )
}

export default Prediction