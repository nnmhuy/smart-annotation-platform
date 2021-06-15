const backendURL = process.env.REACT_APP_BACKEND_URL

const ResponseCode = {
  SUCCESS: 'success',

  ERROR_PARAMS: 'error_params',
  ERROR_HEADER: 'error_header',
  ERROR_FORBIDDEN: 'error_forbidden',
}

const ANNOTATION_TYPE = {
  POLYGON: 'POLYGON',
  BBOX: 'BBOX',
  MASK: 'MASK',
}

export {
  backendURL,
  ResponseCode,

  ANNOTATION_TYPE,
}