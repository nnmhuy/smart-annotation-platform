import DataClass from './DataClass'
export default class ImageClass extends DataClass {
  constructor(id, name='', image, thumbnail, otherData) {
    super(id, name, thumbnail, otherData)

    this.image = image
  }
  static constructorFromServerData(data) {
    const { id, name, image, thumbnail, ...others } = data 
    return new ImageClass(
      id,
      name,
      image, thumbnail,
      others
    )
  }
}