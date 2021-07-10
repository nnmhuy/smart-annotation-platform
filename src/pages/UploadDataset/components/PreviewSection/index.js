import React from 'react'
import { makeStyles } from '@material-ui/core'

import ImagePreview from './components/ImagePreview/index'

const useStyles = makeStyles((theme) => ({
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    margin: 'auto',
  },
}))

const PreviewSection = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const files = useStore(state => state.files)
  console.log(files)
  
  return (
    <div className={classes.thumbsContainer}>
      {
        files.map((file, index) => (
          <ImagePreview
            useStore={useStore}
            key={`${index}-${file.name}`}
            index={index}
            file={file}
          />
        ))
      }
    </div>
  )
}

export default PreviewSection