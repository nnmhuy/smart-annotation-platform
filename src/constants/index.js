const backendURL = process.env.REACT_APP_BACKEND_URL

const ResponseCode = {
  SUCCESS: 'success',

  ERROR_PARAMS: 'error_params',
  ERROR_HEADER: 'error_header',
  ERROR_FORBIDDEN: 'error_forbidden',
}


const ANNOTATION_TYPE = {
  BBOX: 'BBOX',
  POLYGON: 'POLYGON',
  MASK: 'MASK',
}

const ENUM_ANNOTATION_TYPE = {
  BBOX: 1,
  POLYGON: 2,
  MASK: 3,
}

const ENUM_ANNOTATE_STATUS = {
  FINSIHED: 1,
  UNFINISHED: 2,
  UNCERTAIN: 3,
}

const DATASET_DATATYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
}

// Number data display in dataset management
const NUM_DISP_DATA_PER_PAGE = 50
// Number data display in annotation page
const NUM_ANNO_DATA_PER_PAGE = 5

export {
  backendURL,
  ResponseCode,

  ANNOTATION_TYPE,
  ENUM_ANNOTATION_TYPE,
  DATASET_DATATYPE,
  ENUM_ANNOTATE_STATUS,

  NUM_DISP_DATA_PER_PAGE,
  NUM_ANNO_DATA_PER_PAGE,
}
