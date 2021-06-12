import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import ToolSelector from './ToolSelector'
import ToolConfigPopUpButton from './ToolConfigPopUpButton'
import Slider from '../../../../../components/Slider'

import { ReactComponent as PositiveScribbleIcon } from './ConfigIcon/positive_scribble.svg'
import { ReactComponent as NegativeScribbleIcon } from './ConfigIcon/negative_scribble.svg'
import { ReactComponent as EraserIcon } from './ConfigIcon/eraser.svg'
import { ReactComponent as SizeSliderIcon } from './ConfigIcon/size_slider.svg'


import { BRUSH_TYPES, MIN_BRUSH_SIZE, MAX_BRUSH_SIZE } from '../../../constants'

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
  brushSizeInput: {
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

const brushTools = [
  {
    tool: BRUSH_TYPES.POSITIVE_SCRIBBLE,
    name: 'Positive scribble',
    component: <PositiveScribbleIcon/>
  },
  {
    tool: BRUSH_TYPES.NEGATIVE_SCRIBBLE,
    name: 'Negative scribble',
    component: <NegativeScribbleIcon />
  },
  {
    tool: BRUSH_TYPES.ERASER,
    name: 'Eraser',
    component: <EraserIcon />
  },
]


const BrushConfig = (props) => {
  const classes = useStyles()
  const { toolboxConfig, setToolboxConfig, } = props
  const { brushSize, } = toolboxConfig

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <ToolSelector
          activeTool={toolboxConfig.brushType}
          toolList={brushTools}
          onSelect={(tool) => setToolboxConfig({ ...toolboxConfig, brushType: tool })}
        />
      </div>
      <Divider orientation="vertical" className={classes.divider}/>
      <div className={classes.optionContainer}>
        <ToolConfigPopUpButton
          name={'Brush size'}
          component={<SizeSliderIcon/>}
        >
          <div className={classes.popUpContainer}>
            <OutlinedInput
              id="outlined-adornment-weight"
              value={brushSize}
              onChange={(e) => setToolboxConfig({ ...toolboxConfig, brushSize: Math.max(Math.min(Number(e.target.value), MAX_BRUSH_SIZE), MIN_BRUSH_SIZE) })}
              className={classes.brushSizeInput}
              type="number"
            />
            <div className={classes.sliderContainer}>
              <Slider
                value={brushSize}
                aria-labelledby="brush-size-slider"
                step={1}
                min={MIN_BRUSH_SIZE}
                max={MAX_BRUSH_SIZE}
                valueLabelDisplay="auto"
                onChange={(e, newValue) => setToolboxConfig({ ...toolboxConfig, brushSize: newValue })}
              />
            </div>
          </div>
        </ToolConfigPopUpButton>
      </div>
    </div>
  )
}

export default BrushConfig