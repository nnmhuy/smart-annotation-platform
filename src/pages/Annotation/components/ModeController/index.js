import React, { useEffect } from 'react'
import { find, get } from 'lodash'

import Cursor from './Cursor/index'
import Edit from './Edit/index'
import DrawBBox from './DrawBBox/index'
// import DrawPolygon from './DrawPolygon/index'
// import CutPolygon from './CutPolygon/index'
// import ScribbleToMask from './ScribbleToMask/index'
// import Delete from './Delete/index'

import { MODES } from '../../constants'
import { ENUM_ANNOTATION_TYPE }from '../../../../constants/constants'

import { useGeneralStore, useAnnotationStore } from '../../stores/index'

const mapModeToComponent = {
  [MODES.CURSOR.name]: Cursor,
  [MODES.EDIT.name]: Edit,
  [MODES.DRAW_BBOX.name]: DrawBBox,
  // [MODES.DRAW_POLYGON.name]: DrawPolygon,
  // [MODES.SCRIBBLE_TO_MASK.name]: ScribbleToMask,
  // [MODES.CUT_POLYGON.name]: CutPolygon,
  // [MODES.DELETE.name]: Delete,
}

const mapAnnotationTypeToMode = {
  [ENUM_ANNOTATION_TYPE.BBOX]: MODES.DRAW_BBOX.name,
  [ENUM_ANNOTATION_TYPE.POLYGON]: MODES.DRAW_POLYGON.name,
  [ENUM_ANNOTATION_TYPE.MASK]: MODES.SCRIBBLE_TO_MASK.name,
}

const ModeController = (props) => {
  const activeMode = useGeneralStore(state => state.activeMode)
  const setActiveMode = useGeneralStore(state => state.setActiveMode)
  const ActiveModeComponent = get(mapModeToComponent, activeMode, null)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const annotationObjects = useAnnotationStore(state => state.annotationObjects)
  useEffect(() => {
    if (!selectedObjectId) {
      setActiveMode(MODES.EDIT.name)
    } else {
      const annotationObject = find(annotationObjects, { id: selectedObjectId})
      setActiveMode(mapAnnotationTypeToMode[annotationObject.annotationType])
    }
  }, [selectedObjectId])

  return ([
    <Cursor key="cursor-handler" {...props}/>,
    ActiveModeComponent && <ActiveModeComponent key="mode-handler" {...props}/>
  ])
}

export default ModeController