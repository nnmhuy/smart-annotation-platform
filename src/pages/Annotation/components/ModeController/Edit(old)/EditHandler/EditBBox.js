import React from 'react'

import { EVENT_TYPES } from '../../../../constants'


const EditBBox = (props) => {
  const { useStore, eventCenter } = props
  const setEditingAnnotation = useStore(state => state.setEditingAnnotation)
  
  const handleEditBBox = (data, commitAnnotation=false) => {
    setEditingAnnotation(data, commitAnnotation)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.EDIT_ANNOTATION]: getSubject(EVENT_TYPES.EDIT_ANNOTATION)
        .subscribe({ next: (data) => handleEditBBox(data) }),
      [EVENT_TYPES.COMMIT_EDIT_ANNOTATION]: getSubject(EVENT_TYPES.COMMIT_EDIT_ANNOTATION)
        .subscribe({ next: (data) => handleEditBBox(data, true) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    null
  )
}

export default EditBBox