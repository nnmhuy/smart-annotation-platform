import React from 'react'
import { makeStyles, styled } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

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

  const [map, setMap] = React.useState(null)

  return (
    <GridContainer container className={classes.root}>
      {/* <GridContainer container item xs={1}>
        <Toolbox
          map={map}
        />
      </GridContainer> */}
      <GridContainer container item xs={9}>
        <Annotator
          setMap={setMap}
        />
      </GridContainer>
      <GridContainer container item xs={3}>
        <Sidebar/>
      </GridContainer>
    </GridContainer>
  );
}

export default Annotation