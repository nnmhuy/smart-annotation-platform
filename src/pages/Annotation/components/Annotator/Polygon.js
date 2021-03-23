import React from 'react'
import { Line, Rect } from 'react-konva'

const Polygon = (props) => {
  const { 
    polygon, currentMousePos, 
    isDrawing, 
    isSelected, onSelect,
    setIsMouseOverPolygonStart, handleChange 
  } = props

  const { points, ...others } = polygon

  const isFinished = !!!isDrawing
  const flattenedPoints = points
    .concat(isFinished ? [] : [currentMousePos.x, currentMousePos.y])
    .reduce((a, b) => a.concat(b), [])

  const handleMouseOverStartPoint = event => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });
    setIsMouseOverPolygonStart(true)
  }
  
  const handleMouseOutStartPoint = event => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverPolygonStart(false)
  }

  const handleDragStartPoint = event => {
    console.log("start", event);
  }

  const handleDragMovePoint = event => {
    const index = event.target.index - 1;
    console.log(event.target);
    const pos = [event.target.attrs.x, event.target.attrs.y];
    console.log("move", event);
    console.log(pos);
    handleChange({
      ...polygon,
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)]
    })
  }

  const handleDragOutPoint = event => {
    console.log("end", event);
  }

  return (
    <>
      <Line
        points={flattenedPoints}
        // closed={isFinished}
        closed={true}
        onClick={onSelect}
        onTap={onSelect}
        {...others}
      />
      {(isDrawing || isSelected) && 
        points.map((point, index) => {
          const width = 6;
          const x = point[0] - width / 2;
          const y = point[1] - width / 2;
          const startPointAttr =
            (index === 0 && isDrawing)
              ? {
                hitStrokeWidth: 12,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint
              }
              : null;
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={width}
              fill={index === 0 ? "red" : "white"}
              stroke="black"
              strokeWidth={3}
              onDragStart={handleDragStartPoint}
              onDragMove={handleDragMovePoint}
              onDragEnd={handleDragOutPoint}
              draggable
              {...startPointAttr}
            />
          );
        }
      )}
    </>
  )
}

export default Polygon