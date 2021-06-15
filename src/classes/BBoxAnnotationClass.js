import { ANNOTATION_TYPE } from "../pages/OldAnnotation/constants";
import Annotation from "./AnnotationClass";

export default class BBoxAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, bBox) {
    super(annotationId, labelId, imageId)
    this.type = ANNOTATION_TYPE.BBOX
    this.bBox = bBox
  }
  set updateData(data) {
    this.bBox = {
      ...this.bBox,
      ...data
    }
  }
}