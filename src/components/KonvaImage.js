import React from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'

const KonvaImage = (props) => {
  const { bitmap, src, isMovingViewport, cache, hitFromCache, ...others } = props
  const [image] = useImage(src)

  const drawHitFromCache = (img) => {
    try {
      if (img && (src || bitmap)) {
        if (cache) img.cache();
        if (hitFromCache) img.drawHitFromCache();
      }
    } catch (error) {
    }
  };

  return (
    <Image 
      ref={(node) => { drawHitFromCache(node); }}
      image={bitmap || image} offsetX={0} offsetY={0}
      hitFunc={isMovingViewport && function () {
        // disable hitFunc while dragging viewport
      }}
      {...others}
    />
  )
}

export default KonvaImage