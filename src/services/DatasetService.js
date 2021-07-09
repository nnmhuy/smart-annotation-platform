import RestConnector from '../connectors/RestConnector'

import DatasetClass from '../classes/DatasetClass'

class DatasetService {
  getDatasetById(id) {
    return RestConnector.get(`/datasets?id=${id}`)
      .then(response => {
        if (!response.data[0]) {
          alert("Not found dataset")
        }
        return DatasetClass.constructorFromServerData(response.data[0])
      })
  }
}

export default new DatasetService()