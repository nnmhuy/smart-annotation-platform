import React from 'react'
import { find } from 'lodash'

import EditBBox from './EditHandler/EditBBox';
import EditPolygon from './EditHandler/EditPolygon';

import { EVENT_TYPES } from '../../../constants';
import BBoxAnnotation from '../../../../../classes/BBoxAnnotationClass';
import PolygonAnnotation from '../../../../../classes/PolygonAnnotationClass';

const mapAnnotationClassToEditHandler = [
  { annotationClass: BBoxAnnotation, handler: EditBBox, },
  { annotationClass: PolygonAnnotation, handler: EditPolygon, },
]

const Edit = (props) => {
  const { useStore, eventCenter } = props
  const annotations = useStore(state => state.annotations)
  const editingAnnotationId = useStore(stage => stage.editingAnnotationId)
  const setEditingAnnotationId = useStore(stage => stage.setEditingAnnotationId)

  const handleSelectAnnotation = ({e, id: annotationId }) => {
    e.cancelBubble = true
    setEditingAnnotationId(annotationId)
  }

  const handleStageClick = (e) => {
    setEditingAnnotationId(null)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.SELECT_ANNOTATION]: getSubject(EVENT_TYPES.SELECT_ANNOTATION)
        .subscribe({ next: (e) => handleSelectAnnotation(e) }),
      [EVENT_TYPES.STAGE_MOUSE_CLICK]: getSubject(EVENT_TYPES.STAGE_MOUSE_CLICK)
        .subscribe({ next: (e) => handleStageClick(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])


  const editingAnnotation = find(annotations, { id: editingAnnotationId })
  const activeEditHandlerElement = find(mapAnnotationClassToEditHandler, ({ annotationClass }) => (editingAnnotation instanceof annotationClass))
  const ActiveEditHandler = activeEditHandlerElement ? activeEditHandlerElement.handler : null

  return (ActiveEditHandler ? 
    <ActiveEditHandler
      useStore={useStore}
      eventCenter={eventCenter}
    />
    : null
  )
}

export default Edit