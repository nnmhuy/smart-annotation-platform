import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, SvgIcon } from '@material-ui/core'
import clsx from 'clsx'

import { theme } from '../../../../../../../theme'

const useStyles = makeStyles(() => ({
  button: {
    width: 20,
    height: 20,
    padding: 5,
    margin: 5,
    borderRadius: 5,
    alignItem: 'center',
    backgroundColor: theme.light.primaryColor,
    cursor: 'pointer',
  },
  activeButton: {
    backgroundColor: theme.light.secondaryColor,
  },
  icon: {
    width: 20,
    height: 20,
    color: theme.light.darkColor
  },
}))

const ToolConfigPopUpButton = (props) => {
  const classes = useStyles(props)
  const { name, component, children } = props

  const anchorRef = React.useRef(null);
  const [isActive, setIsActive] = React.useState(false)
  
  const handleClick = () => {
    setIsActive(value => !value)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setIsActive(false);
  };

  return (
    <>
    <Tooltip title={!isActive ? name : ''} placement="top">
        <div className={clsx(classes.button, isActive && classes.activeButton)} onClick={handleClick} ref={anchorRef}>
        <SvgIcon className={classes.icon}>
          {component}
        </SvgIcon>
      </div>
    </Tooltip>
      <Popper open={isActive} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 100 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                {children}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default ToolConfigPopUpButton
