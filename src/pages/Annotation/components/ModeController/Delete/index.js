import React from 'react'
import { cloneDeep, filter } from 'lodash';

import { EVENT_TYPES } from '../../../constants';

const Delete = (props) => {
  const { useStore, eventCenter } = props
  const getAnnotations = useStore(stage => stage.getAnnotations)
  const setAnnotations = useStore(stage => stage.setAnnotations)

  const handleDeleteAnnotation = ({ e, id: annotationId }) => {
    e.cancelBubble = true

    const annotations = getAnnotations()
    const newAnnotations = cloneDeep(filter(annotations, (ann) => ann.id !== annotationId))

    setAnnotations(newAnnotations)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.SELECT_ANNOTATION]: getSubject(EVENT_TYPES.SELECT_ANNOTATION)
        .subscribe({ next: (e) => handleDeleteAnnotation(e) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])


  return null
}

export default Delete