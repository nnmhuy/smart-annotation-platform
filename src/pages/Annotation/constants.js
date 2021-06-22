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
  SCRIBBLE_TO_MASK: {
    name: 'SCRIBBLE_TO_MASK',
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

  SELECT_ANNOTATION: 'SELECT_ANNOTATION',
  EDIT_ANNOTATION: 'EDIT_ANNOTATION',
  FINISH_ANNOTATION: 'FINISH_ANNOTATION',
  CONTEXT_MENU_ANNOTATION: 'CONTEXT_MENU_ANNOTATION',

  MOUSE_OVER_POLYGON_START: 'MOUSE_OVER_POLYGON_START',

  SCRIBBLE_TO_MASK: {
    PREDICT: 'PREDICT',
    MI_VOS_S2M: 'MI_VOS_S2M'
  }
}

const DEFAULT_ANNOTATION_ATTRS = {
  fill: 'green',
  opacity: 0.4,
  stroke: 'black',
  strokeWidth: 2,
}

const STAGE_PADDING = 50

const SCRIBBLE_TO_MASK_CONSTANTS = {
  MAX_SCRIBBLE_SIZE: 100,
  MIN_SCRIBBLE_SIZE: 10,
  SCRIBBLE_TYPES: {
    POSITIVE: "POSITIVE",
    NEGATIVE: "NEGATIVE",
    ERASER: "ERASER"
  },


}
const COLOR_BY_SCRIBBLE_TYPE = {
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.POSITIVE]: 'green',
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.NEGATIVE]: 'red',
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER]: 'black',
}

const DEFAULT_TOOL_CONFIG = {
  [MODES.SCRIBBLE_TO_MASK.name]: {
    scribbleSize: 20,
    scribbleType: SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.POSITIVE,
    threshold: 0.5,
  }
}



export {
  MODES,
  EVENT_TYPES,
  DEFAULT_TOOL_CONFIG,
  
  STAGE_PADDING,

  DEFAULT_ANNOTATION_ATTRS,

  SCRIBBLE_TO_MASK_CONSTANTS,
  COLOR_BY_SCRIBBLE_TYPE,
}