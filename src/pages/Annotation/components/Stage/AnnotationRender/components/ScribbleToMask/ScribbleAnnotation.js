import React from 'react'
import { Group } from 'react-konva'
import { get } from 'lodash'

import Scribble from './Scribble'
import Mask from './Mask'

import { EVENT_TYPES } from '../../../../../constants'
import thresholdMask from '../../../../../utils/thresholdMask'
import hexColorToRGB from '../../../../../../../utils/hexColorToRGB'

const MaskAnnotation = (props) => {
  const { annotation , useStore, eventCenter } = props

  const { id, properties, maskData } = annotation

  const [displayMask, setDisplayMask] = React.useState(null)

  const editingAnnotationId = useStore(state => state.editingAnnotationId)
  const image = useStore(state => state.image)

  const isSelected = (id === editingAnnotationId)
  
  const scribbles = maskData.scribbles

  const mask = maskData.mask
  let threshold = get(properties, 'threshold', 0)
  let color = get(properties, 'fill', '')

  React.useEffect(() => {
    async function getThresholdImage() {
      if (image && mask) {
        const thresholdedMask = await thresholdMask(mask, threshold, {
          color: hexColorToRGB(color),
          canvasWidth: image.width,
          canvasHeight: image.height
        })
        setDisplayMask(thresholdedMask)
      } else {
        setDisplayMask(null)
      }
    }
    getThresholdImage();
  }, [mask, image, threshold, color])


  const handleSelectMask = (e) => {
    eventCenter.emitEvent(EVENT_TYPES.SELECT_ANNOTATION)({ e, id })
  }

  const handleContextMenu = (e) => {
    eventCenter.emitEvent(EVENT_TYPES.CONTEXT_MENU_ANNOTATION)({
      e,
      id
    })
  }

  return (
    <Group
      id={id}
    >
      {scribbles.map((scribble, index) => 
        <Scribble 
          key={`scribble-${id}-${index}`} scribble={scribble}
          imageWidth={image.width}
          imageHeight={image.height}
        />
        )}
      <Mask
        isSelected={isSelected}
        mask={displayMask}
        handleSelectMask={handleSelectMask}
        handleContextMenu={handleContextMenu}
        imageWidth={image.width}
        imageHeight={image.height}
      />
    </Group>
  )
}

export default MaskAnnotation