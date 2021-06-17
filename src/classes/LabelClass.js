export default class LabelClass {
  constructor(labelId, label, properties) {
    this.id = labelId
    this.label = label
    this.properties = properties
  }
  set updateProperties(properties) {
    this.properties = {
      ...this.properties,
      ...properties
    }
  }
}