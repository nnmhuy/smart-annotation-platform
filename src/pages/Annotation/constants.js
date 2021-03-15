import {
  ViewMode,

  DrawPolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleMode,

  CompositeMode,
  TranslateMode,
  ModifyMode
} from 'nebula.gl'

const CUSTOM_MODIFY_MODE = new CompositeMode([new TranslateMode(), new ModifyMode()])

const ALL_MODES = [
  {
    category: 'View',
    modes: [
      { label: 'View', mode: ViewMode },
    ],
  },
  {
    category: 'Draw',
    modes: [
      { label: 'Draw Polygon', mode: DrawPolygonMode },
      { label: 'Draw Polygon By Dragging', mode: DrawPolygonByDraggingMode },
      { label: 'Draw Rectangle', mode: DrawRectangleMode },
    ],
  },
  {
    category: 'Alter',
    modes: [
      { label: 'Modify', mode: CUSTOM_MODIFY_MODE }
    ],
  },
];

export {
  ALL_MODES,
  CUSTOM_MODIFY_MODE
}