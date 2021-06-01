import React from 'react'

import { IconButton, makeStyles } from '@material-ui/core'

import ThumbnailImage from './ThumbnailImage'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
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
  const {
    selectedId,
    setSelectedId,
    dataList,
  } = props
  // Page use 0-index

  const [page, setPage] = React.useState(0)
  const [imagePerPage, setImagePerPage] = React.useState(1)
  const componentRef = React.useRef()

  React.useEffect(() => {
    if (!componentRef.current)
      return
    let newImagePerPage = Math.floor(componentRef.current.offsetWidth / 120)
    console.log(newImagePerPage)
    setImagePerPage(newImagePerPage)
  }, [])

  const classes = useStyles()
  const handleChangePage = (val) => {
    // Max page = total page - 1 (0-index)
    const maxPage = Math.floor((dataList.length - 1) / imagePerPage)
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
          {dataList.map((data, index) => {
            return (
              <ThumbnailImage
                id={data.id}
                isSelected={data.id === selectedId}
                setSelectedId={setSelectedId}
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