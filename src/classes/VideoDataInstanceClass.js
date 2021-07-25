import DataInstanceClass from './DataInstanceClass'
import ImageClass from './ImageClass'

export default class VideoDataInstanceClass extends DataInstanceClass {
  static _cls = "VideoDataInstance"

  constructor(id, name = '', video, thumbnail, frames, otherData) {
    const { fps, num_frames, width, height, ...others } = otherData

    super(id, name, thumbnail, width, height, others)

    this.video = video
    this.frames = frames
    this.fps = fps
    this.numFrames = num_frames

    this.playingState = {
      playing: 0,
      loaded: -1,
      loadedFrames: {},
    }
  }

  set updatePlayingState(newState) {
    this.playingState = {
      ...this.playingState,
      ...newState
    }
  }

  nextFrame() {
    const { playing } = this.playingState
    this.playingState = {
      ...this.playingState,
      playing: Math.min(playing + 1, this.numFrames - 1)
    }
  }

  get currentImage () {
    const { playing } = this.playingState
    return this.frames[playing]
  }

  static async constructorFromServerData(data) {
    const { id, name, video, frames, thumbnail, ...others } = data
    let frames_obj = frames.map(frame => ImageClass.constructFromServerData(frame))
    // await Promise.all(frames_obj.map(async (frame) => frame.getData()))
    
    return new VideoDataInstanceClass(
      id,
      name,
      video,
      thumbnail,
      frames_obj,
      others
    )
  }
}