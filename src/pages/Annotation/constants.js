const MODES = {
  CURSOR: {
    name: 'CURSOR',
    cursor: 'pointer',
  },
  EDIT: {
    name: 'EDIT',
    cursor: 'default',
  },
  DRAW_RECTANGLE: {
    name: 'DRAW_RECTANGLE',
    cursor: 'crosshair'
  },
  DRAW_POLYGON: {
    name: 'DRAW_POLYGON',
    cursor: 'crosshair',
  },
  DRAW_POLYGON_BY_BRUSH: {
    name: 'DRAW_POLYGON_BY_BRUSH',
    cursor: 'crosshair',
  },
  CUT: {
    name: 'CUT_POLYGON',
    cursor: 'nw-resize'
  },
  DELETE: {
    name: 'DELETE',
    cursor: 'not-allowed'
  },
}

const MANUAL_EVENTS = {
  RESET_ALL_STATE: "RESET_ALL_STATE",

  LAYER_MOUSE_CLICK: "LAYER_MOUSE_CLICK",
  LAYER_MOUSE_MOVE: "LAYER_MOUSE_MOVE",
}

const ANNOTATION_SHAPE_LIST = {
  RECTANGLE: ['Rect'],
  POLYGON: ['Path'],
}

const DEFAULT_SHAPE_ATTRS = {
  fill: 'green',
  opacity: 0.4,
  stroke: 'black',
  strokeWidth: 2,
}

const MAX_BRUSH_SIZE = 20
const MIN_BRUSH_SIZE = 1

const MIN_ZOOM_SCALE = 0.5
const MAX_ZOOM_SCALE = 5

export {
  MODES,
  MANUAL_EVENTS,

  DEFAULT_SHAPE_ATTRS,
  ANNOTATION_SHAPE_LIST,

  MAX_BRUSH_SIZE,
  MIN_BRUSH_SIZE,

  MIN_ZOOM_SCALE,
  MAX_ZOOM_SCALE,
}