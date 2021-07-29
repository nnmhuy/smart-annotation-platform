import React from 'react'
import { filter, cloneDeep, get, find } from 'lodash'

import BBoxAnnotation from '../../../../../classes/BBoxAnnotationClass'
import PolygonAnnotation from '../../../../../classes/PolygonAnnotationClass'
import MaskAnnotation from '../../../../../classes/MaskAnnotationClass'

import BBox from './components/BBox/BBox'
import Polygon from './components/Polygon/Polygon'
import Mask from './components/Mask/MaskAnnotation'

import { useGeneralStore, useDatasetStore, useAnnotationStore } from '../../../stores/index'


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
    cls: MaskAnnotation,
    render: Mask,
  },
]


const AnnotationRender = (props) => {
  const renderingSize = useGeneralStore(state => state.renderingSize)

  const currentAnnotationImageId = useDatasetStore(state => state.currentAnnotationImageId)

  const annotations = useAnnotationStore(state => state.annotations[currentAnnotationImageId] || [])
  
  const annotationObjects = useAnnotationStore(state => state.annotationObjects)
  const drawingAnnotation = useAnnotationStore(state => state.drawingAnnotation)
  const labels = useAnnotationStore(state => state.labels)

  let renderingAnnotations = [...annotations, drawingAnnotation].map((ann) => {
    if (ann === null) {
      return null
    }
    let renderAnn = cloneDeep(ann)
    const annObject = find(annotationObjects, { id: renderAnn.annotationObjectId })
    if (!annObject) {
      return null
    }

    const label = find(labels, { id: annObject.labelId })

    const labelAnnotationProperties = get(label, 'annotationProperties', {})
    renderAnn.annotationType = annObject.annotationType
    renderAnn.properties = {
      ...annObject.properties,
      ...labelAnnotationProperties,
      isHidden: get(label, 'properties.isHidden', false) || get(annObject, 'properties.isHidden', false)
    }
    return renderAnn
  })

  // filter out hidden annotations and null drawingAnnotation
  renderingAnnotations = filter(renderingAnnotations, (ann) => ann && !ann?.properties?.isHidden)
  return (
    renderingAnnotations.map(ann => {
      const renderer = find(mapAnnotationClassToRender, (value => ann instanceof value.cls))
      if (renderer) {
        const RenderComponent = renderer.render
        return (
          <RenderComponent
            key={`annotation-${ann.id}`}
            annotation={ann}
            renderingSize={renderingSize}
          />
        )
      }
      return null
    })
  )
}

export default AnnotationRender