import {
  MIN_ZOOM_SCALE,
  MAX_ZOOM_SCALE,
} from '../constants'

const handleStageZoom = (stage, e) => {
  e.evt.preventDefault();

  const scaleBy = 1.05;
  const oldScale = stage.scaleX();

  const pointer = stage.getPointerPosition();

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  const newScale =
    e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  // limit zoom scale
  if (newScale >= MIN_ZOOM_SCALE && newScale <= MAX_ZOOM_SCALE) {
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  }
}

export default handleStageZoom