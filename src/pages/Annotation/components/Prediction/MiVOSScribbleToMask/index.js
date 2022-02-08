import React from 'react'

import EventCenter from '../../../EventCenter'

import { EVENT_TYPES } from '../../../constants'
import sendFormData from '../../../../../utils/sendFormData'
import {MODEL_SERVER_URL_KEY} from '../../../constants'


const MiVOSScribbleToMask = (props) => {
  /**
   * 
   * @param {object} data - image, p_srb, n_srb, mask (optional)
   * @returns 
   */
  const handleScribbleToMask = async (data) => {
    const server_url = localStorage.getItem(MODEL_SERVER_URL_KEY.S2M) || ''
    if (server_url)
      data['server_url'] = server_url
    const predictedMask = await sendFormData(
      '/s2m/predict',
      data
    )
      .catch((err) => {
        console.log(err)
        return null
      })

    if (!predictedMask) {
      EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_ERROR)()
      return;
    }

    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.MI_VOS_S2M_FINISH)(predictedMask)
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