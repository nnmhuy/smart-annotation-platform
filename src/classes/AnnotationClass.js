import RestConnector from '../connectors/RestConnector'
export default class Annotation {
  constructor(annotationId, labelId, imageId, properties) {
    this.id = annotationId
    this.labelId = labelId
    this.imageId = imageId
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

  async applyUpdateAnnotation() {
    // abstract function to be implemented in child classes
  }
  async applyDeleteAnnotation() {    
    RestConnector.delete(`annotations?id=${this.id}`)
  }
}