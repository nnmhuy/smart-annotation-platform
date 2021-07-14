import RestConnector from '../connectors/RestConnector'

import AnnotationService from './AnnotationService'

import AnnotationObjectClass from '../classes/AnnotationObjectClass'


class AnnotationObjectService {
  async getAnnotationObjectsByData(dataId) {
    return Promise.all(RestConnector.get(`/annotation_objects?data_id=${dataId}`).data
      .map(async annotationObjectData => {
        let { annotations = [] } = annotationObjectData

        // parse annotations
        annotations = await Promise.all(annotations.map(async ann => await AnnotationService.parseAnnotationObj(ann)))

        AnnotationObjectClass.constructFromServerData({
          ...annotationObjectData,
          annotations
        })
      })
    )
  }

  async deleteAnnotationObjectById(id) {
    return RestConnector.delete(`/annotation_objects?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new AnnotationObjectService()