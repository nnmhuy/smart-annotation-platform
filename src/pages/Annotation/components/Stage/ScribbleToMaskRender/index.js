import React from 'react'

import ScribbleAnnotation from './components/ScribbleAnnotation'

const BrushToMaskRender = (props) => {
  const { useStore, eventCenter, scribbleAnnotations } = props

  return (scribbleAnnotations.map(annotation =>
    <ScribbleAnnotation
      key={`scribble-to-mask-annotation-${annotation.id}`}
      useStore={useStore}
      eventCenter={eventCenter}
      id={annotation.id}
      maskData={annotation.maskData}
    />
  ))
}

export default BrushToMaskRender