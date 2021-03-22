import React, { Component } from 'react'

import ImageUploader from './ImageUploader'
import ClassList from './ClassList'

import { theme } from '../../../../theme'

const styles = {
  sideBarWrapper: {
    width: '100%',
    backgroundColor: theme.light.backgroundColor
  },
}

export default class Sidebar extends Component {
  render() {
    const { annotationClasses, setAnnotationClasses, setImage } = this.props
    return (
      <div style={styles.sideBarWrapper}>
        <ImageUploader setImage={setImage}/>
        <ClassList 
          annotationClasses={annotationClasses}
          setAnnotationClasses={setAnnotationClasses}
        />
      </div>
    )
  }
}
