import RestConnector from "../connectors/RestConnector"

export default class LabelClass {
  constructor(labelId = '', label = '', projectId = '', properties = {}, annotationProperties = {}) {
    this.id = labelId
    this.label = label
    this.projectId = projectId
    this.properties = properties
    this.annotationProperties = annotationProperties
  }

  static constructorFromServerData(data) {
    return new LabelClass(
      data.id,
      data.label,
      data.project,
      data.properties,
      data.annotation_properties
    )
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

  async applyCreateLabel() {
    return await RestConnector.post('/annotation_labels', {
      label: this.label,
      project_id: this.projectId,
      properties: this.properties,
      annotation_properties: this.annotationProperties
    })
  }

  async applyUpdateLabel() {
    return await RestConnector.put('/annotation_labels', {
      id: this.id,
      label: this.label,
      properties: this.properties,
      annotation_properties: this.annotationProperties
    })
  }

  async applyDeleteLabel () {
    return await RestConnector.delete(`/annotation_labels?id=${this.id}`)
  }
}