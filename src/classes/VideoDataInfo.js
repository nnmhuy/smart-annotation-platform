import AnnotationDataInfo from "./AnnotationDataInfoClass"

class VideoDataInfo extends AnnotationDataInfo {
  constructor(frame_index) {
    super()

    this.frame_index = frame_index
  }

  static constructFromServerData(data) {
    return new VideoDataInfo(data.frame_index)
  }
}

export default VideoDataInfo