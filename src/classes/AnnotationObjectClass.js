import RestConnector from '../connectors/RestConnector'
import generateNewUid from '../utils/uidGenerator'

export default class AnnotationObjectClass {
  constructor(id = '', dataInstanceId, labelId, annotationType, properties = {}, attributes = {}) {
    this.id = id || generateNewUid()
    this.dataInstanceId = dataInstanceId
    this.labelId = labelId
    this.annotationType = annotationType

    this.properties = {
      ...properties,
      isHidden: false
    }
    this.attributes = attributes
  }

  set updateLabel(labelId) {
    this.labelId = labelId
  }
  set updateProperties(newProperties) {
    this.properties = {
      ...this.properties,
      ...newProperties,
    }
  }

  static constructFromServerData(data) {
    return new AnnotationObjectClass(
      data.id,
      data.data_instance,
      data.label,
      data.annotation_type,
      data.properties,
      data.attributes
    )
  }

  async applyUpdate() {
    return await RestConnector.post('/annotation_objects', {
      id: this.id,
      data_instance_id: this.dataInstanceId,
      label_id: this.labelId,
      annotation_type: this.annotationType,
      properties: this.properties,
      attributes: this.attributes
    })
  }
}