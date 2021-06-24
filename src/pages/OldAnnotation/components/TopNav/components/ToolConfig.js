import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash' 

import BrushConfig from './BrushConfig'

import { MODES } from '../../../constants'


const useStyles = makeStyles(() => ({
  toolConfigWrapper: {
    flex: 1,
  }
}))

const toolBoxConfigs = {
  [MODES.DRAW_POLYGON_BY_BRUSH.name]: BrushConfig
}

const ToolConfig = (props) => {
  const { activeMode, toolboxConfig, setToolboxConfig, } = props
  const classes = useStyles()
  const ActiveConfigComponent = get(toolBoxConfigs, activeMode.name, null)

  return (
    <div className={classes.toolConfigWrapper}>
      {ActiveConfigComponent &&
        <ActiveConfigComponent
          toolboxConfig={toolboxConfig}
          setToolboxConfig={setToolboxConfig}
        />
      }
    </div>
  )
}

export default ToolConfig