import React from 'react'

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'
import sendFormData from '../../../../../utils/sendFormData'
import bufferArrayToBase64 from '../../../../../utils/bufferArrayToBase64'


const MiVOSScribbleToMask = (props) => {
  /**
   * 
   * @param {object} data - image, p_srb, n_srb, mask (optional)
   * @returns 
   */
  const handleScribbleToMask = async (data) => {
    const predictedMask = await sendFormData(
      '/s2m/predict',
      data,
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
      EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT_ERROR)()
      return;
    }

    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT_FINISH)({
      base64: predictedMask,
    })
  }

  React.useEffect(() => {
    const { getSubject } = EventCenter
    let subscriptions = {
      [EVENT_TYPES.DRAW_MASK.MI_VOS_S2M]: getSubject(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M)
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