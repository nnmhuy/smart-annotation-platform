import React from 'react'
import { get } from 'lodash'

import { EVENT_TYPES, SCRIBBLE_TO_MASK_CONSTANTS } from '../../../constants'
import base64ToBlob from '../../../../../utils/base64ToBlob'
import blobToBase64 from '../../../../../utils/blobToBase64'
import sendFormData from '../../../../../utils/sendFormData'
import bufferArrayToBase64 from '../../../../../utils/bufferArrayToBase64'
import convertScribbleToBlob from './convertScribbleToBlob'

const { SCRIBBLE_TYPES } = SCRIBBLE_TO_MASK_CONSTANTS


const MiVOSScribbleToMask = (props) => {
  const { eventCenter } = props

  const handleScribbleToMask = async ({ image, annotation }) => {
    const imageWidth = get(image, 'width', 0)
    const imageHeight = get(image, 'height', 0)
    const canvasWidth = get(image, 'originalWidth', 0)
    const canvasHeight = get(image, 'originalHeight', 0)

    const imgBlob = image.blob
    const scribbles = annotation.maskData.scribbles

    const p_srb = await convertScribbleToBlob(scribbles, SCRIBBLE_TYPES.POSITIVE, {
      canvasWidth,
      canvasHeight,
    })
    const n_srb = await convertScribbleToBlob(scribbles, SCRIBBLE_TYPES.NEGATIVE, {
      canvasWidth,
      canvasHeight,
    })

    console.log(await blobToBase64(p_srb))
    console.log(await blobToBase64(n_srb))

    const mask = await base64ToBlob(annotation.maskData.mask.originalBase64)

    const predictedMask = await sendFormData(
      {
        image: imgBlob,
        p_srb,
        n_srb,
        mask
      },
      's2m/predict',
      {
        responseType: "arraybuffer"
      }
    )
      .then(async (newMask) => {
        return bufferArrayToBase64(newMask, "image/jpeg")
      })
      .catch((err) => {
        console.log(err)
        return null
      })

    if (!predictedMask) {
      eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT_ERROR)()
      return;
    }

    eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT_FINISH)({
      base64: predictedMask,
    })
  }

  React.useEffect(() => {
    const { getSubject } = eventCenter
    let subscriptions = {
      [EVENT_TYPES.SCRIBBLE_TO_MASK.MI_VOS_S2M]: getSubject(EVENT_TYPES.SCRIBBLE_TO_MASK.MI_VOS_S2M)
        .subscribe({ next: (data) => handleScribbleToMask(data) }),
    }

    return () => {
      Object.keys(subscriptions).forEach(subscription => subscriptions[subscription].unsubscribe())
    }
  }, [])
  return (
    null
  )
}

export default MiVOSScribbleToMask