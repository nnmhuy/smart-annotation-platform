import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { debounce } from 'lodash'

import EventCenter from '../../../../../EventCenter'

import ToolSelector from '../components/ToolSelector'
import ToolConfigPopUpButton from '../components/ToolConfigPopUpButton'
import ToolConfigButton from '../components/ToolConfigButton'
import Slider from '../../../../../../../components/Slider'

import { ReactComponent as PositiveScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/positive_scribble.svg'
import { ReactComponent as NegativeScribbleIcon } from '../../../../../../../static/images/icons/ConfigIcon/negative_scribble.svg'
import { ReactComponent as EraserIcon } from '../../../../../../../static/images/icons/ConfigIcon/eraser.svg'
import { ReactComponent as SizeSliderIcon } from '../../../../../../../static/images/icons/ConfigIcon/size_slider.svg'
import { ReactComponent as S2MIcon } from '../../../../../../../static/images/icons/ConfigIcon/s2m.svg'
import { ReactComponent as ClearIcon } from '../../../../../../../static/images/icons/ConfigIcon/clear.svg'
import { ReactComponent as ThresholdIcon } from '../../../../../../../static/images/icons/ConfigIcon/threshold.svg'
import { ReactComponent as DeleteIcon } from '../../../../../../../static/images/icons/ConfigIcon/delete.svg'



import { SCRIBBLE_TO_MASK_CONSTANTS, EVENT_TYPES } from '../../../../../constants'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 30,
  },
  optionContainer: {
    marginLeft: 10,
    marginRight: 10,
    display: 'flex',
  },
  sliderContainer: {
    width: 150,
    marginLeft: 20,
  },
  sliderInput: {
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
  const { toolConfig, setToolConfig, } = props
  const { scribbleSize, threshold } = toolConfig

  const emitThresholdUpdate = debounce(
    EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD),
    500
  )

  const handleSliderChange = (e, newValue) => {
    setToolConfig({ ...toolConfig, threshold: newValue })
    emitThresholdUpdate()
    // EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.UPDATE_THRESHOLD)()
  }

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <ToolSelector
          activeTool={toolConfig.scribbleType}
          toolList={scribbleToMaskTools}
          onSelect={(tool) => setToolConfig({ ...toolConfig, scribbleType: tool })}
        />
        <ToolConfigPopUpButton
          name={'Scribble size'}
          component={<SizeSliderIcon />}
        >
          <div className={classes.popUpContainer}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={scribbleSize}
              onChange={(e) => setToolConfig({ ...toolConfig, scribbleSize: Math.max(Math.min(Number(e.target.value), SCRIBBLE_TO_MASK_CONSTANTS.MAX_SCRIBBLE_SIZE), SCRIBBLE_TO_MASK_CONSTANTS.MIN_SCRIBBLE_SIZE) })}
              className={classes.sliderInput}
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
        <ToolConfigButton
          name={'Clear all scribbles'}
          handleClick={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.CLEAR_ALL_SCRIBBLES)}
          component={<ClearIcon />}
        />
      </div>
      <Divider orientation="vertical" className={classes.divider}/>
      <Divider orientation="vertical" className={classes.divider} />
      <div className={classes.optionContainer}>
        <ToolConfigPopUpButton
          name={'Score threshold'}
          component={<ThresholdIcon />}
        >
          <div className={classes.popUpContainer}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={threshold}
              onChange={(e) => setToolConfig({ ...toolConfig, threshold: Math.max(Math.min(Number(e.target.value), 100), 0) })}
              className={classes.sliderInput}
              type="number"
            />
            <div className={classes.sliderContainer}>
              <Slider
                value={threshold}
                aria-labelledby="threshold-slider"
                step={1}
                min={1}
                max={100}
                valueLabelDisplay="auto"
                onChange={handleSliderChange}
              />
            </div>
          </div>
        </ToolConfigPopUpButton>
        <ToolConfigButton
          name={'MiVOS - Scribbles to mask'}
          handleClick={EventCenter.emitEvent(EVENT_TYPES.DRAW_MASK.PREDICT)}
          component={<S2MIcon/>}
        />
      </div>
      <Divider orientation="vertical" className={classes.divider} />
      <div className={classes.optionContainer}>
        <ToolConfigButton
          name={'Delete annotation'}
          handleClick={EventCenter.emitEvent(EVENT_TYPES.EDIT.DELETE_ANNOTATION)}
          component={<DeleteIcon />}
        />
      </div>
    </div>
  )
}

export default ScribbleToMaskConfig