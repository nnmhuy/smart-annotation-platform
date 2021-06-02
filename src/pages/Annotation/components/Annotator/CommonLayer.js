import React from 'react'
import { Layer } from 'react-konva'

import Image from './KonvaImage'
import Portal from './Portal'
import ClassSelectionPopover from './ClassSelectionPopover'

import {
  MODES,
} from '../../constants'

const CommonLayer = (props) => {
  const {
    activeMode,
    image,
    isDraggingViewport,
    isEmptyPosition,
  } = props

  const layerRef = React.useCallback(layer => {
    if (layer !== null) {
      // this is safe because not dependent on any state variables
    }
  }, []);

  const [contextMenuPosition, setContextMenuPosition] = React.useState(null)
  

  const handleLayerContextMenu = (e) => {
    if (e.manually_triggered) {
      // prevent propagate to stage click
      e.cancelBubble = true

      if (activeMode === MODES.EDIT) {
        if (!isEmptyPosition(e)) {
          setContextMenuPosition({
            x: e.evt.x,
            y: e.evt.y
          })
        }
      }
    }
  }

  return (
    <Layer
      id="common-layer"
      ref={layerRef}
      onContextMenu={handleLayerContextMenu}
    >
      {image &&
        <Image
          src={image.img}
          isDraggingViewport={isDraggingViewport}
        />
      }
      <Portal>
        <ClassSelectionPopover
          contextMenuPosition={contextMenuPosition}
          setContextMenuPosition={setContextMenuPosition}
        />
      </Portal>
    </Layer>
  )
}

export default CommonLayer