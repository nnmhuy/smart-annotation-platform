import RestConnector from '../connectors/RestConnector'

import ImageDataInstanceClass from '../classes/ImageDataInstanceClass'
import VideoDataInstanceClass from '../classes/VideoDataInstanceClass'


class DataInstanceService {
  async getDataInstancesByDataset(datasetId, page = 1, per_page = 50) {
    const dataInstancesResponse = await RestConnector.get(`/data?dataset_id=${datasetId}&page=${page}&per_page=${per_page}`)

    const dataInstancesObj = await Promise.all(dataInstancesResponse.data.map(instance => {
      if (instance._cls.includes(ImageDataInstanceClass._cls))
        return ImageDataInstanceClass.constructorFromServerData(instance)
      if (instance._cls.includes(VideoDataInstanceClass._cls))
        return VideoDataInstanceClass.constructorFromServerData(instance)
      return {}
    }))

    return dataInstancesObj
  }

  async deleteDataById(id) {
    return RestConnector.delete(`/data?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new DataInstanceService()