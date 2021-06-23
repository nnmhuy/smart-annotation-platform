import Annotation from "./AnnotationClass";

import { ANNOTATION_TYPE } from '../constants/constants'

export default class ScribbleToMaskAnnotationClass extends Annotation {
  constructor(annotationId, labelId, imageId, maskData) {
    super(annotationId, labelId, imageId)
    this.type = ANNOTATION_TYPE.MASK
    this.maskData = maskData
  }
  set updateData(newData) {
    this.maskData = {
      ...this.maskData,
      ...newData,
    }
  }
}