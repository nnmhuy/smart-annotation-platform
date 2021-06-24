import React from 'react'

import ToolboxButton from './ToolboxButton'
import { MODES } from '../../constants'

import { ReactComponent as RectangleIcon } from '../../../../static/images/icons/ToolboxIcon/rectangle.svg'
import { ReactComponent as PolygonIcon } from '../../../../static/images/icons/ToolboxIcon/polygon.svg'
import { ReactComponent as PainBrushIcon } from '../../../../static/images/icons/ToolboxIcon/paintbrush.svg'
import { ReactComponent as CursorIcon } from '../../../../static/images/icons/ToolboxIcon/cursor.svg'
import { ReactComponent as EditIcon } from '../../../../static/images/icons/ToolboxIcon/edit.svg'
import { ReactComponent as CutIcon } from '../../../../static/images/icons/ToolboxIcon/cut.svg'
import { ReactComponent as DeleteIcon } from '../../../../static/images/icons/ToolboxIcon/delete.svg'

const toolBoxButtons = [
  {
    name: 'Cursor',
    mode: MODES.CURSOR.name,
    component: <CursorIcon />,
  },
  {
    name: 'Edit',
    mode: MODES.EDIT.name,
    component: <EditIcon />,
  },
  {
    name: 'Rectangle',
    mode: MODES.DRAW_BBOX.name,
    component: <RectangleIcon />,
  },
  {
    name: 'Polygon',
    mode: MODES.DRAW_POLYGON.name,
    component: <PolygonIcon />,
  },
  {
    name: 'Scribble',
    mode: MODES.SCRIBBLE_TO_MASK.name,
    component: <PainBrushIcon />,
  },
  {
    name: 'Cut',
    mode: MODES.CUT_POLYGON.name,
    component: <CutIcon />
  },
  {
    name: 'Delete',
    mode: MODES.DELETE.name,
    component: <DeleteIcon />,
  },
]

const Toolbox = (props) => {
  const { useStore } = props
  const activeMode = useStore(state => state.activeMode)
  const setActiveMode = useStore(state => state.setActiveMode)
  return (
    <div>
      {
        toolBoxButtons.map((btn) => {
          const { name, component, mode, } = btn
          return (
            <ToolboxButton
              key={`toolbox-button-${mode}`}
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

export default Toolbox