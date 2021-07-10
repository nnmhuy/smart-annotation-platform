import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  imageList: {
    padding: 30,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}))

const ImageListSection = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const images = useStore(state => state.images)

  return (
    <ImageList className={classes.imageList} cols={4}>
      {images.map(item => {
        return (
          <ImageListItem key={item.id}>
            <img src={item.thumbnailURL} alt={item.name} />
            <ImageListItemBar
              title={item.name}
              actionIcon={
                <IconButton aria-label={`info about ${item.name}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        )
      })
      }
    </ImageList>
  )
}


export default ImageListSection