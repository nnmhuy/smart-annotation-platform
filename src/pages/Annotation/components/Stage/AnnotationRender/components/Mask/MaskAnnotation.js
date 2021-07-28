import React from 'react'
import { Group } from 'react-konva'
import { get, debounce } from 'lodash'

import EventCenter from '../../../../../EventCenter'
import { useAnnotationStore } from '../../../../../stores/index'

import Scribble from './Scribble'
import Mask from './Mask'

import { EVENT_TYPES } from '../../../../../constants'
import hexColorToRGB from '../../../../../../../utils/hexColorToRGB'

const MaskAnnotation = (props) => {
  const { annotation, renderingSize } = props

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)

  const { id, annotationObjectId, properties, maskData } = annotation

  const imageWidth = get(renderingSize, 'width', 1)
  const imageHeight = get(renderingSize, 'height', 1)

  const [displayMask, setDisplayMask] = React.useState(null)

  const isSelected = (annotationObjectId === selectedObjectId)

  const { mask, scribbles, threshold } = maskData

  let color = get(properties, 'fill', '')

  React.useEffect(() => {
    async function getThresholdImage() {
      if (mask) {
        const maskBase64 = await mask.getBase64()
        setDisplayMask(maskBase64)
      } else {
        setDisplayMask(null)
      }
    }

    const debounced = debounce(getThresholdImage, 100)
    debounced()
    return () => {
      debounced.cancel()
    }
  }, [mask])


  const handleSelectMask = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.SELECT_ANNOTATION)({ e, id })
  }

  const handleContextMenu = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.CONTEXT_MENU_ANNOTATION)({
      e,
      id
    })
  }

  return (
    <Group
      id={id}
    >
      {isSelected && scribbles &&
        scribbles.map((scribble, index) =>
          <Scribble
            key={`scribble-${id}-${index}`} scribble={scribble}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
        )
      }
      <Mask
        isSelected={isSelected}
        mask={displayMask}
        color={hexColorToRGB(color)}
        handleSelectMask={handleSelectMask}
        handleContextMenu={handleContextMenu}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        threshold={threshold}
      />
    </Group>
  )
}

export default MaskAnnotation