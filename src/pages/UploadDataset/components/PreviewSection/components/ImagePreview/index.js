import React from 'react'
import { makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'

import CloseIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  thumb: {
    display: 'inline-flex',
    position: 'relative',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    padding: 4,
    boxSizing: 'border-box'
  },

  errorThumb: {
    borderColor: '#ff0000',
  },

  thumbInner: {
    display: 'flex',
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  img: {
    width: 100,
    height: 100,
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
  const { useStore, index, file } = props

  const deleteFileAtIndex = useStore(state => state.deleteFileAtIndex)

  return (
    <div className={clsx(classes.thumb, file.duplicateError && classes.errorThumb)}>
      <IconButton 
        className={classes.deleteButton} size="small"
        onClick={() => deleteFileAtIndex(index)}
      >
        <CloseIcon/>
      </IconButton>
      <div className={classes.thumbInner}>
        <img
          alt={file.name}
          src={file.preview}
          className={classes.img}
        />
        <div className={classes.info}>
          {file.width} x {file.height}
        </div>
      </div>
    </div>
  )
}

export default ImagePreview