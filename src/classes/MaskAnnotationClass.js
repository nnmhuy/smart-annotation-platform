import { cloneDeep } from 'lodash'

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

  async setMaskBase64(base64) {
    const blob = await base64ToBlob(base64)
    const uploadMaskData = await sendFormData('/annotations/upload-annotation-mask',{
      id: this.id,
      mask: blob
    })
    const maskFile = StorageFileClass.constructorFromServerData(uploadMaskData)
    maskFile.blob = blob
    maskFile.base64 = base64
    await maskFile.getBitmap()
    this.updateData = {
      mask: maskFile
    }
  }

  static async constructorFromServerData(data) {
    const maskFile = StorageFileClass.constructorFromServerData(data.mask)
    await maskFile.getBitmap()
    return new MaskAnnotation(
      data.id,
      data.annotation_object,
      data.annotation_image,
      {
        scribbles: data.scribbles,
        mask: maskFile,
        threshold: data.threshold,
      },
      data.key_frame
    )
  }

  async applyUpdate() {
    let maskData = cloneDeep(this.maskData)
    if (!maskData.mask.URL) {
      delete maskData.mask
    }
    if (maskData.mask) {
      maskData.mask = {
        filename: maskData.mask.filename,
        URL: maskData.mask.URL
      }
    }
    return await RestConnector.post('/annotations', {
      id: this.id,
      annotation_object_id: this.annotationObjectId,
      annotation_image_id: this.annotationImageId,
      annotation_type: ENUM_ANNOTATION_TYPE.MASK,
      key_frame: this.keyFrame,
      data: maskData
    })
  }
}