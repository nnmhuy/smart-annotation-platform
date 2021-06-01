import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { MODES, STAGE_PADDING } from './constants'

import Toolbox from './components/Toolbox/index'
import Sidebar from './components/Sidebar/index'
import Annotator from './components/Annotator'
import ThumbnailSlider from './components/ThumbnailSlider'

import loadImageFromURL from '../../utils/loadImageFromURL'
import resizeImage from '../../utils/resizeImage'

import {demoAnnotateData, dataList} from '../../mockup'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  annotationWrapper: {
    // background: '#f8f8f8'
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  annotatorContainer: {
    background: '#f8f8f8',
    display:'flex',
    flexDirection: 'column',
    width: '80%'
  },
  toolboxContainer: {
    
  },
  sidebarWrapper: {
    width: '20%',
  }
}))

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
  const [selectedImageId, setSelectedImageId] = React.useState(null)

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

  const handleSelectImage = (imageId) => {
    setSelectedImageId(imageId)
    const data = dataList.find(data => data.id === imageId)

    loadImageFromURL(data.imageURL)
    .then((imageData) => resizeImage(imageData, {
      maxWidth: stageSize.width - STAGE_PADDING,
      maxHeight: stageSize.height - STAGE_PADDING,
    }))
    .then(image => {
      setImage(image)
    })
  }

  return (
    <div className={classes.root}>
      <div className={classes.annotationWrapper}>
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
          />
        </div>
      </div>
      <ThumbnailSlider
          dataList={dataList}
          selectedId={selectedImageId}
          setSelectedId={handleSelectImage}
      />
    </div>
  );
}

export default AnnotationPage