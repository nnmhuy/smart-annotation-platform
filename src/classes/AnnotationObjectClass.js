export default class AnnotationObjectClass {
  constructor(id, dataInstanceId, labelId, properties = {}, attributes = {}) {
    this.id = id
    this.dataInstanceId = dataInstanceId
    this.labelId = labelId

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
      data.properties,
      data.attributes
    )
  }
}