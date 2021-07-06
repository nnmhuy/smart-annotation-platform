import Annotation from "./AnnotationClass";

import RestConnector from '../connectors/RestConnector'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from "../constants/constants";

export default class PolygonAnnotation extends Annotation {
  constructor(annotationId, labelId, imageId, polygon, properties = {}) {
    super(annotationId, labelId, imageId, properties)
    this.type = ANNOTATION_TYPE.POLYGON
    this.polygon = polygon
  }
  set updateData(newPolygon) {
    this.polygon = {
      ...this.polygon,
      ...newPolygon,
    }
  }
  static constructorFromServerData(data) {
    return new PolygonAnnotation(
      data.id,
      data.label,
      data.image,
      {
        x: 0,
        y: 0,
        polys: data.polys
      },
      data.properties
    )
  }

  async applyUpdateAnnotation() {
    return await RestConnector.post('annotations', {
      id: this.id,
      annotation_type: ENUM_ANNOTATION_TYPE.POLYGON,
      label_id: this.labelId,
      image_id: this.imageId,
      properties: this.properties,
      data: {
        polys: this.polygon.polys,
      }
    })
  }
}