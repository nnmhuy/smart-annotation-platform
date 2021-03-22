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
  },
  annotatorContainer: {
    background: '#f8f8f8'
  }
}))

const GridContainer = styled(Grid)({
  height: '100vh'
})

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    opacity: 0.4,
    stroke: 'black',
    strokeWidth: 3,
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    opacity: 0.4,
    stroke: 'black',
    strokeWidth: 3,
    id: 'rect2',
  },
];
const demoAnnotateData = [
  {id: 1, label: 'Cat', isHidden: true},
  {id: 2, label: 'Dog', isHidden: false}
] 

const Annotation = (props) => {
  const classes = useStyles()
  const [image, setImage] = React.useState(null)
  const [activeMode, setActiveMode] = React.useState(MODES.CURSOR)
  const [rectangles, setRectangles] = React.useState(initialRectangles);

  return (
    <GridContainer container className={classes.root}>
      <GridContainer container item xs={1}>
        <Toolbox
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />
      </GridContainer>
      <GridContainer container item xs={9} className={classes.annotatorContainer}>
        <Annotator
          activeMode={activeMode}
          image={image}
          rectangles={rectangles}
          setRectangles={setRectangles}
        />
      </GridContainer>
      <GridContainer container item xs={2}>
        <Sidebar 
          data={demoAnnotateData}
          setImage={setImage}
        />
      </GridContainer>
    </GridContainer>
  );
}

export default Annotation