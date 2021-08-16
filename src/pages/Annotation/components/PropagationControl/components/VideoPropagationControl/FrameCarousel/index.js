import React, { useRef, useEffect, useState, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { CarouselProvider, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';


import EventCenter from '../../../../../EventCenter'
import { useGeneralStore } from '../../../../../stores';

import { EVENT_TYPES } from '../../../../../constants'

import FrameItem from './FrameItem'

const useStyles = makeStyles(theme => ({
  sliderRoot: {
    width: '100%',
  },
  slider:{
    overflow: 'visible'
  }
}))

const SLIDE_WIDTH = 40

const FrameCarousel = (props) => {
  const classes = useStyles()
  const sliderRef = useRef(null)

  const stageSize = useGeneralStore(state => state.stageSize)
  const visibleSlides = useMemo(() => {
    let slots = Math.round((stageSize.width - SLIDE_WIDTH) / SLIDE_WIDTH)
    if (slots % 2 === 0) slots -= 1
    return slots
  }, [stageSize])

  const { playingFrame, annotations } = props

  const handleGoToFrame = (index) => {
    EventCenter.emitEvent(EVENT_TYPES.PLAY_CONTROL.GO_TO_FRAME)(index)
  }
  
  const [sliderPadLeft, setSliderPadLeft] = useState('0px')
  useEffect(() => {
    if (sliderRef?.current) {
      const { slideSize, slideTraySize, visibleSlides } = sliderRef?.current?.carouselStore?.state
      setSliderPadLeft(`calc(${slideTraySize}% * (${slideSize} * ${Math.round((visibleSlides - 1) / 2)} / 100))`)
    }
  }, [sliderRef?.current?.carouselStore?.state])
  
  return (
    <CarouselProvider
      className={classes.sliderRoot}
      currentSlide={playingFrame}
      naturalSlideHeight={50}
      naturalSlideWidth={SLIDE_WIDTH}
      totalSlides={annotations.length}
      visibleSlides={visibleSlides}
      isIntrinsicHeight={true}
      disableAnimation={true}
      ref={sliderRef}
    >
      <Slider 
        className={classes.slider}
        style={{ left: sliderPadLeft }}
      >
        {annotations.map((ann, index) => {
          return (
            <FrameItem
              key={index}
              index={index}
              isActive={playingFrame === index}
              isKeyFrame={ann?.keyFrame}
              hasAnnotation={!!ann}
              onFocus={() => handleGoToFrame(index)}
              onClick={() => handleGoToFrame(index)}
            />
          )
        })
        }
      </Slider>
    </CarouselProvider>
  );
}

export default FrameCarousel