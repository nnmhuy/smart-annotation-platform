import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'

import humanFileSize from '../../../../../../utils/humanFileSize'

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    width: '100%',
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: (props) => ({
    borderRadius: 5,
    backgroundColor: props.status === "error" ? 'red' : (props.status === "uploading" ? '#1a90ff' : "green"),
  }),
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  thumb: {
    border: '4px solid #eaeaea',
    borderRadius: 10,
    marginBottom: 8,
    marginRight: 8,
    height: 200,
    boxSizing: 'border-box'
  },

  logUploading: {
    color: 'blue'
  },
  logSuccess: {
    color: 'green'
  },
  logError: {
    color: 'red'
  },
  filePreview: {
    width: 'auto',
    maxWidth: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  info: {
    fontSize: 10,
    textAlign: 'center',
  },

  deleteButton: {
    position: 'absolute',
    top: -4,
    right: -4,
  }
}))

const ImagePreview = (props) => {
  const classes = useStyles()
  const { file, log, progress = 0, deleteFileById } = props

  let clx = classes.logUploading
  let status = "uploading"
  if (log) {
    if (log.success) {
      status = "success"
      clx = classes.logSuccess
    }
    else {
      status = "error"
      clx = classes.logError
    }
  }

  return (
    <Grid container item direction="row" className={classes.thumb} spacing={1}>
      <Grid container item xs={5} style={{ height: '100%' }}>
        {file.type.includes("image") ?
          <img
            alt={file.name}
            src={file.preview}
            className={classes.filePreview}
          />
          : 
          <video
            alt={file.name}
            className={classes.filePreview}
            controls
          >
            <source src={file.preview} type={file.type}></source>
          </video>
        }
      </Grid>
      <Grid container item xs={7} alignItems="center" spacing={2}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid container item direction="column" alignItems="flex-start" justifyContent="space-evenly" xs={7}>
            <span>{file.name}</span>
            <span style={{ marginTop: 10 }}>{humanFileSize(file.size)}</span>
          </Grid>
          <Grid container item xs={5} justifyContent="flex-end">
            {status === "error" && 
              <Button 
                onClick={() => deleteFileById(file.id)}
                color="secondary"
                variant="contained"
              >
                Delete
              </Button>
            }
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <BorderLinearProgress variant="determinate" value={progress - (status === "uploading") * 10} status={status}/>
          <div className={clx} style={{ marginTop: 10}} >
            {log ?
              log.message :
              "Uploading"
            }
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ImagePreview