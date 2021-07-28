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

  async getBase64() {
    if (!this.base64) {
      this.base64 = await this.getBlob().then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve( reader.result )
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }))
    }
    return this.base64
  }

  static constructorFromServerData(data) {
    return new StorageFileClass(data.filename, data.URL)
  }
}