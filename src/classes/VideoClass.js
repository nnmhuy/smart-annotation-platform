import DataClass from './DataClass'


export default class VideoClass extends DataClass {
  constructor(id, name='', video, frames, fps, thumbnail, otherData) {
    super(id, name, thumbnail, otherData)

    this.video = video
    this.frames = frames
    this.fps = fps
  }
  static constructorFromServerData(data) {
    const { id, name, video, frames, fps, thumbnail, ...others } = data
    return new VideoClass(
      id,
      name,
      video, frames, fps,
      thumbnail,
      others
    )
  }
}