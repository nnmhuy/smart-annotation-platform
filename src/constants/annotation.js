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
    DRAW_MASK_BRUSH: {
      name: 'DRAW_MASK_BRUSH',
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
  
    DRAW_MASK_BRUSH: {
      CHOOSE_POSITIVE_BRUSH: 'CHOOSE_POSITIVE_BRUSH',
      CHOOSE_NEGATIVE_BRUSH: 'CHOOSE_NEGATIVE_BRUSH',
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
  
      CHOOSE_POSITIVE_SCRIBBLE: 'CHOOSE_POSITIVE_SCRIBBLE',
      CHOOSE_NEGATIVE_SCRIBBLE: 'CHOOSE_NEGATIVE_SCRIBBLE',
      CHOOSE_ERASER_SCRIBBLE: 'CHOOSE_ERASER_SCRIBBLE',
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
  
      RULE_BASED_REFERRING_EXPRESSION_TO_MASK: 'RULE_BASED_REFERRING_EXPRESSION_TO_MASK',
      RULE_BASED_REFERRING_EXPRESSION_TO_MASK_FINISH: 'RULE_BASED_REFERRING_EXPRESSION_TO_MASK_FINISH',
      RULE_BASED_REFERRING_EXPRESSION_TO_MASK_ERROR: 'RULE_BASED_REFERRING_EXPRESSION_TO_MASK_ERROR',
  
      UPDATE_THRESHOLD: 'UPDATE_THRESHOLD',
    },
  
    PLAY_CONTROL: {
      GO_TO_FRAME: 'GO_TO_FRAME'
    },
  
    VIEW: {
      CENTER_VIEWPOINT: 'CENTER_VIEWPOINT'
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
  }
  
  const SCRIBBLE_TYPES = {
    POSITIVE: "POSITIVE",
    NEGATIVE: "NEGATIVE",
    ERASER: "ERASER"
  }
  
  const COLOR_BY_SCRIBBLE_TYPE = {
    [SCRIBBLE_TYPES.POSITIVE]: '#00FF00',
    [SCRIBBLE_TYPES.NEGATIVE]: '#FF0000',
    [SCRIBBLE_TYPES.ERASER]: '#000000',
  }
  
  const REFERRING_EXPRESSION_MODELS = {
    CMPC: "CMPC",
    RULE_BASED: "RULE_BASED"
  }
  
  const DEFAULT_TOOL_CONFIG = {
    [MODES.DRAW_MASK_BRUSH.name]: {
      scribbleSize: 20,
      scribbleType: SCRIBBLE_TYPES.POSITIVE,
    },
    [MODES.DRAW_MASK.name]: {
      scribbleSize: 20,
      scribbleType: SCRIBBLE_TYPES.POSITIVE,
      threshold: 20,
    },
    [MODES.REFERRING_EXPRESSION.name]: {
      model: REFERRING_EXPRESSION_MODELS.CMPC,
      threshold: 50,
    }
  }
  
  const MODEL_SERVER_URL_KEY = {
    S2M: 'S2M_SERVER_URL',
    CMPC: 'CMPC_SERVER_URL',
    REFEX_RULE: 'REFEX_RULE_SERVER_URL',
    MASK_PROP: 'MASKPROP_SERVER_URL'
  }
  
  const NUM_DISP_DATA_PER_PAGE = 50
  const NUM_ANNO_DATA_PER_PAGE = 5
  
  const PROPAGATION_DIRECTION = {
    FORWARD: 'Forward',
    BACKWARD: 'Backward',
  }
  
  export {
    MODES,
    EVENT_TYPES,
    DEFAULT_TOOL_CONFIG,
    
    STAGE_PADDING,
    MIN_ZOOM_SCALE,
    MAX_ZOOM_SCALE,
    NUM_DISP_DATA_PER_PAGE,
    NUM_ANNO_DATA_PER_PAGE,
  
    DEFAULT_ANNOTATION_ATTRS,
  
    SCRIBBLE_TO_MASK_CONSTANTS,
    SCRIBBLE_TYPES,
    COLOR_BY_SCRIBBLE_TYPE,
    
    PROPAGATION_DIRECTION,
    REFERRING_EXPRESSION_MODELS,
  
    MODEL_SERVER_URL_KEY
  }