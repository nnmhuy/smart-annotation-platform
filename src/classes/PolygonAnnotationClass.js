import { ANNOTATION_TYPE } from "../constants/constants";
import Annotation from "./AnnotationClass";

export default class PolygonAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, polys) {
    super(annotationId, labelId, imageId)
    this.type = ANNOTATION_TYPE.POLYGON
    this.polys = polys
  }
  updateData = (data) => {
    const { polys } = data
    this.polys = polys
  }
}