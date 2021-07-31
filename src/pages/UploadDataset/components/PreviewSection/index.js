import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import ImagePreview from './components/ImagePreview/index'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    margin: 'auto',
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    color: theme.palette.primary.dark
  }
}))

const PreviewSection = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const files = useStore(state => state.files)
  const uploadLogs = useStore(state => state.uploadLogs)
  const progressInfos = useStore(state => state.progressInfos)
  const deleteFileById = useStore(state => state.deleteFileById)

  return (
    files.length ?
      <Grid container direction="column" spacing={5} className={classes.root}>
        <Grid item className={classes.title}>
          File list
        </Grid>
        {
          files.map((file, index) => (
            <ImagePreview
              useStore={useStore}
              key={`${index}-${file.name}`}
              index={index}
              file={file}
              log={uploadLogs[file.id]}
              progress={progressInfos[file.id]}
              deleteFileById={deleteFileById}
            />
          ))
        }
      </Grid>
      : null
  )
}

export default PreviewSection