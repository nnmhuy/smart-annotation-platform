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
}