import AnnotationDataInfo from "./AnnotationDataInfoClass"

class ImageDataInfo extends AnnotationDataInfo {
  // constructor() {
  //   super()
  // }

  static constructFromServerData(data) {
    return new ImageDataInfo()
  }
}

export default ImageDataInfo