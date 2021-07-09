import React from 'react'
import { filter, cloneDeep, get, find } from 'lodash'


import BBoxAnnotation from '../../../../../classes/BBoxAnnotationClass'
import PolygonAnnotation from '../../../../../classes/PolygonAnnotationClass'
import ScribbleToMaskAnnotation from '../../../../../classes/ScribbleToMaskAnnotationClass'

import BBox from './components/BBox/BBox'
import Polygon from './components/Polygon/Polygon'
import ScribbleToMask from './components/ScribbleToMask/ScribbleAnnotation'


const mapAnnotationClassToRender = [
  {
    cls: BBoxAnnotation,
    render: BBox,
  },
  {
    cls: PolygonAnnotation,
    render: Polygon,
  },
  {
    cls: ScribbleToMaskAnnotation,
    render: ScribbleToMask,
  },
]


const AnnotationRender = (props) => {
  const { useStore, eventCenter } = props

  const annotations = useStore(state => state.annotations)
  const drawingAnnotation = useStore(state => state.drawingAnnotation)
  const labels = useStore(state => state.labels)


  let renderingAnnotations = [...annotations, drawingAnnotation].map((ann) => {
    if (ann === null) {
      return null
    }
    let renderAnn = cloneDeep(ann)
    const label = find(labels, { id: renderAnn.labelId })
    const labelAnnotationProperties = get(label, 'annotationProperties', {})
    renderAnn.updateProperties = {
      ...labelAnnotationProperties,
      isHidden: get(label, 'properties.isHidden', false) || get(renderAnn, 'properties.isHidden', false)
    }
    return renderAnn
  })

  // filter out hidden annotations and null drawingAnnotation
  renderingAnnotations = filter(renderingAnnotations, (ann) => ann && !ann.properties.isHidden)

  return (
    renderingAnnotations.map(ann => {
      const renderer = find(mapAnnotationClassToRender, (value => ann instanceof value.cls))
      if (renderer) {
        const RenderComponent = renderer.render
        return (
          <RenderComponent
            key={`annotation-${ann.id}`}
            useStore={useStore}
            eventCenter={eventCenter}
            annotation={ann}
          />
        )
      }
      return null
    })
  )
}

export default AnnotationRender