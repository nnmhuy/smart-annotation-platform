export default class ImageClass {
  constructor(id, imageURL, thumbnailURL, name='') {
    this.id = id
    this.imageURL = imageURL
    this.thumbnailURL = thumbnailURL
    this.name = name
  }
  static constructorFromServerData(data) {
    return new ImageClass(
      data.id,
      data.imageURL,
      data.imageURL,
      data.name
    )
  }
}