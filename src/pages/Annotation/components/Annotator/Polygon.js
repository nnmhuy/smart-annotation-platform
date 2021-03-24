import React from 'react'
import { Line, Circle } from 'react-konva'

const Polygon = (props) => {
  const { 
    polygon, currentMousePos, 
    isDrawing, 
    isSelected, onSelect,
    setIsMouseOverPolygonStart, onChange 
  } = props

  const { points, ...others } = polygon
  const [draggingIndex, setDraggingIndex] = React.useState(null)

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
    const index = event.target.index - 1;

    if (!draggingIndex) {
      setDraggingIndex(index)
    }
  }

  const handleDragMovePoint = event => {
    const index = event.target.index - 1;
    if (index !== draggingIndex) { // prevent dragging 2 near points
      return
    }
    const pos = [event.target.attrs.x, event.target.attrs.y];
    onChange({
      ...polygon,
      points: [...points.slice(0, index), pos, ...points.slice(index + 1)]
    })
  }

  const handleDragOutPoint = event => {
    console.log("end", event);
    setDraggingIndex(null)
  }

  const onDragStart = event => {
  }

  const onDragMove = event => {
    onChange({
      ...polygon,
      x: event.target.x(),
      y: event.target.y()
    })
  }

  const onDragEnd = event => {
    onChange({
      ...polygon,
      points: polygon.points.map(p => [p[0] + polygon.x, p[1] + polygon.y]),
      x: 0,
      y: 0
    })
  }

  return (
    <>
      <Line
        points={flattenedPoints}
        // closed={isFinished}
        closed={true}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        draggable={isSelected}
        {...others}
      />
      {(isDrawing || isSelected) && 
        points.map((point, index) => {
          // TODO: relative size when zoom in
          const x = point[0];
          const y = point[1];
          const startPointAttr =
            (index === 0 && isDrawing)
              ? {
                hitStrokeWidth: 6,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint,
                fill: "red"
              }
              : null;
          return (
            <Circle
              key = { index }
              x = {x + polygon.x}
              y = {y + polygon.y}
              radius={5}
              fill="white"
              stroke="black"
              strokeWidth={2}
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