import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ToolConfig from './components/ToolConfig/index'

import { theme } from '../../../../theme'

const useStyles = makeStyles(() => ({
  topNavWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    background: theme.light.forthColor
  },
}))

// TODO: keyboard instruction
const TopNav = (props) => {
  const {
    useStore,
    eventCenter,
  } = props
  const classes = useStyles()
  return (
    <div className={classes.topNavWrapper}>
      <ToolConfig
        useStore={useStore}
        eventCenter={eventCenter}
      />
    </div>
  )
}

export default TopNav