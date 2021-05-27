import React, { Component } from 'react'

import ImageUploader from './ImageUploader'
import ClassList from './ClassList'

import { theme } from '../../../../theme'

import { makeStyles } from '@material-ui/core'

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
    stageSize,
    setImage,
    annotationClasses,
    annotations,
  } = props
  const classes = useStyles()
  return (
    <div className={classes.sideBarWrapper}>
      {/* <ImageUploader
          stageSize={stageSize}
          setImage={setImage}
        /> */}
      {
        annotationClasses.map(value => {
          return <ClassList
            annotations={annotations.filter(anno => anno.labelId === value.id)}
            classLabel={value.label}
          />
        })
      }
    </div>
  )
}

export default SideBar