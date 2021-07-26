import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'

import { useAnnotationStore } from '../../../../stores/index'

import ArrowRightIcon from '@material-ui/icons/ChevronRightRounded'
import ArrowDownIcon from '@material-ui/icons/ExpandMoreRounded';

import LabelInfo from './LabelInfo'


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
  },
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

const LabelInfoPanel = (props) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  const labels = useAnnotationStore(state => state.labels)

  return (
    <Grid container className={classes.root}>
      <Grid container item xs={12} direction="row" alignItems="center" className={classes.header}
        onClick={() => setIsOpen(isOpen => !isOpen)}
      >
        <Grid container item direction="row" alignItems="center" xs={2}>
          {isOpen ?
            <ArrowDownIcon color="secondary" />
            : <ArrowRightIcon color="secondary" />
          }
        </Grid>
        <Grid container item xs={8} direction="row" alignItems="center">
          <Grid item className={classes.title}>Label</Grid>
          <Grid item className={classes.titleCount}>{labels.length}</Grid>
        </Grid>
        <Divider orientation="vertical" flexItem className={classes.divider} />
        <Grid item xs={2}>

        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Collapse in={isOpen}>
          {labels.map(obj => {
            return (
              <LabelInfo key={obj.id} labelObject={obj} />
            )
          })
          }
        </Collapse>
      </Grid>
    </Grid>
  )
}

export default LabelInfoPanel