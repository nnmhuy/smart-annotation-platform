import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { MODES } from './constants'

import Toolbox from './components/Toolbox/index'
import Sidebar from './components/Sidebar/index'
import Annotator from './components/Annotator'



const useStyles = makeStyles(() => ({
  root: {
    // background: '#f8f8f8'
    display: 'flex',
    flexDirection: 'row',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden'
  },
  annotatorContainer: {
    background: '#f8f8f8',
    width: '80%'
  },
  toolboxContainer: {
    
  },
  sidebarWrapper: {
    width: '20%',
  }
}))

const demoAnnotateData = [
  { id: 1, label: 'Cat', isHidden: true, color: 'red' },
  { id: 2, label: 'Dog', isHidden: false, color: 'green' }
] 

const AnnotationPage = (props) => {
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
  const [annotations, setAnnotations] = React.useState([])
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
    <div className={classes.root}>
      <div className={classes.toolboxContainer}>
        <Toolbox
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          toolboxConfig={toolboxConfig}
          setToolboxConfig={setToolboxConfig}
        />
      </div>
      <div className={classes.annotatorContainer} id='stage-container'>
        <Annotator
          activeMode={activeMode}
          toolboxConfig={toolboxConfig}
          setToolboxConfig={setToolboxConfig}
          image={image}
          rectangles={rectangles}
          setRectangles={setRectangles}
          polygons={polygons}
          setPolygons={setPolygons}
          annotations={annotations}
          setAnnotations={setAnnotations}
          annotationClasses={annotationClasses}
          stageSize={stageSize}
        />
      </div>
      <div className={classes.sidebarWrapper}>
        <Sidebar 
          annotationClasses={annotationClasses}
          setAnnotationClasses={setAnnotationClasses}
          annotations={annotations}
          setImage={setImage}
          stageSize={stageSize}
        />
      </div>
    </div>
  );
}

export default AnnotationPage