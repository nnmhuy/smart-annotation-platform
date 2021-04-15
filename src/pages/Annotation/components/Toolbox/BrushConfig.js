import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

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
  const { brushType, brushSize, } = toolboxConfig
  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <Typography variant="button" gutterBottom>
          Brush type
        </Typography>
        <ButtonGroup color="primary">
          <Button 
            variant={brushType === "brush" ? "contained" : "outlined"}
            onClick={() => setToolboxConfig({...toolboxConfig, brushType: "brush" })}
          >
            Brush
          </Button>
          <Button 
            variant={brushType === "eraser" ? "contained" : "outlined"}
            onClick={() => setToolboxConfig({ ...toolboxConfig, brushType: "eraser" })}
          >
            Eraser
          </Button>
        </ButtonGroup>
      </div>
      <div className={classes.optionContainer}>
        <Typography id="brush-size-slider" variant="button" gutterBottom>
          Brush size
        </Typography>
        <Slider
          defaultValue={brushSize}
          aria-labelledby="brush-size-slider"
          step={2}
          min={1}
          max={20}
          valueLabelDisplay="auto"
          marks
          onChange={(e, newValue) => setToolboxConfig({ ...toolboxConfig, brushSize: newValue})}
        />
      </div>
      <div className={classes.optionContainer}>
        <Typography variant="button" gutterBottom>
          Keyboard shortcut:
        </Typography>
        <Typography>
          Enter: finish brush
        </Typography>
        <Typography>
          Esc: cancel brush
        </Typography>
      </div>
    </div>
  )
}

export default BrushConfig