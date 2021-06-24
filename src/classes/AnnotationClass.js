export default class Annotation {
  constructor(annotationId, labelId, imageId) {
    this.id = annotationId
    this.labelId = labelId
    this.imageId = imageId
    this.properties = {
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
}