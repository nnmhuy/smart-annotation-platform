import React, { useEffect } from 'react'

import KonvaImage from '../../../../../../components/KonvaImage'

const Video = (props) => {
  const { video, renderingSize } = props
  const { width, height } = renderingSize

  const [playingFrame, setPlayingFrame] = React.useState(0)
  const [bitmap, setBitmap] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const { fps } = video
    const playVideoInterval = setInterval(() => {
      while (loading) {
      }
      setPlayingFrame(x => {
        return (x === video.numFrames - 1) ? 0 : x + 1
      })
    }, 1000 / fps);

    return () => {
      clearInterval(playVideoInterval);
    }
  }, [])


  React.useEffect(() => {
    const getBitmap = async () => {
      setLoading(true)
      const bmp = await video.frames[playingFrame].original.getBitmap()
      setBitmap(bmp)
      setLoading(false)
    }

    getBitmap()
  }, [playingFrame])

  return (video ?
    <KonvaImage
      bitmap={bitmap}
      width={width}
      height={height}
    />
    : null
  )
}

export default Video