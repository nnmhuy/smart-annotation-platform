import Annotation from "./AnnotationClass";

import RestConnector from '../connectors/RestConnector'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from '../constants/constants'

export default class BBoxAnnotation extends Annotation {
  constructor(id, annotation_object_id, data_info = {}, bBox) {
    super(id, annotation_object_id, data_info)

    this.type = ANNOTATION_TYPE.BBOX
    this.bBox = bBox
  }
  /**
   * x, y
   * width, height
   */
  set updateData(data) {
    this.bBox = {
      ...this.bBox,
      ...data
    }
  }
  static constructorFromServerData(data) {
    return new BBoxAnnotation(
      data.id,
      data.annotation_object,
      data.data_info,
      {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
      }
    )
  }
  async applyUpdateAnnotation() {
    return await RestConnector.post('/annotations', {
      id: this.id,
      annotation_object_id: this.annotation_object_id,
      annotation_type: ENUM_ANNOTATION_TYPE.BBOX,
      data_info: this.data_info,
      data: this.bBox
    })
  }
}