import Annotation from "./AnnotationClass";

import { ANNOTATION_TYPE } from '../constants/constants'

export default class BBoxAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, bBox, properties = {}) {
    super(annotationId, labelId, imageId, properties)
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