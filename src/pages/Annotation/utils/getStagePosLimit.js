import { get } from 'lodash'

const getStagePosLimit = (stage, stageSize, image) => {
  const stagePos = stage.position()

  const scale = stage.scaleX();
  const imageWidth = get(image, 'width', 0)
  const imageHeight = get(image, 'height', 0)

  // limit viewport movement base on scale
  // allow at most half of each dimension out of viewport
  let posLimit = {
    xMin: -stageSize.width / 2,
    xMax: stageSize.width / 2,
    yMin: -stageSize.height / 2,
    yMax: stageSize.height / 2,
  }
  if (imageWidth && imageHeight) {
    if (imageWidth * scale <= stageSize.width) {
      let acceptedOutWidth = (imageWidth * scale / 2)
      posLimit.xMin = Math.min(0 - acceptedOutWidth, stagePos.x)
      posLimit.xMax = Math.max(stageSize.width - (imageWidth * scale) + acceptedOutWidth, stagePos.x)
    } else {
      let acceptedOutWidth = (stageSize.width / 2)
      posLimit.xMin = Math.min(stageSize.width - imageWidth * scale - acceptedOutWidth, stagePos.x)
      posLimit.xMax = Math.max(0 + acceptedOutWidth, stagePos.x)
    }
    if (imageHeight * scale <= stageSize.height) {
      let acceptedOutHeight = (imageHeight * scale / 2)
      posLimit.yMin = Math.min(0 - acceptedOutHeight, stagePos.y)
      posLimit.yMax = Math.max(stageSize.height - (imageHeight * scale) + acceptedOutHeight, stagePos.y)
    } else {
      let acceptedOutHeight = (stageSize.height / 2)
      posLimit.yMin = Math.min(stageSize.height - imageHeight * scale - acceptedOutHeight, stagePos.y)
      posLimit.yMax = Math.max(0 + acceptedOutHeight, stagePos.y)
    }
  }

  return posLimit
}

export default getStagePosLimit