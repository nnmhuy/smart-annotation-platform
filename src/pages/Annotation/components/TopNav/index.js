import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ToolConfig from './components/ToolConfig'

import { theme } from '../../../../theme'

const useStyles = makeStyles(() => ({
  topNavWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    height: 30,
    background: theme.light.forthColor
  },
}))

// TODO: keyboard instruction
const TopNav = (props) => {
  const {
    activeMode,
    toolboxConfig, setToolboxConfig,
  } = props
  const classes = useStyles()
  return (
    <div className={classes.topNavWrapper}>
      <ToolConfig
        activeMode={activeMode}
        toolboxConfig={toolboxConfig}
        setToolboxConfig={setToolboxConfig}
      />
    </div>
  )
}

export default TopNav