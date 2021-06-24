import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles, SvgIcon } from '@material-ui/core'
import clsx from 'clsx'

import { theme } from '../../../../theme'

const useStyles = makeStyles((props) => ({
  button: {
    width: 20,
    height: 20,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItem: 'center',
    backgroundColor: props => !props.isActive ? theme.light.primaryColor : theme.light.secondaryColor,
    cursor: 'pointer',
  },
  icon: {
    width: 20,
    height: 20,
    color: theme.light.darkColor
  },
}))

export default function ToolboxButton(props) {
  const classes = useStyles(props)
  const { name, component, handleClick, isActive } = props

  return (
    <Tooltip title={name} placement="right">
      <div className={clsx(classes.button, isActive && classes.activeIcon)} onClick={handleClick}>
        <SvgIcon className={classes.icon}>
          {component}
        </SvgIcon>
      </div>
    </Tooltip>
  )
}
