
import React, { Component } from 'react'

import ToolboxButton from './ToolboxButton'
import {theme} from '../../../../theme'
import {MODE} from '../../../../constant'

import {CursorIcon, PolygonIcon, RectangleIcon} from './ToolboxIcon'

const styles = {
  toolboxWrapper: {
    backgroundColor: theme.light.backgroundColor
  }
}
export default class Toolbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentMode: MODE.CURSOR
    }

  }
  render() {
    return (
      <div style={styles.toolboxWrapper}>
        <ToolboxButton
          mode={MODE.CURSOR}
          onClickHandler={this.changeMode}
          currentMode={this.state.currentMode}
          component={CursorIcon}
        />
        <ToolboxButton
          mode={MODE.RECTANGLE}
          onClickHandler={this.changeMode}
          currentMode={this.state.currentMode}
          component={RectangleIcon}
        />
        <ToolboxButton
          mode={MODE.POLYGON}
          onClickHandler={this.changeMode}
          currentMode={this.state.currentMode}
          component={PolygonIcon}
        />
      </div>
    )
  }
  changeMode = (mode) => {
    const {handleChangeMode} = this.props
    this.setState({currentMode: mode})
    if (handleChangeMode)
      handleChangeMode(mode)
  }
}