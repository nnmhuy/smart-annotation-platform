const MODES = {
  CURSOR: {
    name: 'CURSOR',
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
  DELETE: {
    name: 'DELETE',
    cursor: 'not-allowed'
  },
}

const DEFAULT_SHAPE_ATTRS = {
  fill: 'green',
  opacity: 0.4,
  stroke: 'black',
  strokeWidth: 3,
}

export {
  MODES,
  DEFAULT_SHAPE_ATTRS,
}