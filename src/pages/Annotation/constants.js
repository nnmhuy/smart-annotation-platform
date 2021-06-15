const MODES = {
  CURSOR: {
    name: 'CURSOR',
    cursor: 'pointer',
  },
  EDIT: {
    name: 'EDIT',
    cursor: 'default',
  },
  DRAW_BBOX: {
    name: 'DRAW_BBOX',
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

const EVENT_TYPES = {
  STAGE_MOUSE_CLICK: 'STAGE_MOUSE_CLICK',
  STAGE_MOUSE_DOWN: 'STAGE_MOUSE_DOWN',
  STAGE_MOUSE_UP: 'STAGE_MOUSE_UP',
  STAGE_MOUSE_MOVE: 'STAGE_MOUSE_MOVE',

  STAGE_MOUSE_OUT: 'STAGE_MOUSE_OUT',
  STAGE_MOUSE_ENTER: 'STAGE_MOUSE_ENTER',

  STAGE_TAP: 'STAGE_TAP',
  STAGE_TOUCH_START: 'STAGE_TOUCH_START',
  STAGE_TOUCH_END: 'STAGE_TOUCH_END',
  STAGE_TOUCH_MOVE: 'STAGE_TOUCH_MOVE',

  STAGE_CONTEXT_MENU: 'STAGE_CONTEXT_MENU',
}

const DEFAULT_SHAPE_ATTRS = {
  fill: 'green',
  opacity: 0.4,
  stroke: 'black',
  strokeWidth: 2,
}


export {
  MODES,
  EVENT_TYPES,

  DEFAULT_SHAPE_ATTRS,
}