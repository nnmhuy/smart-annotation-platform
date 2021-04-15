import React, { Component } from 'react'

import ToolboxButton from './ToolboxButton'
import BrushConfig from './BrushConfig'
import { MODES } from '../../constants'

import { ReactComponent as RectangleIcon } from './ToolboxIcon/rectangle.svg'
import { ReactComponent as PolygonIcon } from './ToolboxIcon/polygon.svg'
import { ReactComponent as PainBrushIcon } from './ToolboxIcon/paintbrush.svg'
import { ReactComponent as CursorIcon } from './ToolboxIcon/cursor.svg'
import { ReactComponent as EditIcon } from './ToolboxIcon/edit.svg'
import { ReactComponent as CutIcon } from './ToolboxIcon/cut.svg'
import { ReactComponent as DeleteIcon } from './ToolboxIcon/delete.svg'

import { get } from 'lodash'

const toolBoxButtons = [
  {
    name: 'Cursor',
    mode: MODES.CURSOR,
    component: <CursorIcon />,
  },
  {
    name: 'Edit',
    mode: MODES.EDIT,
    component: <EditIcon />,
  },
  {
    name: 'Rectangle',
    mode: MODES.DRAW_RECTANGLE,
    component: <RectangleIcon />,
  },
  {
    name: 'Polygon',
    mode: MODES.DRAW_POLYGON,
    component: <PolygonIcon />,
  },
  {
    name: 'Brush',
    mode: MODES.DRAW_POLYGON_BY_BRUSH,
    component: <PainBrushIcon />,
    configComponent: BrushConfig,
  },
  {
    name: 'Cut',
    mode: MODES.CUT,
    component: <CutIcon />
  },
  {
    name: 'Delete',
    mode: MODES.DELETE,
    component: <DeleteIcon />,
  },
]

export default class Toolbox extends Component {
  render() {
    const { 
      activeMode, setActiveMode,
      toolboxConfig, setToolboxConfig,
    } = this.props
    const ActiveConfigComponent = get(toolBoxButtons.find(btn => btn.mode === activeMode), 'configComponent', null)
    return (
      <>
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
        {ActiveConfigComponent && 
          <ActiveConfigComponent 
            toolboxConfig={toolboxConfig}
            setToolboxConfig={setToolboxConfig}
          />
        }
      </>
    )
  }
}