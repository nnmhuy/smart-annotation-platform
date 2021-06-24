import React from 'react'
import { makeStyles } from '@material-ui/core'

import ClassList from './ClassList'

import { theme } from '../../../../theme'


const useStyles = makeStyles((props) => ({
  sideBarWrapper: {
    // width: '100%',
    height: '100%',
    backgroundColor: theme.light.primaryColor,
    padding: 20,
  },
  header: {
    fontSize: '2em',
    margin: 0,
    padding: 10,
  }
}))

const SideBar = (props) => {
  const {
    annotationClasses,
    annotations,
    runningTime,
  } = props
  const classes = useStyles()
  return (
    <div className={classes.sideBarWrapper}>
      {
        annotationClasses.map(value => {
          return <ClassList
            key={value.label}
            annotations={annotations.filter(anno => anno.labelId === value.id)}
            classLabel={value.label}
          />
        })
      }
      <div>{runningTime} seconds</div>
    </div>
  )
}

export default SideBar