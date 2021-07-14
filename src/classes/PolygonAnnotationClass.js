import Annotation from "./AnnotationClass";

import RestConnector from '../connectors/RestConnector'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from "../constants/constants";

export default class PolygonAnnotation extends Annotation {
  constructor(id, annotation_object_id, data_info = {}, polygon) {
    super(id, annotation_object_id, data_info)

    this.type = ANNOTATION_TYPE.POLYGON
    this.polygon = polygon
  }
  /**
   * polys: array of polygon
   */
  set updateData(newPolygon) {
    this.polygon = {
      ...this.polygon,
      ...newPolygon,
    }
  }
  static constructorFromServerData(data) {
    return new PolygonAnnotation(
      data.id,
      data.annotation_object,
      data.data_info,
      {
        x: 0,
        y: 0,
        polys: data.polys
      }
    )
  }

  async applyUpdateAnnotation() {
    return await RestConnector.post('/annotations', {
      id: this.id,
      annotation_object_id: this.annotation_object_id,
      annotation_type: ENUM_ANNOTATION_TYPE.POLYGON,
      data_info: this.data_info,
      data: {
        polys: this.polygon.polys,
      }
    })
  }
}