import { get } from 'lodash'

import RestConnector from '../connectors/RestConnector'

import DatasetClass from '../classes/DatasetClass'

class DatasetService {
  getDatasetById(id) {
    return RestConnector.get(`/datasets?id=${id}`)
      .then(response => {
        if (!response.data[0]) {
          alert("Not found dataset")
          window.history.back()
          return
        }
        return DatasetClass.constructorFromServerData(response.data[0])
      })
  }

  createDataset(data) {
    return RestConnector.post(`/datasets`, {
      name: data.name,
      description: data.description,
    })
    .then(response => {
      return DatasetClass.constructorFromServerData(response.data)
    })
  }
  
  deleteDatasetById(id) {
    return RestConnector.delete(`/datasets?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new DatasetService()