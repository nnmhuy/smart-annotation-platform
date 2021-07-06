import Annotation from "./AnnotationClass";

import RestConnector from '../connectors/RestConnector'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from '../constants/constants'
import { get } from 'lodash'

export default class ScribbleToMaskAnnotationClass extends Annotation {
  constructor(annotationId, labelId, imageId, maskData, properties = {}) {
    super(annotationId, labelId, imageId, properties)
    this.type = ANNOTATION_TYPE.MASK
    this.maskData = maskData
  }


  set updateData(newData) {
    this.maskData = {
      ...this.maskData,
      ...newData,
    }
  }

  static constructorFromServerData(data) {
    return new ScribbleToMaskAnnotationClass(
      data.id,
      data.label,
      data.image,
      {
        scribbles: [],
        mask: {
          // TODO: load mask image from cloud, convert to base64
          originalBase64: get(data, 'mask', '')
        }
      },
      data.properties
    )
  }

  async applyUpdateAnnotation() {
    return await RestConnector.post('annotations', {
      id: this.id,
      annotation_type: ENUM_ANNOTATION_TYPE.MASK,
      label_id: this.labelId,
      image_id: this.imageId,
      properties: this.properties,
      data: {
        // TODO: upload mask (from base64 or blob field) and get URL back first
        mask: get(this.maskData, 'mask.originalBase64', null)
      },
    })
  }
}