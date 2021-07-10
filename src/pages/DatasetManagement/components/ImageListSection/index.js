import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/CheckCircle';
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  imageList: {
    padding: 30,
  },
  icon: {
    opacity: 0,
  },
  selectedIcon: {
    opacity: 1,
  },
  imageListItem: {
    cursor: 'pointer'
  },
  selectedItemBar: {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.7,
  },
}))

const ImageListSection = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const images = useStore(state => state.images)
  const setSelectedImage = useStore(state => state.setSelectedImage)
  const selected = useStore(state => state.selected)

  return (
    <ImageList className={classes.imageList} cols={4}>
      {images.map(item => {
        const isSelected = selected[item.id]
        return (
          <ImageListItem key={item.id}
            className={classes.imageListItem}
            onClick={() => setSelectedImage(item.id, !selected[item.id])}
          >
            <img src={item.thumbnailURL} alt={item.name} />
            <ImageListItemBar
              className={clsx(isSelected && classes.selectedItemBar)}
              title={item.name}
              actionIcon={
                <IconButton
                  aria-label={`check ${item.name}`} 
                  className={clsx(classes.icon, isSelected && classes.selectedIcon)}
                >
                    <CheckIcon 
                      color="secondary"
                    />
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