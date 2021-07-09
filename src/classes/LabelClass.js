import RestConnector from "../connectors/RestConnector"

export default class LabelClass {
  constructor(labelId, label, properties = {}, annotationProperties = {}) {
    this.id = labelId
    this.label = label
    this.properties = properties
    this.annotationProperties = annotationProperties
  }
  set updateProperties(properties) {
    this.properties = {
      ...this.properties,
      ...properties
    }
  }
  set updateAnnotationProperties(annotationProperties) {
    this.annotationProperties = {
      ...this.annotationProperties,
      ...annotationProperties,
    }
  }

  async applyUpdateLabel() {
    return await RestConnector.put('/annotation_labels', {
      id: this.id,
      label: this.label,
      properties: this.properties,
      annotation_properties: this.annotationProperties
    })
  }

  static constructorFromServerData(data) {
    return new LabelClass(
      data.id,
      data.label,
      data.properties,
      data.annotation_properties
    )
  }
}