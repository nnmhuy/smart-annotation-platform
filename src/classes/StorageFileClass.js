export default class StorageFileClass {
  constructor(filename, URL) {
    this.filename = filename
    this.URL = URL
  }

  static constructorFromServerData(data) {
    return new StorageFileClass(data.filename, data.URL)
  }
}