import { makeStyles } from '@material-ui/core'
import React from 'react'
import { theme } from '../../../../theme'


const useStyles = makeStyles((props) => ({
  imageWrapper: {
    display: 'inline-block',
    height: 50,
    width: 100,
    borderRadius: 5,
    padding: 5,
    margin: 10,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: props => props.isSelected ? theme.light.secondaryColor : 'rgba(0, 0, 0, 0)',
    borderStyle: 'solid'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }
}))

const ThumbnailImage = (props) => {
  const {
    id,
    thumbnail,
    setSelectedId
  } = props
  const classes = useStyles(props)
  return (
    <div className={classes.imageWrapper}>
      <img className={classes.image} src={thumbnail} alt='' onClick={() => setSelectedId(id)} />
    </div>
  )
}

export default ThumbnailImage