import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash' 

import ScribbleToMaskConfig from './ConfigComponent/ScribbleToMaskConfig'

import { MODES } from '../../../../constants'


const useStyles = makeStyles(() => ({
  toolConfigWrapper: {
    flex: 1,
  }
}))

const toolBoxConfigs = {
  [MODES.SCRIBBLE_TO_MASK.name]: ScribbleToMaskConfig
}

const ToolConfig = (props) => {
  const classes = useStyles()
  // const { activeMode, toolboxConfig, setToolboxConfig, } = props
  const { useStore, eventCenter } = props

  const activeMode = useStore(state => state.activeMode)
  const toolConfig = get(useStore(state => state.toolConfig), activeMode, {})
  const setToolConfig = useStore(state => state.setToolConfig)

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