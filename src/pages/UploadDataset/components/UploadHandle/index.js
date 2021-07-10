import React from 'react'
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { useParams } from 'react-router'
import BeatLoader from 'react-spinners/BeatLoader'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  logContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    maxWidth: 600,
    margin: 'auto',
    border: '1px solid #eaeaea',
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logItem: {
    marginTop: 5,
    marginBottom: 5,
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
  }
}))

const UploadHandle = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const { datasetId } = useParams()

  const uploadFiles = useStore(state => state.uploadFiles)
  const isLoading = useStore(state => state.isLoading)
  const isUploaded = useStore(state => state.isUploaded)
  const files = useStore(state => state.files)
  const uploadLogs = useStore(state => state.uploadLogs)

  return (
    <div className={classes.root}>
      {(!isUploaded && !isLoading["uploading"]) &&
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => uploadFiles(datasetId)}
        >
          Upload
        </Button>
      }

      {isLoading["uploading"] && <BeatLoader size={20} />}

      {(isUploaded || isLoading["uploading"]) &&
        <Grid container className={classes.logContainer}>
          <Grid item xs={12} className={classes.logTitle}>
            Logs
          </Grid>
          <ul>
            {files.map((file, fileIndex) => {
              const log = uploadLogs[fileIndex]
              let clx = classes.logUploading
              if (log) {
                if (log.success) clx = classes.logSuccess
                else clx = classes.logError
              }
              return (
                <li className={clsx(classes.logItem, clx)}>
                  {file.name}: &nbsp;
                  {log ?
                    log.message :
                    "uploading"
                  }
                </li>
              )
            })}
          </ul>
        </Grid>
      }

      {isUploaded &&
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href={`/datasets/dataset=${datasetId}`}
          >
            Back to dataset page
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => window.location.reload()}
            style={{ marginTop: 20 }}
          >
            Upload more
          </Button>
        </div>
      }
    </div>
  )
}

export default UploadHandle