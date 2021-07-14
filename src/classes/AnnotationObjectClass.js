export default class AnnotationObjectClass {
  constructor(id, dataId, labelId, properties = {}, annotations = []) {
    this.id = id
    this.dataId = dataId
    this.labelId = labelId

    this.annotations = annotations
    this.properties = {
      ...properties,
      isHidden: false
    }
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
      data.data,
      data.label,
      data.properties,
      data.annotations
    )
  }
}