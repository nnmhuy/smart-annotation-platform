import React, { Component } from 'react'

import ToolboxButton from './ToolboxButton'
import {MODE} from '../../../../constant'

import {ReactComponent as RectangleIcon} from './ToolboxIcon/rectangle.svg'
import {ReactComponent as PolygonIcon} from './ToolboxIcon/polygon.svg'
import {ReactComponent as CursorIcon} from './ToolboxIcon/cursor.svg'
export default class Toolbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentMode: MODE.CURSOR
    }

  }
  render() {
    return (
      <div>
        <ToolboxButton
          mode={MODE.CURSOR}
          onClickHandler={this.changeMode}
          currentMode={this.state.currentMode}
          component={<CursorIcon/>}
        />
        <ToolboxButton
          mode={MODE.RECTANGLE}
          onClickHandler={this.changeMode}
          currentMode={this.state.currentMode}
          component={<RectangleIcon/>}
        />
        <ToolboxButton
          mode={MODE.POLYGON}
          onClickHandler={this.changeMode}
          currentMode={this.state.currentMode}
          component={<PolygonIcon/>}
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