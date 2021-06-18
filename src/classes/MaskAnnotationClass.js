import Annotation from "./AnnotationClass";

export default class MaskAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, mask) {
    super(annotationId, labelId, imageId)
    this.mask = mask
  }
  updateData = (data) => {
    const { mask } = data
    this.mask = mask
  }
}