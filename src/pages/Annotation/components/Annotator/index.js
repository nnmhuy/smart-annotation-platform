import React from 'react'
import { Stage, Layer } from 'react-konva'

import Rectangle from './Rectangle'

const Annotator = (props) => {
  const { rectangles, setRectangles } = props
  const stageRef = React.createRef()

  const [selectedId, selectShape] = React.useState(null)
  const [viewportStartPos, setViewportStartPos] = React.useState(null)

  const handleDragStart = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current
    const pointer = stage.getPointerPosition();

    setViewportStartPos(pointer)
  }

  const handleDragEnd = (e) => {
    e.evt.preventDefault();

    setViewportStartPos(null)
  }

  const handleDragMove = (e) => {
    e.evt.preventDefault();

    if (viewportStartPos) {
      const stage = stageRef.current
  
      const pointer = stage.getPointerPosition();
      const stagePos = stage.position()
  
      const newPos = {
        x: stagePos.x + (pointer.x - viewportStartPos.x),
        y: stagePos.y + (pointer.y - viewportStartPos.y)
      }
      stage.position(newPos);
      stage.batchDraw();
  
      setViewportStartPos(pointer)
    }
  } 

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      handleDragStart(e);
    }
  };

  const handleZoom = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale =
      e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  }

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchStart={checkDeselect}
      onWheel={handleZoom}
      // onDragStart={handleDragStart}
      // onDragEnd={handleDragEnd}
      // onDragMove={handleDragMove}
    >
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          );
        })}
      </Layer>
    </Stage>
  );
}

export default Annotator