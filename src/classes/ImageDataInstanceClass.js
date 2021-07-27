import DataInstanceClass from './DataInstanceClass'
import ImageClass from './ImageClass'


export default class ImageDataInstanceClass extends DataInstanceClass {
  static _cls = "ImageDataInstance"

  constructor(id, name = '', original, thumbnail, otherData) {
    const { width, height, ...others } = otherData

    super(id, name, thumbnail, width, height, others)

    const image = new ImageClass(id, original, thumbnail)
    Object.assign(this, image)
  }

  getCurrentImage() {
    const { id, original, thumbnail } = this
    return {
      id,
      original,
      thumbnail
    }
  }

  static constructorFromServerData(data) {
    const { id, name, original, thumbnail, ...others } = data 
    return new ImageDataInstanceClass(
      id,
      name,
      original,
      thumbnail,
      others
    )
  }
}