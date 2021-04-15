import React from 'react'
import { makeStyles, styled } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import { MODES } from './constants'

import Toolbox from './components/Toolbox/index'
import Sidebar from './components/Sidebar/index'
import Annotator from './components/Annotator'

const useStyles = makeStyles(() => ({
  root: {
    // background: '#f8f8f8'
    width: '100vw',
    overflow: 'hidden'
  },
  annotatorContainer: {
    background: '#f8f8f8'
  }
}))

const GridContainer = styled(Grid)({
  height: '100vh',
})

const demoAnnotateData = [
  { id: 1, label: 'Cat', isHidden: true, color: 'red' },
  { id: 2, label: 'Dog', isHidden: false, color: 'green' }
] 

const Annotation = (props) => {
  const classes = useStyles()

  const [stageSize, setStageSize] = React.useState({ width: 0, height: 0 })
  const [image, setImage] = React.useState(null)
  const [activeMode, setActiveMode] = React.useState(MODES.CURSOR)
  const [toolboxConfig, setToolboxConfig] = React.useState({
    brushType: 'brush',
    brushSize: 2,
  })
  const [rectangles, setRectangles] = React.useState([])
  const [polygons, setPolygons] = React.useState([])
  const [annotationClasses, setAnnotationClasses] = React.useState(demoAnnotateData)

  const handleNewStageSize = () => {
    const container = document.getElementById('stage-container')
    setStageSize({
      width: container.clientWidth,
      height: container.clientHeight,
    })
  }

  React.useEffect(() => {
    handleNewStageSize()
    window.addEventListener('resize', handleNewStageSize)
    return () => {
      window.removeEventListener('resize', handleNewStageSize)
    }
  }, [])

  return (
    <GridContainer container className={classes.root}>
      <GridContainer container item xs={2} direction='column' alignItems='center' justify='space-between'>
        <Toolbox
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          toolboxConfig={toolboxConfig}
          setToolboxConfig={setToolboxConfig}
        />
      </GridContainer>
      <GridContainer container item xs={8} className={classes.annotatorContainer} id='stage-container'>
        <Annotator
          activeMode={activeMode}
          toolboxConfig={toolboxConfig}
          image={image}
          rectangles={rectangles}
          setRectangles={setRectangles}
          polygons={polygons}
          setPolygons={setPolygons}
          stageSize={stageSize}
        />
      </GridContainer>
      <GridContainer container item xs={2}>
        <Sidebar 
          annotationClasses={annotationClasses}
          setAnnotationClasses={setAnnotationClasses}
          setImage={setImage}
          stageSize={stageSize}
        />
      </GridContainer>
    </GridContainer>
  );
}

export default Annotation