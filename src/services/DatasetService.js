import RestConnector from '../connectors/RestConnector'

import DatasetClass from '../classes/DatasetClass'

class DatasetService {
  getDatasetById(id) {
    return RestConnector.get(`/datasets?id=${id}`)
      .then(response => {
        if (!response.data[0]) {
          throw new Error("Not found dataset")
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

  updateDataset(newDataset) {
    return RestConnector.put(`/datasets`, {
      id: newDataset.id,
      name: newDataset.name,
      description: newDataset.description,
    }).then(response => {
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