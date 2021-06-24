import { ANNOTATION_TYPE } from "../constants/constants";
import Annotation from "./AnnotationClass";

export default class PolygonAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, polygon) {
    super(annotationId, labelId, imageId)
    this.type = ANNOTATION_TYPE.POLYGON
    this.polygon = polygon
  }
  set updateData(newPolygon) {
    this.polygon = {
      ...this.polygon,
      ...newPolygon,
    }
  }
}