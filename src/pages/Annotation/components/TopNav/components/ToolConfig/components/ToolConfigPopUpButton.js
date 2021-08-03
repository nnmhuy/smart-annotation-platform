import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, SvgIcon } from '@material-ui/core'
import clsx from 'clsx'


const useStyles = makeStyles(theme => ({
  button: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.lighter,
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: theme.palette.secondary.lighter
    }
  },
  activeButton: {
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  icon: {
    width: 20,
    height: 20,
    color: theme.palette.primary.darker
  },
}))

const ToolConfigPopUpButton = (props) => {
  const classes = useStyles(props)
  const { name, component, children, ...others } = props

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
        <IconButton
          size="medium" className={clsx(classes.button, isActive && classes.activeButton)}
          onClick={handleClick}
          ref={anchorRef}
          {...others}
        >
          <SvgIcon className={classes.icon}>
            {component}
          </SvgIcon>
        </IconButton>
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
