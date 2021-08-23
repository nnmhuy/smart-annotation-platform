import React from 'react'
import { Group } from 'react-konva'
import { get } from 'lodash'

import EventCenter from '../../../../../EventCenter'
import { useAnnotationStore } from '../../../../../stores/index'

import Scribble from './Scribble'
import Mask from './Mask'

import { EVENT_TYPES } from '../../../../../constants'

const MaskAnnotation = (props) => {
  const { annotation, renderingSize } = props

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)

  const { id, annotationObjectId, properties, maskData } = annotation

  const imageWidth = get(renderingSize, 'width', 1)
  const imageHeight = get(renderingSize, 'height', 1)

  const isSelected = (annotationObjectId === selectedObjectId)

  const { mask, scribbles, threshold } = maskData
  const displayMask = get(mask, 'bitmap', null)
  
  let color = get(properties, 'fill', '')
  let opacity = get(properties, 'opacity', 0.2)

  const handleSelectMask = (e) => {
    EventCenter.emitEvent(EVENT_TYPES.SELECT_ANNOTATION)({ e, id, annotationObjectId })
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
        maskBmp={displayMask}
        color={color}
        opacity={opacity}
        handleSelectMask={handleSelectMask}
        handleContextMenu={handleContextMenu}
        threshold={threshold}
      />
    </Group>
  )
}

export default MaskAnnotation