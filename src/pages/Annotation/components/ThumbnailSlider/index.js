import React from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

import ThumbnailImage from './ThumbnailImage'
import { theme } from '../../../../theme'

const useStyles = makeStyles((props) => ({
  sliderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    width: '100%',
    height: 100,
    background: theme.light.forthColor
  },
  thumbnailWrapper: {
    whiteSpace: 'nowrap',
    width: '100%',
    alignItems: 'center',
    overflowY: 'hidden',
    overflowX: 'scroll',
    "&::-webkit-scrollbar": {
      height: 10,
    },
    "&::-webkit-scrollbar-track": {
      height: 10,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.light.secondaryColor,
      height: 10,
      borderRadius: 5
    },
  },
  button: {
    borderRadius: 0
  },
}))

const ThumbnailSlider = (props) => {
  const { useStore, eventCenter } = props
  const imageId = useStore(state => state.imageId)

  const setImageId = useStore(state => state.setImageId)
  const imageList = useStore(state => state.imageList)
  // Page use 0-index

  const [page, setPage] = React.useState(0)
  const [imagePerPage, setImagePerPage] = React.useState(1)
  
  const componentRef = React.useCallback(component => {
    if (component !== null) {
      let newImagePerPage = Math.floor(component.offsetWidth / 120)

      setImagePerPage(newImagePerPage)
    }
  }, [])

  const classes = useStyles()
  const handleChangePage = (val) => {
    // Max page = total page - 1 (0-index)
    const maxPage = Math.floor((imageList.length - 1) / imagePerPage)
    let newPage = page + val
    // Clamp page value into 0 - maxPage
    newPage = (Math.max(Math.min(maxPage, newPage), 0))
    setPage(newPage)
  }

  return (
    <div className={classes.sliderWrapper}>
      <IconButton onClick={() => handleChangePage(-1)} className={classes.button}>
        <KeyboardArrowLeft />
      </IconButton>
        <div className={classes.thumbnailWrapper} ref={componentRef}>
        {imageList.map((data, index) => {
            return (
              <ThumbnailImage
                id={data.id}
                key={`thumbnail-image-${data.id}`}
                isSelected={data.id === imageId}
                setSelectedId={() => setImageId(data.id)}
                thumbnail={data.thumbnailURL}
              />)
          })}
        </div>
      <IconButton onClick={() => handleChangePage(1)} className={classes.button}>
        <KeyboardArrowRight />
      </IconButton>
    </div>
  )
}

export default ThumbnailSlider