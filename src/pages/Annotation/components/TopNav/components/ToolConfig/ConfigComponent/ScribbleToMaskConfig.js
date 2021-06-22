import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import ToolSelector from '../ToolSelector'
import ToolConfigPopUpButton from '../ToolConfigPopUpButton'
import ToolConfigButton from '../ToolConfigButton'
import Slider from '../../../../../../../components/Slider'

import { ReactComponent as PositiveScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/positive_scribble.svg'
import { ReactComponent as NegativeScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/negative_scribble.svg'
import { ReactComponent as EraserIcon } from '../../../../../../../static/images/icons/ConfigIcon/eraser.svg'
import { ReactComponent as SizeSliderIcon } from '../../../../../../../static/images/icons/ConfigIcon/size_slider.svg'
import { ReactComponent as S2MIcon } from '../../../../../../../static/images/icons/ConfigIcon/s2m.svg'


import { SCRIBBLE_TO_MASK_CONSTANTS, EVENT_TYPES } from '../../../../../constants'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: '80%',
  },
  optionContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  sliderContainer: {
    width: 150,
    marginLeft: 20,
  },
  scribbleSizeInput: {
    width: 70,
    '& .MuiOutlinedInput-input': {
      padding: 10,
    },
    '& .MuiInputAdornment-positionEnd': {
      marginLeft: 0,
    }
  },
  popUpContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  }
}))

const scribbleToMaskTools = [
  {
    tool: SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.POSITIVE,
    name: 'Positive scribble',
    component: <PositiveScribbleIcon/>
  },
  {
    tool: SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.NEGATIVE,
    name: 'Negative scribble',
    component: <NegativeScribbleIcon />
  },
  {
    tool: SCRIBBLE_TO_MASK_CONSTANTS.SCRIBBLE_TYPES.ERASER,
    name: 'Eraser',
    component: <EraserIcon />
  },
]


const ScribbleToMaskConfig = (props) => {
  const classes = useStyles()
  const { eventCenter, toolConfig, setToolConfig, } = props
  const { scribbleSize, } = toolConfig

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <ToolSelector
          activeTool={toolConfig.scribbleType}
          toolList={scribbleToMaskTools}
          onSelect={(tool) => setToolConfig({ ...toolConfig, scribbleType: tool })}
        />
      </div>
      <Divider orientation="vertical" className={classes.divider}/>
      <div className={classes.optionContainer}>
        <ToolConfigPopUpButton
          name={'Scribble size'}
          component={<SizeSliderIcon/>}
        >
          <div className={classes.popUpContainer}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={scribbleSize}
              onChange={(e) => setToolConfig({ ...toolConfig, scribbleSize: Math.max(Math.min(Number(e.target.value), SCRIBBLE_TO_MASK_CONSTANTS.MAX_SCRIBBLE_SIZE), SCRIBBLE_TO_MASK_CONSTANTS.MIN_SCRIBBLE_SIZE) })}
              className={classes.scribbleSizeInput}
              type="number"
            />
            <div className={classes.sliderContainer}>
              <Slider
                value={scribbleSize}
                aria-labelledby="scribble-size-slider"
                step={1}
                min={SCRIBBLE_TO_MASK_CONSTANTS.MIN_SCRIBBLE_SIZE}
                max={SCRIBBLE_TO_MASK_CONSTANTS.MAX_SCRIBBLE_SIZE}
                valueLabelDisplay="auto"
                onChange={(e, newValue) => setToolConfig({ ...toolConfig, scribbleSize: newValue })}
              />
            </div>
          </div>
        </ToolConfigPopUpButton>
      </div>
      <Divider orientation="vertical" className={classes.divider} />
      <div className={classes.optionContainer}>
        <ToolConfigButton
          name={'MiVOS - S2M'}
          handleClick={() => eventCenter.emitEvent(EVENT_TYPES.SCRIBBLE_TO_MASK.PREDICT)()}
          component={<S2MIcon/>}
        />
      </div>
    </div>
  )
}

export default ScribbleToMaskConfig