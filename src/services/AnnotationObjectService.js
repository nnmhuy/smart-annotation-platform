import RestConnector from '../connectors/RestConnector'

import AnnotationObjectClass from '../classes/AnnotationObjectClass'


class AnnotationObjectService {
  async getAnnotationObjectsByDataInstance(dataInstanceId) {
    return RestConnector.get(`/annotation_objects?data_instance_id=${dataInstanceId}`)
      .then(response => 
        response.data.map(annotationObjectData => AnnotationObjectClass.constructFromServerData(annotationObjectData))
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