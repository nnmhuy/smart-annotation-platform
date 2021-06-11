import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import ToolSelector from './ToolSelector'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '90%'
  },
  optionContainer: {
    marginTop: 15,
  }
}))


const BrushConfig = (props) => {
  const classes = useStyles()
  const { toolboxConfig, setToolboxConfig, } = props
  const { brushSize, } = toolboxConfig
  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <Typography variant="button" gutterBottom>
          Brush type
        </Typography>
        <ToolSelector
          onSelect={(type) => setToolboxConfig({ ...toolboxConfig, brushType: type })}
        />
      </div>
      <div className={classes.optionContainer}>
        <Typography id="brush-size-slider" variant="button" gutterBottom>
          Brush size
        </Typography>
        <Slider
          value={brushSize}
          aria-labelledby="brush-size-slider"
          step={2}
          min={10}
          max={100}
          valueLabelDisplay="auto"
          marks
          onChange={(e, newValue) => setToolboxConfig({ ...toolboxConfig, brushSize: newValue})}
        />
      </div>
    </div>
  )
}

export default BrushConfig