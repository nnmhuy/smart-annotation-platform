import Annotation from "./AnnotationClass";

export default class BBoxAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, bBox) {
    super(annotationId, labelId, imageId)
    this.bBox = bBox
  }
  set updateData(data) {
    this.bBox = {
      ...this.bBox,
      ...data
    }
  }
}