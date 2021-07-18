import React from 'react'
import { useParams } from 'react-router'

import Loading from '../../components/Loading'
import DatasetInfo from './components/DatasetInfo/index'
import BulkSelection from './components/BulkSelection/index'
import DataListSection from './components/DataListSection/index'
import DataPagination from './components/DataPagination/index'

import useDatasetManagementStore from './store.js'

import useQuery from '../../utils/useQuery'

const DatasetManagement = (props) => {
  const { datasetId } = useParams()
  let query = useQuery()

  const page = JSON.parse(query.get("page") || 1)

  const isLoading = useDatasetManagementStore(state => state.isLoading)
  const getDataset = useDatasetManagementStore(state => state.getDataset)
  const getData = useDatasetManagementStore(state => state.getData)
  
  React.useEffect(() => {
    getDataset(datasetId)
  }, [datasetId])
  
  React.useEffect(() => {
    getData(datasetId, page)
  }, [page])

  return (
    <div>
      <Loading isLoading={isLoading}/>
      <DatasetInfo useStore={useDatasetManagementStore}/>
      <BulkSelection useStore={useDatasetManagementStore}/>
      <DataPagination useStore={useDatasetManagementStore}/>
      <DataListSection useStore={useDatasetManagementStore}/>
    </div>
  )
}

export default DatasetManagement