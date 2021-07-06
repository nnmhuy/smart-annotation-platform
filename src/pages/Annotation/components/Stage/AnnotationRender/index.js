import React from 'react'
import { find } from 'lodash'

import BBoxAnnotation from '../../../../../classes/BBoxAnnotationClass'
import PolygonAnnotation from '../../../../../classes/PolygonAnnotationClass'
import ScribbleToMaskAnnotation from '../../../../../classes/ScribbleToMaskAnnotationClass'

import BBox from './components/BBox/BBox'
import Polygon from './components/Polygon/Polygon'
import ScribbleToMask from './components/ScribbleToMask/Mask'


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
  const { useStore, eventCenter, annotations } = props

  return (
    annotations.map(ann => {
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