export default class Annotation {
  constructor(annotationId, labelId, imageId) {
    this.id = annotationId
    this.labelId = labelId
    this.imageId = imageId
  }
  updateLabel = (labelId) => {
    this.labelId = labelId
  }
  updateData = () => {
  }
}