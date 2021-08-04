import React, { useRef, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Slider from "react-slick";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import EventCenter from '../../../../../EventCenter'
import { useDatasetStore } from '../../../../../stores';

import { EVENT_TYPES } from '../../../../../constants'

import FrameItem from './FrameItem'

const useStyles = makeStyles(theme => ({
  sliderRoot: {
    width: '100%',
  }
}))

const FrameCarousel = (props) => {
  const classes = useStyles()
  const sliderRef = useRef(null)

  const isPlaying = useDatasetStore(state => state.isPlaying)

  const { playingFrame, annotations } = props

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(playingFrame, true)
    }
  }, [playingFrame])

  const handleGoToFrame = (index) => {
    EventCenter.emitEvent(EVENT_TYPES.PLAY_CONTROL.GO_TO_FRAME)(index)
  }

  const [allowChange, setAllowChange] = useState(!isPlaying)
  useEffect(() => {
    setTimeout(() => {
      setAllowChange(!isPlaying)
    }, 500)
  }, [isPlaying])

  const settings = {
    className: classes.sliderRoot,
    centerMode: true,
    arrows: false,
    dots: false,
    infinite: true,
    focusOnSelect: true,
    slidesToShow: 5, // TODO: calculate base on element width and frame item size
    swipe: true,
    swipeToSlide: true,
    speed: 0,
    easing: 'none',
    useCSS: false,
    useTransform: false,
    beforeChange: allowChange? (_, newIndex) => {
      handleGoToFrame(newIndex) 
    } : undefined
  }

  return (
    <Slider
      ref={sliderRef}
      {...settings}
    >
      {annotations.map((ann, index) => {
        return (
          <FrameItem
            key={index}
            index={index}
            isActive={playingFrame === index}
            isKeyFrame={ann?.keyFrame}
            hasAnnotation={!!ann}
            // onClick={() => handleGoToFrame(index)}
          />
        )
      })
      }
    </Slider>
  );
}

export default FrameCarousel