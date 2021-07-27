import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash'

import { useGeneralStore } from '../../../../stores/index'

import ScribbleToMaskConfig from './ConfigComponent/ScribbleToMaskConfig'
import EditConfig from './ConfigComponent/EditConfig'
import BBoxConfig from './ConfigComponent/BBoxConfig'
import PolygonConfig from './ConfigComponent/PolygonConfig'

import { MODES } from '../../../../constants'


const useStyles = makeStyles(() => ({
  toolConfigWrapper: {
    flex: 1,
  }
}))

const toolBoxConfigs = {
  // [MODES.EDIT.name]: EditConfig,
  [MODES.DRAW_BBOX.name]: BBoxConfig,
  [MODES.DRAW_POLYGON.name]: PolygonConfig,
  [MODES.SCRIBBLE_TO_MASK.name]: ScribbleToMaskConfig,
}

const ToolConfig = (props) => {
  const classes = useStyles()

  const activeMode = useGeneralStore(state => state.activeMode)
  const toolConfig = useGeneralStore(state => state.toolConfig[activeMode] || {})
  const setToolConfig = useGeneralStore(state => state.setToolConfig)

  const ActiveConfigComponent = get(toolBoxConfigs, activeMode, null)

  return (
    <div className={classes.toolConfigWrapper}>
      {ActiveConfigComponent &&
        <ActiveConfigComponent
          toolConfig={toolConfig}
          setToolConfig={setToolConfig}
        />
      }
    </div>
  )
}

export default ToolConfig