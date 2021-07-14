export default class Annotation {
  constructor(id, annotation_object_id, data_info) {
    this.id = id
    this.annotation_object_id = annotation_object_id
    this.data_info = data_info
  }

  async applyUpdateAnnotation() {
    // abstract function to be implemented in child classes
  }
}