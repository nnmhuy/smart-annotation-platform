export default class StorageFileClass {
  constructor(filename, URL) {
    this.filename = filename
    this.URL = URL
  }

  async getBlob() {
    if (!this.blob) {
      this.blob = await fetch(this.URL).then(response => response.blob())
    }
    return this.blob
  }

  async getBitmap() {
    if (!this.bitmap) {
      this.bitmap = await this.getBlob().then(blob => createImageBitmap(blob))
    }
    return this.bitmap
  }

  static constructorFromServerData(data) {
    return new StorageFileClass(data.filename, data.URL)
  }
}