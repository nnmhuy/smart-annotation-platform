import RestConnector from '../connectors/RestConnector'

import AnnotationObjectClass from '../classes/AnnotationObjectClass'


class AnnotationObjectService {
  async getAnnotationObjectsByDataInstance(dataInstanceId) {
    return RestConnector.get(`/annotation_objects?data_instance_id=${dataInstanceId}`)
      .then(response => 
        response.data.map(annotationObjectData => AnnotationObjectClass.constructorFromServerData(annotationObjectData))
      )
  }

  async postAnnotationObject(annotationObject) {
    return await RestConnector.post('/annotation_objects', {
      id: annotationObject.id,
      data_instance_id: annotationObject.dataInstanceId,
      label_id: annotationObject.labelId,
      annotation_type: annotationObject.annotationType,
      properties: annotationObject.properties,
      attributes: annotationObject.attributes
    })
  }

  async deleteAnnotationObjectById(id) {
    return RestConnector.delete(`/annotation_objects?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new AnnotationObjectService()