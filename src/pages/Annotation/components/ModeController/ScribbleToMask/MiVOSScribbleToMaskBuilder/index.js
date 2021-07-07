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
    const blob = await resizeImage(image.img, {
      maxWidth: MiVOSScribbleToMaskBuilder.INPUT_WIDTH,
      maxHeight: MiVOSScribbleToMaskBuilder.INPUT_HEIGHT
    }, true).then(({ img }) => base64ToBlob(img))
    this.image = {
      blob,
      imageWidth: image.originalWidth,
      imageHeight: image.originalHeight,
    }
  }

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
    this.mask = await base64ToBlob(mask)
  }

  getMiVOSScribbleToMaskInput() {
    return {
      image: this.image.blob,
      p_srb: this.p_srb,
      n_srb: this.n_srb,
      mask: this.mask,
    }
  }
}

export default MiVOSScribbleToMaskBuilder