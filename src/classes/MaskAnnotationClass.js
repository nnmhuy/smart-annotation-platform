import { get } from 'lodash'

import RestConnector from '../connectors/RestConnector'
import AnnotationClass from "./AnnotationClass";
import StorageFileClass from './StorageFileClass'

import sendFormData from '../utils/sendFormData'
import base64ToBlob from '../utils/base64ToBlob'
import { ANNOTATION_TYPE, ENUM_ANNOTATION_TYPE } from '../constants/constants'

export default class MaskAnnotation extends AnnotationClass {
  constructor(id, annotationObjectId, annotationImageId, maskData, key_frame=false) {
    super(id, annotationObjectId, annotationImageId, key_frame)

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
    return new MaskAnnotation(
      data.id,
      data.annotation_object,
      data.annotation_image,
      {
        scribbles: data.scribbles,
        mask: StorageFileClass.constructorFromServerData(data.mask),
        threshold: data.threshold,
      },
      data.key_frame
    )
  }

  async applyUpdate() {
    const maskData = this.maskData
    // const maskBlob = await base64ToBlob(get(this.maskData, 'mask', null))
    // const maskURL = await sendFormData({
    //   id: this.id,
    //   mask: maskBlob
    // }, '/annotations/upload-annotation-mask')
    // return await RestConnector.post('/annotations', {
    //   id: this.id,
    //   annotation_object_id: this.annotationObjectId,
    //   annotation_image_id: this.annotationImageId,
    //   annotation_type: ENUM_ANNOTATION_TYPE.MASK,
    //   key_frame: this.keyFrame,
    //   data: maskData,
    // })
  }
}