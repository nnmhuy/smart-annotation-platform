import React from 'react'
import { Group } from 'react-konva'
import { get } from 'lodash'

import Scribble from './Scribble'
import Mask from './Mask'

import thresholdMask from '../../../../utils/thresholdMask'

const MaskAnnotation = (props) => {
  const { id, maskData, useStore } = props

  const [displayMask, setDisplayMask] = React.useState(null)

  const image = useStore(state => state.image)
  const scribbles = maskData.scribbles
  // TODO: threshold + change color of mask
  const mask = maskData.mask
  let maskImage = get(mask, 'base64', null)
  let threshold = get(mask, 'threshold', 0)

  React.useEffect(() => {
    async function getThresholdImage() {
      if (maskImage) {
        const thresholdedMask = await thresholdMask(maskImage, threshold, {
          canvasWidth: image.width,
          canvasHeight: image.height
        })
        setDisplayMask(thresholdedMask)
      }
    }
    getThresholdImage();
  }, [maskImage, image.width, image.height, threshold])
  
  const isMovingViewport = useStore(state => state.isMovingViewport)

  return (
    <Group
      id={id}
    >
      {scribbles.map((scribble, index) => <Scribble key={`scribble-${id}-${index}`} scribble={scribble}/>)}
      <Mask
        mask={displayMask}
        isMovingViewport={isMovingViewport}
      />
    </Group>
  )
}

export default MaskAnnotation