import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash'

import { useDatasetStore } from '../../../../stores/index'

const useStyles = makeStyles(() => ({
  root: {

  },
  name: {
    fontWeight: 500,
    fontSize: 14,
  }
}))

const DataInfo = (props) => {
  const classes = useStyles()

  const getDataInstance = useDatasetStore(state => state.getDataInstance)
  const dataInstance = getDataInstance()
  const dataInstanceName = get(dataInstance, 'name', '')

  return (
    <div className={classes.root}>
      <div className={classes.name}>
        {dataInstanceName}
      </div>
    </div>
  )
}

export default DataInfo