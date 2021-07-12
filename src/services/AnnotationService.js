import RestConnector from '../connectors/RestConnector'

import BBoxAnnotationClass from '../classes/BBoxAnnotationClass'
import PolygonAnnotationClass from '../classes/PolygonAnnotationClass'
import ScribbleToMaskAnnotationClass from '../classes/ScribbleToMaskAnnotationClass'


class AnnotationService {
  async getAnnotationByImage(imageId) {
    const annotationResponse = await RestConnector.get(`/annotations?image_id=${imageId}`)

    const annotationsObj = await Promise.all(annotationResponse.data.map(async ann => {
      switch (ann._cls) {
        case "Annotation.BBoxAnnotation":
          return BBoxAnnotationClass.constructorFromServerData(ann)
        case "Annotation.PolygonAnnotation":
          return PolygonAnnotationClass.constructorFromServerData(ann)
        case "Annotation.MaskAnnotation":
          return await ScribbleToMaskAnnotationClass.constructorFromServerData(ann)
        default:
          return {}
      }
    }))

    return annotationsObj
  }
}

export default new AnnotationService()