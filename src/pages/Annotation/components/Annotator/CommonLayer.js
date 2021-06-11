import React from 'react'
import { Layer } from 'react-konva'

import Image from './KonvaImage'

// import {
//   MODES,
// } from '../../constants'

const CommonLayer = (props) => {
  const {
    // activeMode,
    image,
    isDraggingViewport,
  } = props

  const layerRef = React.useCallback(layer => {
    if (layer !== null) {
      // this is safe because not dependent on any state variables
    }
  }, []);

  return (
    <Layer
      id="common-layer"
      ref={layerRef}
    >
      {image &&
        <Image
          src={image.img}
          isDraggingViewport={isDraggingViewport}
        />
      }
    </Layer>
  )
}

export default CommonLayer