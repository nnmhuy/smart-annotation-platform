import Annotation from "./AnnotationClass";

import RestConnector from '../connectors/RestConnector'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from '../constants/constants'

export default class BBoxAnnotation extends Annotation {
  constructor(annotationId, labelId = '', imageId = '', bBox, properties = {}) {
    super(annotationId, labelId, imageId, properties)
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
      data.label,
      data.image,
      {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
      },
      data.properties
    )
  }
  async applyUpdateAnnotation() {
    return await RestConnector.post('annotations', {
      id: this.id,
      annotation_type: ENUM_ANNOTATION_TYPE.BBOX,
      label_id: this.labelId,
      image_id: this.imageId,
      properties: this.properties,
      data: this.bBox,
    })
  }
}