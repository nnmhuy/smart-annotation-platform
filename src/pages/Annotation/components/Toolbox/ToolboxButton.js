import React, { PureComponent } from 'react'
import { makeStyles, SvgIcon } from '@material-ui/core'
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
    color: props => isSelected(props) ? theme.light.secondaryColor : theme.light.darkColor
  }
}))

export default function ToolboxButton(props) {
    const classes = useStyles(props)
    return (
      <div>
        <div className={classes.button} onClick={() => props.onClickHandler(props.mode)}>
          <SvgIcon className={classes.icon}>
            {props.component}
          </SvgIcon>
        </div>
      </div>
    )
}
