import ImageDataInfoClass from '../classes/ImageDataInfo'
import VideoDataInfoClass from '../classes/VideoDataInfo'


class DataInfoService {
  parseDataInfoObj(data_info) {
    switch (data_info._cls) {
      case "AnnotationDataInfo.ImageDataInfo":
        return ImageDataInfoClass.constructFromServerData(data_info)
      case "Annotation.PolygonAnnotation":
        return VideoDataInfoClass.constructorFromServerData(data_info)
      default:
        return {}
    }
  }
}

export default new DataInfoService()