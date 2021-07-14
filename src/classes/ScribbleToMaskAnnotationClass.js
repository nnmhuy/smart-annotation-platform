import Annotation from "./AnnotationClass";
import { get } from 'lodash'

import RestConnector from '../connectors/RestConnector'
import sendFormData from '../utils/sendFormData'
import base64ToBlob from '../utils/base64ToBlob'
import loadImageFromURL from '../utils/loadImageFromURL'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from '../constants/constants'

export default class ScribbleToMaskAnnotationClass extends Annotation {
  constructor(id, annotation_object_id, data_info = {}, maskData) {
    super(id, annotation_object_id, data_info)

    this.type = ANNOTATION_TYPE.MASK
    this.maskData = maskData
  }

  /**
   * mask: base64 of mask
   */
  set updateData(newData) {
    this.maskData = {
      ...this.maskData,
      ...newData,
    }
  }

  static async constructorFromServerData(data) {
    const loadedMask = await loadImageFromURL(get(data, 'mask', null))

    return new ScribbleToMaskAnnotationClass(
      data.id,
      data.annotation_object,
      data.data_info,
      {
        scribbles: [],
        mask: loadedMask.base64
      }
    )
  }

  async applyUpdateAnnotation() {
    const maskBlob = await base64ToBlob(get(this.maskData, 'mask', null))
    const maskURL = await sendFormData({
      id: this.id,
      mask: maskBlob
    }, '/annotations/upload-annotation-mask')
    return await RestConnector.post('/annotations', {
      id: this.id,
      annotation_object_id: this.annotation_object_id,
      annotation_type: ENUM_ANNOTATION_TYPE.MASK,
      data_info: this.data_info,
      data: {
        mask: maskURL
      },
    })
  }
}