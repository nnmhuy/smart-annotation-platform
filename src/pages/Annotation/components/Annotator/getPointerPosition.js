const getPointerPosition = (stage) => {
  const scale = stage.scaleX();
  const pointer = stage.getPointerPosition();

  const mousePointTo = {
    x: (pointer.x - stage.x()) / scale,
    y: (pointer.y - stage.y()) / scale,
  };

  return mousePointTo
}

export default getPointerPosition