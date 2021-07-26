import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'

import { useAnnotationStore } from '../../../../stores/index'

import ArrowRightIcon from '@material-ui/icons/ChevronRightRounded'
import ArrowDownIcon from '@material-ui/icons/ExpandMoreRounded';

import ObjectInfo from './ObjectInfo'


const useStyles = makeStyles((theme) => ({
  header: {
    cursor: 'pointer',
    background: theme.palette.primary.dark,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
    color: theme.palette.primary.contrastText,
  },
  titleCount: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    minWidth: 30,
    fontSize: 12,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  divider: {
    background: "#FFFFFF"
  }
}))

const ObjectInfoPanel = (props) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  const annotationObjects = useAnnotationStore(state => state.annotationObjects)

  return (
    <Grid container>
      <Grid container item xs={12} direction="row" alignItems="center" className={classes.header}
        onClick={() => setIsOpen(isOpen => !isOpen)}
      >
        <Grid container item direction="row" alignItems="center" xs={2}>
          {isOpen ? 
            <ArrowDownIcon color="secondary"/>
            : <ArrowRightIcon color="secondary"/>
          }
        </Grid>
        <Grid container item xs={8} direction="row" alignItems="center">
          <Grid item className={classes.title}>Object</Grid>
          <Grid item className={classes.titleCount}>{annotationObjects.length}</Grid>
        </Grid>
        <Divider orientation="vertical" flexItem className={classes.divider}/>
        <Grid item xs={2}>
          
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Collapse in={isOpen}>
          {annotationObjects.map(obj => {
              return (
                <ObjectInfo key={obj.id} annotationObject={obj}/>
              )
            })
          }
        </Collapse>
      </Grid>
    </Grid>
  )
}

export default ObjectInfoPanel