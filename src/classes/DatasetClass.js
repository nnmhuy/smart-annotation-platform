import RestConnector from "../connectors/RestConnector"

export default class DatasetClass {
  constructor(id = '', name = '', projectId = '', otherData = {}) {
    this.id = id
    this.name = name
    this.projectId = projectId

    Object.keys(otherData).forEach(key => this[key] = otherData[key])
  }

  static constructorFromServerData(data) {
    const { id, name, project, ...others } = data
    return new DatasetClass(
      id,
      name,
      project,
      others
    )
  }

  async applyCreateDataset() {
    return await RestConnector.post('/datasets', {
      name: this.name,
      project: this.projectId,
    })
  }

  async applyUpdateDataset() {
    return await RestConnector.put('/datasets', {
      id: this.id,
      name: this.name
    })
  }

  async applyDeleteDataset() {
    return await RestConnector.delete(`/datasets?id=${this.id}`)
  }
}