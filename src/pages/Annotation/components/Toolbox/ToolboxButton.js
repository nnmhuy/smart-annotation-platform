import React from 'react'
import { makeStyles, SvgIcon } from '@material-ui/core'
import clsx from 'clsx'

import { theme } from '../../../../theme'

function isSelected(props) {
  return props.currentMode === props.mode
}

const useStyles = makeStyles((props) => ({
  button: {
    width: 20,
    height: 20,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItem: 'center',
    backgroundColor: props => isSelected(props) ? theme.light.primaryColor : theme.light.backgroundColor
  },
  icon: {
    width: 20,
    height: 20,
    color: theme.light.darkColor
  },
  activeIcon: {
    color: theme.light.secondaryColor
  }
}))

export default function ToolboxButton(props) {
  const { name, component, handleClick, isActive } = props

  const classes = useStyles(props)
  return (
    <div className={classes.button} onClick={handleClick}>
      <SvgIcon className={clsx(classes.icon, isActive && classes.activeIcon)}>
        {component}
      </SvgIcon>
    </div>
  )
}
