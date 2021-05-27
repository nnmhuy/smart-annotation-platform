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
    const {
      stageSize,
      setImage,
      annotationClasses,
      annotations,
    } = this.props
    return (
      <div style={styles.sideBarWrapper}>
        <ImageUploader
          stageSize={stageSize}
          setImage={setImage}
        />
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
}
