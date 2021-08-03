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
  DRAW_MASK: {
    name: 'DRAW_MASK',
    cursor: 'crosshair',
  },
  REFERRING_EXPRESSION: {
    name: 'REFERRING_EXPRESSION',
    cursor: 'text',
  },
  CUT_POLYGON: {
    name: 'CUT_POLYGON',
    cursor: 'nw-resize'
  },
  DELETE: {
    name: 'DELETE',
    cursor: 'not-allowed'
  },
}

const EVENT_TYPES = {
  STAGE_DRAG_START: 'STAGE_DRAG_START',
  STAGE_DRAG_MOVE: 'STAGE_DRAG_MOVE',
  STAGE_DRAG_END: 'STAGE_DRAG_END',

  STAGE_MOUSE_CLICK: 'STAGE_MOUSE_CLICK',
  STAGE_MOUSE_DOWN: 'STAGE_MOUSE_DOWN',
  STAGE_MOUSE_UP: 'STAGE_MOUSE_UP',
  STAGE_MOUSE_MOVE: 'STAGE_MOUSE_MOVE',
  STAGE_WHEEL: 'STAGE_WHEEL',

  STAGE_MOUSE_OUT: 'STAGE_MOUSE_OUT',
  STAGE_MOUSE_ENTER: 'STAGE_MOUSE_ENTER',

  STAGE_TAP: 'STAGE_TAP',
  STAGE_TOUCH_START: 'STAGE_TOUCH_START',
  STAGE_TOUCH_END: 'STAGE_TOUCH_END',
  STAGE_TOUCH_MOVE: 'STAGE_TOUCH_MOVE',

  STAGE_CONTEXT_MENU: 'STAGE_CONTEXT_MENU',

  RESIZE_STAGE: 'RESIZE_STAGE',

  SELECT_ANNOTATION: 'SELECT_ANNOTATION',
  EDIT_ANNOTATION: 'EDIT_ANNOTATION',
  COMMIT_EDIT_ANNOTATION: 'COMMIT_EDIT_ANNOTATION',
  FINISH_ANNOTATION: 'FINISH_ANNOTATION',
  CONTEXT_MENU_ANNOTATION: 'CONTEXT_MENU_ANNOTATION',

  MOUSE_OVER_POLYGON_START: 'MOUSE_OVER_POLYGON_START',

  UNSELECT_CURRENT_ANNOTATION_OBJECT: 'UNSELECT_CURRENT_ANNOTATION_OBJECT',

  EDIT: {
    DELETE_ANNOTATION: 'DELETE_ANNOTATION',
  },

  BBOX: {
    CANCEL_DRAWING_BBOX: 'CANCEL_DRAWING_BBOX',
  },

  POLYGON: {
    REMOVE_LAST_DRAWN_POINT: 'REMOVE_LAST_DRAWN_POINT',
    CANCEL_DRAWING_POLYGON: 'CANCEL_DRAWING_POLYGON',
  },

  DRAW_MASK: {
    PREDICT: 'PREDICT',
    PREDICT_ERROR: 'PREDICT_ERROR',
    PREDICT_FINISH: 'PREDICT_FINISH',
    CLEAR_ALL_SCRIBBLES: 'CLEAR_ALL_SCRIBBLES',
    UPDATE_THRESHOLD: 'UPDATE_THRESHOLD',
    MI_VOS_S2M: 'MI_VOS_S2M',
    MI_VOS_S2M_FINISH: 'MI_VOS_S2M_FINISH',
    MI_VOS_S2M_ERROR: 'MI_VOS_S2M_ERROR',
  },

  REFERRING_EXPRESSION: {
    PREDICT: 'PREDICT',
    PREDICT_FINISH: 'PREDICT_FINISH',
    PREDICT_ERROR: 'PREDICT_ERROR',
    FOCUS_TEXT_INPUT: 'FOCUS_TEXT_INPUT',
    REFERRING_EXPRESSION_CHANGE: 'REFERRING_EXPRESSION_CHANGE',
    CMPC_REFERRING_EXPRESSION_TO_MASK: 'CMPC_REFERRING_EXPRESSION_TO_MASK',
    CMPC_REFERRING_EXPRESSION_TO_MASK_FINISH: 'CMPC_REFERRING_EXPRESSION_TO_MASK_FINISH',
    CMPC_REFERRING_EXPRESSION_TO_MASK_ERROR: 'CMPC_REFERRING_EXPRESSION_TO_MASK_ERROR',
  }
}

const DEFAULT_ANNOTATION_ATTRS = {
  fill: '#00FF00',
  opacity: 0.4,
  stroke: '#000000',
  strokeWidth: 2,
}

const STAGE_PADDING = 50
const MIN_ZOOM_SCALE = 0.5
const MAX_ZOOM_SCALE = 5

const SCRIBBLE_TO_MASK_CONSTANTS = {
  MAX_SCRIBBLE_SIZE: 100,
  MIN_SCRIBBLE_SIZE: 1,
  SCRIBBLE_TYPES: {
    POSITIVE: "POSITIVE",
    NEGATIVE: "NEGATIVE",
    ERASER: "ERASER"
  },
}

const COLOR_BY_SCRIBBLE_TYPE = {
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.POSITIVE]: '#00FF00',
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.NEGATIVE]: '#FF0000',
  [SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER]: '#000000',
}

const DEFAULT_TOOL_CONFIG = {
  [MODES.DRAW_MASK.name]: {
    scribbleSize: 20,
    scribbleType: SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.POSITIVE,
    threshold: 20,
  }
}

const DATA_PER_PAGE = 50
const IMAGES_PER_PAGE = 50

export {
  MODES,
  EVENT_TYPES,
  DEFAULT_TOOL_CONFIG,
  
  STAGE_PADDING,
  MIN_ZOOM_SCALE,
  MAX_ZOOM_SCALE,
  DATA_PER_PAGE,
  IMAGES_PER_PAGE,

  DEFAULT_ANNOTATION_ATTRS,

  SCRIBBLE_TO_MASK_CONSTANTS,
  COLOR_BY_SCRIBBLE_TYPE,
}