import React, { Component } from 'react'

import ToolboxButton from './ToolboxButton'
import { MODES } from '../../constants'

import {ReactComponent as RectangleIcon} from './ToolboxIcon/rectangle.svg'
import {ReactComponent as PolygonIcon} from './ToolboxIcon/polygon.svg'
import {ReactComponent as EditIcon} from './ToolboxIcon/edit.svg'
import {ReactComponent as DragIcon} from './ToolboxIcon/drag.svg'
import {ReactComponent as CutIcon} from './ToolboxIcon/cut.svg'
import {ReactComponent as DeleteIcon} from './ToolboxIcon/delete.svg'

// const toolBoxButtons = [
//   { 
//     name: 'Polygon', 
//     handleClick: map => () => map.pm.Toolbar.buttons.drawPolygon._triggerClick(),
//     getStatus: map => () => map && map.pm.Toolbar.buttons.drawPolygon.toggled(),
//     component: <PolygonIcon />,
//   },
//   {
//     name: 'Rectangle',
//     handleClick: map => () => map.pm.Toolbar.buttons.drawRectangle._triggerClick(),
//     getStatus: map => () => map && map.pm.Toolbar.buttons.drawRectangle.toggled(),
//     component: <RectangleIcon />,
//   },
//   {
//     name: 'Edit',
//     handleClick: map => () => map.pm.Toolbar.buttons.editMode._triggerClick(),
//     getStatus: map => () => map && map.pm.Toolbar.buttons.editMode.toggled(),
//     component: <EditIcon />,
//   },
//   {
//     name: 'Drag',
//     handleClick: map => () => map.pm.Toolbar.buttons.dragMode._triggerClick(),
//     getStatus: map => () => map && map.pm.Toolbar.buttons.dragMode.toggled(),
//     component: <DragIcon />,
//   },
//   {
//     name: 'Cut',
//     handleClick: map => () => map.pm.Toolbar.buttons.cutPolygon._triggerClick(),
//     getStatus: map => () => map && map.pm.Toolbar.buttons.cutPolygon.toggled(),
//     component: <CutIcon />,
//   },
//   {
//     name: 'Delete',
//     handleClick: map => () => map.pm.Toolbar.buttons.removalMode._triggerClick(),
//     getStatus: map => () => map && map.pm.Toolbar.buttons.removalMode.toggled(),
//     component: <DeleteIcon />,
//   },
// ]

const toolBoxButtons = [
  {
    name: 'Cursor',
    mode: MODES.CURSOR,
    component: <EditIcon />,
  },
  { 
    name: 'Rectangle',
    mode: MODES.DRAW_RECTANGLE,
    component: <RectangleIcon />,
  },
]

export default class Toolbox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { activeMode, setActiveMode } = this.props
    return (
      <div>
        {
          toolBoxButtons.map((btn) => {
            const { name, component, mode, } = btn
            return (
              <ToolboxButton
                key={`toolbox-button-${name}`}
                name={name}
                handleClick={() => setActiveMode(mode)}
                isActive={mode === activeMode}
                component={component}
              />
            )
          })
        }
      </div>
    )
  }
}