import React from 'react'

import { EVENT_TYPES } from '../../../../constants'


const EditPolygon = (props) => {
  const { useStore, eventCenter } = props
  const setEditingAnnotation = useStore(state => state.setEditingAnnotation)

  const handleEditPolygon = (data) => {
    setEditingAnnotation(data)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.EDIT_ANNOTATION]: getSubject(EVENT_TYPES.EDIT_ANNOTATION)
        .subscribe({ next: (data) => handleEditPolygon(data) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    null
  )
}

export default EditPolygon