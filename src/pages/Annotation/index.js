import React from 'react'
import { makeStyles, styled } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import {
  ViewMode,
} from 'nebula.gl'

import Toolbox from './components/Toolbox/index'
import Sidebar from './components/Sidebar/index'
import Annotator from './components/Annotator'

const useStyles = makeStyles(() => ({
  root: {
    background: '#f8f8f8'
  }
}))

const GridContainer = styled(Grid)({
  height: '100vh'
})

const Annotation = (props) => {
  const classes = useStyles()

  const [activeMode, setActiveMode] = React.useState(() => ViewMode)
  const setMode = (mode) => {
    setActiveMode(() => mode)
  }
  const [features, setFeatures] = React.useState({
    type: "FeatureCollection",
    features: []
  })
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = React.useState([]);

  return (
    <GridContainer container className={classes.root}>
      <GridContainer container item xs={1}>
        <Toolbox
          activeMode={activeMode}
          setMode={setMode}
        />
      </GridContainer>
      <GridContainer container item xs={8}>
        <Annotator
          activeMode={activeMode}
          setMode={setMode}
          features={features}
          setFeatures={setFeatures}
          selectedFeatureIndexes={selectedFeatureIndexes}
          setSelectedFeatureIndexes={setSelectedFeatureIndexes}
        />
      </GridContainer>
      <GridContainer container item xs={3}>
        <Sidebar
          features={features}
          selectedFeatureIndexes={selectedFeatureIndexes}
          setSelectedFeatureIndexes={setSelectedFeatureIndexes}
        />
      </GridContainer>
    </GridContainer>
  );
}

export default Annotation