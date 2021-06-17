import React from 'react'

import LabelSelectionPopover from './components/LabelSelectionPopover'

import { EVENT_TYPES } from '../../constants'

const LabelSelection = (props) => {
  const { useStore, eventCenter } = props

  const [isOpenLabelSelection, setIsOpenLabelSelection] = React.useState(false)
  const setEditingAnnotationLabelId = useStore(state => state.setEditingAnnotationLabelId)
  const setEditingAnnotationId = useStore(state => state.setEditingAnnotationId)
  const currentMousePosition = useStore(state => state.currentMousePosition)
  const updateCurrentMousePosition = useStore(state => state.updateCurrentMousePosition)
  const labels = useStore(state => state.labels)

  const handleFinishAnnotation = (annotationId) => {
    updateCurrentMousePosition()
    setEditingAnnotationId(annotationId)
    setIsOpenLabelSelection(true)
  }

  const handleSelectLabel = (newLabelId) => {
    setEditingAnnotationLabelId(newLabelId)
  }

  const handleClose = () => {
    setEditingAnnotationId(null)
    setIsOpenLabelSelection(false)
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.FINISH_ANNOTATION]: getSubject(EVENT_TYPES.FINISH_ANNOTATION)
        .subscribe({ next: (annotationId) => handleFinishAnnotation(annotationId) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])

  return (
    isOpenLabelSelection ?
      <LabelSelectionPopover
        contextMenuPosition={currentMousePosition}
        labels={labels}
        handleSelectLabel={handleSelectLabel}
        handleClose={handleClose}
      />
      : null
  )
}

export default LabelSelection