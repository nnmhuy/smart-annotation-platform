import React from 'react'
import { makeStyles, styled } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Toolbox from './components/Toolbox/index'
import Sidebar from './components/Sidebar/index'
import Annotator from './components/Annotator/index'

const useStyles = makeStyles(() => ({
  root: {
    background: '#555555'
  }
}))

const GridContainer = styled(Grid)({
  height: '100vh'
})

const demoAnnotateData = [
  {id: 1, label: 'Cat', isHidden: true},
  {id: 2, label: 'Dog', isHidden: false}
] 

const Annotation = (props) => {
  const classes = useStyles()
  return (
    <GridContainer container className={classes.root}>
      <GridContainer container item xs={1}>
        <Toolbox/>
      </GridContainer>
      <GridContainer container item xs={8}>
        <Annotator/>
      </GridContainer>
      <GridContainer container item xs={3}>
        <Sidebar data={demoAnnotateData}/>
      </GridContainer>
    </GridContainer>
  );
}

export default Annotation