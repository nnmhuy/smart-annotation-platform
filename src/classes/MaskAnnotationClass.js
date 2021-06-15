import { ANNOTATION_TYPE } from "../pages/Annotation/constants";
import Annotation from "./AnnotationClass";

export default class MaskAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, mask) {
    super(annotationId, labelId, imageId)
    this.type = ANNOTATION_TYPE.MASK
    this.mask = mask
  }
  updateData = (data) => {
    const { mask } = data
    this.mask = mask
  }
}