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
  static constructorFromServerData(data) {
    return new LabelClass(
      data.id,
      data.label,
      data.properties,
      data.annotation_properties
    )
  }
}