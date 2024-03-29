import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { useDropzone } from 'react-dropzone'

import Loading from '../../../../components/Loading'
import _ from 'lodash'

import generateNewUid from '../../../../utils/uidGenerator'
import { DATASET_DATATYPE } from 'constants/index'

const useStyles = makeStyles((theme) => ({
  dropZoneWrapper: {
    display: 'flex'
  },
  dropZone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: theme.palette.primary.dark,
    borderStyle: 'dashed',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  },

  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },

  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  },

  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },

  img: {
    display: 'block',
    width: 'auto',
    height: '100%'
  }
}))

const acceptedFormats = {
  [DATASET_DATATYPE.IMAGE]: { accept: "image/*", message: "Drop PNG, JPEG files to upload." },
  [DATASET_DATATYPE.VIDEO]: { accept: "video/*", message: "Drop MP4 files to upload." },
}

const UploadZoneFolder = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const isLoading = useStore(state => state.isLoading)
  const isUploaded = useStore(state => state.isUploaded)
  const datasetInfo = useStore(state => state.datasetInfo)

  const [acceptedFormat, setAcceptedFormat] = useState(acceptedFormats[DATASET_DATATYPE.IMAGE])

  useEffect(() => {
    if (datasetInfo) {
      setAcceptedFormat(acceptedFormats[datasetInfo.datatype])
    }
  }, [datasetInfo])

  const files = useStore(state => state.files)
  const appendFile = useStore(state => state.appendFile)

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFormat?.accept,
    onDrop: async (acceptedFiles) => {
      // Split accepted files into 100 files each batch
      // Each batch will handle sequentially, so that we can update the UI
      const batch_size = 100
      const batches = _.chunk(acceptedFiles, batch_size)
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        await Promise.all(batch.map(async (file) => {
          try {
            let processedFile = file
  
            const objectUrl = URL.createObjectURL(file);
            processedFile = Object.assign(processedFile, {
              id: generateNewUid(),
              preview: objectUrl
            })
            await appendFile(processedFile)
          } catch (error) {
            console.log(error)
          }
        }))
        // Paused for 1 second to update the UI
        await new Promise(r => setTimeout(r, 1000))
      }
    }
  })

  return (
    <section className="container">
      <Loading isLoading={isLoading["loading-new-images"]} />
      <div className={classes.dropZoneWrapper}>
        {(!isUploaded && !isLoading["uploading"]) &&
          <div {...getRootProps({ className: classes.dropZone })} style={{ height: files.length ? 100 : 300 }}>
            <input {...getInputProps()}/>
            <p>{acceptedFormat?.message}</p>
            <Button
              color="primary"
              variant="contained"
            >
              Choose files to upload
            </Button>
            <p>256MB maximum size</p>
          </div>
        }
      </div>
    </section>
  );
}

export default UploadZoneFolder