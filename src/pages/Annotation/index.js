import React from 'react'
import { makeStyles, styled } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

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
    opacity: 0.2,
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
    opacity: 0.2,
    stroke: 'black',
    strokeWidth: 3,
    id: 'rect2',
  },
];

const Annotation = (props) => {
  const classes = useStyles()
  const [rectangles, setRectangles] = React.useState(initialRectangles);

  return (
    <GridContainer container className={classes.root}>
      <GridContainer container item xs={1}>
        <Toolbox/>
      </GridContainer>
      <GridContainer container item xs={9} className={classes.annotatorContainer}>
        <Annotator
          rectangles={rectangles}
          setRectangles={setRectangles}
        />
      </GridContainer>
      <GridContainer container item xs={2}>
        <Sidebar/>
      </GridContainer>
    </GridContainer>
  );
}

export default Annotation