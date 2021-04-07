import React from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'

const KonvaImage = (props) => {
  const { src } = props
  const [image] = useImage(src)
  return (
    <Image image={image} offsetX={0} offsetY={0}/>
  )
}

export default KonvaImage