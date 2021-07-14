export default class DataClass {
  constructor(id, name = '', thumbnail, otherData) {
    this.id = id
    this.name = name
    this.thumbnail = thumbnail

    Object.keys(otherData).forEach(key => this[key] = otherData[key])
  }
}
