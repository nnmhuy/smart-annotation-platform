import RestConnector from '../connectors/RestConnector'

import ImageClass from '../classes/ImageClass'
import VideoClass from '../classes/VideoClass'


class DataService {
  async getDataByDataset(datasetId, page = 1, per_page = 50) {
    const annotationResponse = await RestConnector.get(`/data?dataset_id=${datasetId}&page=${page}&per_page=${per_page}`)

    const annotationsObj = await Promise.all(annotationResponse.data.map(async ann => {
      switch (ann._cls) {
        case "Data.Image":
          return ImageClass.constructorFromServerData(ann)
        case "Data.Video":
          return VideoClass.constructorFromServerData(ann)
        default:
          return {}
      }
    }))

    return annotationsObj
  }

  async deleteDataById(id) {
    return RestConnector.delete(`/data?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new DataService()