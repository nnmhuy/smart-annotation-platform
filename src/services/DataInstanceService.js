import { cloneDeep } from 'lodash'
import RestConnector from '../connectors/RestConnector'

import ImageDataInstanceClass from '../models/ImageDataInstanceClass'
import VideoDataInstanceClass from '../models/VideoDataInstanceClass'
import { file } from 'jszip'


class DataInstanceService {
  async parseDataInstanceFromServer(instance) {
    if (instance._cls.includes(ImageDataInstanceClass._cls))
      return ImageDataInstanceClass.constructorFromServerData(instance)
    if (instance._cls.includes(VideoDataInstanceClass._cls))
      return VideoDataInstanceClass.constructorFromServerData(instance)
    return {}
  }

  async getDataInstancesByDataset(datasetId, page = 1, per_page = 20, is_preview = false) {
    const dataInstancesResponse = await RestConnector.get(`/data?dataset_id=${datasetId}&page=${page}&per_page=${per_page}&is_preview=${is_preview}`)

    const dataInstancesObj = await Promise.all(dataInstancesResponse.data.map(instance => this.parseDataInstanceFromServer(instance)))

    return dataInstancesObj
  }

  async deleteDataById(id) {
    return RestConnector.delete(`/data?id=${id}`)
      .then((response) => {
        return response.data
      })
  }

  async putDataInstance(dataInstance)
  {
    const updateData = cloneDeep(dataInstance)
    delete updateData._cls
    delete updateData.image
    delete updateData.thumbnail
    return await RestConnector.put(`/data`, updateData)
  }

  async upload(file, datasetId, onUploadProgress) {
    let formData = new FormData();

    formData.append("dataset_id", datasetId);
    
    let uploadURL = "/data/upload_image"
    if (file.type.includes("image")) {
      formData.append("image", file);
      uploadURL = "/data/upload_image"
    } else {
      formData.append("video", file);
      uploadURL = "/data/upload_video"
    }

    return RestConnector.post(uploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }).then(response => {
      const data = response.data
      return this.parseDataInstanceFromServer(data)
    })
  }

  async uploadMultipleFiles(datasetId, files, onUploadProgress) {
    let formData = new FormData();
    let uploadURL = ""
    formData.append("dataset_id", datasetId);
  
    // Get file type
    if (files[0].type.includes("image")) {
      uploadURL = "/data/upload_multiple_images"
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      } 
    } else {
      uploadURL = "/data/upload_multiple_videos"
      for (let i = 0; i < files.length; i++) {
        formData.append("videos", files[i]);
      } 
    }

    return RestConnector.post(uploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }).then(response => {
      const data = response.data
      // Parse data
      return data.map(instance => this.parseDataInstanceFromServer(instance))
    })
  }
}

export default new DataInstanceService()