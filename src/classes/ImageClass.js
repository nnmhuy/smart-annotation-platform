import StorageFileClass from './StorageFileClass'

export default class ImageClass {
  constructor(id, original, thumbnail) {
    this.id = id
    this.original = original
    this.thumbnail = thumbnail
  }

  static constructFromServerData(data) {
    return new ImageClass(
      data.id,
      StorageFileClass.constructorFromServerData(data.original),
      StorageFileClass.constructorFromServerData(data.thumbnail)
    )
  }
}