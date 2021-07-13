import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash'

const useStyles = makeStyles(() => ({
  root: {

  },
  name: {
    fontWeight: 500,
    fontSize: 14,
  }
}))

// TODO: keyboard instruction
const DataInfo = (props) => {
  const classes = useStyles()
  const { useStore } = props

  const image = useStore(state => state.image)
  const imageName = get(image, 'obj.name', '')

  return (
    <div className={classes.root}>
      <div className={classes.name}>
        {imageName}
      </div>
    </div>
  )
}

export default DataInfo