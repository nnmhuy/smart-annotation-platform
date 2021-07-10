import React from 'react'
import { makeStyles } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import { get } from 'lodash'
import { useParams } from 'react-router'

import { IMAGES_PER_PAGE } from '../../constant'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },
  text: {
    fontStyle: 'italic'
  }
}))

const ImagesPagination = (props) => {
  const classes = useStyles()
  const { useStore } = props
  const { datasetId, page = 1 } = useParams()

  const dataset = useStore(state => state.dataset)
  const instances = get(dataset, 'instances', 0)

  const handleChange = (event, value) => {
    window.location = `/datasets:dataset=${datasetId}&page=${value}`
  };

  const pageStart = Math.min((page - 1) * IMAGES_PER_PAGE + 1, instances)
  const pageEnd = Math.min(page * IMAGES_PER_PAGE, instances)

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        {pageStart} - {pageEnd}
      </div>
      <Pagination
        count={Number.parseInt((instances / IMAGES_PER_PAGE) + Boolean(instances % IMAGES_PER_PAGE))}
        showFirstButton 
        showLastButton
        color="primary"
        variant="outlined" 
        shape="rounded"
        size="large"
        page={page}
        onChange={handleChange}
      />
    </div>
  )
}

export default ImagesPagination