import LabelClass from '../models/LabelClass'

import RestConnector from '../connectors/RestConnector'

class LabelService {
  async getLabelByProject(projectId) {
    const response = await RestConnector.get(`/annotation_labels?project_id=${projectId}`)
    return response.data.map(label => LabelClass.constructorFromServerData(label))
  }

  async getLabelByDataset(datasetId) {
    const response = await RestConnector.get(`/annotation_labels?dataset_id=${datasetId}`)
    return response.data.map(label => LabelClass.constructorFromServerData(label))
  }

  async createLabel(data) {
    const response = await RestConnector.post('/annotation_labels', {
      label: data.label,
      project_id: data.projectId,
      properties: data.properties,
      annotation_properties: data.annotationProperties
    })
    return LabelClass.constructorFromServerData(response.data)
  }

  async updateLabel(data) {
    const response = await RestConnector.put('/annotation_labels', {
      id: data.id,
      label: data.label,
      properties: data.properties,
      annotation_properties: data.annotationProperties
    })
    return LabelClass.constructorFromServerData(response.data)
  }

  deleteLabelById(id) {
    return RestConnector.delete(`/annotation_labels?id=${id}`)
  }
}

const labelService = new LabelService()

export default labelService