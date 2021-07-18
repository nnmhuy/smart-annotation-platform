import React from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import { useParams, useHistory } from 'react-router'
import { get } from 'lodash'


import { IMAGES_PER_PAGE } from '../../constants'
import useQuery from '../../../../utils/useQuery'

import ThumbnailImage from './ThumbnailImage'
import { theme } from '../../../../theme'

const useStyles = makeStyles((props) => ({
  sliderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    width: '100%',
    height: 100,
    background: theme.light.forthColor
  },
  pageInfo: {
    fontWeight: 500,
    width: 100,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
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
  const classes = useStyles()
  const { projectId, datasetId } = useParams()
  let query = useQuery()
  let history = useHistory()

  const page = JSON.parse(query.get("page") || 1)

  const { 
    useStore, 
    // eventCenter 
  } = props


  const imageId = useStore(state => state.imageId)
  const dataset = useStore(state => state.dataset)
  const setImageId = useStore(state => state.setImageId)
  const getImagesOfDataset = useStore(state => state.getImagesOfDataset)
  const imageList = useStore(state => state.imageList)

  const instances = get(dataset, 'instances', 0)
  const maxPage = Number.parseInt((instances / IMAGES_PER_PAGE) + Boolean(instances % IMAGES_PER_PAGE))


  const handleChangePage = async (val) => {
    let newPage = page + val

    newPage = (Math.max(Math.min(maxPage, newPage), 1))

    if (newPage !== page) {
      history.push(`/annotations/project=${projectId}&dataset=${datasetId}?page=${newPage}`)
      // TODO: remove this
      await getImagesOfDataset(datasetId, newPage)
      // TODO: put this inside get images
      setImageId(null)
    }
  }


  // TODO: show current page / total page
  return (
    <div className={classes.sliderWrapper}>
      <div className={classes.pageInfo}>
        <div>{`Page: ${page}`}</div>
        <div>{`Total: ${maxPage}`}</div>
      </div>
      <IconButton onClick={() => handleChangePage(-1)} className={classes.button}>
        <KeyboardArrowLeft />
      </IconButton>
        <div className={classes.thumbnailWrapper}>
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