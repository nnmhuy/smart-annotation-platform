import React from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'

const KonvaImage = (props) => {
  const { src } = props
  const [image] = useImage(src)
  return (
    <Image image={image}/>
  )
}

export default KonvaImage