import { merge } from 'lodash'
import Annotation from "./AnnotationClass";

export default class ScribbleToMaskAnnotationClass extends Annotation {
  constructor(annotationId, labelId, imageId, maskData) {
    super(annotationId, labelId, imageId)
    this.maskData = maskData
  }
  set updateData(newData) {
    this.maskData = {
      ...this.maskData,
      ...newData,
    }
  }
}