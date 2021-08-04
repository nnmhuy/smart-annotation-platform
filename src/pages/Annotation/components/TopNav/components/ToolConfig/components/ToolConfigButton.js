import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles, SvgIcon } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'
import BounceLoader from 'react-spinners/BounceLoader'


const useStyles = makeStyles(theme => ({
  button: {
    margin: 10,
    borderRadius: 5,
    padding: 5,
    backgroundColor: theme.palette.secondary.lighter,
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: theme.palette.secondary.lighter
    },
    color: theme.palette.primary.dark
  },
  activeButton: {
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    color: theme.palette.primary.darker
  },
}))

export default function ToolboxButton(props) {
  const { name, component, handleClick, isActive, isLoading, ...others } = props

  const classes = useStyles(props)
  return (
    <Tooltip title={name} placement="bottom">
      <IconButton
        size="small" className={clsx(classes.button, isActive && classes.activeButton)}
        onClick={handleClick}
        {...others}
      >
        {isLoading ?
          <BounceLoader size={15} className={classes.icon}/>
          :
          <SvgIcon fontSize="small">
            {component}
          </SvgIcon>
        }
      </IconButton>
    </Tooltip>
  )
}
