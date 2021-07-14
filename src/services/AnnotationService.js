import RestConnector from '../connectors/RestConnector'

import DataInfoService from './DataInfoService'

import BBoxAnnotationClass from '../classes/BBoxAnnotationClass'
import PolygonAnnotationClass from '../classes/PolygonAnnotationClass'
import ScribbleToMaskAnnotationClass from '../classes/ScribbleToMaskAnnotationClass'


class AnnotationService {
  async parseAnnotationObj(ann) {
    const { data_info = {} } = ann
    ann.data_info = DataInfoService.parseDataInfoObj(data_info)
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
  }

  async getAnnotationByData(dataId) {
    const annotationResponse = await RestConnector.get(`/annotations?data_id=${dataId}`)

    const annotationsObj = await Promise.all(annotationResponse.data.map(async ann => await this.parseAnnotationObj(ann)))

    return annotationsObj
  }

  async deleteAnnotationById(id) {
    return RestConnector.delete(`/annotations?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new AnnotationService()