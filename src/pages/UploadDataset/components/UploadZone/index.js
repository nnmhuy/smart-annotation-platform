import React from 'react'
import { makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { useDropzone } from 'react-dropzone'
import { set, cloneDeep } from 'lodash'

const useStyles = makeStyles((theme) => ({
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

const UploadZone = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const isUploaded = useStore(state => state.isUploaded)


  const files = useStore(state => state.files)
  const appendFiles = useStore(state => state.appendFiles)

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: async (acceptedFiles) => {
      const processedFiles = await Promise.all(acceptedFiles.map((file) => new Promise((resolve, reject) => {
        try {
          let processedFile = file

          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          set(processedFile, 'preview', objectUrl)

          img.onload = function () {
            processedFile = Object.assign(processedFile, {
              width: this.width,
              height: this.height,
            })
            resolve(processedFile)
          };
          img.src = objectUrl;
        } catch (error) {
          reject(error)
        }
      })))
      appendFiles(processedFiles)
    }
  });

  return (
    <section className="container">
      {!isUploaded && 
        <div {...getRootProps({ className: classes.dropZone })} style={{ height: files.length ? 100 : 300 }}>
          <input {...getInputProps()} />
          <p>Drop PNG, JPEG files to upload.</p>
          <Button
            color="primary"
            variant="contained"
          >
            Choose files to upload
          </Button>
          <p>10MB maximum size</p>
        </div>
      }
    </section>
  );
}

export default UploadZone