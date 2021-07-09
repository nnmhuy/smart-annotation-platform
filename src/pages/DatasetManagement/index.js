import React from 'react'
import { useParams } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';

import Loading from '../../components/Loading'
import DatasetInfo from './components/DatasetInfo/index'
import ImageListSection from './components/ImageListSection/index'
import ImagesPagination from './components/ImagesPagination/index'

import useDatasetManagementStore from './store.js'

const DatasetManagement = (props) => {
  const { datasetId, page = 1 } = useParams()

  const isLoading = useDatasetManagementStore(state => state.isLoading)
  const getDataset = useDatasetManagementStore(state => state.getDataset)
  const getImages = useDatasetManagementStore(state => state.getImages)
  
  React.useEffect(() => {
    getDataset(datasetId)
    getImages(datasetId, page)
  }, [])

  return (
    <div>
      <Loading isLoading={isLoading}/>
      <DatasetInfo useStore={useDatasetManagementStore}/>
      <ImagesPagination useStore={useDatasetManagementStore}/>
      <ImageListSection useStore={useDatasetManagementStore}/>
    </div>
  )
}

export default DatasetManagement