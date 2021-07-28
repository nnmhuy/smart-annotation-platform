import convertScribbleToBlob from './convertScribbleToBlob'
import resizeImage from '../../../../../../utils/resizeImage'
import base64ToBlob from '../../../../../../utils/base64ToBlob'

import { SCRIBBLE_TO_MASK_CONSTANTS } from '../../../../constants'
const { SCRIBBLE_TYPES } = SCRIBBLE_TO_MASK_CONSTANTS


class MiVOSScribbleToMaskBuilder {
  static INPUT_WIDTH = 768
  static INPUT_HEIGHT = 480

  constructor() {
    this.image = null
    this.p_srb = null
    this.n_srb = null
    this.mask = null
  }

  async setImage(image) {
    if (!image) {
      this.image = null
      return
    }
    const base64 = await image.original.getBase64()
    const blob = await resizeImage(base64, {
      maxWidth: MiVOSScribbleToMaskBuilder.INPUT_WIDTH,
      maxHeight: MiVOSScribbleToMaskBuilder.INPUT_HEIGHT
    }, true).then(({ img }) => base64ToBlob(img))
    this.image = blob
  }

  // experiment task from 50ms - 150ms
  async setScribbles(scribbles) {
    this.p_srb = await convertScribbleToBlob(scribbles, SCRIBBLE_TYPES.POSITIVE, {
      canvasWidth: MiVOSScribbleToMaskBuilder.INPUT_WIDTH,
      canvasHeight: MiVOSScribbleToMaskBuilder.INPUT_HEIGHT,
    })
    this.n_srb = await convertScribbleToBlob(scribbles, SCRIBBLE_TYPES.NEGATIVE, {
      canvasWidth: MiVOSScribbleToMaskBuilder.INPUT_WIDTH,
      canvasHeight: MiVOSScribbleToMaskBuilder.INPUT_HEIGHT,
    })
  }

  async setMask(mask) {
    if (!mask) {
      this.mask = null
      return
    }
    const blob = await resizeImage(mask, {
      maxWidth: MiVOSScribbleToMaskBuilder.INPUT_WIDTH,
      maxHeight: MiVOSScribbleToMaskBuilder.INPUT_HEIGHT
    }, true).then(({ img }) => base64ToBlob(img))
    this.mask = blob
  }

  getMiVOSScribbleToMaskInput() {
    return {
      image: this.image,
      p_srb: this.p_srb,
      n_srb: this.n_srb,
      mask: this.mask,
    }
  }
}

export default MiVOSScribbleToMaskBuilder